declare module "remix-routes" {
  type URLSearchParamsInit = string | string[][] | Record<string, string> | URLSearchParams;
  // symbol won't be a key of SearchParams
  type IsSearchParams<T> = symbol extends keyof T ? false : true;
  
  type ExportedQuery<T> = IsSearchParams<T> extends true ? T : never;
  

  export interface Routes {
  
    "": {
      params: never,
      query: ExportedQuery<import('app/routes/_layout._index').SearchParams>,
    };
  
    "/": {
      params: never,
      query: ExportedQuery<import('app/root').SearchParams>,
    };
  
    "/:year?/agenda": {
      params: {
        year?: string | number;
      } ,
      query: ExportedQuery<import('app/routes/_layout.($year).agenda').SearchParams>,
    };
  
    "/*": {
      params: {
        "*": string | number;
      } ,
      query: ExportedQuery<import('app/routes/_layout.$').SearchParams>,
    };
  
    "/blog": {
      params: never,
      query: ExportedQuery<import('app/routes/_layout.blog._index').SearchParams>,
    };
  
    "/blog/:slug": {
      params: {
        slug: string | number;
      } ,
      query: ExportedQuery<import('app/routes/_layout.blog.$slug').SearchParams>,
    };
  
    "/blog/rss.xml": {
      params: never,
      query: ExportedQuery<import('app/routes/blog.rss[.xml]').SearchParams>,
    };
  
    "/config": {
      params: never,
      query: ExportedQuery<import('app/routes/config').SearchParams>,
    };
  
  }

  type RoutesWithParams = Pick<
    Routes,
    {
      [K in keyof Routes]: Routes[K]["params"] extends Record<string, never> ? never : K
    }[keyof Routes]
  >;

  export type RouteId =
    | 'root'
    | 'routes/_layout'
    | 'routes/_layout._index'
    | 'routes/_layout.($year).agenda'
    | 'routes/_layout.$'
    | 'routes/_layout.blog._index'
    | 'routes/_layout.blog.$slug'
    | 'routes/blog.rss[.xml]'
    | 'routes/config';

  export function $path<
    Route extends keyof Routes,
    Rest extends {
      params: Routes[Route]["params"];
      query?: Routes[Route]["query"];
    }
  >(
    ...args: Rest["params"] extends Record<string, never>
      ? [route: Route, query?: Rest["query"]]
      : [route: Route, params: Rest["params"], query?: Rest["query"]]
  ): string;

  export function $params<
    Route extends keyof RoutesWithParams,
    Params extends RoutesWithParams[Route]["params"]
  >(
      route: Route,
      params: { readonly [key: string]: string | undefined }
  ): {[K in keyof Params]: string};

  export function $routeId(routeId: RouteId): RouteId;
}