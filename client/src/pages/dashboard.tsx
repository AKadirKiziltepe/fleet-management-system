import NavSidebar from "@/components/layout/nav-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Vehicle, WorkOrder, Inventory } from "@shared/schema";
import { Car, ClipboardList, Package } from "lucide-react";

export default function Dashboard() {
  const { data: vehicles } = useQuery<Vehicle[]>({ queryKey: ["/api/vehicles"] });
  const { data: workOrders } = useQuery<WorkOrder[]>({ queryKey: ["/api/work-orders"] });
  const { data: inventory } = useQuery<Inventory[]>({ queryKey: ["/api/inventory"] });

  const stats = [
    {
      title: "Total Vehicles",
      value: vehicles?.length ?? 0,
      icon: Car,
    },
    {
      title: "Active Work Orders",
      value: workOrders?.filter(wo => wo.status === "in_progress").length ?? 0,
      icon: ClipboardList,
    },
    {
      title: "Low Stock Items",
      value: inventory?.filter(item => item.quantity <= item.minQuantity).length ?? 0,
      icon: Package,
    },
  ];

  return (
    <div className="flex h-screen">
      <NavSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
