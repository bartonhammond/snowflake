import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';


const middlewares = [thunk];

/**
 * Mocked Store
 * @see http://rackt.org/redux/docs/recipes/WritingTests.html
 */
export default function mockStore(state, expectedActions) {
  if (!Array.isArray(expectedActions)) {
    throw new Error('expectedActions should be an array of expected actions.');
  }

  function mockStoreWithoutMiddleware() {
    return {
      getState() {
        return typeof state === 'function' ? state() : state;
      },

      dispatch(action) {
        const expectedAction = expectedActions.shift();
        try {
          expect(action.type).toEqual(expectedAction.type);
          return action;
        } catch (e) {
          throw new Error(e);
        }
      }
    };
  }

  const mockStoreWithMiddleware = applyMiddleware(
      ...middlewares
  )(mockStoreWithoutMiddleware);

  return mockStoreWithMiddleware();
}
