# LumApps Frontend Test

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

The candidate will need to use Node JS v.20.11.1 in order to run this project. Not doing so will result in an error. The candidate can install this particular version using [nvm](https://github.com/nvm-sh/nvm).

To start development, the candidate can execute `yarn start`, which will run the app in development mode.

## Project delivery

This project should be accessible on GitHub as either a private or public repository. The candidate's recruiter will provide further details when it comes to who to give access to the repository.
