import expect from 'expect';
import sinon from 'sinon';
import thunk from 'redux-thunk';

import mockMiddleware from './mock/middleware';
import configureStore from '../src';

const mockStore = configureStore([thunk]);

describe('redux-mock-store', () => {

  it('calls getState if it is a function', () => {
    const getState = sinon.spy();
    const store = mockStore(getState, []);

    store.getState();
    expect(getState.called).toBe(true);
  });

  it('returns the initial state', () => {
    const initialState = { items: [], count: 0 };
    const store = mockStore(initialState);

    expect(store.getState()).toEqual(initialState);
  });

  it('should return if the tests is successful', () => {
    const action = { type: 'ADD_ITEM' };
    const store = mockStore({});

    store.dispatch(action);

    const [first] = store.getActions();
    expect(first).toBe(action);
  });


  it('handles async actions', (done) => {
    function increment() {
      return {
        type: 'INCREMENT_COUNTER'
      };
    }

    function incrementAsync() {
      return dispatch => {
        return Promise.resolve()
          .then(() => dispatch(increment()));
      };
    }

    const store = mockStore({});

    store.dispatch(incrementAsync())
      .then(() => {
        expect(store.getActions()[0]).toEqual(increment())
        done();
      });
  });

  it('should call the middleware', () => {
    const spy = sinon.spy();
    const middlewares = [mockMiddleware(spy)];
    const mockStoreWithMiddleware = configureStore(middlewares);
    const action = { type: 'ADD_ITEM' };

    const store = mockStoreWithMiddleware();
    store.dispatch(action);
    expect(spy.called).toBe(true);
  });

  it('should handle when test function throws an error', (done) => {
    const store = mockStore({});
    const error = { error: 'Something went wrong' };

    store.dispatch(() => Promise.reject(error))
      .catch(err => {
        expect(err).toEqual(error);
        done();
      })
  });

  it('clears the actions', () => {
    const action = { type: 'ADD_ITEM' };
    const store = mockStore({});

    store.dispatch(action);
    expect(store.getActions()).toEqual([action]);

    store.clearActions();
    expect(store.getActions()).toEqual([]);
  })

  it('handles multiple actions', () => {
    const store = mockStore();
    const actions = [
      { type: 'ADD_ITEM' },
      { type: 'REMOVE_ITEM' }
    ];

    store.dispatch(actions[0]);
    store.dispatch(actions[1]);

    expect(store.getActions()).toEqual(actions);
  });

  it('has empty subscribe method', () => {
    const store = mockStore();

    expect(store.subscribe()).toEqual(null);
  });
});
