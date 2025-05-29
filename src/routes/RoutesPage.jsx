import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import Layout from '../layouts/Layout'
import Store from '../store/Store'
import Home from '../pages/Home'

function RoutesPage() {
    const router = createBrowserRouter([

        { path: '/', element: <Layout /> ,children: [
            {index: true, element: <Home />},
        ]},


    ])
    return (
        <>
            <Provider store={Store}>
                <RouterProvider router={router} />
            </Provider>
        </>
    )
}

export default RoutesPage