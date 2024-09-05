import { Outlet } from 'react-router-dom';
import {
  DashboardSidebar,
  MobileDashboardSideBar,
} from '../components/Dashboard/DashboardSideBar';

const DashboardLayout = () => {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[220px_1fr]">
      <DashboardSidebar />
      <div className="flex flex-col">
        <MobileDashboardSideBar />
        {/* Big screen header */}
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
