import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Loader from '../UI/Loader/Loader'

const MainPage = React.lazy(() => import('../pages/MainPage/MainPage'))
const NotFound = React.lazy(() => import('../pages/NotFound/NotFound'))

const MainRouter = ({setIsLoading}) => {
    return (
        <Suspense fallback={<Loader setIsLoading={setIsLoading}/>}>
            <Routes>
                <Route path={'/'} element={<MainPage/>}/>
                <Route path={'*'} element={<NotFound/>}/>
            </Routes>
        </Suspense>
    )
}

export default MainRouter