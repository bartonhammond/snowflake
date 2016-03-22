Snowflake ![snowflake](https://cloud.githubusercontent.com/assets/1282364/11599365/1a1c39d2-9a8c-11e5-8819-bc1e48b30525.png)
==================================
#### A React-Native starter mobile app, or maybe just an example, or maybe a boilerplate (you decide) for iOS and Android with a single code base. 

[![Join the chat at https://gitter.im/bartonhammond/snowflake](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/bartonhammond/snowflake?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
![ios](https://img.shields.io/badge/IOS--blue.svg) [![Build Status](https://www.bitrise.io/app/348ae0a97c5e147a.svg?token=RmDwzjeIGuo7i9MeazE1fg)](https://www.bitrise.io/app/348ae0a97c5e147a)
![andriod](https://img.shields.io/badge/Android--blue.svg) [![Build Status](https://www.bitrise.io/app/1e0425744dcc7ce3.svg?token=uvZDZvo89BLXvjrArJJreQ)](https://www.bitrise.io/app/1e0425744dcc7ce3)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://github.com/bartonhammond/snowflake/blob/master/LICENSE) 

--------------- 
Navigation is handled with [React Native Router Flux](https://github.com/aksonov/react-native-router-flux)

Using [Redux](https://github.com/reactjs/react-redux) and [Immutable](https://facebook.github.io/immutable-js/), the state of the application is testable with Jest, currently at 80% coverage. 

Snowflake supports Hot Reloading of its state.  Snowflake uses CI with [Bitrise.io]( https://www.bitrise.io) and has extensive docs and 45+ min of video demonstating implementation.

Note: Snowflake now (Jan 3, 2016) has a **choice of servers**, either 

* The original Parse.com 
or 
* Hapi Server that runs on Openshift and locally.  

See [https://github.com/bartonhammond/snowflake-hapi-openshift](https://github.com/bartonhammond/snowflake-hapi-openshift) for more information about the OpenShift Hapi server.  The setup instructions below describe how to select the server you desire.  

-----------------

# Content

- [Screens](#screens)
- [Summary](#summary)
- [Quotes](#quotes)
- [Technologies](#technologies)
- [Setup](#setup)
- [Continuous Integration](#continuous-integration)
- [Redux State Management](#redux-state-management)
- [Hot Reloading](#hot-reloading)
- [FAQ](#faq)
- [Source documentation](http://bartonhammond.github.io/snowflake/snowflake.js.html)

----------

## Screens

| Platform| Register     | Login | Profile   |
| :------:| :-------: | :----: | :---: |
| iOS|  ![ios Profile](https://cloud.githubusercontent.com/assets/1282364/11598478/b2b1b5e6-9a87-11e5-8be9-37cbfa478a71.gif)  | ![ios Login](https://cloud.githubusercontent.com/assets/1282364/11598580/6d360f02-9a88-11e5-836b-4171f789a41d.gif)| ![ios Register](https://cloud.githubusercontent.com/assets/1282364/11598582/6d392750-9a88-11e5-9839-05127dfba96b.gif)  |
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
1. The backend is provided by Parse.com using the **Rest API**
1. **Every action** performed by the UI interfaces with the **Redux actions** and subsequently to the Redux Store.  This **reduces the complexity** of the JSX Components **tremendously**and makes them easily testable.
1. **Jest Unit Tests cover 86%** of the application statements.
1. Demonstrates how to **setup React-Native to perform Jest testing** with Babel.
1. Includes ability to **debug Jest unit tests**with Chrome
1. Instructions and videos for **continuous integration with Bitrise.io**

----------
## Quotes

Some quotes from users of **Snowflake**

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

###[Jest](https://facebook.github.io/jest/) 
*81 Unit tests that cover plain objects and JSX components*

The de-facto standard for React/Native testing.  This app demonstrates how to mock **ReactNative, node_modules, classes** and to properly **test JSX components** by programmatically changing the props, and throughly **test the applications data state and the actions** in conjunction with Redux.

![Jest Coverage Analysis](https://cloud.githubusercontent.com/assets/1282364/11598581/6d38ead8-9a88-11e5-956f-c0f09c22b6f0.png)

###[Redux](http://redux.js.org/)
*Redux is a predictable state container for JavaScript apps. It helps you write applications that behave consistently, run in different environments (client, server, and native), and are easy to test.*

Before Redux, application state was managed by all the various components in the app.  Now, the state is managed in a **predictable and consistent manner** and it can be **tested with Jest** and best of all, it is **independent** of the UI.  This is a major advancement in application design!

###[Hapi](http://hapijs.com/)
For me, Hapi provided a clear way for defining APIs and managing things clearly.  Some folks like Express, I've used Express myself, and I wanted to try Hapi.  I'm very satisfied with Hapi.  As you may or may not know, WalMart Labs produced Hapi and they've used it in their business.  

One of the needs of any application is server side processing.  With the ability to run Hapi locally or on OpenShift, I'm able to write my server logic and test it locally.  When I'm "happy" I can push the code to OpenShift.  The same code runs in both environments.

###[Parse.com](https://www.parse.com/)
*Focus on creating amazing user experiences and forget complex infrastructure*

Using Parse.com as the backend **reduces the angst** of setting up a server, managing the database, providing security and backups, etc.  Their free tier is more then ample to achieve a POC.

While Parse.com was nice to use in starting the Snowflake app, once I needed to write server side code, I chose to look elsewhere.  Why?  Because, for one, I can't debug the "Cloud Code" locally or remotely.  Another, Parse has it's own flavors for HTTP Request and Promises.  It just made it difficult to write server side code and work w/ Parse.  

### [OpenShift](https://www.openshift.com/)
I chose OpenShift because I could get a reasonable performing application for free.  The Snowflake server ([https://github.com/bartonhammond/snowflake-hapi-openshift](https://github.com/bartonhammond/snowflake-hapi-openshift) uses 3 gears with MongoDB and Redis.  

###[TComb](https://github.com/gcanti/tcomb-form-native)
*A structured model based approach to declarative forms*

*With this library, you **simplify form processing** incredibly!  Write a lot **less code**, get **usability** and **accessibility for free** (automatic labels, inline validation, etc) and no need to update forms when domain model changes.  This application **demonstrates how to test these forms** also!

###[Validate.js](http://validatejs.org/)
*Validate.js provides a declarative way of validating javascript objects.*

Using Validate.js for the Form processing was a breeze!  And with the ability to test the validations to the Redux state was very easy!

---------------


## Setup

* [Install React-Native](https://facebook.github.io/react-native/docs/getting-started.html#content)

* Clone snowflake:

 ```
 git clone https://github.com/bartonhammond/snowflake.git
 ```

*  cd snowflake
```
npm install
```

*  Copy or move ```src/lib/config.example.js``` to ```src/lib/config.js```.
   * Note: you must select one of three options for the ```backend``` as shown below:

```
  backend: {
    parse: false,
    hapiLocal: false,
    hapiRemote: true
  },
```
   * To run Hapi either locally on remotely on OpenShift, update the below ```src/lib/config.js``` file:

```
  HAPI: {
    local: {
      url: 'http://127.0.0.1:5000'
    },
    remote: {
      url: 'https://mysnowflake-bartonhammond.rhcloud.com'
    }
  }

```

* If you choose Parse.com, create account and app on Parse.com
  * Copy the Parse.com app keys for APP_ID and REST_API_KEY and update ```src/lib/config.js```
  * Update the Apps Settings -> Authentication 
 	  * Allow username and password-based authentication -> Yes
	  * Allow anonymous users -> No
  * Update the Apps Settings -> Email
	  * Verify user emails -> Yes

### To run: 
* On mac, open XCode and load project
* For android, ```react-native run-android``` assuming you have an emulator or device attached.
* To run Jest, ```npm test```
* To debug Jest unit cases, install [node_inspector](https://github.com/node-inspector/node-inspector) and run ```npm run test-chrome```
* Enjoy!


----------


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
- [Things not addressed](#things-not-addressed)

----------

##### Introduction 
* **Video 1/7**: [https://youtu.be/EYafslJvXz8](https://youtu.be/EYafslJvXz8)
<a
href="http://www.youtube.com/watch?feature=player_embedded&v=EYafslJvXz8"
target="_blank">
<img src="http://img.youtube.com/vi/EYafslJvXz8/0.jpg" 
alt="Introduction" width="240" height="180" border="10"
/></a>

* Snowflake is a *starter app* so all tutorials are basic in nature
* There are a bizzilion ways of doing any of this - I'm showing one
* There's a number of CI sites, I chose Bitrise.io 
* There's a general understanding of why to us a CI
* The build will be done on Bitrise.io - not locally
* The **only** goal is to get the build to run on Bitrise.io
* You can **still** run applications locally with simulators


#####  Bitrise Overview
  * **Video 2/7**:[https://youtu.be/JAHlfNUKoLg](https://youtu.be/JAHlfNUKoLg)
<a
href="http://www.youtube.com/watch?feature=player_embedded&v=JAHlfNUKoLg"
target="_blank">
<img src="http://img.youtube.com/vi/JAHlfNUKoLg/0.jpg" 
alt="Bitrise.io Overview" width="240" height="180" border="10"
/></a>

  *  Introduction to Bitrise.io [https://www.bitrise.io/](https://www.bitrise.io/)
  * Overview of what it does for us
  * Overview of the two WorkFlows
	  * iOS 
	  * Android 

##### iOS XCode Modifications
* **Video 3/7**:[https://youtu.be/3y72adWNRSU](https://youtu.be/3y72adWNRSU)
<a
href="http://www.youtube.com/watch?feature=player_embedded&v=3y72adWNRSU"
target="_blank">
<img src="http://img.youtube.com/vi/3y72adWNRSU/0.jpg" 
alt="iOS XCode Modifications" width="240" height="180" border="10"
/></a>
  * XCode
	* Icons - Asset Catalog Creator Free - see App Store
	* Bundler ID
	* [ https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/ConfiguringYourApp/ConfiguringYourApp.html](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/ConfiguringYourApp/ConfiguringYourApp.html)
	* AppDelegate.m
	* Versioning
	* [https://developer.apple.com/library/ios/qa/qa1827/_index.html](https://developer.apple.com/library/ios/qa/qa1827/_index.html)
	* Automatic Certificate & Development

##### XCode Certs Provision Profiles App Id
  * **Video 4/7**:
  [https://youtu.be/zJXoHIaJg7Y](https://youtu.be/zJXoHIaJg7Y)
<a
href="http://www.youtube.com/watch?feature=player_embedded&v=zJXoHIaJg7Y"
target="_blank">
<img src="http://img.youtube.com/vi/zJXoHIaJg7Y/0.jpg" 
alt="XCode Certs Provision Profiles" width="240" height="180" border="10"
/></a>
* see [https://developer.apple.com/library/ios/qa/qa1814/_index.html](https://developer.apple.com/library/ios/qa/qa1814/_index.html)
* App Development Center
	*  Remove all Certs, App Ids, and Profiles
   * Generating  Certificates and Provision Profile
		* Update XCode appDelegate.m w/ ifconfig value
		* Xcode -> Run with device attached
		* Select option for Xcode to fix signing
	
##### Create iOS App
* **Video 5/7**:
[Bitrise, YML, Profile, P12](https://youtu.be/olfpwEjVlZ4)
<a
href="http://www.youtube.com/watch?feature=player_embedded&v=olfpwEjVlZ4"
target="_blank">
<img src="http://img.youtube.com/vi/olfpwEjVlZ4/0.jpg" 
alt="Create iOS App" width="240" height="180" border="10"
/></a>
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
<a
href="http://www.youtube.com/watch?feature=player_embedded&v=nQWXJI0ncns"
target="_blank">
<img src="http://img.youtube.com/vi/nQWXJI0ncns/0.jpg" 
alt="iOS install from email" width="240" height="180" border="10"
/></a>

* From device, open email app
* Open **letsconnect**
* Follow instructions to load in Safarie
* Follow prompts and enjoy!

##### Android Setup 
* **Video 7/7**: [Android YML, Setup](https://youtu.be/o4RQZodbzIU)
<a
href="http://www.youtube.com/watch?feature=player_embedded&v=o4RQZodbzIU"
target="_blank">
<img src="http://img.youtube.com/vi/o4RQZodbzIU/0.jpg" 
alt="Android Setup" width="240" height="180" border="10"/>
</a>

* Settings -> Docker Image
* Secret Variables 
* App/build.gradle
* Setup Secret and Env Vars 
* Import YML
* Run build

##### Things not addressed
* Submission to any store
* Working with other CIs
* Complex setups for either ios or andriod
* Debugging any failures
* Shiny new things
* No local builds with Bitrise CLI
* No local builds with Fastlane
* No tutorial on all the features of Fastlane


---------------

## Redux State Management
This section explains a little about what I've learned with Redux and the management of application state.

### Without Redux

![Alt text](http://g.gravizo.com/g?
  digraph G {
    aize ="4,4";
    login [shape=box];
    login -> validate [style=bold,label="1"];
    login -> restful [style=bold,label="2"];
    restful -> parse [style=bold,label="3"];
    login -> router [style=bold,label="4"];
    router-> new_page [style=bold,label="5"];
  }
)

A typical app, at least those I've written before, have logic and state scattered all through out.  Frameworks help to organize but typically the developer has to know how to "stitch" it together by remembering to update certain state at certain times.

In the above diagram, the Login component is responsible for calling the Validate and making sure the rules are applied and errors are displayed. Then it has to have logic that confirms everything is in the right state, and pass that data to a Restul API to interact, in this case, with Parse.com.  When that activity is complete the Router has to be informed and a new_page can be displayed.

This makes testing hard as the logic is partially contained in the Login component itself and the sequence of those events are encapsulated there too!  

### With Redux

![Alt text](http://g.gravizo.com/g?
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
)

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

### Why did you use the RestAPI instead of the (JS-sdk | ParseReact)

I looked at it initially and, imo, it had too much magic.  For example, I couldn't see how I was going to isolate my JSX components easily and keep all my "state" in Redux.  ParseReact is right there in the middle of your JSX component which would tie me to a very particular vendor and implementation detail.  If I decided to later move away from ParseReact I'd have to rewrite a lot of code and tests.

Also, it had this statement

> Mutations are dispatched in the manner of Flux Actions, allowing updates to be synchronized between many different components without requiring views to talk to each other

I don't want to deal w/ wrapping my head around Flux Actions and have to monkey-patch or something to get Redux Actions.

In a previous life, I worked with Parse JS SDK and it's based on backbone.js.  So I didn't go that direction either, because, again, I didn't want to have another data model to deal with.  Plus, at the time I was using it, the SDK was buggy and it was difficult to work with. 

With the Parse Rest API, it's simple, can be tested itself from the command line with curl, it's clear, it's succinct and it's easily replaced with something else, an example such as Mongo/Mongoose without much, if any, impact on the code base.


######-barton hammond
