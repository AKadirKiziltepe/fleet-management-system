import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Car, Clipboard, Package2, LayoutDashboard, LogOut } from "lucide-react";

export default function NavSidebar() {
  const { user, logoutMutation } = useAuth();

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/vehicles", icon: Car, label: "Vehicles" },
    { href: "/work-orders", icon: Clipboard, label: "Work Orders" },
    { href: "/inventory", icon: Package2, label: "Inventory" },
  ];

  return (
    <div className="flex flex-col h-screen w-64 bg-sidebar border-r">
      <div className="p-4">
        <h1 className="text-xl font-bold text-sidebar-foreground">Fleet Manager</h1>
        <p className="text-sm text-sidebar-foreground/60">Welcome, {user?.username}</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive"
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
