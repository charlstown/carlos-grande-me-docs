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

test('unmapped and potentially ambiguous routes pass through unchanged', () => {
  for (const uri of ['/', '/contact-me-carlos-grande/', '/category/articles/', '/python-generators/other', '/constructor', '/about-me/']) {
    const request = { uri, querystring: { x: { value: 'y' } } };
    assert.equal(context.handler({ request }), request);
  }
});
