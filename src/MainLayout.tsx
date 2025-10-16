import { Outlet } from "react-router-dom";
import { StatusServidorProvider } from "./context/StatusServidorProvider";

export const MainLayout = () => {
  return (
    <StatusServidorProvider>
      <Outlet />
    </StatusServidorProvider>
  );
};