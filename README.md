[![Build Status](https://img.shields.io/travis/markdalgleish/redux-hotjar/master.svg?style=flat-square)](http://travis-ci.org/markdalgleish/redux-hotjar) [![Coverage Status](https://img.shields.io/coveralls/markdalgleish/redux-hotjar/master.svg?style=flat-square)](https://coveralls.io/r/markdalgleish/redux-hotjar) [![npm](https://img.shields.io/npm/v/redux-hotjar.svg?style=flat-square)](https://www.npmjs.com/package/redux-hotjar)

# redux-hotjar

Declarative [Hotjar tagging](http://docs.hotjar.com/docs/tagging-recordings) for [Redux](https://github.com/reactjs/redux).

```bash
$ npm install --save redux-hotjar
```

## Setup

```js
import hotjar from 'redux-hotjar';

import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';

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
