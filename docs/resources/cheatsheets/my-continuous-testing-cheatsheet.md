---
short_title: Continuous Testing Cheatsheet
description: An interactive map of the checks, tests, and operational feedback that support continuous delivery.
date: 2026-11-09
thumbnail: assets/images/thumbnails/continuous-testing-portrait.png
social:
  cards_layout_options:
    background_image: docs/assets/images/thumbnails/continuous-testing-portrait.png
    background_color: transparent
---

# Continuous Testing Cheatsheet

When we talk about Continuous Testing, we're not just talking about running tests in CI. We're also talking about the checks we make while developing, how we validate a deployment, and what we observe once a change is in production.

I've wanted to put this interactive cheatsheet together since I studied for my master's in DevOps. I wanted to bring together the checks we can make at each phase, what we're looking for, and how often it makes sense to run them.

I don't intend it to be a mandatory pipeline. I prefer to think of it as a starting point each team can adapt to its product, risks, and way of working.

## 1. The continuous testing map

Click a phase to see where its checks run and what needs to happen before moving forward. Select a stop to learn what it's for. On mobile, you'll find the phases arranged vertically.

--8<-- "assets/html/continuous-testing-embed.html:diagram"

## 2. Reading the map

The map follows a change through seven phases: it starts with **Local Prechecks**, moves through deployment to production, and continues with **Continuous Monitoring & Feedback**. Colours show the validation area, and icons help you distinguish tests, analysis, controls, and monitoring.

### 2.1 Validation areas

Each colour tells you which aspect we're checking. Some activities can fit into more than one area; I've grouped them here by their main purpose in the map.

| Area | What we're looking for |
|---|---|
| **Static** | Find issues in code or configuration without running the product, and check that it can be built. |
| **Functional** | Check that the product does what we expect across different use cases. |
| **Non-functional** | Evaluate qualities such as performance, capacity, compatibility, and accessibility. |
| **Contracts** | Check that components respect agreements about the data and messages they exchange. |
| **Security** | Find vulnerabilities and check that access and permissions work as intended. |
| **Compliance** | Review applicable requirements and policies, such as licences, privacy, or traceability. |
| **Operational** | Check that we can deploy, observe, maintain, and recover the product. |

### 2.2 Activity types

The icon at each stop tells us what we're doing. I find it useful to distinguish between them because not everything on the map is a test in the strict sense.

| Activity | What it involves |
|---|---|
| **Test** | Run a check and compare the result with what we expected. For example, verify that a business rule works. |
| **Analysis** | Examine code, dependencies, or other elements for potential problems. For example, look for known vulnerabilities. |
| **Control** | Verify a condition or perform an action needed to move forward. For example, check the configuration before deployment. |
| **Monitoring** | Observe the product's behaviour over time. For example, keep an eye on availability and alerts. |

The frequency shown at each stop is a guide. A fast check can run for every change; an extended load test or recovery exercise might run periodically. Monitoring, meanwhile, continues even when nothing new is being deployed.

## 3. Making it work for your team

If you're putting together your own workflow, this table can help you get started. You don't need to do everything: choose the checks that make sense for your product, its architecture, and the risks of each change.

| Phase | Common checks | What we're looking for |
|---|---|---|
| **Local Prechecks** | Formatting and linting, a quick build, unit tests, and secret scanning. | Catch obvious errors before sharing the change, without waiting for the pipeline. |
| **Change Validation** | CI build, unit tests, contract validation, code and dependency analysis, and automated accessibility checks when there is an interface. | Find failures that didn't appear locally and make sure the required checks pass before integration. |
| **Integration & Packaging** | Integration and contract tests, checks for data changes when applicable, and analysis of the generated artifact. | Find incompatible components or problems in the artifact we're going to deploy. |
| **Development Validation** | Post-deployment smoke checks, main user flows, communication between services, permissions, and delivery of logs, metrics, and traces. | See whether configuration or integration errors appear when the product runs in a shared or temporary environment. |
| **Pre-Production Validation** | Regression and acceptance, security, load and concurrency, compatibility, accessibility, and backup restoration. | Take a closer look at the release in a production-like environment before it goes live. |
| **Production Deployment & Validation** | Progressive deployment when appropriate, smoke checks with controlled side effects, and review of errors and latency against agreed criteria. | Detect problems with real configuration or traffic and act if we need to stop the rollout or recover the service. |
| **Continuous Monitoring & Feedback** | Service indicators and objectives, actionable alerts, synthetic journeys, and incident reviews. | Spot problems as they develop and find ways to improve the product, alerts, and tests. |

You don't need to run everything for every change. You can keep fast checks for each integration and schedule an extended load test or full restore as often as your team needs.

One distinction I find useful: in production, watching metrics and alerts is **monitoring**. Running a synthetic journey or checking that an alert fires and reaches the right place is a test.
