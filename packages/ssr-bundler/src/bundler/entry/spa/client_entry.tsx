// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Layout from '@/components/Layout';
import loadable, { loadableReady, LoadableComponent } from '@loadable/component';
import React, { useEffect, useState } from 'react';
import { hydrate, render } from 'react-dom';
import { pathToRegexp } from 'path-to-regexp';
import * as RouterDOM from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import routes from '_route_dist/ssr-temp-routes';

// 是否 v6 版本路由
const isRouterV6 = !!RouterDOM.Routes;
// V6 使用 Routes 代替 V5 的 Switch
const Routes = isRouterV6 ? RouterDOM.Routes : (RouterDOM as any).Switch;
// V6 Route
const Route = isRouterV6 ? RouterDOM.Route : (RouterDOM as any).Route;



interface RouteProps {
  // 定义的路由地址
  path: string;
  // 定义的路由组件
  // 整个组件的导出
  element: any;
  // 获取初始化状态的函数
  getInitialProps?: Function;
  // 路由的默认渲染组件
  component?: React.ReactElement;
  // 是否首屏
  isFirstScreen?: boolean;
  // 首屏状态 - 来自 window.__props
  props?: object;
}

/**
 * 是否 Loadable 组件
 * @param Element 
 * @returns 
 */
function isLoadableComponent(Element: any) {
  return Element && Element.displayName === 'Loadable';
}


/**
 * 不同依赖版本生成不同的 Route 组件
 * @param Element 
 * @param route 
 * @returns 
 */
const getRoute = (Element: any, route: any) => {
  if (isRouterV6) {
    return <Route key={route.path} path={route.path} element={<Element key={location.pathname} />}
    />;
  }
  return <Route key={route.path} exact={true} path={route.path} render={
    (p: any) => <Element {...p} />}
  />;
};

/**
 * 是否已经渲染
 * 如果为 true 则为非首次渲染的路由组件
 */
let hasRender = false;

/**
 * 包裹路由组件
 * 加载远程数据
 * @param route 
 * @returns 
 */
const wrapComponent = (route: RouteProps) => {
  let WrappedComponent: any = route.component;
  const _isLoadableComponent = isLoadableComponent(route.element);
  let _props = route.props ?? {};
  return () => {
    const [ready, setReady] = useState(!!route.isFirstScreen);
    const didMount = async () => {
      // ssr 模式非首次渲染需要触发请求
      if (hasRender) {
        const completeElement = _isLoadableComponent ? await route.element.load() : route.element;
        const { default: Element, getInitialProps } = completeElement;
        WrappedComponent = Element;
        if (getInitialProps && typeof getInitialProps === 'function') {
          const calculateProps = await getInitialProps();
          _props = {
            ..._props,
            ...calculateProps
          };
        }
        setReady(true);
      }
      hasRender = true;
    };

    useEffect(() => {
      didMount();
    }, []);

    return ready ? <WrappedComponent {..._props} /> : null;
  };
};

/**
 * 预加载路由组件
 */
async function preloadElement(originRoutes: RouteProps[], props = {}) {
  const curveRoutes: RouteProps[] = [];
  for (const route of originRoutes) {
    const { element, path } = route;
    // 如果是首屏路由组件
    if (pathToRegexp(path).test(location.pathname)) {
      const completeElement = isLoadableComponent(element) ? await (element as any).load() : element;
      curveRoutes.push({
        ...route,
        component: completeElement.default,
        getInitialProps: completeElement.getInitialProps,
        isFirstScreen: true,
        props
      });
    } else {
      curveRoutes.push(route);
    }
  }
  return curveRoutes;
}



async function bootstrap() {
  const root = document.getElementById('root');
  const props = (window as any).__props;
  const r = props ? hydrate : render;
  // 预加载当前路由组件
  const finalRoutes = await preloadElement(routes, props);
  r(<RouterDOM.BrowserRouter>
    <Layout>
      <Routes>
        {
          finalRoutes.map((route: any) => {
            const Element = wrapComponent(route);
            return getRoute(Element, route);
          })
        }
      </Routes>
    </Layout>
  </RouterDOM.BrowserRouter>, root ?? document.body);


  if ((module as any).hot) {
    (module as any).hot.accept();
  }
}

// bootstrap();

loadableReady(bootstrap);

