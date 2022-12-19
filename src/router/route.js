import { UrlParser } from './url_parser.js';

function RouterRoute({ routeInfo, path, routeNamedParams, urlParser, namedPath, language }) {
  const namedParams = () => {
    const parsedParams = UrlParser(`https://fake.com${urlParser.pathname}`, namedPath).namedParams;

    return { ...routeNamedParams, ...parsedParams };
  };

  const get = () => {
    return {
      name: path,
      component: routeInfo.component,
      hash: urlParser.hash,
      layout: routeInfo.layout,
      componentProps:routeInfo.props,
      layoutProps:routeInfo.props,
      queryParams: urlParser.queryParams,
      namedParams: namedParams(),
      path,
      language,
    };
  };

  return Object.freeze({ get, namedParams });
}

export { RouterRoute };
