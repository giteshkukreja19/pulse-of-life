
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, Users, Activity, HelpCircle, 
  Settings, LogOut, Heart, Hospital, Database,
  LineChart, Calendar, FileText, User
} from "lucide-react";

interface SidebarProps {
  userRole: "admin" | "hospital" | "donor" | "recipient";
}

export function Sidebar({ userRole }: SidebarProps) {
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
    <div className="w-64 bg-slate-50 border-r min-h-[calc(100vh-64px)] p-4 hidden md:block">
      <div className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-blood"
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </div>

      <div className="absolute bottom-4 space-y-1">
        <Link
          to="/help"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-blood"
        >
          <HelpCircle className="h-5 w-5" />
          Help & Support
        </Link>
        <Link
          to="/logout"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:text-blood"
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </Link>
      </div>
    </div>
  );
}
