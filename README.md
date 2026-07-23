# LumApps Frontend Test

[![CI](https://github.com/fruitizz/frontend-tech-test-submission/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/fruitizz/frontend-tech-test-submission/actions/workflows/ci.yml)
[![Playwright](https://img.shields.io/badge/tested_with-Playwright-45ba4b?logo=playwright&logoColor=white)](https://playwright.dev)
[![Coverage](https://img.shields.io/badge/coverage-85%25%2F80%25%2F75%25-brightgreen)](https://github.com/fruitizz/frontend-tech-test-submission/actions/workflows/ci.yml)

## Reviewer Guide

For anyone doing a time-boxed review of this submission:

- **Live app:** [frontend-tech-test-submission.vercel.app](https://frontend-tech-test-submission.vercel.app)
- **Architecture:** [docs/architecture.md](docs/architecture.md)

**Final architecture, in short:** a Vite + React 19 app with a narrow `src/api` transport boundary (`requestJson` + typed `ApiError`/`SearchError`), a `src/features/character-search` slice that owns search and pagination state as an explicit `SearchViewState` discriminated union and reaction state as a per-card `ReactionState` union, presentational components under `src/components`, and shared pure helpers under `src/lib` (pagination, reactions grouping, abortable requests). See the architecture document for full detail, including state ownership and the abort/stale-response handling strategy.

**Primary quality evidence:**

- Unit/component tests: `yarn test` / `yarn test:coverage` — Vitest, covering `src/api`, `src/lib`, and the feature's state-derivation logic.
- End-to-end tests: `yarn test:e2e` — Playwright, covering search, pagination, reactions, request states, retries, clear/reset, keyboard shortcut, and accessibility.
- Coverage thresholds are enforced in CI (see [Unit tests and coverage](#unit-tests-and-coverage) below).
- GitHub Actions CI runs validation (tests, coverage, build, Hanfani) and the full E2E suite on every PR and push to `master`.

**Five key PRs** (chronologically last, and most representative of the final quality bar):

- [#42](https://github.com/fruitizz/frontend-tech-test-submission/pull/42) — E2E tests and CI
- [#45](https://github.com/fruitizz/frontend-tech-test-submission/pull/45) — semantic HTML, accessibility and coverage gate
- [#47](https://github.com/fruitizz/frontend-tech-test-submission/pull/47) — narrow API/error boundary
- [#49](https://github.com/fruitizz/frontend-tech-test-submission/pull/49) — feature-oriented architecture
- [#51](https://github.com/fruitizz/frontend-tech-test-submission/pull/51) — explicit search and reaction view states

PRs [#22–#28](https://github.com/fruitizz/frontend-tech-test-submission/pulls?q=is%3Apr) contain the progressive functional implementation of search, reactions, pagination and request states that the PRs above later hardened and refactored; not every one of the 20+ historical PRs received independent human review, so the five PRs above are the fastest path to evaluating the final quality bar.

## Introduction

Welcome to the LumApps Frontend Technical Test. In this test, the candidate will need to create a small frontend application using the technologies that we at LumApps use in our daily routine.

## What is the candidate going to develop?

### Description 

In this technical test, the idea is to create a simple frontend application that retrieves data from a server and renders a list of entities. The candidate will be using a locally provided API in order to list the different characters, and the candidate needs to allow the user to search for a character based on their name. The main page should:
- When the user searches for a character, by typing on the Search field, and hits enter, a list of 4 results will be displayed. The results displayed should display characters where their name starts with the text entered by the user on the Search field.
- At the bottom of the page, a simple pagination system will be displayed, that will allow the user to see more results.
- A second API is provided in order to retrieve the reactions that each of these characters has. The candidate needs to retrieve this data and add it to each of the characters displayed

### Mockup

Below you will find a low fidelity mockup of the application which should give the idea of how the application should work. This does not mean that the candidate's test needs to be exactly identical to the design, this test will not evaluate the candidate's skill to create web applications that are pixel perfect. However, a general coherence in terms of style, spacing and sizes will be evaluated.

Each result displays:
- Character's image
- Character's name
- Character's description
- Character's species, birth year, affiliations.

The Pagination component should be present at the bottom of the page.

![App mockup](design.png)

### Acceptance criteria

For this test to be completed, the candidate's application should:
- Allow the user to search for characters by their name
- Display a list of 4 results, each of them with an image, title, description and the additional data
- Reactions for each character.
- A pagination component that allows the user to navigate between pages.

These features are what LumApps requires for considering this test as a complete one and the candidate should focus on having these features developed before developing additional features, functionality should be the focus of the test. If the search, reactions or the pagination features do not work or are not developed, the test will be considered as incomplete and it will affect the final review.

The candidate should not control how much time they are taking to fulfill the test. Each candidate can take as long as they want (as long as it is within the reasonable timeframe of LumApps recruitement scheduling), but the amount of time that the candidate takes will not affect the evaluation of the test itself.

## What will be evaluated?

The objective of this test is to evaluate different topics of frontend development. Specifically:
- The level of expertise that a candidate has with the web stack, which includes HTML, CSS and JavaScript, and how the candidate uses these languages in order to solve a problem.
- The level of expertise when it comes to JavaScript and React in general. 
- The attention that the candidate has for the general quality of the application. Specifically in terms of:
    - Accessibility
    - Performance
    - Usability and visual coherence
    - Maintainability
    - Edge case management

## Stack

In this test, we encourage the candidate to use the technologies that we use in our daily basis:
*   HTML
*   JavaScript
*   React JS
*   SCSS
*   Yarn
*   Webpack and Webpack Dev Server

If the candidate wants to use other technologies or add features in order to enhance their application (such as, Redux, Jest, RTL, responsive design), they can do so.

As for using a components library, the candidate has multiple choices:
- If the candidate already knows and uses a specific React components library, they can use it and save sometime on the development process.
- If the candidate does not know any library, they can use the following: [https://github.com/lumapps/design-system](https://github.com/lumapps/design-system). This is an open source library created by LumApps and that we use in our current product. The candidate can access the library's documentation by going to https://design.lumapps.com/.

### Ground rules

* We strongly suggest that the candidate uses the technologies suggested under the Stack section. If the candidate wants to use another technology such as Angular JS or Vue JS because they do not know React, they can do so, but they should take into consideration that we do not use them in our daily basis
* If the candidate wants to use their own boilerplate, they are free to override the whole repository, but the candidate should note that this could take more time than just using the provided boilerplate.

## Setup

The candidate should fork the repo and create their own, downloading it locally.

In the project directory, the candidate needs to run: `yarn`
This will setup the necessary dependencies to execute this project.

The candidate will need to use Node JS v.20.19.0 or later (see `engines.node` in `package.json`, matched to the CI Node version and to Vite 7's minimum supported Node version) in order to run this project. Not doing so will result in an error. The candidate can install a compatible version using [nvm](https://github.com/nvm-sh/nvm).

To start development, the candidate can execute `yarn start`, which will run the app in development mode.

## Project delivery

This project should be accessible on GitHub as either a private or public repository. The candidate's recruiter will provide further details when it comes to who to give access to the repository.
