# Template: Frontend (Phaser 3) + TypeScript

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Deploy project to GitHub Pages](https://github.com/new-objects/template-frontend-phaser3/actions/workflows/deploy.yml/badge.svg)](https://github.com/new-objects/template-frontend-phaser3/actions/workflows/deploy.yml)

[Template](https://new-objects.github.io/template-frontend-phaser3/) for frontend projects of newObjects GmbH, rendering 2D graphics with Phaser3 .

## Tools / stack

- **[Phaser 3](https://phaser.io/)** for rendering 2D graphics
- [Vite](https://vitejs.dev/) for bundling
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/) for styling
- [PostCSS](https://postcss.org/) for CSS processing
- [ESLint](https://eslint.org/) for linting
- [Prettier](https://prettier.io/) for code formatting
- [GitHub actions](https://github.com/features/actions) for continuous integration

All tools are defined as **`dev-dependencies`**!

## Prerequisites

You'll need [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed.

It is highly recommended to use [Node Version Manager](https://github.com/nvm-sh/nvm) (nvm) to install Node.js and npm.

For Windows users there is [Node Version Manager for Windows](https://github.com/coreybutler/nvm-windows).

Install Node.js and `npm` with `nvm`:

```bash
nvm install node

nvm use node
```

Replace 'node' with 'latest' for `nvm-windows`.

## Setup

There are three ways to get started with this template:

1. Either use the [nobj](https://github.com/new-objects/cli) tool to create a copy of this template ("phaser3")
2. [Create a new repository with this repository as template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)
3. Fork the repository and clone it to your local machine.

### Getting started

We provide a default set of tools via npm scripts. Run a script via

```shell
$ npm run <command>
```

where `<command>` is one of the following available commands:

| Command          | Description                                                                                   | Output                                                   |
| ---------------- | --------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `install`        | Installs dependencies                                                                         | -                                                        |
| `dev`            | Starts a development server with hot reloading                                                | http://localhost:5173                                    |
| `dev:host`       | Starts a development server with hot reloading, listening to all available network interfaces | http://localhost:5173, http://0.0.0.0:5173, ...          |
| `build`          | Builds the project for production                                                             | `dist`                                                   |
| `build:gh-pages` | Builds the project for production (gh-pages)                                                  | `dist`                                                   |
| `preview`        | Builds the project for production and previews it locally                                     | http://localhost:4173                                    |
| `lint`           | Lints the project                                                                             | -                                                        |
| `lint:fix`       | Lints the project and fixes errors                                                            | -                                                        |
| `prettier`       | Formats the project                                                                           | -                                                        |
| `prettier:fix`   | Formats the project and fixes errors                                                          | -                                                        |
| `format`         | Lints and formats the project and fixes errors                                                | -                                                        |
| `gh-deploy`      | Builds the project for production (gh-pages) and deploys it to GitHub Pages                   | https://new-objects.github.io/template-frontend-phaser3/ |

## Environment variables

The following environment variables are used in this project:

- `NODE_ENV`: The environment in which the application is running. Possible values are `development`, `test`, and `production`.
- `DEPLOY_ENV`: The environment to which the application is deployed. Possible values are `""` and `gh-pages`.

## Project Structure

```
    .
    ├── dist
    ├── node_modules
    ├── public
    ├── src
    |   ├── js
    |   |   ├── scenes
    │   |   |   ├── Game.ts
    │   |   ├── index.ts
	  ├── index.html
    ├── package.json
```

JavaScript files are intended for the `src\js` folder. `index.ts` is the entry point referenced by `index.html`.

Other than that there is no opinion on how you should structure your project.

There is an example `Game.ts` file that is placed inside a `scenes` folder to organize by type or elsewhere to organize by function. For example, you can keep all files specific to the HelloWorld scene in a `hello-world` folder.

It is all up to you!

## Static Assets

Any static assets like images or audio files should be placed in the `public` folder. It'll then be served from the root. For example: http://localhost:8000/images/my-image.png

Example `public` structure:

```
    public
    ├── images
    │   ├── my-image.png
    ├── music
    │   ├── ...
    ├── sfx
    │   ├── ...
```

They can then be loaded by Phaser with `this.image.load('my-image', 'images/my-image.png')`.

# TypeScript ESLint

This template uses a basic `eslint` set up for code linting to help you find and fix common problems in your JavaScript code.

It does not aim to be opinionated.

[See here for rules to turn on or off](https://eslint.org/docs/rules/).

## Dev Server Port

You can change the dev server's port number by modifying the `vite.config.js` file. Look for the `server` section:

```js
{
	// ...
	server: { host: '0.0.0.0', port: 8080 },
}
```
