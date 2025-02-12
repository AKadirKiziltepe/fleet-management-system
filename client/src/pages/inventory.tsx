import NavSidebar from "@/components/layout/nav-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Inventory } from "@shared/schema";
import { AlertTriangle } from "lucide-react";

export default function InventoryPage() {
  const { data: inventory } = useQuery<Inventory[]>({ 
    queryKey: ["/api/inventory"] 
  });

  const lowStockItems = inventory?.filter(
    item => item.quantity <= item.minQuantity
  ) ?? [];

  return (
    <div className="flex h-screen">
      <NavSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-8">Inventory</h1>

        {lowStockItems.length > 0 && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center text-yellow-800">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-800">
                {lowStockItems.length} items are running low on stock and need to be replenished.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Stock Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory?.map((item) => {
                const stockPercentage = (item.quantity / item.minQuantity) * 100;
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>
                      {item.quantity} / {item.minQuantity} min
                    </TableCell>
                    <TableCell className="w-[200px]">
                      <Progress 
                        value={stockPercentage > 100 ? 100 : stockPercentage} 
                        className={`${
                          stockPercentage <= 50 ? 'text-red-500' :
                          stockPercentage <= 75 ? 'text-yellow-500' :
                          'text-green-500'
                        }`}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
