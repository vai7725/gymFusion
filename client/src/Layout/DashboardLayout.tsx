import { Outlet } from 'react-router-dom';
import {
  DashboardHeader,
  MobileDashboardHeader,
} from '../components/Header/DashboardHeader';

const DashboardLayout = () => {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <DashboardHeader />
      <div className="flex flex-col">
        <MobileDashboardHeader />
        {/* Big screen header */}
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
