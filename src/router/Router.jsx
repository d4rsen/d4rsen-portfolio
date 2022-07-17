import React, { memo } from 'react'
import { Route, Routes } from 'react-router-dom'
import MainPage from '../components/pages/MainPage/MainPage'
import NotFound from '../components/pages/NotFound/NotFound'

function Router() {
    return (
        <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    )
}

export default memo(Router)
