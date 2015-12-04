Snowflake ![snowflake](https://cloud.githubusercontent.com/assets/1282364/11599365/1a1c39d2-9a8c-11e5-8819-bc1e48b30525.png)
==================================
#### A React-Native starter mobile app for iOS and Android with a single code base.

----------
| Platform| Register     | Login | Profile   |
| :------:| :-------: | :----: | :---: |
| iOS|![ios Register](https://cloud.githubusercontent.com/assets/1282364/11598582/6d392750-9a88-11e5-9839-05127dfba96b.gif) | ![ios Login](https://cloud.githubusercontent.com/assets/1282364/11598580/6d360f02-9a88-11e5-836b-4171f789a41d.gif)|  ![ios Profile](https://cloud.githubusercontent.com/assets/1282364/11598478/b2b1b5e6-9a87-11e5-8be9-37cbfa478a71.gif)   |
| Android |![Android Register](https://cloud.githubusercontent.com/assets/1282364/11598579/6d3487b8-9a88-11e5-9e95-260283a6951e.gif)    | ![Android Login](https://cloud.githubusercontent.com/assets/1282364/11598577/6d2f140e-9a88-11e5-8cd4-1ba8c9cbc603.gif)   |  ![Android Profile](https://cloud.githubusercontent.com/assets/1282364/11598578/6d314ee0-9a88-11e5-9a6c-512a313535ee.gif) |

## Application summary

 1. The application runs on **both iOS and Android**with a **single code** base
 2. A User can **Register, Login, Logout, Reset their Password** and modify their **Profile**
 3. The Forms display messages for **help and field validation**.
 4. The Forms are **protected** when fetching.
 5. The Forms display **spinner** when fetching.
 6. **All state changes*** are actions to the Redux store.
 3. The backend is provided by Parse.com using the **Rest API**
 3. **Every action** performed by the UI interfaces with the **Redux actions** and subsequently to the Redux Store.  This **reduces the complexity** of the JSX Components **tremendously**and makes them easily testable.
 4. **Jest Unit Tests cover 86%** of the application statements.
 5. Demonstrates how to **setup React-Native to perform Jest testing** with Babel.
 6. Includes ability to **debug Jest unit tests**with Chrome

## Technologies
*The following are brief descriptions of the technologies used*

### [React-Native](https://facebook.github.io/react-native/) 
*React Native enables you to build world-class application experiences on native platforms using a consistent developer experience based on JavaScript and React.*

What more can I say?  It's a fantastic leap forward in providing the ability to write native applications with Javascript that target both iOS and Android.

This application provides one code base that works on both platforms.  It demonstrates Form interactions,  Navigation, and use of many other components.

###[Jest](https://facebook.github.io/jest/) 
*81 Unit tests that cover plain objects and JSX components*

The de-facto standard for React/Native testing.  This app demonstrates how to mock **ReactNative, node_modules, classes** and to properly **test JSX components** by programmatically changing the props, and throughly **test the applications data state and the actions** in conjunction with Redux.

![Jest Coverage Analysis](https://cloud.githubusercontent.com/assets/1282364/11598581/6d38ead8-9a88-11e5-956f-c0f09c22b6f0.png)

###[Redux](http://redux.js.org/)
*Redux is a predictable state container for JavaScript apps. It helps you write applications that behave consistently, run in different environments (client, server, and native), and are easy to test.*

Before Redux, application state was managed by all the various components in the app.  Now, the state is managed in a **predictable and consistent manner** and it can be **tested with Jest** and best of all, it is **independent** of the UI.  This is a major advancement in application design!

###[Parse.com](https://www.parse.com/)
*Focus on creating amazing user experiences and forget complex infrastructure*

Using Parse.com as the backend **reduces the angst** of setting up a server, managing the database, providing security and backups, etc.  Their free tier is more then amble to achieve a POC.

###[TComb](https://github.com/gcanti/tcomb-form-native)
*A structured model based approach to declarative forms*

*With this library, you **simplify form processing** incredibly!  Write a lot **less code**, get **usability** and **accessibility for free** (automatic labels, inline validation, etc) and no need to update forms when domain model changes.  This application **demonstrates how to test these forms** also!

###[Validate.js](http://validatejs.org/)
*Validate.js provides a declarative way of validating javascript objects.*

Using Validate.js for the Form processing was a breeze!  And with the ability to test the validations to the Redux state was very easy!

## Setup

 1. [Install React-Native](https://facebook.github.io/react-native/docs/getting-started.html#content)
 2. ```git clone https://github.com/bartonhammond/snowflake.git```
 3. cd snowflake
 4. npm install
 5. Create account and app on Parse.com
	 6. Copy the Parse.com app keys for APP_ID and REST_API_KEY and update ```src/lib/config.js```
	 7. Update the Apps Settings -> Authentication 
		 8. Allow username and password-based authentication -> Yes
		 9. Allow anonymous users -> No
	 10. Update the Apps Settings -> Email
		 11. Verify user emails -> Yes
 7. On mac, open XCode and load project
 8. For android, ```react-native run-android``` assuming you have an emulator or device attached.
 9. To run Jest, ```npm test```
 10. To debug Jest unit cases, install [node_inspector](https://github.com/node-inspector/node-inspector) and run ```npm run test-chrome```
 7. Enjoy!


######-barton hammond
