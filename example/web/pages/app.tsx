import { Button } from 'antd';

import React from 'react';
import './app.less';

export async function getInitialProps(req) {
    return { data: {
        aaaaa: 111111
    }  };
}

export default function (props: any) {
    return (
        <Button type="primary" onClick={() => {
            console.log(11111111);
            alert(1111222);
        }}>{props.data.aaaaa || '22222'}</Button>
    );
}