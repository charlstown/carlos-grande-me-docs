const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

const context = vm.createContext({});
vm.runInContext(readFileSync(__dirname + '/wordpress-redirects.js', 'utf8'), context);

test('all mapped paths redirect with and without trailing slash', () => {
  for (const [path, target] of Object.entries(context.redirects)) {
    for (const uri of [path, path + '/']) {
      const result = context.handler({ request: { uri, querystring: {} } });
      assert.equal(result.statusCode, 301);
      assert.equal(result.headers.location.value, 'https://carlosgrande.me' + target);
    }
  }
});

test('preserves query values and repeated parameters', () => {
  const result = context.handler({ request: { uri: '/python-generators/', querystring: {
    utm_source: { value: 'test%20source' }, ref: { value: 'first', multiValue: [{ value: 'first' }, { value: 'second' }] }, flag: { value: '' }
  } } });
  assert.equal(result.headers.location.value, 'https://carlosgrande.me/notebooks/coding/python-generators/?utm_source=test%20source&ref=first&ref=second&flag');
});

test('redirects the Search Console 404 examples to their exact destinations', () => {
  const expected = {
    '/docs/': '/',
    '/docs/resources/cheatsheets/my-docker-cheatsheet/': '/resources/cheatsheets/my-docker-cheatsheet/',
    '/docs/references/case-studies/3000000-kms/': '/references/case-studies/3000000-kms/',
    '/docs/resources/cheatsheets/my-sql-cheatsheet/': '/resources/cheatsheets/my-sql-cheatsheet/',
    '/docs/resources/cheatsheets/my-business-model-canvas/': '/resources/cheatsheets/my-business-model-canvas/',
    '/docs/resources/thesis/my-data-fabric-thesis/': '/resources/thesis/my-data-fabric-thesis/',
    '/sample-size-determination/': '/notebooks/data-science/sample-size-determination/',
    '/space-of-flows/': '/references/articles/space-of-flows/',
    '/my-python-project-cheatsheet/': '/resources/cheatsheets/my-python-project-cheatsheet/'
  };
  for (const [uri, target] of Object.entries(expected)) {
    const result = context.handler({ request: { uri, querystring: {} } });
    assert.equal(result.statusCode, 301);
    assert.equal(result.headers.location.value, 'https://carlosgrande.me' + target);
  }
  const tracked = context.handler({ request: { uri: '/space-of-flows/', querystring: { utm_source: { value: 'chatgpt.com' } } } });
  assert.equal(tracked.headers.location.value, 'https://carlosgrande.me/references/articles/space-of-flows/?utm_source=chatgpt.com');
});

test('unmapped and potentially ambiguous routes pass through unchanged', () => {
  for (const uri of ['/', '/contact-me-carlos-grande/', '/category/articles/', '/projects/', '/articles/', '/specify-feature', '/plan-feature', '/clean-feature', '/constitution', '/implement-feature', '/python-generators/other', '/constructor', '/about-me/']) {
    const request = { uri, querystring: { x: { value: 'y' } } };
    assert.equal(context.handler({ request }), request);
  }
});
