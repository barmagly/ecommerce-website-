import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import Layout from '../layouts/Layout'
import Store from '../services/Slice/Store'
import Home from '../pages/Home'

// Import admin components
import AdminApp from '../admin/App'

function RoutesPage() {
    return (
        <Provider store={Store}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                </Route>
                {/* Admin routes - wrapped to avoid conflicts */}
                <Route path="/admin/*" element={
                    <React.Suspense fallback={<div>Loading Admin...</div>}>
                        <AdminApp />
                    </React.Suspense>
                } />
            </Routes>
        </Provider>
    )
}

export default RoutesPage