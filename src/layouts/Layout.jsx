import { Outlet } from "react-router-dom"
import WhatsAppFloat from "../components/WhatsAppFloat"
import { useLocation } from 'react-router-dom';

const Layout = () => {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');
    return (
        <>
            <div>
                <Outlet />
            </div>
            {!isAdmin && <WhatsAppFloat />}
        </>
    )
}

export default Layout