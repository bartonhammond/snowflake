Snowflake ![snowflake](https://cloud.githubusercontent.com/assets/1282364/19871941/447b11ea-9f85-11e6-81d6-cb4b70faea6f.png)
==================================
A React-Native starter mobile app, or maybe just an example, or maybe a boilerplate (you decide) for iOS and Android with a single code base, with 2 backends to chose from: a Hapi or Parse Server solution- [Demo](#screens)

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c072e4c80b2e477591170553b149772b)](https://www.codacy.com/app/bartonhammond/snowflake?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=bartonhammond/snowflake&amp;utm_campaign=Badge_Grade)
[![Join the chat at https://gitter.im/bartonhammond/snowflake](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/bartonhammond/snowflake?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
![iOS](https://img.shields.io/badge/IOS--blue.svg) [![Build Status](https://www.bitrise.io/app/348ae0a97c5e147a.svg?token=RmDwzjeIGuo7i9MeazE1fg)](https://www.bitrise.io/app/348ae0a97c5e147a)
![Android](https://img.shields.io/badge/Android--blue.svg) [![Build Status](https://www.bitrise.io/app/1e0425744dcc7ce3.svg?token=uvZDZvo89BLXvjrArJJreQ)](https://www.bitrise.io/app/1e0425744dcc7ce3)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://github.com/bartonhammond/snowflake/blob/master/LICENSE)
[![React Native](https://img.shields.io/badge/react%20native-0.41.2-brightgreen.svg)](https://github.com/facebook/react-native)

## Installation

* [Install React-Native](https://facebook.github.io/react-native/docs/getting-started.html#content)

### Install Snowflake
* Clone snowflake: `git clone https://github.com/bartonhammond/snowflake.git`

* install dependencies

```
cd snowflake

npm install
```

### Using Snowflake Hapi Server

#### Use the local or remote Snowflake Hapi Server
To make things easy for you, the `config.example.js` has been initialized to use the remote **Snowflake Hapi Server** which is running on **Redhat OpenShift**.

This **Snowflake Hapi Server** is Open Source.  It can run either locally or on **RedHat OpenShift**.  For your convince a server is running at: [https://snowflakeserver-bartonhammond.rhcloud.com](https://snowflakeserver-bartonhammond.rhcloud.com/)

Please refer to [https://github.com/bartonhammond/snowflake-hapi-openshift](https://github.com/bartonhammond/snowflake-hapi-openshift) for more information about the code and instructions for installation and setup of the server.

#### The following commands are for the client

*  Copy the ```src/lib/config.example.js``` to ```src/lib/config.js```.  
* **Note**: the `.gitignore` includes `config.js` from being committed to GitHub
* **Note**: you must select either  `hapiLocal` or `hapiRemote` for the ```backend``` as shown below with `hapiRemote` set as the default.

```
  backend: {
    hapiLocal: false,
    hapiRemote: true,
    parseLocal: false,
    parseRemote: false
  },
```
* To run Hapi locally, follow the instructions at [https://github.com/bartonhammond/snowflake-hapi-openshift](https://github.com/bartonhammond/snowflake-hapi-openshift).  You will have to install **MongoDB** and **Redis**.
* **Note**: The default is to run remotely on the **RedHat OpenShift Snowflake Server** so there is nothing more to do if you want to use it! In that case, just use the `config.js` as is.
* If you want to install and run  the **Snowflake Hapi Server** locally, then update the ```src/lib/config.js``` file as shown below.  
* **Note**: use the ip from the `ifconfig` command for the `local`. This ip matches the **Snowflake Hapi Server** setup.
*  An example of the `url` is shown below assuming the `ifconfig` shows the local ip to be `192.168.0.5`
* **Note**: You don't have to provide the `local.url` value if you are using the `remote`

```
  HAPI: {
    local: {
      url: 'http://192.168.0.5:5000'
    },
    remote: {
      url: 'https://snowflakeserver-bartonhammond.rhcloud.com/'
    }
  }

```

### Using Parse Server
This **Snowflake Parse Heroku Server** is Open Source.  It can run either locally or on **Heroku**.  For your convince a server is running at: [https://snowflake-parse.herokuapp.com/parse](https://snowflake-parse.herokuapp.com/parse)

Please refer to [https://github.com/bartonhammond/snowflake-parse-heroku](https://github.com/bartonhammond/snowflake-parse-heroku) for more information about the code and instructions for installation and setup of the server.

#### The following instructions are for the client
* Copy the ```src/lib/config.example.js``` to ```src/lib/config.js```.  
* **Note**: the `.gitignore` includes `config.js` from being committed to GitHub
* Set `parseLocal` to true if you are running a local instance of parse-server
* Otherwise, set `parseRemote` to true to indicate your parse server instance is hosted in the cloud

```
  backend: {
    hapiLocal: false,
    hapiRemote: false,
    parseLocal: true,
    parseRemote: false
  },
```

* To setup parse-server, follow the instructions at https://github.com/ParsePlatform/parse-server-example
* Set the `local.url` value if you are running parse-server `local`
* Set the `remote.url` value if you are running parse-server `remote`

```
  PARSE: {
    appId: 'snowflake',                              // match APP_ID in parse-server's index.js
    local: {
    	url: 'http://localhost:1337/parse'             // match SERVER_URL in parse-server's index.js
    },
    remote: {
    	url: 'https://enter_your_snowflake_host.com'   // match SERVER_URL in parse-server's index.js
    }
  }

```

### To run:
* For iOS, from the command line, run via command: ```react-native run-ios``` or open XCode and load project, Run ```Product -> Run (⌘+R)```
* For Android, from the command line, run via the command: ```react-native run-android``` assuming you have an emulator or device running and attached
* To run Jest, ```npm test```
* To debug Jest unit cases, install [node_inspector](https://github.com/node-inspector/node-inspector) and run ```npm run test-chrome```
* Enjoy!


----------


------------
## Notes

Code is written to [JS Standard](https://github.com/feross/standard) and validated with [Eslint](http://eslint.org/).  To setup your favorite editor using the Eslint configuration, see [Editors](http://eslint.org/docs/user-guide/integrations#editors)

Navigation is handled with [React Native Router Flux](https://github.com/aksonov/react-native-router-flux).  Multiple scenes support **Login, Register, and Reset Password**.  Once successfully logged in, there are 3 more scenes: **Logout, Subview, and Profile**.

A user can **change** their **Email Address** and **User Name** once they are logged in using the **Profile** form.

The icons used throughout the app are from [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons), namely using **FontAwesome**

**Form building** is extremely easy and consistent by using [Tcomb Form Library](https://github.com/gcanti/tcomb-form-native) by using **domain models** and writing less code.

Using [Redux](https://github.com/reactjs/react-redux) and [Immutable](https://facebook.github.io/immutable-js/), the state of the application is **testable** with [Jest](https://facebook.github.io/jest/), which includes [Snapshot tests](http://facebook.github.io/jest/blog/2016/07/27/jest-14.html) currently with 85 tests and ~90% coverage!!!  

To ease the pain of Redux Action definitions, Snowflake uses [Key Mirror](https://github.com/STRML/keyMirror).

Using the [Validate.JS](https://validatejs.org/) Library, all **user input is validated**.  Appropriate messages are displayed to the user guiding them in the input requirements.

Once a user is logged in, their **Session State is stored** in [AsyncStorage](https://github.com/jasonmerino/react-native-simple-store) so that subsequent usage does not require logging in again.

Snowflake supports **multiple languages** using [I18n](https://github.com/AlexanderZaytsev/react-native-i18n) with English, French and Spanish.

Snowflake supports **Hot Reloading** of its state.  

Snowflake uses CI with [Bitrise.io]( https://www.bitrise.io) and has **extensive docs and 45+ min of video** demonstating implementation.

Snowflake has a **choice of servers**, either

* **Hapi Server** that runs on **RedHat Openshift** and **locally**.

    See [https://github.com/bartonhammond/snowflake-hapi-openshift](https://github.com/bartonhammond/snowflake-hapi-openshift) for more information about the OpenShift Hapi server.  The setup instructions below describe how to select the server you desire.  

* **Parse Server** that runs **remotely** or **locally**

    See [https://github.com/ParsePlatform/parse-server-example](https://github.com/ParsePlatform/parse-server-example) for more information.

---------------
# Content

- [Editor Configuration](#editor-configuration)
- [Screens](#screens)
- [Summary](#summary)
- [Quotes](#quotes)
- [Technologies](#technologies)
- [Continuous Integration](#continuous-integration)
- [Redux State Management](#redux-state-management)
- [Hot Reloading](#hot-reloading)
- [FAQ](#faq)
- [Source documentation](http://bartonhammond.github.io/snowflake/snowflake.js.html)

----------

## Editor Configuration
**Atom**
```bash
apm install editorconfig es6-javascript javascript-snippets linter linter-eslint language-babel
```

**Sublime**
* https://github.com/sindresorhus/editorconfig-sublime#readme
* https://github.com/SublimeLinter/SublimeLinter3
* https://github.com/roadhump/SublimeLinter-eslint
* https://github.com/babel/babel-sublime

**Others**
* [Editorconfig](http://editorconfig.org/#download)
* [ESLint](http://eslint.org/docs/user-guide/integrations#editors)
* Babel Syntax Plugin

## Screens

| Platform| Register     | Login | Profile   |
| :------:| :-------: | :----: | :---: |
| iOS|  ![iOS Profile](https://cloud.githubusercontent.com/assets/1282364/11598478/b2b1b5e6-9a87-11e5-8be9-37cbfa478a71.gif)  | ![iOS Login](https://cloud.githubusercontent.com/assets/1282364/11598580/6d360f02-9a88-11e5-836b-4171f789a41d.gif)| ![iOS Register](https://cloud.githubusercontent.com/assets/1282364/11598582/6d392750-9a88-11e5-9839-05127dfba96b.gif)  |
| Android |![Android Register](https://cloud.githubusercontent.com/assets/1282364/11598579/6d3487b8-9a88-11e5-9e95-260283a6951e.gif)    | ![Android Login](https://cloud.githubusercontent.com/assets/1282364/11598577/6d2f140e-9a88-11e5-8cd4-1ba8c9cbc603.gif)   |  ![Android Profile](https://cloud.githubusercontent.com/assets/1282364/11598578/6d314ee0-9a88-11e5-9a6c-512a313535ee.gif) |


----------

## Summary

1. The application runs on **both iOS and Android** with a **single code** base
1. A User can **Register, Login, Logout, Reset their Password** and modify their **Profile**
1. The Forms display messages for **help and field validation**.
1. The Forms are **protected** when fetching.
1. The Forms display **spinner** when fetching.
1. Form submission **errors are displayed** (see above Login)
1. **All state changes*** are actions to the Redux store.
1. The backend is provided by either a Hapi server or Parse server using the **Rest API**
1. **Every action** performed by the UI interfaces with the **Redux actions** and subsequently to the Redux Store.  This **reduces the complexity** of the JSX Components **tremendously**and makes them easily testable.
1. **Jest Unit Tests cover ~90%** of the application statements.
1. Demonstrates how to **setup React-Native to perform Jest testing** with Mock modules
1. Includes ability to **debug Jest unit tests** with Chrome
1. Instructions and videos for **continuous integration with Bitrise.io**

----------
## Quotes

Some quotes from users of **Snowflake**

**Open Source Mag: Learn best of React Native with these open source projects**:
[http://opensourceforu.com/2016/05/learn-best-of-react-native-with-these-open-source-projects/](http://opensourceforu.com/2016/05/learn-best-of-react-native-with-these-open-source-projects/)

**ICICletech Blog: Mobile App Development With 8 Awesome React-Native Starter Kits**:
We have listed some of our favorite starter kits and boilerplates to get started quickly.
[https://www.icicletech.com/blog/react-native-starter-kits](https://www.icicletech.com/blog/react-native-starter-kits)

**Infinite.Red: Ignite Your Mobile Development:**
> awesome releases as Barton Hammond’s snowflake.

[https://shift.infinite.red/ignite-your-mobile-development-32417590ed3e#.pz7u3djtm](https://shift.infinite.red/ignite-your-mobile-development-32417590ed3e#.pz7u3djtm)

**AdtMag: New Community Projects for React Native: Deco IDE and Pepperoni Boilerplate**
[https://adtmag.com/articles/2016/05/26/react-native-projects.aspx](https://adtmag.com/articles/2016/05/26/react-native-projects.aspx) Snowflake mentioned

**Pepperoni App Kit** (see [Credits](https://github.com/futurice/pepperoni-app-kit#credits))
>This project was initially motivated by Snowflake....you should check it out to see if it's a good fit for your app.

**Viktor**
>Just saw the tweets, still watching the vids. It's awesome!! It's really really high quality, I'm truly amazed

**John**
>project is awesome, thank you for providing it!

**Eric**:
> I've been going through snowflake and love what you have done!

**Nikos**:
> wow new videos, nice

**Josh**
>thanks for the thorough videos!

**Patrick**
> just wanna snowflake is awesome

**Justin**
>Congrats - the project is super helpful

**Stephen**
>Thanks so much for this amazing foundation!

**Jim**
>Neat project

----------

## Technologies
*The following are brief descriptions of the technologies used*

### [React-Native](https://facebook.github.io/react-native/)
*React Native enables you to build world-class application experiences on native platforms using a consistent developer experience based on JavaScript and React.*

What more can I say?  It's a fantastic leap forward in providing the ability to write native applications with Javascript that target both iOS and Android.

This application provides one code base that works on both platforms.  It demonstrates Form interactions,  Navigation, and use of many other components.

### [Jest](https://facebook.github.io/jest/)
*85 Unit tests that cover plain objects and JSX components*

The de-facto standard for React/Native testing.  This app demonstrates how to mock **ReactNative, node_modules, classes** and to properly **test JSX components** by programmatically changing the props, and throughly **test the applications data state and the actions** in conjunction with Redux.

![Jest Coverage Analysis](https://cloud.githubusercontent.com/assets/1282364/17187737/19524234-5400-11e6-8350-53e653a4c1f6.png)

### [Redux](http://redux.js.org/)
*Redux is a predictable state container for JavaScript apps. It helps you write applications that behave consistently, run in different environments (client, server, and native), and are easy to test.*

Before Redux, application state was managed by all the various components in the app.  Now, the state is managed in a **predictable and consistent manner** and it can be **tested with Jest** and best of all, it is **independent** of the UI.  This is a major advancement in application design!

### [Hapi](http://hapijs.com/)
For me, Hapi provided a clear way for defining APIs and managing things clearly.  Some folks like Express, I've used Express myself, and I wanted to try Hapi.  I'm very satisfied with Hapi.  As you may or may not know, WalMart Labs produced Hapi and they've used it in their business.  

One of the needs of any application is server side processing.  With the ability to run Hapi locally or on OpenShift, I'm able to write my server logic and test it locally.  When I'm "happy" I can push the code to OpenShift.  The same code runs in both environments.

### [Parse Server](https://github.com/ParsePlatform/parse-server)
As an alternative to Hapi, Snowflake also supports Parse Server.  Parse Server is an open source version of the Parse backend that can be deployed to any infrastructure that can run Node.js.

Parse Server works with the Express web application framework.  You can test it locally and push changes to your parse remote server when you are ready.

### [OpenShift](https://www.openshift.com/)
I chose OpenShift because I could get a reasonable performing application for free.  The Snowflake server ([https://github.com/bartonhammond/snowflake-hapi-openshift](https://github.com/bartonhammond/snowflake-hapi-openshift) uses 3 gears with MongoDB and Redis.  

### [TComb](https://github.com/gcanti/tcomb-form-native)
*A structured model based approach to declarative forms*

*With this library, you **simplify form processing** incredibly!  Write a lot **less code**, get **usability** and **accessibility for free** (automatic labels, inline validation, etc) and no need to update forms when domain model changes.  This application **demonstrates how to test these forms** also!

### [Validate.js](http://validatejs.org/)
*Validate.js provides a declarative way of validating javascript objects.*

Using Validate.js for the Form processing was a breeze!  And with the ability to test the validations to the Redux state was very easy!

---------------


## Continuous Integration

CI proves to the developer that everything required to build and test
the application is well defined and repeatable.  Without CI, one would
not know, for a fact, that all the required tools and assests are
available for everyone to build with.  CI gives us developers some
"peace of mind" that our build process is repeatable.

The following videos will walk you through setting up CI with BitRise.io

- [Introduction](#introduction)
- [Bitrise Overview](#bitrise-overview)
- [iOS XCode Modifications](#ios-xcode-modifications)
- [XCode Certs Provision Profiles  App Id](#xcode-certs-provision-profiles-app-id)
- [Create iOS App](#create-ios-app)
- [iOS install](#ios-install)
- [Android Setup](#android-setup)
- [Addendum #1](#addendum-#1)
- [Things not addressed](#things-not-addressed)

----------

##### Introduction
* **Video 1/7**: [https://youtu.be/EYafslJvXz8](https://youtu.be/EYafslJvXz8)

<a href="http://www.youtube.com/watch?feature=player_embedded&v=EYafslJvXz8" target="_blank">
  <img src="http://img.youtube.com/vi/EYafslJvXz8/0.jpg" alt="Introduction" width="240" height="180" border="10" />
</a>

* Snowflake is a *starter app* so all tutorials are basic in nature
* There are a bizzilion ways of doing any of this - I'm showing one
* There's a number of CI sites, I chose Bitrise.io
* There's a general understanding of why to us a CI
* The build will be done on Bitrise.io - not locally
* The **only** goal is to get the build to run on Bitrise.io
* You can **still** run applications locally with simulators


##### Bitrise Overview
  * **Video 2/7**: [https://youtu.be/JAHlfNUKoLg](https://youtu.be/JAHlfNUKoLg)

<a href="http://www.youtube.com/watch?feature=player_embedded&v=JAHlfNUKoLg" target="_blank">
  <img src="http://img.youtube.com/vi/JAHlfNUKoLg/0.jpg" alt="Bitrise.io Overview" width="240" height="180" border="10" />
</a>

  *  Introduction to Bitrise.io [https://www.bitrise.io/](https://www.bitrise.io/)
  * Overview of what it does for us
  * Overview of the two WorkFlows
	  * iOS
	  * Android

##### iOS XCode Modifications
* **Video 3/7**: [https://youtu.be/3y72adWNRSU](https://youtu.be/3y72adWNRSU)

<a href="http://www.youtube.com/watch?feature=player_embedded&v=3y72adWNRSU" target="_blank">
  <img src="http://img.youtube.com/vi/3y72adWNRSU/0.jpg" alt="iOS XCode Modifications" width="240" height="180" border="10" />
</a>

  * XCode
	* Icons - Asset Catalog Creator Free - see App Store
	* Bundler ID
	* [ https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/ConfiguringYourApp/ConfiguringYourApp.html](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/ConfiguringYourApp/ConfiguringYourApp.html)
	* AppDelegate.m
	* Versioning
	* [https://developer.apple.com/library/ios/qa/qa1827/_index.html](https://developer.apple.com/library/ios/qa/qa1827/_index.html)
	* Automatic Certificate & Development

##### XCode Certs Provision Profiles App Id
  * **Video 4/7**: [https://youtu.be/zJXoHIaJg7Y](https://youtu.be/zJXoHIaJg7Y)

<a href="http://www.youtube.com/watch?feature=player_embedded&v=zJXoHIaJg7Y" target="_blank">
  <img src="http://img.youtube.com/vi/zJXoHIaJg7Y/0.jpg" alt="XCode Certs Provision Profiles" width="240" height="180" border="10" />
</a>

* see [https://developer.apple.com/library/ios/qa/qa1814/_index.html](https://developer.apple.com/library/ios/qa/qa1814/_index.html)
* App Development Center
	*  Remove all Certs, App Ids, and Profiles
   * Generating  Certificates and Provision Profile
		* Update XCode appDelegate.m w/ ifconfig value
		* Xcode -> Run with device attached
		* Select option for Xcode to fix signing

##### Create iOS App
* **Video 5/7**: [Bitrise, YML, Profile, P12](https://youtu.be/olfpwEjVlZ4)

<a href="http://www.youtube.com/watch?feature=player_embedded&v=olfpwEjVlZ4" target="_blank">
  <img src="http://img.youtube.com/vi/olfpwEjVlZ4/0.jpg" alt="Create iOS App" width="240" height="180" border="10" />
</a>

* Login/Register Bitrise.io
* Dashboard
* Add App
* Authenticate GitHub
* Select repository, branch
* Import YML
* Download Certifications
* Update KeyChain
* Save .p12
* Download Provision
* Load .p12 and provision to Bitrise.io
* Setup Secret and Env Vars
* Build

##### iOS install
* **Video 6/7**: [https://youtu.be/nQWXJI0ncns](https://youtu.be/nQWXJI0ncns)

<a href="http://www.youtube.com/watch?feature=player_embedded&v=nQWXJI0ncns" target="_blank">
  <img src="http://img.youtube.com/vi/nQWXJI0ncns/0.jpg" alt="iOS install from email" width="240" height="180" border="10" />
</a>

* From device, open email app
* Open **letsconnect**
* Follow instructions to load in Safarie
* Follow prompts and enjoy!

##### Android Setup
* **Video 7/7**: [Android YML, Setup](https://youtu.be/o4RQZodbzIU)

<a href="http://www.youtube.com/watch?feature=player_embedded&v=o4RQZodbzIU" target="_blank">
  <img src="http://img.youtube.com/vi/o4RQZodbzIU/0.jpg" alt="Android Setup" width="240" height="180" border="10" />
</a>

* Settings -> Docker Image
* Secret Variables
* App/build.gradle
* Setup Secret and Env Vars
* Import YML
* Run build

##### Addendum #1
* **Video**: [XCode Edge Stack, WorkFlow](https://youtu.be/mP5D2MQboxw)

<a href="http://www.youtube.com/watch?feature=player_embedded&v=mP5D2MQboxw" target="_blank">
  <img src="http://img.youtube.com/vi/mP5D2MQboxw/1.jpg" alt="XCode Edge Stack" width="240" height="180" border="10" />
</a>

* "XCode Edge Stack" for iOS
* New React-Native steps for Install & Bundle
* Upgraded Step versions
* GitHub branch triggers



##### Things not addressed
* Submission to any store
* Working with other CIs
* Complex setups for either iOS or Android
* Debugging any failures
* Shiny new things
* No local builds with Bitrise CLI
* No local builds with Fastlane
* No tutorial on all the features of Fastlane


---------------

## Redux State Management
This section explains a little about what I've learned with Redux and the management of application state.

### Without Redux

![Alt text](https://g.gravizo.com/source/custom_mark10?https%3A%2F%2Fraw.githubusercontent.com%2Fbartonhammond%2Fsnowflake%2Fmaster%2FREADME.md)

<details> 
<summary></summary>
custom_mark10
  digraph G {
    aize ="4,4";
    login [shape=box];
    login -> validate [style=bold,label="1"];
    login -> restful [style=bold,label="2"];
    restful -> parse [style=bold,label="3"];
    login -> router [style=bold,label="4"];
    router-> new_page [style=bold,label="5"];
  }
custom_mark10
</details>


A typical app, at least those I've written before, have logic and state scattered all through out.  Frameworks help to organize but typically the developer has to know how to "stitch" it together by remembering to update certain state at certain times.

In the above diagram, the Login component is responsible for calling the Validate and making sure the rules are applied and errors are displayed. Then it has to have logic that confirms everything is in the right state, and pass that data to a Restul API to interact, in this case, with Parse.  When that activity is complete the Router has to be informed and a new_page can be displayed.

This makes testing hard as the logic is partially contained in the Login component itself and the sequence of those events are encapsulated there too!  

### With Redux

![Alt text](https://g.gravizo.com/source/custom_mark11?https%3A%2F%2Fraw.githubusercontent.com%2Fbartonhammond%2Fsnowflake%2Fmaster%2FREADME.md)

<details> 
<summary></summary>
custom_mark11
  digraph G {
    aize ="4,4";
    login [shape=box];
    login -> Action[style=bold,label="1"];
    Action -> Reducer [style=bold,label="2"];
    Reducer -> login [style=bold,label="3"];
    login -> Action [style=bold,label="4"];
    Action -> restful [style=bold,label="5"];
    restful -> parse [style=bold,label="6"];
    Action -> Reducer [style=bold,label="7"];
    Reducer -> new_page [style=bold,label="8"];
  }
custom_mark11
</details>

What the above diagram depicts is that the logic for login is contained in the Actions and Reducer and can be tested in isolation from the UI. This also makes the UI Component Login much simpler to write as it just renders content based on props that are provided.  The props are actually the Reducer Store.

So what is happening in this diagram?  Where's the Validation?  That would be in step 1.  When the user enters characters on the form, they are sent to an action.  The action packages them up and sends them to the Reducer.  The reducer looks at what Type the Action is and performs the operation, in this case, Validate the parameters.

How does Login respond?  Well, it recieves the updated Props - the properties which are the store.  It then renders it's output based on those properties.  Just straight forward logic - nothing more then checking the properties and display approptiately.  At no time does the Login component change any property state.  

The responsibility of changing state belongs to the Reducer.

Every time an Action is called, that Action interacts w/ the Reducer.  The Reducer does state changes on the State or Store model.

Let's look at a concrete example, Resetting a Password.  Now the UI is pretty simple, provide a Text Input for the email entry and a Button to click.  Let's further assume that the email has been validated and the user clicks the "Reset Password" button.  All that Login does is call an Action function called ```resetPassword``` passing the email value.

So don't get too overwhelmed with the following code.  You can think of the ```dispatch``` calls as meerly as a messaging system.  Each ```dispatch``` call invokes a function - it just calls a function in a Promise chain.  

I want to now look at one specific Action and trace it's path.  That action is the ```dispatch(resetPasswordRequest());``` call.  That call signals that the "**reset password request**" processing is starting.  We'll look at that next and how it trickles all the way back to the Login ui.

> Action.resetPassword

```
export function resetPassword(email) {
  return dispatch => {
    dispatch(resetPasswordRequest());
    return new Parse().resetPassword({
      email: email
    })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(loginState());
          dispatch(resetPasswordSuccess());
        } else {
          dispatch(resetPasswordFailure(JSON.parse(response._bodyInit)));
        }
        return response;
      })
      .then((response) => {
        if (response.status === 200 || response.status === 201) {
          dispatch(emitLoggedOut());
        }
      })
      .catch((error) => {
        dispatch(resetPasswordFailure(error));
      });

  };
}
```

The simple function returns an object with type ```RESET_PASSWORD_REQUEST```.  All of the activities performed have this pattern, make a REQUEST and then either have a SUCCESS or a FAILURE.

Now Redux is responsible for taking this returned Action object and passing it to the Reducer.  What does the Reducer do with this Action?  We'll look at that next.

> Action.resetPasswordRequest

```
export function resetPasswordRequest() {
  return {
    type: RESET_PASSWORD_REQUEST
  };
}
```

The Reducer is a function with 2 parameters, state and action.  What it does is to make modifications to the state depending upon the action.  The state is any javascript object you like.  This application uses Immutable.js for it's state so to guarantee the state is always immutable.

Notice the ```switch``` statement - it's looking at that Action.type value - all Actions have a type value.  In our case, the type is RESET_PASSWORD_REQUEST.

So what's happening here.  If any request type comes to the Reducer, including RESET_PASSWORD_REQUEST, we change the state by setting the ```form.isFetching``` to ```true``` and the ```form.error``` field to null.  The returned new state value has these two fields set.

What happens with that new state?  Well Redux makes that state available in the Login component ```props```.  And since the ```props``` have changed, Login needs to ```render```.  Let's look at that next.

> Reducer.Action.ResetPasswordRequest snippet

```
export default function authReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);
  switch (action.type) {

  case SESSION_TOKEN_REQUEST:
  case SIGNUP_REQUEST:
  case LOGOUT_REQUEST:
  case LOGIN_REQUEST:
  case RESET_PASSWORD_REQUEST:
      let nextState =  state.setIn(['form', 'isFetching'], true)
        .setIn(['form','error'],null);
    return nextState;
.....
```

So here in the ```render``` component we need to decide if a ```spinner``` should be displayed.  It should display when the ```props.isFetching``` is ```true```.  That's the value set above in the Reducer!  All the Login ```render()``` has to do is check that property and set the UI appropriately.

> Login.Header.render snippet

```
  render() {
    let spinner = <Text> </Text>;
    if (this.props.isFetching) {
      spinner =  <GiftedSpinner/>;
    }

    return (
      <View style={styles.header}>
        <Image style={styles.mark} source={{uri:
                                            'http://i.imgur.com/da4G0Io.png'}}
        />
        {spinner}
      </View>
    );
  }
```

Hopefully this gives you some insight into how Redux is integrated into the application.  In my opinion, this is a huge step in application logic.

If you'd like to read an excellent tutorial on Redux I can't recommend this one enough: [http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html](http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html)


--------------------

## Hot Reloading
This video shows Snowflake exporting and importing state from Redux.  It demonstrates, with the iOS Simulator, the process of copying the state for import at a later time.  After the demo, I walk through the code to clarify how I achieved this.  It's assumed you have some familiarity with Redux.  Hopefully it helps you gain a better understanding of what Redux provides you!

<a href="http://www.youtube.com/watch?feature=player_embedded&v=b4eqQUA3O6o" target="_blank"><img src="http://img.youtube.com/vi/b4eqQUA3O6o/0.jpg"
alt="Snowflake Hot Loading" width="240" height="180" border="10" /></a>



-------------

## Faq

### How do I change the Language of the App?  

Just use the Settings of your Device or Simulator.

### Why did you use the RestAPI instead of the (JS-sdk | ParseReact)

I looked at it initially and, imo, it had too much magic.  For example, I couldn't see how I was going to isolate my JSX components easily and keep all my "state" in Redux.  ParseReact is right there in the middle of your JSX component which would tie me to a very particular vendor and implementation detail.  If I decided to later move away from ParseReact I'd have to rewrite a lot of code and tests.

Also, it had this statement

> Mutations are dispatched in the manner of Flux Actions, allowing updates to be synchronized between many different components without requiring views to talk to each other

I don't want to deal w/ wrapping my head around Flux Actions and have to monkey-patch or something to get Redux Actions.

In a previous life, I worked with Parse JS SDK and it's based on backbone.js.  So I didn't go that direction either, because, again, I didn't want to have another data model to deal with.  Plus, at the time I was using it, the SDK was buggy and it was difficult to work with.

With the Parse Rest API, it's simple, can be tested itself from the command line with curl, it's clear, it's succinct and it's easily replaced with something else, an example such as Mongo/Mongoose without much, if any, impact on the code base.


###### -barton hammond
