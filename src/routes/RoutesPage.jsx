import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import Layout from '../layouts/Layout'
import Store from '../store/Store'
import Home from '../pages/Home'

function RoutesPage() {
    return (
        <Provider store={Store}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                </Route>
            </Routes>
        </Provider>
    )
}

export default RoutesPage