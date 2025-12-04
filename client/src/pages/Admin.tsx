import { useState } from "react";
import { useParking } from "@/lib/parking-context";
import { ZoneCard } from "@/components/parking/ZoneCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Shield, Camera, Printer, BarChart3, LayoutDashboard } from "lucide-react";

export default function Admin() {
  const { zones, enterVehicle, totalCapacity, totalOccupied } = useParking();
  const [vehicleNumber, setVehicleNumber] = useState("");
  const { toast } = useToast();
  const [lastTicket, setLastTicket] = useState<any>(null);

  const handleEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNumber.trim()) return;

    const result = enterVehicle(vehicleNumber.toUpperCase());
    
    if (result.success) {
      setLastTicket(result.ticket);
      setVehicleNumber("");
      toast({
        title: "Vehicle Entry Recorded",
        description: `Assigned to ${result.ticket.zoneName}`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Entry Failed",
        description: result.message,
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            Police Control Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Manage vehicle entries and monitor zone status.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-card border border-border px-4 py-2 rounded-lg text-center">
            <div className="text-xs text-muted-foreground uppercase font-bold">Total Capacity</div>
            <div className="text-xl font-mono font-bold">{totalCapacity}</div>
          </div>
          <div className="bg-card border border-border px-4 py-2 rounded-lg text-center">
            <div className="text-xs text-muted-foreground uppercase font-bold">Occupied</div>
            <div className="text-xl font-mono font-bold text-primary">{totalOccupied}</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Entry Simulation */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Camera className="w-5 h-5" />
                Vehicle Entry
              </CardTitle>
              <CardDescription>Simulate ANPR camera read</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleEntry} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vnum">Vehicle Number</Label>
                  <Input 
                    id="vnum" 
                    placeholder="KL-01-AB-1234" 
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className="font-mono uppercase text-lg tracking-widest"
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full text-lg h-12" size="lg">
                  Generate Ticket
                </Button>
              </form>
            </CardContent>
          </Card>

          {lastTicket && (
            <Card className="border-dashed border-2 bg-yellow-50/50 dark:bg-yellow-900/10 animate-in fade-in zoom-in duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Printer className="w-4 h-4" />
                  Last Ticket Generated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Vehicle</span>
                    <span className="font-bold text-lg">{lastTicket.vehicleNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Zone</span>
                    <span className="font-bold text-primary">{lastTicket.zoneName}</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Ticket ID</span>
                    <span>{lastTicket.ticketId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span>{lastTicket.time}</span>
                  </div>
                  <div className="pt-4 text-center">
                    <div className="inline-block bg-black text-white px-2 py-1 text-xs rounded">
                      AUTHORIZED PARKING
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Zone Dashboard */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="grid">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-serif font-bold">Zone Overview</h3>
              <TabsList>
                <TabsTrigger value="grid"><LayoutDashboard className="w-4 h-4 mr-2"/> Grid</TabsTrigger>
                <TabsTrigger value="list"><BarChart3 className="w-4 h-4 mr-2"/> List</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="grid" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                {zones.map((zone) => (
                  <ZoneCard key={zone.id} zone={zone} detailed />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="list">
              <Card>
                <CardContent className="p-0">
                  <div className="rounded-md border">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted text-muted-foreground">
                        <tr>
                          <th className="p-4 font-medium">Zone ID</th>
                          <th className="p-4 font-medium">Name</th>
                          <th className="p-4 font-medium text-right">Capacity</th>
                          <th className="p-4 font-medium text-right">Occupied</th>
                          <th className="p-4 font-medium text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {zones.map((zone) => (
                          <tr key={zone.id} className="border-t hover:bg-muted/50 transition-colors">
                            <td className="p-4 font-mono font-medium">{zone.id}</td>
                            <td className="p-4">{zone.name}</td>
                            <td className="p-4 text-right text-muted-foreground">{zone.capacity}</td>
                            <td className="p-4 text-right font-medium">{zone.occupied}</td>
                            <td className="p-4 text-right">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                zone.occupied >= zone.capacity 
                                  ? "bg-red-100 text-red-700" 
                                  : zone.occupied > zone.capacity * 0.8 
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-green-100 text-green-700"
                              }`}>
                                {Math.round((zone.occupied / zone.capacity) * 100)}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}