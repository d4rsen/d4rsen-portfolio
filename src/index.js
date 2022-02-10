import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import { BrowserRouter } from 'react-router-dom'
import App from './App/App'
import './normalize.css'

ReactGA.initialize('G-303075485', {debug: true})

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
)