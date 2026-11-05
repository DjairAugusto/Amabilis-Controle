import { createBrowserRouter } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Obras from './pages/Obras'
import Tarefas from './pages/Tarefas'
import Recursos from './pages/Recursos'
import Fornecedores from './pages/Fornecedores'
import ObraDetalhes from './pages/ObrasDetalhes'
import Relatorios from './pages/Relatorios'
import ProtectedRoute from './routes/ProtectedRoute' 
import Pagamentos from './pages/Pagamentos'
import Mapa from './pages/Mapa'
import Tutorial from './pages/Tutorial'

export default createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {path:"/login", element: <Login />}
    ]
  },
  {
    path: "/",
    element: <ProtectedRoute />, 
    children: [
      {
        element: <MainLayout />, 
        children: [
          {index: true, element: <Dashboard />},
          {path: "obras", element: <Obras />},
          {path: "obras/:id", element: <ObraDetalhes />},
          {path: "tarefas", element: <Tarefas />},
          {path: "recursos", element: <Recursos/>},
          {path: "fornecedores", element: <Fornecedores/>},
          {path: "relatorios", element: <Relatorios/>},
          {path: "pagamentos", element: <Pagamentos />},
          {path: "mapa", element: <Mapa />},
          {path: "tutorial", element: <Tutorial />}
        ]
      }
    ]
  }
])