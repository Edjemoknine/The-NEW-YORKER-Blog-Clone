import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { Outlet, useLocation } from "react-router-dom";

const Root = () => {
  const { pathname } = useLocation();
  return (
    <div>
      {pathname !== "/auth" && <Navbar />}
      <Outlet />

      {pathname !== "/auth" && <Footer />}
    </div>
  );
};

export default Root;
