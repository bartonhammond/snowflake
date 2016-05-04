## Customizable navbar for react-native
![react-native-side-menu demo](https://habrastorage.org/files/1b4/9cd/9d0/1b49cd9d0d054cada8ebef5e2326e10d.png)

### Content
- [Installation](#installation)
- [Examples](#examples)
- [Getting started](#getting-started)
- [API](#api)
- [Usage with webpack](#usage-with-webpack)
- [Questions?](#questions)

### Installation
First of all, make sure you're using `npm3+` and `babel6` for version `1.1.1` or above.

```bash
npm i react-native-navbar --save
```

### Examples
- [Basic](https://github.com/Kureev/react-native-navbar/tree/master/examples/Basic)
- [Custom Elements](https://github.com/Kureev/react-native-navbar/tree/master/examples/CustomElements)
- [Routing](https://github.com/Kureev/react-native-navbar/tree/master/examples/Routing)

### Getting started
*First of all, I assume you've already made a react-native project by running `react-native init project-name` and installed `react-native-navbar` component by `npm`.*

In your `index.ios.js` file require `react-native-navbar` component:
```jsx
var NavigationBar = require('react-native-navbar');
```
or, if you use ES2015 syntax:
```jsx
import NavigationBar from 'react-native-navbar';
```

Inside your component's `render` method, use `NavigationBar`:
```jsx
render: function() {
  var rightButtonConfig = {
    title: 'Next',
    handler: function onNext() {
      alert('hello!');
    }
  };

  var titleConfig = {
    title: 'Hello, world',
  };

  return (
    <View style={{ flex: 1, }}>
      <NavigationBar
        title={titleConfig}
        rightButton={rightButtonConfig} />
    </View>
  );
}
```
or, if you use ES2015:
```jsx
render() {
  const rightButtonConfig = {
    title: 'Next',
    handler: () => alert('hello!'),
  };

  const titleConfig = {
    title: 'Hello, world',
  };

  return (
    <View style={{ flex: 1, }}>
      <NavigationBar
        title={titleConfig}
        rightButton={rightButtonConfig} />
    </View>
  );
}
```

That's it, you're ready to go!

### API
- **style** - (Object, Array) - Style object or array of style objects
- **tintColor** - (String) - NavigationBar's tint color
- **statusBar** - (Object):
  - **style** - ('light-content' or 'default') - Style of statusBar
  - **hidden** - (Boolean)
  - **tintColor** - (String) - Status bar tint color
  - **hideAnimation** - ('fade', 'slide', 'none') - Type of statusBar hide animation
  - **showAnimation** - ('fade', 'slide', 'none') - Type of statusBar show animation
- **leftButton / rightButton** - (Object, React Element) - Either plain object with configuration, or React Element which will be used as a custom left/right button element. Configuration object has following keys:
  - **title** - (String) - Button's title
  - **tintColor** - (String) - Button's text color
  - **style** - (Object, Array) - Style object or array of style objects
  - **handler** - (Function) - onPress function handler
- **title** - (Object, React Element) - Either plain object with configuration, or React Element which will be used as a custom title element. Configuration object has following keys:
  - **title** - (String) - Button's title
  - **tintColor** - (String) - Title's text color

### Usage with Webpack
This module uses JSX syntax and requires a compiler such as [babel](https://babeljs.io/).
React Native's packager runs this automatically but if you use Webpack be sure
to compile this module from your dependencies
```javascript
loaders: [{
  test: /\.js$/,
   include: [
     path.resolve(__dirname, "src"),
     path.resolve(__dirname, "node_modules/react-native-navbar")
   ],
  loader: 'babel',
  query: { stage: 0, plugins: [] }
}]
```

### Questions?
Feel free to contact me via
- [Twitter](https://twitter.com/kureevalexey)
- Slack (@kureev on #reactiflux channel)

If you want to report a bug, please [submit an issue!](https://github.com/Kureev/react-native-navbar/issues/new)
