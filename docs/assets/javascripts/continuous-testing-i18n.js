/* English copy for the interactive map. The Spanish source remains the default. */
(() => {
  if (new URLSearchParams(location.search).get('lang') !== 'en') return;

  document.documentElement.lang = 'en';
  const svg = document.querySelector('svg[role="img"]');
  const phaseDescriptions = [
    'Where: on the developer’s machine. Moving on: the selected local checks pass; required controls run again in CI.',
    'Where: in a CI runner. Moving on: the build and required checks pass. Investigate intermittent failures to keep the results trustworthy.',
    'Where: in CI runners and test services, often temporary. Moving on: the required integration checks pass and the artifact is ready to deploy.',
    'Where: in DEV or a temporary environment. Moving on: the deployment, selected flows, and integrations work in that environment.',
    'Where: in QA, staging, or PRE, depending on the team. Moving on: the agreed acceptance and quality criteria are met.',
    'Where: in production. Moving on: initial checks and indicators stay within the agreed limits during the observation period.',
    'Where: mainly in production. There is no single finish line: signals and alerts are reviewed continuously and findings feed improvements.',
  ];
  const artifacts = [
    ['SOURCE CODE', 'Here we work with source code on the local machine. We do not need to represent a deployment artifact yet.'],
    ['SOURCE CODE', 'CI validates the code change and its integration. An early build can run checks before the artifact to be promoted is generated.'],
    ['BUILD · vx.y.z', 'The example artifact is generated and identified here. The version is illustrative; a digest can identify its contents more precisely.'],
    ['ARTIFACT · vx.y.z', 'The same example artifact is deployed and validated in DEV. Configuration can vary by environment without rebuilding the package.'],
    ['ARTIFACT · vx.y.z', 'The same example artifact is promoted to PRE for validation. Its identifier connects the results to the package tested.'],
    ['ARTIFACT · vx.y.z', 'The validated artifact is promoted to production. The example version is illustrative; a digest helps verify the same contents.'],
    ['ACTIVE VERSIONS', 'Monitoring follows the versions active in production, which can include several versions during a progressive rollout.'],
  ];
  const entries = [
    ['Format and style', 'We review code without running it, looking for formatting, style, and type issues.', 'Format, lint and types', 'Errors before sharing'],
    ['Business rules', 'We test small pieces in isolation to confirm that rules and validation behave as expected, including edge cases.', 'Isolated functions', 'Edge cases and validation'],
    ['Data structure', 'We check data structures and available contracts for changes that could break communication.', 'Schemas and fields', 'Incompatible changes'],
    ['Quick security review', 'We look for exposed passwords or keys and quickly check dependencies for known vulnerabilities.', 'Exposed secrets', 'Vulnerable dependencies'],
    ['Configuration files', 'We check that configuration has a valid structure and the basic values needed to work.', 'Syntax and values', 'Basic requirements'],
    ['Quick build', 'When the project allows it, we build locally to catch compilation errors and missing dependencies early.', 'Local build', 'Early errors'],
    ['Code quality', 'We automatically review code for quality issues, duplication, and possible errors before integration.', 'Quality rules', 'Duplication and defects'],
    ['Isolated behaviour', 'We test individual pieces. Coverage shows what was exercised, but does not guarantee that everything is correct.', 'Rules and edge cases', 'Coverage as a guide'],
    ['Interface compatibility', 'We check that consumers and providers respect their agreements. Schema validation alone cannot prove that all communication works.', 'Agreed schemas', 'Consumer expectations'],
    ['Code and dependencies', 'We look for vulnerabilities in code and dependencies, as well as keys or secrets included by mistake.', 'SAST and SCA', 'Secret scanning'],
    ['Project rules', 'We check project rules, such as whether dependency licences are allowed.', 'Allowed licences', 'Usage restrictions'],
    ['Automated accessibility', 'We automatically check for some accessibility issues, such as missing labels or structural errors. These checks cannot find every barrier.', 'Detectable rules', 'Labels and structure'],
    ['CI build', 'We build the change in a CI runner to catch dependencies or configuration that exist only on a local machine.', 'Runner build', 'Dependencies and environment'],
    ['Component connections', 'We test how components work together, such as whether an application reads and saves data correctly.', 'Databases and services', 'Reading and writing'],
    ['Messages and events', 'We verify message and event formats and expectations. Contract tests complement, but do not replace, integration tests.', 'Message formats', 'Service agreements'],
    ['Artifact review', 'We review the package or image to deploy for vulnerable dependencies and other security issues.', 'Image or package', 'Vulnerable dependencies'],
    ['Version provenance', 'We record the source and versions included in the artifact so we know what we are deploying.', 'Included versions', 'Source evidence'],
    ['Package build', 'We generate the package to deploy and check that it contains the required components and configuration.', 'Artifact generation', 'Contents and configuration'],
    ['Supported environments', 'We test that the package works with the runtime and dependency versions the product supports.', 'Runtime versions', 'Supported combinations'],
    ['Data migrations', 'When the data structure changes, we test that migrations work and that versions which must coexist remain compatible.', 'Schema changes', 'Version compatibility'],
    ['Initial checks', 'After deployment, we quickly check that the service starts and has its essential configuration.', 'Service startup', 'Essential configuration'],
    ['Main journeys', 'We exercise the main functions to check that the system works end to end in the development environment.', 'Important functions', 'End-to-end checks'],
    ['Service communication', 'We test that deployed services communicate correctly through requests and events.', 'Service requests', 'Event exchange'],
    ['Diagnostic signals', 'We check that logs, metrics, and traces arrive, can be queried and correlated, and do not expose sensitive data. Sampling can limit traces.', 'Collection and access', 'Logs, metrics and traces'],
    ['Access permissions', 'We test who can enter and what they can do, including both permitted and rejected access.', 'Sign-in', 'Authorised actions'],
    ['Basic compatibility', 'We test main journeys in commonly used browsers or environments to catch obvious incompatibilities.', 'Common browsers', 'Main flows'],
    ['Initial response', 'We measure a few response times to catch obvious regressions before more complete load testing.', 'Request times', 'Early detection'],
    ['Existing functions', 'We repeat important cases to check that changes have not broken existing functions and the release meets expectations.', 'Regression cases', 'Acceptance criteria'],
    ['Response under load', 'We generate load using representative data and traffic and compare results with measurable objectives, accounting for differences from production.', 'Request volume', 'Limits and timings'],
    ['Deployed application', 'We look for vulnerabilities in the deployed application and check that access restrictions work.', 'Dynamic analysis', 'Unauthorised access'],
    ['Data and audit', 'We review applicable privacy and personal-data requirements and the records needed to audit what happened.', 'Data privacy', 'Records and evidence'],
    ['Operational readiness', 'We check that alerts notify as expected and that there are ways to recover the service if something fails.', 'Alert activation', 'Recovery options'],
    ['Failure response', 'We introduce controlled failures to see how the system responds and whether we can return to an earlier version.', 'Controlled failures', 'Degradation and rollback'],
    ['Sustained load', 'We maintain load over time to uncover resource leaks or degradation that only appears later.', 'Long-running test', 'Leaks and degradation'],
    ['Scaling and concurrency', 'We simulate concurrent users or tasks and check whether the system scales within its objectives.', 'Concurrent users', 'Autoscaling response'],
    ['Limits and capacity', 'We approach the expected limits to check that quotas apply and excess demand is handled in a controlled way.', 'Quotas and rate limits', 'Behaviour at limits'],
    ['Portability and runtime', 'We test relevant browser, system, or runtime combinations to check support for the declared platforms.', 'Browsers and systems', 'Supported versions'],
    ['Data restoration', 'We restore a backup, check its integrity, and compare recovery time (RTO) and acceptable data loss (RPO) with agreed objectives.', 'Backup restoration', 'Integrity and timing'],
    ['Accessibility and usability', 'We review whether people can understand and complete journeys, using assistive technology where appropriate. This complements automated checks.', 'Keyboard and assistive tech', 'Journey review'],
    ['Progressive rollout', 'We release to part of the traffic and observe errors and response times. We expand or stop the rollout according to agreed limits.', 'Traffic and observation', 'Criteria to proceed'],
    ['Initial verification', 'After deployment, we check critical journeys with test data and controlled side effects, avoiding real charges or deliveries.', 'Critical journeys', 'Post-deploy errors'],
    ['Service health', 'We observe metrics and alerts to check that the new version is not causing errors or degradation.', 'Release metrics', 'Anomaly detection'],
    ['Rollback', 'When something fails, we choose how to recover: roll back, disable a feature, or fix forward. Data changes can limit rollback.', 'Rollback or fix forward', 'Service recovery'],
    ['Production access', 'We check that production configuration and permissions are correct and do not allow unintended access.', 'Effective permissions', 'Secure configuration'],
    ['Post-deploy capacity', 'We review production resource use and scaling after deployment for signs of insufficient capacity.', 'Resource usage', 'Scaling behaviour'],
    ['Continuous monitoring', 'We follow logs, metrics, and traces to understand service behaviour and investigate problems.', 'Logs, metrics and traces', 'Problem diagnosis'],
    ['Operational alerts', 'We define alerts that identify meaningful service or user impact and reach the right team with information to act.', 'Service impact', 'Actionable alerts'],
    ['Synthetic journeys', 'We run simulated journeys periodically using test data and controlled side effects to avoid unintended real operations.', 'Periodic execution', 'Available functions'],
    ['Experience and capacity', 'We follow service indicators (SLIs), such as availability or response time, and compare them with objectives (SLOs) to understand user impact.', 'Availability and latency', 'Indicators and objectives'],
    ['Continuous improvement', 'We review what we learn from incidents and observations to improve the product, tests, and operations.', 'Incident reviews', 'Changes to tests and ops'],
    ['Capacity trends', 'We follow concurrency and consumption over time to anticipate capacity problems and decide when to adjust resources.', 'Concurrency and usage', 'Long-term growth'],
  ];

  const categories = {
    'estáticas': 'static', 'funcionales': 'functional', 'no funcionales': 'non-functional',
    'contratos': 'contracts', 'seguridad': 'security', 'cumplimiento': 'compliance',
    'operacionales': 'operational',
  };
  const types = { prueba: 'test', análisis: 'analysis', control: 'control', monitorización: 'monitoring' };
  const frequencies = { 'POR CAMBIO': 'PER CHANGE', 'POR DESPLIEGUE': 'PER DEPLOYMENT', 'PERIÓDICA': 'PERIODIC', 'CONTINUA': 'CONTINUOUS' };

  svg.querySelectorAll('.phase').forEach((node, i) => {
    node.dataset.description = phaseDescriptions[i];
    node.setAttribute('aria-label', node.dataset.title + ': location and exit criteria');
  });
  svg.querySelectorAll('.artifact').forEach((node, i) => {
    node.dataset.title = artifacts[i][0];
    node.dataset.description = artifacts[i][1];
    node.setAttribute('aria-label', artifacts[i][0] + ': show information');
    node.querySelector('.artifact-text').textContent = artifacts[i][0];
  });
  svg.querySelectorAll('.stop').forEach((node, i) => {
    const [title, description, first, second] = entries[i];
    const aria = node.getAttribute('aria-label');
    const category = (aria.match(/categoría: ([^;]+)/) || [])[1];
    const type = (aria.match(/tipo: ([^;]+)/) || [])[1];
    const frequency = node.querySelector('.frequency-label');
    frequency.textContent = frequencies[frequency.textContent.trim()];
    node.dataset.title = title;
    node.dataset.description = description;
    node.setAttribute('aria-label', title + '; frequency: ' + frequency.textContent.toLowerCase() +
      '; type: ' + types[type] + '; category: ' + categories[category] + '; show description');
    const itemTitle = node.querySelector('.item');
    const titleLines = itemTitle.querySelectorAll('tspan');
    if (titleLines.length) {
      titleLines[0].textContent = title;
      titleLines[1].textContent = '';
    } else {
      itemTitle.textContent = title;
    }
    const detail = node.querySelector('.detail');
    const x = detail.getAttribute('x');
    detail.replaceChildren();
    [first, second].forEach((text, index) => {
      const span = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      span.setAttribute('x', x);
      if (index) span.setAttribute('dy', '16');
      span.textContent = text;
      detail.appendChild(span);
    });
  });
  const staticLabels = {
    'Del cambio a la operación': 'From change to operation',
    'UN MAPA DE VALIDACIÓN A TRAVÉS DEL CICLO DE DESPLIEGUE': 'A VALIDATION MAP ACROSS THE DEPLOYMENT LIFECYCLE',
    'EXPLORA EL MAPA': 'EXPLORE THE MAP',
    'Selecciona una fase o parada': 'Select a phase or stop',
    'Haz clic en una fase o prueba para saber más.': 'Select a phase or check to learn more.',
    'TIPOS DE VALIDACIÓN': 'VALIDATION AREAS', 'TIPO DE ACTIVIDAD': 'ACTIVITY TYPES',
    'Estáticas': 'Static', 'Funcionales': 'Functional', 'No funcionales': 'Non-functional',
    'Contratos': 'Contracts', 'Seguridad': 'Security', 'Cumplimiento': 'Compliance',
    'Operacionales': 'Operational', 'Prueba': 'Test', 'Análisis': 'Analysis',
    'Control': 'Control', 'Monitorización': 'Monitoring',
    'PRO / CONTINUO': 'PRO / CONTINUOUS',
    'Frecuencias orientativas; pueden variar según el producto y el riesgo.':
      'Suggested frequencies vary with the product and its risks.',
  };
  svg.querySelectorAll('text, tspan').forEach(node => {
    if (!node.children.length && staticLabels[node.textContent]) node.textContent = staticLabels[node.textContent];
  });
  svg.querySelector('#ct-title').textContent = 'Continuous Testing: from local to production';
  svg.querySelector('#ct-desc').textContent =
    'Seven validation phases from left to right, with example checks grouped by category.';
  svg.querySelectorAll('.activity-icon[aria-label]').forEach(node => {
    const names = { Prueba: 'Test', Análisis: 'Analysis', Control: 'Control', Monitorización: 'Monitoring' };
    const label = node.getAttribute('aria-label');
    if (names[label]) node.setAttribute('aria-label', names[label]);
  });
  document.getElementById('mobile-map').setAttribute('aria-label', 'A journey through the Continuous Testing phases');
})();
