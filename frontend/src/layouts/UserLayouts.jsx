import React from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

// interface RouteData {
//   url: string;
//   component: React.ReactNode;
// }

function UserLayouts() {
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    const checkToken = () => {
      const userData = localStorage.getItem("user");
      if (!userData) {
        navigate("/auth/login");
        return;
      }
      const user = JSON.parse(userData);
      const token = user?.token;
      if (!token || isTokenExpired(token)) {
        localStorage.removeItem("user");
        navigate("/auth/login");
      }
    };
    const interval = setInterval(checkToken, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="h-full min-h-screen w-full bg-[#f4f4f4] dark:bg-[#181818]">
      <Header />
      <Navbar />

      <div className="flex h-full">
        {location.pathname.includes("/dashboard/admin") && (
          <aside>
            <SideBar />
          </aside>
        )}

        <main
          className={`${location.pathname.includes("/dashboard/admin") ? "flex-1" : "w-full"
            }`}
        >
          <Routes>
            {rutas.dashboard.children.map((data, i) => {//(data: RouteData, i: number)
              if (data.url === "inicio") {
                return (
                  <Route
                    key={i}
                    path={`${data.url}`}
                    element={
                      <div className="h-[92vh] mx-auto laptop:pt-5 laptop:px-5 laptop:h-[86vh]">
                        {data.component}
                      </div>
                    }
                  />
                );
              } else {
                return (
                  <Route
                    key={i}
                    path={`${data.url}`}
                    element={
                      <div className="max-w-[1530px] mx-auto py-5">
                        {data.component}
                      </div>
                    }
                  />
                );
              }
            })}
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default UserLayouts;
