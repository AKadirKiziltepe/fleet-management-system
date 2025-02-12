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
import { useQuery } from "@tanstack/react-query";
import { Vehicle } from "@shared/schema";
import { Plus } from "lucide-react";
import VehicleForm from "@/components/vehicles/vehicle-form";
import { useState } from "react";

export default function Vehicles() {
  const { data: vehicles } = useQuery<Vehicle[]>({ queryKey: ["/api/vehicles"] });
  const [showAddVehicle, setShowAddVehicle] = useState(false);

  return (
    <div className="flex h-screen">
      <NavSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Vehicles</h1>
          <Button onClick={() => setShowAddVehicle(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plate Number</TableHead>
                <TableHead>Make</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles?.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>{vehicle.plateNumber}</TableCell>
                  <TableCell>{vehicle.make}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>{vehicle.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <VehicleForm open={showAddVehicle} onOpenChange={setShowAddVehicle} />
      </main>
    </div>
  );
}
