import { Bell, Menu, Package2, Search } from 'lucide-react';

import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Link } from 'react-router-dom';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import svg1 from '../../assets/icons/icon-1.svg';
import svg2 from '../../assets/icons/icon-2.svg';
import svg3 from '../../assets/icons/icon-3.svg';
import svg4 from '../../assets/icons/icon-4.svg';
import svg5 from '../../assets/icons/icon-5.svg';
import svg6 from '../../assets/icons/icon-6.svg';

interface NavItem {
  icon: string;
  label: string;
  to: string;
}

const navText: NavItem[] = [
  { icon: svg3, label: 'Dashboard', to: '/dashboard' },
  { icon: svg2, label: 'Workout Plan', to: '/dashboard/workout_plan' },
  { icon: svg6, label: 'Diet Food Plan', to: '/dashboard/diet_food_plan' },
  { icon: svg1, label: 'Attendance', to: '/dashboard/attendance' },
  { icon: svg2, label: 'Trainers', to: '/dashboard/trainers' },
  { icon: svg5, label: 'Subscription', to: '/dashboard/subscription' },
  { icon: svg4, label: 'Personal Record', to: '/dashboard/personal_record' },
];

function MobileDashboardHeader() {
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
              <Link
                key={index}
                to={item.to}
                className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
              >
                <img src={item.icon} alt="logo" className="p-2 h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search
              color="white"
              className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Toggle notifications</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

function DashboardHeader() {
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
              <Link
                key={index}
                to={item.to}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <img src={item.icon} alt="logo" className="p-2 h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

export { DashboardHeader, MobileDashboardHeader };
