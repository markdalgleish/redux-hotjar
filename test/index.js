import { assert } from 'chai';
import { spy } from 'sinon';
import { createStore, applyMiddleware } from 'redux';
import hotjar from '../src';

global.window = {};

const actionWithMeta = meta => ({ type: 'ACTION', ...(meta ? { meta } : {}) });

describe('redux-hotjar', () => {
  let store;
  let errorSpy;
  let hjSpy;

  beforeEach(() => {
    hjSpy = spy();
    global.window = { hj: hjSpy };
    console.error = errorSpy = spy();
    const createStoreWithMiddleware = applyMiddleware(hotjar())(createStore);
    const reducer = (state, { type }) => type === 'ADD' ? state + 1 : state;
    store = createStoreWithMiddleware(reducer, 0);
  });

  it('supports single tags', () => {
    store.dispatch(actionWithMeta({ hotjar: 'single tag' }));
    const { args } = hjSpy.getCall(0);
    assert.deepEqual(args, ['tagRecording', ['single tag']]);
  });

  it('supports multiple tags', () => {
    store.dispatch(actionWithMeta({ hotjar: ['multiple', 'tags'] }));
    const { args } = hjSpy.getCall(0);
    assert.deepEqual(args, ['tagRecording', ['multiple', 'tags']]);
  });

  it('ignores actions without meta', () => {
    store.dispatch(actionWithMeta(null));
    assert.deepEqual(hjSpy.callCount, 0);
  });

  it('does nothing when window.hj is missing', () => {
    delete global.window.hj;
    store.dispatch(actionWithMeta({ hotjar: 'single tag' }));
    assert.deepEqual(hjSpy.callCount, 0);
  });

  it('does nothing in a node environment (i.e. window is missing)', () => {
    delete global.window;
    store.dispatch(actionWithMeta({ hotjar: 'single tag' }));
    assert.deepEqual(hjSpy.callCount, 0);
  });

  it('allows the action to go through', () => {
    assert.equal(store.getState(), 0);
    store.dispatch({ type: 'ADD', meta: { hotjar: 'hello' }});
    assert.equal(store.getState(), 1);
  });

  describe('tags are ignored when', () => {
    it('has falsy meta', () => {
      store.dispatch(actionWithMeta({ hotjar: null }));
      assert.equal(hjSpy.callCount, 0);
    });

    it('has meta that is an empty array', () => {
      store.dispatch(actionWithMeta({ hotjar: [] }));
      assert.equal(hjSpy.callCount, 0);
    });
  });

  describe('should log a type error when', () => {
    it('has meta that is not an array or string', () => {
      store.dispatch(actionWithMeta({ hotjar: { invalid: true } }));
      const [ errorMessage, tag ] = errorSpy.getCall(0).args;
      assert.equal(errorMessage, 'Hotjar tags must be strings or arrays of strings');
      assert.deepEqual(tag, { invalid: true });
      assert.equal(hjSpy.callCount, 0);
    });

    it('has meta with an array with a non-string value', () => {
      store.dispatch(actionWithMeta({ hotjar: [
        'string',
        'another string',
        { not: 'a string' }
      ]}));
      const [ errorMessage, tag ] = errorSpy.getCall(0).args
      assert.equal(errorMessage, 'Hotjar tags must be strings or arrays of strings');
      assert.deepEqual(tag, [
        'string',
        'another string',
        { not: 'a string' }
      ]);
      assert.equal(hjSpy.callCount, 0);
    });
  });
});
