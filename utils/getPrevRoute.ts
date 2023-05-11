import { GetServerSidePropsContext } from 'next';

import routes from 'constants/routes';

export const getPrevRoute = (ctx: GetServerSidePropsContext) => {
  let prevRoute = ctx.req.headers?.referer || undefined;
  let host = ctx.req.headers?.host || undefined;
  let resolvedUrl = ctx.resolvedUrl;

  if (prevRoute === undefined || prevRoute.includes(resolvedUrl) || !host) {
    prevRoute = routes.explore;
  } else if (host) {
    prevRoute = prevRoute.substring(prevRoute.indexOf(host) + host.length);
  }

  return prevRoute;
};
