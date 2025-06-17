import { Outlet } from "react-router-dom"
import WhatsAppFloat from "../components/WhatsAppFloat"

const Layout = () => {
    return (
        <>
            <div>
                <Outlet />
            </div>
            <WhatsAppFloat />
        </>
    )
}

export default Layout