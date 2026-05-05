import { createBrowserRouter, Navigate } from "react-router-dom"

import Landing from "./ui/pages/Landing"
import Login from "./ui/pages/Login"
import Register from "./ui/pages/Register"
import Dashboard from "./ui/pages/Dashboard"
import Protected from "./ui/components/Protected"

export const router = createBrowserRouter([
    {
        path : '/',
        element : <Landing/>
    },
    {
        path : '/login',
        element : <Login/>
    },
    {
        path : "/register",
        element : <Register/>
    },
    {
        path : "/dashboard",
        element : <Protected><Dashboard/></Protected>
    },
    {
        path : '*',
        element : <Navigate to="/"/>
    },

])
