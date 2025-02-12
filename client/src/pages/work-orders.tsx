import NavSidebar from "@/components/layout/nav-sidebar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { WorkOrder, Vehicle, User, workOrderStatus } from "@shared/schema";
import { Plus } from "lucide-react";
import WorkOrderForm from "@/components/work-orders/work-order-form";
import { useState } from "react";
import { format } from "date-fns";

export default function WorkOrders() {
  const { data: workOrders } = useQuery<WorkOrder[]>({ 
    queryKey: ["/api/work-orders"]
  });
  const { data: vehicles } = useQuery<Vehicle[]>({ 
    queryKey: ["/api/vehicles"]
  });
  const [showAddWorkOrder, setShowAddWorkOrder] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const filteredOrders = workOrders?.filter(order => 
    statusFilter ? order.status === statusFilter : true
  );

  const getVehiclePlate = (vehicleId: number) => {
    return vehicles?.find(v => v.id === vehicleId)?.plateNumber ?? "N/A";
  };

  return (
    <div className="flex h-screen">
      <NavSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Work Orders</h1>
          <div className="flex gap-4 items-center">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                {Object.values(workOrderStatus).map(status => (
                  <SelectItem key={status} value={status}>
                    {status.replace('_', ' ').charAt(0).toUpperCase() + 
                     status.slice(1).replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => setShowAddWorkOrder(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Work Order
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{getVehiclePlate(order.vehicleId)}</TableCell>
                  <TableCell>{order.description}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                      ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {order.status.replace('_', ' ').charAt(0).toUpperCase() + 
                       order.status.slice(1).replace('_', ' ')}
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(order.createdAt), 'PPp')}</TableCell>
                  <TableCell>
                    {order.updatedAt ? format(new Date(order.updatedAt), 'PPp') : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <WorkOrderForm open={showAddWorkOrder} onOpenChange={setShowAddWorkOrder} />
      </main>
    </div>
  );
}
