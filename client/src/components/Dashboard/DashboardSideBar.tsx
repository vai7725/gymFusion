import { LogOut, Menu, Package2 } from 'lucide-react';

import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import svg1 from '../../assets/icons/icon-1.svg';
import svg2 from '../../assets/icons/icon-2.svg';
import svg3 from '../../assets/icons/icon-3.svg';
import svg4 from '../../assets/icons/icon-4.svg';
import svg5 from '../../assets/icons/icon-5.svg';
import svg6 from '../../assets/icons/icon-6.svg';

import { cn } from '../../lib/utils';
import Header from './Header';

interface NavItem {
  icon: string;
  label: string;
  to: string;
}

const navText: NavItem[] = [
  { icon: svg3, label: 'Dashboard', to: '/dashboard/home' },
  { icon: svg2, label: 'Workout Plan', to: '/dashboard/workout-plan' },
  { icon: svg6, label: 'Diet Food Plan', to: '/dashboard/diet-food-plan' },
  { icon: svg1, label: 'Attendance', to: '/dashboard/attendance' },
  { icon: svg2, label: 'Trainers', to: '/dashboard/trainers' },
  { icon: svg5, label: 'Subscription', to: '/dashboard/subscription' },
  { icon: svg4, label: 'Personal Record', to: '/dashboard/personal-record' },
];

function MobileDashboardSideBar() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            {navText.map((item, index) => (
              <NavLink
                key={index}
                to={item.to}
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                <img
                  src={item.icon}
                  alt="logo"
                  className="p-2 h-4 w-4 bg-white"
                />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Big screen Header */}
      <Header />
    </header>
  );
}

function DashboardSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };
  return (
    <div className="hidden bg-black border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Acme Inc</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navText.map((item, index) => (
              <NavLink
                key={index}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    isActive ? 'bg-[#1f3a5f]' : '',
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
                  )
                }
              >
                <img
                  src={item.icon}
                  alt="logo"
                  className="h-5 w-5 bg-accent p-1"
                />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="h-full flex items-center justify-start">
            <Button variant={'ghost'} className="m-4" onClick={handleLogout}>
              <LogOut className="pr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { DashboardSidebar, MobileDashboardSideBar };
