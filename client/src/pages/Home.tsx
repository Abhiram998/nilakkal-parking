import { useParking } from "@/lib/parking-context";
import { ZoneCard } from "@/components/parking/ZoneCard";
import { PredictionChart } from "@/components/parking/PredictionChart";
import { AlertCircle, MapPin } from "lucide-react";
import heroImage from '@assets/generated_images/sabarimala_parking_entrance_atmospheric_shot.png';

export default function Home() {
  const { zones, totalCapacity, totalOccupied } = useParking();
  const availabilityPercentage = Math.round(((totalCapacity - totalOccupied) / totalCapacity) * 100);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border shadow-xl">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Nilakkal Entrance" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>
        
        <div className="relative z-10 p-8 md:p-12 max-w-2xl text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-sm font-medium mb-6 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Live Updates
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight">
            Real-time Parking Availability at Nilakkal
          </h1>
          <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
            Check live slot availability before you arrive. Plan your pilgrimage with our AI-powered occupancy predictions.
          </p>
          
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            <div>
              <div className="text-sm text-white/60 uppercase tracking-wider font-medium mb-1">Total Vacant Spots</div>
              <div className="text-4xl font-bold text-white">{totalCapacity - totalOccupied}</div>
            </div>
            <div>
              <div className="text-sm text-white/60 uppercase tracking-wider font-medium mb-1">Overall Status</div>
              <div className={`text-4xl font-bold ${availabilityPercentage < 20 ? 'text-red-400' : 'text-green-400'}`}>
                {availabilityPercentage < 10 ? 'Critical' : availabilityPercentage < 30 ? 'Busy' : 'Available'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Section */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-2xl font-serif font-bold text-foreground">Tomorrow's Forecast</h2>
          <p className="text-muted-foreground">
            Based on historical data and booking trends, here is the predicted parking probability for tomorrow.
          </p>
          <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-primary">Pilgrim Advisory</h4>
              <p className="text-sm text-muted-foreground">
                Heavy rush expected between 4:00 PM and 8:00 PM. Plan to arrive early morning for easier parking.
              </p>
            </div>
          </div>
        </div>
        <div className="md:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="font-medium text-muted-foreground uppercase text-sm tracking-wider">Occupancy Probability</h3>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">Date: Tomorrow</span>
          </div>
          <PredictionChart />
        </div>
      </div>

      {/* Zones Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-serif font-bold text-foreground">Parking Zones</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {zones.map((zone) => (
            <ZoneCard key={zone.id} zone={zone} />
          ))}
        </div>
      </div>
    </div>
  );
}