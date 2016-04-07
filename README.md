[![Build Status](https://img.shields.io/travis/markdalgleish/redux-hotjar/master.svg?style=flat-square)](http://travis-ci.org/markdalgleish/redux-hotjar) [![Coverage Status](https://img.shields.io/coveralls/markdalgleish/redux-hotjar/master.svg?style=flat-square)](https://coveralls.io/r/markdalgleish/redux-hotjar) [![npm](https://img.shields.io/npm/v/redux-hotjar.svg?style=flat-square)](https://www.npmjs.com/package/redux-hotjar)

# redux-hotjar

Declarative [Hotjar tagging](http://docs.hotjar.com/docs/tagging-recordings) for [Redux](https://github.com/reactjs/redux).

```bash
$ npm install --save redux-hotjar
```

## Setup

For client-only applications, simply include the supplied middleware.

```js
import hotjar from 'redux-hotjar';

import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';

const store = createStore(
  rootReducer,
  applyMiddleware(hotjar())
);
```

For server-rendered applications, to ensure Hotjar tags for server-side actions are included in your recordings, you'll also need to include the redux-hotjar reducer in your store.

Note that, for brevity, the following example uses the proposed [object spread properties](https://github.com/sebmarkbage/ecmascript-rest-spread#spread-properties) standard, which is available via [babel-plugin-transform-object-rest-spread](https://www.npmjs.com/package/babel-plugin-transform-object-rest-spread).


```js
import hotjar, { reducer as hotjarReducer } from 'redux-hotjar';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { reducer1, reducer2 } from './reducers';

// First, include the redux-hotjar reducer in your root reducer:
const rootReducer = combineReducers({
  reducer1,
  reducer2,
  ...hotjarReducer()
});

// Then, apply the middleware to the store:
const store = createStore(
  rootReducer,
  applyMiddleware(hotjar())
);
```

## Tagging Events

Simply add metadata to your actions using the [Flux Standard Action](https://github.com/acdlite/flux-standard-action) pattern.

```js
// Single tags:
dispatch({
  type: 'NEW_TODO',
  meta: {
    hotjar: 'New Todo'
  }
});

// Multiple tags:
dispatch({
  type: 'NEW_TODO',
  meta: {
    hotjar: ['Todos', 'Todos: New Todo']
  }
});
```

## License

[MIT License](http://markdalgleish.mit-license.org/)
