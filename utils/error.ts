// import * as Sentry from '@sentry/browser';

export const throwError = (err: any) => {
  // catch error
  console.log('error', err?.response?.data?.message || err?.message || err);
  //   Sentry.captureException(err);
  return 'Error';
};
