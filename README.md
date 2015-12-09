Snowflake ![snowflake](https://cloud.githubusercontent.com/assets/1282364/11599365/1a1c39d2-9a8c-11e5-8819-bc1e48b30525.png)
==================================
#### A React-Native starter mobile app for iOS and Android with a single code base.  Using Redux and Immutable, the state of the application is fully testable with Jest, currently at 86% coverage.  Snowflake supports Hot Reloading of its state.


# Content

- [Screens](#screens)
- [Hot Reloading](#hot-reloading)
- [Summary](#summary)
- [Source documentation](http://bartonhammond.github.io/snowflake/snowflake.js.html)
- [Technologies](#technologies)
- [Setup](#setup)
- [Redux State Management](#redux-state-management)
- [FAQ](#faq)

----------

## Screens

| Platform| Register     | Login | Profile   |
| :------:| :-------: | :----: | :---: |
| iOS|  ![ios Profile](https://cloud.githubusercontent.com/assets/1282364/11598478/b2b1b5e6-9a87-11e5-8be9-37cbfa478a71.gif)  | ![ios Login](https://cloud.githubusercontent.com/assets/1282364/11598580/6d360f02-9a88-11e5-836b-4171f789a41d.gif)| ![ios Register](https://cloud.githubusercontent.com/assets/1282364/11598582/6d392750-9a88-11e5-9839-05127dfba96b.gif)  |
| Android |![Android Register](https://cloud.githubusercontent.com/assets/1282364/11598579/6d3487b8-9a88-11e5-9e95-260283a6951e.gif)    | ![Android Login](https://cloud.githubusercontent.com/assets/1282364/11598577/6d2f140e-9a88-11e5-8cd4-1ba8c9cbc603.gif)   |  ![Android Profile](https://cloud.githubusercontent.com/assets/1282364/11598578/6d314ee0-9a88-11e5-9a6c-512a313535ee.gif) |

----------

## Hot Reloading
This video shows Snowflake exporting and importing state from Redux.  It demonstrates, with the iOS Simulator, the process of copying the state for import at a later time.  After the demo, I walk through the code to clarify how I achieved this.  It's assumed you have some familiarity with Redux.  Hopefully it helps you gain a better understanding of what Redux provides you!

<a href="http://www.youtube.com/watch?feature=player_embedded&v=b4eqQUA3O6o" target="_blank"><img src="http://img.youtube.com/vi/b4eqQUA3O6o/0.jpg" 
alt="Snowflake Hot Loading" width="240" height="180" border="10" /></a>

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

###[Parse.com](https://www.parse.com/)
*Focus on creating amazing user experiences and forget complex infrastructure*

Using Parse.com as the backend **reduces the angst** of setting up a server, managing the database, providing security and backups, etc.  Their free tier is more then amble to achieve a POC.

###[TComb](https://github.com/gcanti/tcomb-form-native)
*A structured model based approach to declarative forms*

*With this library, you **simplify form processing** incredibly!  Write a lot **less code**, get **usability** and **accessibility for free** (automatic labels, inline validation, etc) and no need to update forms when domain model changes.  This application **demonstrates how to test these forms** also!

###[Validate.js](http://validatejs.org/)
*Validate.js provides a declarative way of validating javascript objects.*

Using Validate.js for the Form processing was a breeze!  And with the ability to test the validations to the Redux state was very easy!


----------


## Setup

1. [Install React-Native](https://facebook.github.io/react-native/docs/getting-started.html#content)
1. ```git clone https://github.com/bartonhammond/snowflake.git```
1. cd snowflake
1. npm install
1. Copy or move ```src/lib/config.example.js``` to ```src/lib/config.js```.
1. Create account and app on Parse.com
  1. Copy the Parse.com app keys for APP_ID and REST_API_KEY and update ```src/lib/config.js```
  1. Update the Apps Settings -> Authentication 
 	  1. Allow username and password-based authentication -> Yes
	  1. Allow anonymous users -> No
  1. Update the Apps Settings -> Email
	  1. Verify user emails -> Yes
1. On mac, open XCode and load project
1. For android, ```react-native run-android``` assuming you have an emulator or device attached.
1. To run Jest, ```npm test```
1. To debug Jest unit cases, install [node_inspector](https://github.com/node-inspector/node-inspector) and run ```npm run test-chrome```
1. Enjoy!


----------


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


----------
## FAQ 

### Why did you use the RestAPI instead of the (JS-sdk | ParseReact)

I looked at it initially and, imo, it had too much magic.  For example, I couldn't see how I was going to isolate my JSX components easily and keep all my "state" in Redux.  ParseReact is right there in the middle of your JSX component which would tie me to a very particular vendor and implementation detail.  If I decided to later move away from ParseReact I'd have to rewrite a lot of code and tests.

Also, it had this statement

> Mutations are dispatched in the manner of Flux Actions, allowing updates to be synchronized between many different components without requiring views to talk to each other

I don't want to deal w/ wrapping my head around Flux Actions and have to monkey-patch or something to get Redux Actions.

In a previous life, I worked with Parse JS SDK and it's based on backbone.js.  So I didn't go that direction either, because, again, I didn't want to have another data model to deal with.  Plus, at the time I was using it, the SDK was buggy and it was difficult to work with. 

With the Parse Rest API, it's simple, can be tested itself from the command line with curl, it's clear, it's succinct and it's easily replaced with something else, an example such as Mongo/Mongoose without much, if any, impact on the code base.


######-barton hammond
