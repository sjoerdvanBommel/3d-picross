import React from 'react';
import ReactDOM from 'react-dom';
import Experience from './experience/Experience'
import './assets/tailwind.css';
import BuildFigureMenu from './react/components/build-figure-menu';

new Experience({
    targetElement: document.querySelector('.experience')
})

ReactDOM.render(
    <BuildFigureMenu />, document.getElementById('react-content')
);
