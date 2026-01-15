import { Outlet } from "react-router-dom";
import { StatusServidorProvider } from "./providers/StatusServidorProvider";

export const MainLayout = () => {
  return (
    <StatusServidorProvider>
      <Outlet />
    </StatusServidorProvider>
  );
};