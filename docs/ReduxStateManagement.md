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

