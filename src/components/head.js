import React from 'react';
import {Helmet} from 'react-helmet';

export default Head;
function Head() {
    return (
        <>
            <Helmet>
                <link href="https://fonts.googleapis.com/css?family=Raleway:400,500,600&display=swap" rel="stylesheet" />
            </Helmet>
        </>
    );
}