import ReactGA from 'react-ga4';

export const initGA = (id: string) => {
  // turn back on once know working
  // if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize(id);
  // }
};
