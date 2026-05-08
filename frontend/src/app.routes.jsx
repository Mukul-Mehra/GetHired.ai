import { createBrowserRouter, Navigate } from "react-router-dom"

import Landing from "./ui/pages/Landing"
import Login from "./ui/pages/Login"
import Register from "./ui/pages/Register"
import Dashboard from "./ui/pages/Dashboard"
import History from "./ui/pages/History"
import Protected from "./ui/components/Protected"
import PublicOnly from "./ui/components/PublicOnly"

export const router = createBrowserRouter([
    {
        path : '/',
        element : <Landing/>
    },
    {
        path : '/login',
        element : <PublicOnly><Login/></PublicOnly>
    },
    {
        path : "/register",
        element : <PublicOnly><Register/></PublicOnly>
    },
    {
        path : "/dashboard",
        element : <Protected><Dashboard/></Protected>
    },
    {
        path: "/history",
        element: <Protected><History/></Protected>
    },
    {
        path : '*',
        element : <Navigate to="/"/>
    },

])
