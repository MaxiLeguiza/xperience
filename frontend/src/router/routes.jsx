// import UserLayouts from "../layouts/UserLayouts.jsx";
import Home from "../pages/home.jsx";
import RedeemPage from "../routes/redeemPage.jsx"; // 👈 importar la nueva página

export const rutas = {
  dashboard: {
    url: "/dashboard/*",
    tittle: "dashboard",
    component: <UserLayouts />,
    children: [
      {
        url: "inicio",
        title: "Inicio",
        flatIcon: "",
        component: <Home />,
      },
      {
        url: "redeem", // 👈 acá va la nueva ruta
        title: "Redeem",
        flatIcon: "",
        component: <RedeemPage />,
      },
    ],
  },
};
