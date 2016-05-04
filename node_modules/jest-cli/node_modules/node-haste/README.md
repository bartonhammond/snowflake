# node-haste [![Build Status](https://travis-ci.org/facebook/node-haste.png?branch=master)](https://travis-ci.org/facebook/node-haste)

node-haste is a dependency management system for static resources for node.js. It provides the ability to statically resolve JavaScript module dependencies both for node module resolution and Facebook's haste module system.

It is used internally at Facebook as well as externally as part of Facebook's open source projects, like [jest](https://github.com/facebook/jest) and [react-native](https://github.com/facebook/react-native).

**Note:** If you are consuming the code here and you are not also a Facebook project, be prepared for a bad time. APIs may appear or disappear and we may not follow semver strictly, though we will do our best to. This library is being published with our use cases in mind and is not necessarily meant to be consumed by the broader public. In order for us to move fast and ship projects like Jest and react-native, we've made the decision to not support everybody. We probably won't take your feature requests unless they align with our needs. There will be overlap in functionality here and in other open source projects.

## Example Usage

```sh
npm install --save node-haste
```

```js
const NodeHaste = require('node-haste');

const cache = new NodeHaste.Cache({
  cacheKey: '$$cacheKey$$',
});

const fileWatcher = new NodeHaste.FileWatcher([{
  dir: '/path/to/node-haste/lib',
}], {useWatchman: true});

// Create an instance of the dependency graph
const graph = new NodeHaste({
  roots: ['/path/to/node-haste/lib'],
  cache,
  fileWatcher,
  // Don't throw on unresolved errors; node-haste currently doesn't support
  // native node modules, for example.
  shouldThrowOnUnresolvedErrors: () => false,
});

// Find all recursive dependencies of `lib/index.js`
graph.getDependencies('/path/to/node-haste/lib/index.js')
  .then(
    response => console.log(response.dependencies.map(dep => dep.path)),
    error => console.error(error)
  );

```

## Development

```sh
$ npm install
$ npm test
```
