import { UrlParser } from './url_parser.js';
import { RouterRedirect } from './redirect.js';
import { RouterRoute } from './route.js';
import { RouterPath } from './path.js';
import { anyEmptyNestedRoutes, pathWithoutQueryParams, startsWithNamedParam } from '../lib/utils.js';

const NotFoundPage = '/404.html';

function RouterFinder({ routes, currentUrl, routerOptions, convert }) {
  const defaultLanguage = routerOptions.defaultLanguage;
  const sitePrefix = routerOptions.prefix ? routerOptions.prefix.toLowerCase() : '';
  const urlParser = parseCurrentUrl(currentUrl, sitePrefix);
  let redirectTo = '';
  let routeNamedParams = {};
  let staticParamMatch = false;

  function findActiveRoute() {
    let searchActiveRoute = searchActiveRoutes(routes, '', urlParser.pathNames, routerOptions.lang, convert);

    if (!searchActiveRoute || !Object.keys(searchActiveRoute).length || anyEmptyNestedRoutes(searchActiveRoute)) {
      if (typeof window !== 'undefined') {
        searchActiveRoute = routeNotFound(routerOptions.lang);
      }
    } else {
      searchActiveRoute.path = pathWithoutQueryParams(searchActiveRoute);
      if (sitePrefix) {
        searchActiveRoute.path = `/${sitePrefix}${searchActiveRoute.path}`;
      }
    }

    return searchActiveRoute;
  }

  /**
   * Gets an array of routes and the browser pathname and return the active route
   * @param routes
   * @param basePath
   * @param pathNames
   **/
  function searchActiveRoutes(routes, basePath, pathNames, currentLanguage, convert) {
    let currentRoute = {};
    let basePathName = pathNames.shift().toLowerCase();
    const routerPath = RouterPath({ basePath, basePathName, pathNames, convert, currentLanguage });
    staticParamMatch = false;

    routes.forEach(function (route) {
      routerPath.updatedPath(route);

      if (matchRoute(routerPath, route.name)) {
        let routePath = routerPath.routePath();
        redirectTo = RouterRedirect(route, redirectTo).path();

        if (currentRoute.name !== routePath) {
          let componentProps = route.componentProps;
          let layoutProps = route.layoutProps;
          currentRoute = setCurrentRoute({
            route,
            routePath,
            routeLanguage: routerPath.routeLanguage(),
            urlParser,
            namedPath: routerPath.namedPath(),
            componentProps,
            layoutProps,
          });
        }

        if (route.nestedRoutes && route.nestedRoutes.length > 0 && routerPath.pathNames.length > 0) {
          currentRoute.childRoute = searchActiveRoutes(
            route.nestedRoutes,
            routePath,
            routerPath.pathNames,
            routerPath.routeLanguage(),
            convert
          );
          currentRoute.path = currentRoute.childRoute.path;
          currentRoute.language = currentRoute.childRoute.language;
        } else if (nestedRoutesAndNoPath(route, routerPath.pathNames)) {
          const indexRoute = searchActiveRoutes(
            route.nestedRoutes,
            routePath,
            ['index'],
            routerPath.routeLanguage(),
            convert
          );
          if (indexRoute && Object.keys(indexRoute).length > 0) {
            currentRoute.childRoute = indexRoute;
            currentRoute.language = currentRoute.childRoute.language;
          }
        }
      }
    });

    if (redirectTo) {
      currentRoute.redirectTo = redirectTo;
    }

    return currentRoute;
  }

  function matchRoute(routerPath, routeName) {
    const basePathSameAsLocalised = routerPath.basePathSameAsLocalised();
    if (basePathSameAsLocalised) {
      staticParamMatch = true;
    }

    return basePathSameAsLocalised || (!staticParamMatch && startsWithNamedParam(routeName));
  }

  function nestedRoutesAndNoPath(route, pathNames) {
    return route.nestedRoutes && route.nestedRoutes.length > 0 && pathNames.length === 0;
  }

  function parseCurrentUrl(currentUrl, sitePrefix) {
    if (sitePrefix && sitePrefix.trim().length > 0) {
      const replacePattern = currentUrl.endsWith(sitePrefix) ? sitePrefix : sitePrefix + '/';
      const noPrefixUrl = currentUrl.replace(replacePattern, '');
      return UrlParser(noPrefixUrl);
    } else {
      return UrlParser(currentUrl);
    }
  }

  function setCurrentRoute({ route, routePath, routeLanguage, urlParser, namedPath, props }) {
    const routerRoute = RouterRoute({
      routeInfo: route,
      urlParser,
      path: routePath,
      routeNamedParams,
      namedPath,
      language: routeLanguage || defaultLanguage,
      props,
    });
    routeNamedParams = routerRoute.namedParams();

    return routerRoute.get();
  }

  const routeNotFound = (customLanguage) => {
    const custom404Page = routes.find((route) => route.name == '404');
    const language = customLanguage || defaultLanguage || '';
    if (custom404Page) {
      return { ...custom404Page, language, path: '404' };
    } else {
      return { name: '404', component: '', path: '404', redirectTo: NotFoundPage };
    }
  };

  return Object.freeze({ findActiveRoute });
}

export { RouterFinder };
