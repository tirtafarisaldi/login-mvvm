# CONTENT MANAGEMENT SYSTEM FRONTEND STUDIO PERTUNJUKAN

## Pattern
 - [Design Pattern - MVVM](https://reactjsexample.com/clean-architecture-for-react/)


## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode with staging environment.\
Open [http://localhost:5001](http://localhost:5001) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run lint`

Linter checking.

## Master Branch Git Commit Guidelines

We have very precise rules over how our git commit messages can be formatted in our **Master Branch**.  This leads to **more
readable messages** that are easy to follow when looking through the **project history**.  But also,
we use the git commit messages to **generate the change log**.

Note: If you mark as **squash commits** on the Github merge options, make sure title of merge request should be follow this commit guidelines.

### Commit Message Format
The commit message should be structured as follows:

```
<type>[optional scope]: <description>
<BLANK LINE>
[optional body]
<BLANK LINE>
[optional footer(s)]
```

Note: Appends a ! after the type/scope, introduces a breaking API change

Examples:

Commit message with scope
```
feat(lang): add english language
```
Commit message with scope and ! to draw attention to breaking change
```
chore(webpack)!: drop support for Node 6
```
Commit message with no scope
```
docs: correct spelling of README
```
Commit message with ! to draw attention to breaking change
```
chore!: drop support for Node 6
```

### Type
Must be one of the following:

* **feat** or **feature**: A new feature
* **fix** or **hotfix**: A bug fix
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **perf**: A code change that improves performance
* **test**: Adding missing or correcting existing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

### Scope
A scope MAY be provided after a type. A scope MUST consist of a noun describing a section of the codebase surrounded by parenthesis, e.g., `fix(server): your commit message`

You can use `*` when the change affects more than a single scope.

### Description
The description is a short summary of the code changes, e.g., `fix: array parsing issue when multiple spaces were contained in string.`

* follow the colon and space after the type/scope prefix
* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize first letter
* no dot (.) at the end

A detailed explanation can be found in this [conventionalcommits spesification](https://www.conventionalcommits.org/).