import tap from 'redux-tap';

const isAllStrings = vals => vals.every(val => typeof val === 'string');

const typeError = tag => {
  console.error('Hotjar tags must be strings or arrays of strings', tag);
};

export default () => tap(({ meta }) => meta && meta.hotjar, input => {
  if (typeof window === 'undefined' || typeof window.hj !== 'function') {
    return;
  }

  if (typeof input !== 'string' && !Array.isArray(input)) {
    typeError(input);
    return;
  }

  const tags = Array.isArray(input) ? input : [input];

  if (tags.length === 0) {
    return;
  }

  if (!isAllStrings(tags)) {
    typeError(tags);
    return;
  }

  window.hj('tagRecording', tags);
});
