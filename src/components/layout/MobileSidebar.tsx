
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Users, Activity, HelpCircle, 
  Settings, LogOut, Heart, Hospital, Database,
  LineChart, Calendar, FileText, User
} from "lucide-react";

interface MobileSidebarProps {
  userRole: "admin" | "hospital" | "donor" | "recipient";
}

export function MobileSidebar({ userRole }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  
  const adminLinks = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/admin/requests", label: "Blood Requests", icon: <Activity className="h-5 w-5" /> },
    { href: "/admin/donors", label: "Donors", icon: <Users className="h-5 w-5" /> },
    { href: "/admin/hospitals", label: "Hospitals", icon: <Hospital className="h-5 w-5" /> },
    { href: "/admin/inventory", label: "Blood Inventory", icon: <Database className="h-5 w-5" /> },
    { href: "/admin/reports", label: "Reports", icon: <LineChart className="h-5 w-5" /> },
    { href: "/admin/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ];

  const hospitalLinks = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/hospital/requests", label: "Blood Requests", icon: <Heart className="h-5 w-5" /> },
    { href: "/hospital/donors", label: "Donors", icon: <Users className="h-5 w-5" /> },
    { href: "/hospital/inventory", label: "Inventory", icon: <Database className="h-5 w-5" /> },
    { href: "/hospital/events", label: "Donation Events", icon: <Calendar className="h-5 w-5" /> },
    { href: "/hospital/reports", label: "Reports", icon: <FileText className="h-5 w-5" /> },
    { href: "/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
  ];

  const links = userRole === "admin" ? adminLinks : hospitalLinks;
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden m-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <div className="space-y-1 mt-8">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                location.pathname === link.href 
                ? "bg-blood/10 text-blood font-medium" 
                : "text-slate-900 hover:text-blood"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        <div className="space-y-1 absolute bottom-8 left-4 right-4">
          <Link
            to="/help"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-blood"
          >
            <HelpCircle className="h-5 w-5" />
            Help & Support
          </Link>
          <Link
            to="/logout"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-blood"
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
