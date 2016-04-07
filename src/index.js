import tap from 'redux-tap';

const REDUCER_KEY = '@@redux-hotjar-state';
const QUEUE_TAGS = '@@REDUX_HOTJAR_QUEUE_TAGS';
const FLUSH_QUEUE = '@@REDUX_HOTJAR_FLUSH_QUEUE';

export const reducer = () => ({
  [REDUCER_KEY]: (state = [], { type, payload }) => {
    switch (type) {
      case QUEUE_TAGS: {
        return [ ...state, payload ];
      }

      case FLUSH_QUEUE: {
        return [];
      }

      default: {
        return state;
      }
    }
  }
});

const isAllStrings = vals => vals.every(val => typeof val === 'string');

const typeError = tag => {
  console.error('Hotjar tags must be strings or arrays of strings', tag);
};

const selectMeta = ({ meta }) => meta && meta.hotjar;
export default () => tap(selectMeta, (input, action, store) => {
  if (typeof input !== 'string' && !Array.isArray(input)) {
    typeError(input);
    return;
  }

  const tags = [].concat(input);

  if (tags.length === 0) {
    return;
  }

  if (!isAllStrings(tags)) {
    typeError(tags);
    return;
  }

  const { getState, dispatch } = store;
  const isUniversal = getState()[REDUCER_KEY];

  isUniversal && dispatch({ type: QUEUE_TAGS, payload: tags });

  if (typeof window !== 'undefined' && typeof window.hj === 'function') {
    (isUniversal ? getState()[REDUCER_KEY] : [tags])
      .forEach(queuedTags => window.hj('tagRecording', queuedTags));

    isUniversal && dispatch({ type: FLUSH_QUEUE });
  }
});
