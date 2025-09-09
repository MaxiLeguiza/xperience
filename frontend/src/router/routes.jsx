// import ProtectedRoute from "./ProtectedRoute";
import UserLayouts from "../layouts/UserLayouts.jsx";
import Home from "../pages/home.jsx";


export const rutas = {
  dashboard: {
    url: "/dashboard/*",
    tittle: "dashboard",
    // element: <ProtectedRoute />,
    component: <UserLayouts />,
    children: [
      {
        url: "inicio",
        title: "Inicio",
        flatIcon: "",
        component: <Home/>,
      }
    ]
  }
};