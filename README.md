# Insite

This is a project for UCSC's CSE 115A course. It is a React repository for a 
node-based data visualization tool.

## Building
This repository is built with Node.js. It is known to work with `v18.12.0`.

After cloning it, you will want to run `npm install` to install the required
dependencies. This process will also set up Git pre-commit hooks via `husky`.
These pre-commit hooks will execute ESLint and Prettier in their respective
`--fix` and `--write` modes to help ensure that your code is compliant with
our code style.

## Development
The front-end can be started with `npm run start` in development mode. Although
the build-tooling implements hot-reloading, our code does not support it; you will
want to reload your webpages after making changes.

There is also a companion back-end that supports more involved computation. It may
be found at [Insite Server](https://git.ucsc.edu/insite/insite-server).

## Compilation and Packaging
The single-page app can be assembled with the `npm run build` command.
