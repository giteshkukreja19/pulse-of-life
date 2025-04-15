
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

interface MobileSidebarProps {
  userRole: "admin" | "hospital" | "donor" | "recipient";
}

export function MobileSidebar({ userRole }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <div className="flex items-center justify-between mb-6">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-xl font-bold text-blood"
            >
              Plus of Life
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <Sidebar userRole={userRole} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
