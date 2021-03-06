import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App/App'
import './normalize.scss'

ReactDOM.render(
    <BrowserRouter>
        <App/>
        <canvas id="c"/>
    </BrowserRouter>,
    document.getElementById('root'),
)
