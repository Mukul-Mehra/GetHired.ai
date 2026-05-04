
import './App.css'
import Signin from './ui/pages/Login.jsx'
import Signup from './ui/pages/Register.jsx'
import { RouterProvider } from "react-router-dom"
import { router } from './app.routes.jsx'
import { AuthProvider } from './auth/auth.context.jsx'

function App() {


  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
