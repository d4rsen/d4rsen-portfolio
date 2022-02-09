import { useState } from 'react'
import MainRouter from '../components/router/MainRouter'
import Footer from '../components/UI/Footer/Footer'
import Header from '../components/UI/Header/Header'
import Loader from '../components/UI/Loader/Loader'
import './App.scss'

function App() {
    const [isLoading, setIsLoading] = useState(true)

    if (isLoading) {
        return (<Loader setIsLoading={setIsLoading}/>)
    }

    return (
        <div className="wrapper">
            <div className="_main-container">
                <Header/>
                <main className="main">
                    <MainRouter setIsLoading={setIsLoading}/>
                </main>
                <Footer/>
            </div>
        </div>
    )
}

export default App