import React from 'react'
import { Route, Routes } from 'react-router-dom'
import MainPage from '../pages/MainPage/MainPage'
import NotFound from '../pages/NotFound/NotFound'

const MainRouter = () => {
    return (
        <Routes>
            <Route path={'/'} element={<MainPage/>}/>
            <Route path={'*'} element={<NotFound/>}/>
        </Routes>
    )
}

export default MainRouter