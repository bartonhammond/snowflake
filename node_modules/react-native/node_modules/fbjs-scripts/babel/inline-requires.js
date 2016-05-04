/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

/**
 * Map of require(...) aliases to module names.
 *
 * `Foo` is an alias for `require('ModuleFoo')` in the following example:
 *   var Foo = require('ModuleFoo');
 */
var inlineRequiredDependencyMap;

/**
 * This transform inlines top-level require(...) aliases with to enable lazy
 * loading of dependencies.
 *
 * Continuing with the example above, this replaces all references to `Foo` in
 * the module to `require('ModuleFoo')`.
 */
module.exports = function fbjsInlineRequiresTransform(babel) {
  var t = babel.types;

  function buildRequireCall(name) {
    return t.callExpression(
      t.identifier('require'),
      [t.literal(inlineRequiredDependencyMap[name])]
    );
  }

  return new babel.Transformer('fbjs.inline-requires', {
    Program: {
      enter: function(node, parent, scope, state) {
        resetCollection();
      },
    },

    /**
     * Collect top-level require(...) aliases.
     */
    CallExpression: {
      enter: function(node, parent, scope) {
        if (isTopLevelRequireAlias(this)) {
          var varName = parent.id.name;
          var moduleName = node.arguments[0].value;

          inlineRequiredDependencyMap[varName] = moduleName;

          // Remove the declaration.
          this.parentPath.parentPath.dangerouslyRemove();
          // And the associated binding in the scope.
          scope.removeBinding(varName);
        }
      },
    },

    /**
     * Inline require(...) aliases.
     */
    Identifier: {
      enter: function(node, parent, scope, state) {
        if (!shouldInlineRequire(node, scope)) {
          return node;
        }

        if (
          parent.type === 'AssignmentExpression' &&
          this.isBindingIdentifier() &&
          !scope.bindingIdentifierEquals(node.name, node)
        ) {
          throw new Error(
            'Cannot assign to a require(...) alias, ' + node.name +
            '. Line: ' + node.loc.start.line + '.'
          );
        }

        return this.isReferenced() ? buildRequireCall(node.name) : node;
      }
    },
  });
};

function resetCollection() {
  inlineRequiredDependencyMap = {};
}

function isTopLevelRequireAlias(path) {
  return (
    isRequireCall(path.node) &&
    path.parent.type === 'VariableDeclarator' &&
    path.parent.id.type === 'Identifier' &&
    path.parentPath.parent.type === 'VariableDeclaration' &&
    path.parentPath.parent.declarations.length === 1 &&
    path.parentPath.parentPath.parent.type === 'Program'
  );
}

function isRequireCall(node) {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'require' &&
    node['arguments'].length === 1 &&
    node['arguments'][0].type === 'Literal'
  );
}

function shouldInlineRequire(node, scope) {
  return (
    inlineRequiredDependencyMap.hasOwnProperty(node.name) &&
    !scope.hasBinding(node.name, true /* noGlobals */)
  );
}
