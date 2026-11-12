// CloudFront Functions viewer-request handler. Keep unknown requests untouched.
var redirects = {
  '/docs': '/',
  '/docs/resources/cheatsheets/my-docker-cheatsheet': '/resources/cheatsheets/my-docker-cheatsheet/',
  '/docs/references/case-studies/3000000-kms': '/references/case-studies/3000000-kms/',
  '/docs/resources/cheatsheets/my-sql-cheatsheet': '/resources/cheatsheets/my-sql-cheatsheet/',
  '/docs/resources/cheatsheets/my-business-model-canvas': '/resources/cheatsheets/my-business-model-canvas/',
  '/docs/resources/thesis/my-data-fabric-thesis': '/resources/thesis/my-data-fabric-thesis/',
  '/azure-big-picture': '/notebooks/data-architecture/azure-big-picture/',
  '/cloud-migration-planning': '/notebooks/data-architecture/cloud-migration-planning/',
  '/google-challenge-01': '/notebooks/coding/google-challenge-part-1/',
  '/my-business-model-canvas': '/resources/cheatsheets/my-business-model-canvas/',
  '/my-data-fabric-thesis': '/resources/thesis/my-data-fabric-thesis/',
  '/my-data-mesh-thesis': '/resources/thesis/my-data-mesh-thesis/',
  '/my-data-product-thesis': '/resources/thesis/my-data-product-thesis/',
  '/my-git-cheatsheet': '/resources/cheatsheets/my-git-cheatsheet/',
  '/my-linux-cheatsheet': '/resources/cheatsheets/my-linux-cheatsheet/',
  '/my-python-project-cheatsheet': '/resources/cheatsheets/my-python-project-cheatsheet/',
  '/my-python-template': '/resources/templates/my-python-template/',
  '/my-screen-splitter': '/resources/tools/my-favorite-screen-splitter/',
  '/python-design-patterns': '/notebooks/coding/python-design-patterns/',
  '/python-generators': '/notebooks/coding/python-generators/',
  '/reinforcement-learning-basics': '/notebooks/data-science/reinforcement-learning-basics/',
  '/rubiks-cube-model': '/projects/my-rubiks-cube-model/',
  '/sample-size-determination': '/notebooks/data-science/sample-size-determination/',
  '/space-of-flows': '/references/articles/space-of-flows/',
  '/team-topologies': '/notebooks/business/team-topologies/',
  '/whole-brain-emulation': '/references/articles/whole-brain-emulation/'
};

function handler(event) {
  var request = event.request;
  var path = request.uri.replace(/\/$/, '');
  var destination = Object.prototype.hasOwnProperty.call(redirects, path) && redirects[path];
  if (!destination) return request;

  // CloudFront represents repeated query keys as multiValue arrays.
  var parameters = [];
  var query = request.querystring || {};
  Object.keys(query).forEach(function (key) {
    var item = query[key];
    var values = item.multiValue || [item];
    values.forEach(function (entry) {
      parameters.push(key + (entry.value === '' ? '' : '=' + entry.value));
    });
  });
  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: {
      location: { value: 'https://carlosgrande.me' + destination + (parameters.length ? '?' + parameters.join('&') : '') }
    }
  };
}
