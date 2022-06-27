import React from 'react';
import { hydrate, render } from 'react-dom';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Layout from '@/components/Layout';

declare const $__daze_container__: any;

async function bootstrap() {
    const root = document.getElementById('root');
    const route = window.location.pathname;
    const module = $__daze_container__.getModule(route);
    if (!module) return;
    let props = (window as any).__props;
    const evaluateProps = module.getInitialProps;

    if (!props && evaluateProps) {
        props = await evaluateProps();
    }

    const Element = module.default;

    const r = props ? hydrate : render;
    r(
        <Layout>
            <Element {...props} />
        </Layout>,
        root ?? document.body
    );
}

bootstrap();