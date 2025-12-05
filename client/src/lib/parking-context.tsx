import React, { createContext, useContext, useState, useEffect } from 'react';

export type VehicleType = 'heavy' | 'medium' | 'light';

export type Vehicle = {
  number: string;
  entryTime: Date;
  zoneId: string;
  ticketId: string;
  type: VehicleType;
};

export type ParkingZone = {
  id: string;
  name: string;
  capacity: number;
  occupied: number;
  vehicles: Vehicle[];
  stats: {
    heavy: number;
    medium: number;
    light: number;
  };
};

type ParkingContextType = {
  zones: ParkingZone[];
  enterVehicle: (vehicleNumber: string, type?: VehicleType) => { success: boolean; ticket?: any; message?: string };
  totalCapacity: number;
  totalOccupied: number;
  isAdmin: boolean;
  loginAdmin: (username?: string, password?: string) => boolean;
  logoutAdmin: () => void;
};

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

const ZONES_COUNT = 20;
const ZONE_CAPACITY = 50;

const INITIAL_ZONES: ParkingZone[] = Array.from({ length: ZONES_COUNT }, (_, i) => {
  const occupiedCount = Math.floor(Math.random() * (ZONE_CAPACITY * 0.8));
  const vehicles: Vehicle[] = [];
  let heavy = 0, medium = 0, light = 0;

  for(let j=0; j<occupiedCount; j++) {
    const typeRand = Math.random();
    const type: VehicleType = typeRand > 0.8 ? 'heavy' : typeRand > 0.5 ? 'medium' : 'light';
    if(type === 'heavy') heavy++;
    else if(type === 'medium') medium++;
    else light++;

    vehicles.push({
      number: `KL-${Math.floor(Math.random()*99)}-${String.fromCharCode(65+Math.random()*26)}${String.fromCharCode(65+Math.random()*26)}-${Math.floor(1000+Math.random()*9000)}`,
      entryTime: new Date(Date.now() - Math.floor(Math.random() * 10000000)),
      zoneId: `Z${i + 1}`,
      ticketId: `TKT-${Date.now()}-${j}`,
      type
    });
  }

  return {
    id: `Z${i + 1}`,
    name: `Nilakkal Zone ${i + 1}`,
    capacity: ZONE_CAPACITY,
    occupied: occupiedCount,
    vehicles,
    stats: { heavy, medium, light }
  };
});

export function ParkingProvider({ children }: { children: React.ReactNode }) {
  const [zones, setZones] = useState<ParkingZone[]>(INITIAL_ZONES);
  const [isAdmin, setIsAdmin] = useState(false);

  const loginAdmin = (username?: string, password?: string) => {
    if (username === "police@gmail.com" && password === "575") {
      setIsAdmin(true);
      return true;
    }
    return false;
  };
  
  const logoutAdmin = () => setIsAdmin(false);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setZones(current => current.map(z => {
        // Randomly add or remove a vehicle occasionally
        if (Math.random() > 0.8) {
          const isAdding = Math.random() > 0.5;
          
          if (isAdding && z.occupied < z.capacity) {
            const typeRand = Math.random();
            const type: VehicleType = typeRand > 0.8 ? 'heavy' : typeRand > 0.5 ? 'medium' : 'light';
            const newVehicle: Vehicle = {
              number: `KL-${Math.floor(Math.random()*99)}-NEW-${Math.floor(1000+Math.random()*9000)}`,
              entryTime: new Date(),
              zoneId: z.id,
              ticketId: `TKT-${Date.now()}`,
              type
            };
            return {
              ...z,
              occupied: z.occupied + 1,
              vehicles: [newVehicle, ...z.vehicles],
              stats: {
                ...z.stats,
                [type]: z.stats[type] + 1
              }
            };
          } else if (!isAdding && z.occupied > 0) {
            const removedVehicle = z.vehicles[z.vehicles.length - 1]; // Remove oldest for simplicity in mock
            if (!removedVehicle) return z;
            
            return {
              ...z,
              occupied: z.occupied - 1,
              vehicles: z.vehicles.slice(0, -1),
              stats: {
                ...z.stats,
                [removedVehicle.type]: Math.max(0, z.stats[removedVehicle.type] - 1)
              }
            };
          }
        }
        return z;
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const enterVehicle = (vehicleNumber: string, type: VehicleType = 'light') => {
    // Find first available zone
    const availableZoneIndex = zones.findIndex(z => z.occupied < z.capacity);
    
    if (availableZoneIndex === -1) {
      return { success: false, message: "All parking zones are full!" };
    }

    const zone = zones[availableZoneIndex];
    const ticketId = `TKT-${Date.now()}-${Math.floor(Math.random()*1000)}`;
    const newVehicle: Vehicle = {
      number: vehicleNumber,
      entryTime: new Date(),
      zoneId: zone.id,
      ticketId,
      type
    };

    const updatedZones = [...zones];
    updatedZones[availableZoneIndex] = {
      ...zone,
      occupied: zone.occupied + 1,
      vehicles: [newVehicle, ...zone.vehicles],
      stats: {
        ...zone.stats,
        [type]: zone.stats[type] + 1
      }
    };

    setZones(updatedZones);

    return { 
      success: true, 
      ticket: {
        vehicleNumber,
        zoneName: zone.name,
        ticketId,
        time: new Date().toLocaleTimeString(),
        type
      }
    };
  };

  const totalCapacity = zones.reduce((acc, z) => acc + z.capacity, 0);
  const totalOccupied = zones.reduce((acc, z) => acc + z.occupied, 0);

  return (
    <ParkingContext.Provider value={{ zones, enterVehicle, totalCapacity, totalOccupied, isAdmin, loginAdmin, logoutAdmin }}>
      {children}
    </ParkingContext.Provider>
  );
}

export function useParking() {
  const context = useContext(ParkingContext);
  if (!context) throw new Error("useParking must be used within ParkingProvider");
  return context;
}