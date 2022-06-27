import { Request, Response, app } from '@dazejs/framework';
import React from 'react';
import { renderToString } from 'react-dom/server';
import * as RouterDOM from 'react-router-dom';
import serialize from 'serialize-javascript';
import Outlet from './outlet';

React.useLayoutEffect = React.useEffect;

export async function createController({ element, manifest, jsOrder = [], cssOrder = [], path = '', isMpa = false, Layout, extractor, routes }: {
    element: any;
    path?: string;
    manifest: any;
    chunkName?: string;
    jsOrder: string[];
    cssOrder: string[];
    isMpa: boolean,
    Layout: any,
    extractor?: any,
    routes?: any,
}) {
    const isRouterV6 = !!RouterDOM.Routes;
    const StaticRouter = isRouterV6 ? (await import('react-router-dom/server')).StaticRouter : (RouterDOM as any).StaticRouter;
    // V6 使用 Routes 代替 V5 的 Switch
    const Routes = isRouterV6 ? RouterDOM.Routes : (RouterDOM as any).Switch;
    // V6 Route
    const Route = isRouterV6 ? RouterDOM.Route : (RouterDOM as any).Route;
    const getRoute = (Element: any, route: any) => {
        if (isRouterV6) {
            return <Route key={route.path} path={route.path} element={<Element key={location.pathname} />}
            />;
        }
        return <Route key={route.path} exact={true} path={route.path} render={
            (p: any) => <Element {...p} />}
        />;
    };

    return async (request: Request) => {
        if (!element) return new Response().notFound();
        const scripts: string[] = [];
        const styles: string[] = [];

        for (const js of jsOrder) {
            manifest[js] && scripts.push(manifest[js]);
        }
        for (const css of cssOrder) {
            manifest[css] && styles.push(manifest[css]);
        }

        // const TargetOutlet = element.Outlet ?? Outlet;

        let initProps = {};

        const isLoadableComponent = element.displayName === 'Loadable';
        // 筛选后的 element
        const completeElement = isLoadableComponent ? await element.load() : element;
        const { default: Element, getInitialProps } = completeElement;
        if (getInitialProps && typeof getInitialProps === 'function') {
            const calculateProps = await getInitialProps(request);
            initProps = {
                ...initProps,
                ...calculateProps
            };
        }

        const App = (
            <StaticRouter localtion={request.url ?? ''} context={{}}>
                <Outlet
                    scripts={scripts ?? []}
                    styles={styles ?? []}
                    props={initProps}
                    extractor={extractor}
                    serializedProps={serialize(initProps)}
                >
                    <div id="root">
                        <Layout>
                            <Routes suppressNoMatchWarning={true}>
                                <Route key={path} path={path} element={<Element key={request.url} {...initProps} />} />
                            </Routes>
                        </Layout>
                    </div>
                </Outlet>
            </StaticRouter>
        );
        const html = renderToString(App);

        return new Response().html(`<!DOCTYPE html>${html}`);
    };
}



export async function createMpaController({ element, manifest, jsOrder = [], cssOrder = [], isMpa = false, Layout, extractor, routes }: {
    element: any
    manifest: any;
    chunkName?: string;
    jsOrder: string[];
    cssOrder: string[];
    isMpa: boolean,
    Layout: any,
    extractor?: any,
    routes?: any,
}) {
    const isRouterV6 = !!RouterDOM.Routes;
    const StaticRouter = isRouterV6 ? (await import('react-router-dom/server')).StaticRouter : (RouterDOM as any).StaticRouter;
    return async (request: Request) => {
        if (!element) return new Response().notFound();
        const scripts: string[] = [];
        const styles: string[] = [];

        for (const js of jsOrder) {
            manifest[js] && scripts.push(manifest[js]);
        }
        for (const css of cssOrder) {
            manifest[css] && styles.push(manifest[css]);
        }

        let initProps = {};

        // 筛选后的 element
        const { default: Element, getInitialProps } = element;
        if (getInitialProps && typeof getInitialProps === 'function') {
            const calculateProps = await getInitialProps(request);
            initProps = {
                ...initProps,
                ...calculateProps
            };
        }

        const App = (
            <StaticRouter localtion={request.url ?? ''} context={{}}>
                <Outlet
                    scripts={scripts ?? []}
                    styles={styles ?? []}
                    props={initProps}
                    // extractor={extractor}
                    serializedProps={serialize(initProps)}
                >
                    <div id="root">
                        <Layout>
                            <Element {...initProps} />
                        </Layout>
                    </div>
                </Outlet>
            </StaticRouter>
        );
        const html = renderToString(App);

        return new Response().html(`<!DOCTYPE html>${html}`);
    };
}