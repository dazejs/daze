
import React from 'react';

const DefaultOutlet = function ({ children, head, scripts, styles, extractor, props = {} }: any) {
    return (
        <html>
            <head>
                { head }
                {
                    styles?.map((url: string) => {
                        return <link key={url} rel="stylesheet" as="style" href={ `${url}` } />;
                    })
                }
                {extractor?.getLinkElements()}
                {extractor?.getStyleElements()}
                <script dangerouslySetInnerHTML={{ __html: `window.__props=${ JSON.stringify(props) };` }} />
            </head>
            <body>
                { children }
                {extractor?.getScriptElements()}
                { scripts?.map((src: string) => <script key={src} defer src={ src } />) }
            </body>
        </html>
    );
};

export default DefaultOutlet;