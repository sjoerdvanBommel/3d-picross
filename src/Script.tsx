import React from 'react';
import ReactDOM from 'react-dom';
import Experience from './experience/Experience';
import { App } from './react/App';

new Experience({
    targetElement: document.querySelector('.experience')
})

ReactDOM.render(
    <App />, document.getElementById('react-content')
);
