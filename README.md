[![Build Status](https://travis-ci.org/beckend/redux-observable-ts.svg?branch=master)](https://travis-ci.org/beckend/redux-observable-ts)
[![Coverage Status](https://coveralls.io/repos/github/beckend/redux-observable-ts/badge.svg?branch=master)](https://coveralls.io/github/beckend/redux-observable-ts?branch=master)
[![Dependency Status](https://img.shields.io/david/beckend/redux-observable-ts.svg?maxAge=2592000)](https://david-dm.org/beckend/redux-observable-ts)
[![DevDependency Status](https://img.shields.io/david/dev/beckend/redux-observable-ts.svg?maxAge=2592000)](https://david-dm.org/beckend/redux-observable-ts?type=dev)

# A Boilerplate to create npm modules using typescript

### Requires
- `npm -g i gulp-cli jest-cli`.

### Usage
- `gulp --tasks` to get going.

### Developing
- `jest --watchAll` to watch recompiled files and rerun tests.

### Testing
Supports:
- `jest`, needs `jest-cli` installed. it will execute the transpiled files from typescript.

### Dist
- `gulp` will run default task which consist of running tasks:
- `lint`, `clean`, `build`, `minify` then `jest` and collect coverage.
