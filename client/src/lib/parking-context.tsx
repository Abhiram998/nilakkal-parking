import React, { createContext, useContext, useState, useEffect } from 'react';

export type Vehicle = {
  number: string;
  entryTime: Date;
  zoneId: string;
  ticketId: string;
};

export type ParkingZone = {
  id: string;
  name: string;
  capacity: number;
  occupied: number;
  vehicles: Vehicle[];
};

type ParkingContextType = {
  zones: ParkingZone[];
  enterVehicle: (vehicleNumber: string) => { success: boolean; ticket?: any; message?: string };
  totalCapacity: number;
  totalOccupied: number;
};

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

const ZONES_COUNT = 20;
const ZONE_CAPACITY = 50; // Simplify for mockup

const INITIAL_ZONES: ParkingZone[] = Array.from({ length: ZONES_COUNT }, (_, i) => ({
  id: `Z${i + 1}`,
  name: `Nilakkal Zone ${i + 1}`,
  capacity: ZONE_CAPACITY,
  occupied: Math.floor(Math.random() * (ZONE_CAPACITY * 0.8)), // Random initial occupancy
  vehicles: []
}));

export function ParkingProvider({ children }: { children: React.ReactNode }) {
  const [zones, setZones] = useState<ParkingZone[]>(INITIAL_ZONES);

  // Simulate live updates slightly
  useEffect(() => {
    const interval = setInterval(() => {
      setZones(current => current.map(z => {
        if (Math.random() > 0.7) {
          const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
          const newOccupied = Math.max(0, Math.min(z.capacity, z.occupied + change));
          return { ...z, occupied: newOccupied };
        }
        return z;
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const enterVehicle = (vehicleNumber: string) => {
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
      ticketId
    };

    const updatedZones = [...zones];
    updatedZones[availableZoneIndex] = {
      ...zone,
      occupied: zone.occupied + 1,
      vehicles: [newVehicle, ...zone.vehicles]
    };

    setZones(updatedZones);

    return { 
      success: true, 
      ticket: {
        vehicleNumber,
        zoneName: zone.name,
        ticketId,
        time: new Date().toLocaleTimeString()
      }
    };
  };

  const totalCapacity = zones.reduce((acc, z) => acc + z.capacity, 0);
  const totalOccupied = zones.reduce((acc, z) => acc + z.occupied, 0);

  return (
    <ParkingContext.Provider value={{ zones, enterVehicle, totalCapacity, totalOccupied }}>
      {children}
    </ParkingContext.Provider>
  );
}

export function useParking() {
  const context = useContext(ParkingContext);
  if (!context) throw new Error("useParking must be used within ParkingProvider");
  return context;
}