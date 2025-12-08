import { useParking } from "@/lib/parking-context";
import { ZoneCard } from "@/components/parking/ZoneCard";
import { MapPin, Search, MoreHorizontal, Car, Share2, ThumbsUp, Star, DollarSign, Database, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "wouter";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

export default function Home() {
  const { zones, totalCapacity, totalOccupied, isAdmin } = useParking();
  
  // Calculate vacancy
  const totalVacancy = totalCapacity - totalOccupied;
  const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;
  
  // Rating/Efficiency Mock
  const rating = 8.5;

  // Chart Data Preparation (Keeping the logic from previous app)
  const barChartData = zones.map(zone => ({
    name: zone.name.replace('Nilakkal Zone ', 'Z'),
    Heavy: zone.stats.heavy,
    Medium: zone.stats.medium,
    Light: zone.stats.light,
    occupied: zone.occupied,
    capacity: zone.capacity,
  }));

  const pieData = [
    { name: 'Heavy', value: zones.reduce((acc, z) => acc + z.stats.heavy, 0), color: '#1e293b' },
    { name: 'Medium', value: zones.reduce((acc, z) => acc + z.stats.medium, 0), color: '#f59e0b' },
    { name: 'Light', value: zones.reduce((acc, z) => acc + z.stats.light, 0), color: '#3b82f6' },
  ];

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    if (!searchQuery.trim()) {
      setSearchResult(null);
      return;
    }
    for (const zone of zones) {
      const vehicle = zone.vehicles.find(v => v.number.toLowerCase().includes(searchQuery.toLowerCase()));
      if (vehicle) {
        setSearchResult({ zone, vehicle });
        return;
      }
    }
    setSearchResult(null);
  };

  const TopCard = ({ title, value, icon: Icon, color, subValue, dark = false }: any) => (
    <div className={`rounded-xl p-6 shadow-sm border relative overflow-hidden group hover:shadow-md transition-all ${dark ? 'bg-[#1a233a] text-white border-none' : 'bg-white border-slate-100 text-slate-800'}`}>
      <div className="flex justify-between items-start mb-4">
        <span className={`font-medium ${dark ? 'text-slate-300' : 'text-slate-500'}`}>{title}</span>
        {dark ? (
             <div className="bg-white/20 p-1.5 rounded-full">
               <Icon className="w-4 h-4 text-white" />
             </div>
        ) : (
            <Icon className={`w-5 h-5 ${color}`} />
        )}
      </div>
      <div className="text-4xl font-bold mb-1">
        {value}
      </div>
      {subValue && <div className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-400'}`}>{subValue}</div>}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Parking</h1>
        </div>
        <div className="flex items-center gap-4">
           {/* Mobile Menu Trigger is handled in Layout */}
           <Button variant="ghost" size="icon" className="md:hidden">
             <MoreHorizontal />
           </Button>
        </div>
      </div>

      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Vacancy (was Revenue) - Dark Blue */}
        <TopCard 
          title="Vacancy" 
          value={totalVacancy}
          icon={DollarSign} // Using DollarSign as in the mock, but functionality is Vacancy
          color="text-white"
          dark={true}
        />
        {/* Card 2: Occupancy (was Share) */}
        <TopCard 
          title="Occupancy" 
          value={totalOccupied} 
          icon={Share2} 
          color="text-orange-500" 
        />
        {/* Card 3: Total Capacity (was Likes) */}
        <TopCard 
          title="Total Capacity" 
          value={totalCapacity} 
          icon={ThumbsUp} 
          color="text-yellow-500" 
        />
        {/* Card 4: Rating/Efficiency */}
        <TopCard 
          title="Rating" 
          value={rating} 
          subValue="Stars"
          icon={Star} 
          color="text-orange-400" 
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Bar Chart Section (The "Result" graph) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-700">Live Zone Status</h3>
              <div className="flex items-center gap-2">
                 <span className="bg-slate-900 text-white text-xs px-2 py-1 rounded">2025</span>
                 <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white border-none h-8 text-xs">Check Now</Button>
              </div>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    cursor={{ fill: '#f1f5f9' }}
                  />
                  <Bar dataKey="Heavy" fill="#1e293b" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Medium" fill="#f59e0b" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Light" fill="#3b82f6" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Legend for the chart */}
            <div className="flex items-center justify-center gap-6 mt-4">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#1e293b] rounded-sm"></div>
                  <span className="text-xs text-slate-500">Heavy</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#f59e0b] rounded-sm"></div>
                  <span className="text-xs text-slate-500">Medium</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#3b82f6] rounded-sm"></div>
                  <span className="text-xs text-slate-500">Light</span>
               </div>
            </div>
          </div>

          {/* Bottom Section: Live Zone Status (Zone Cards) */}
          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-slate-700">Live Zone Overview</h3>
             </div>
             
             {/* Using a grid for zones, but maybe more compact than the full page version? 
                 Actually the ZoneCard is already quite good. */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {zones.slice(0, 4).map((zone) => (
                  <ZoneCard key={zone.id} zone={zone} />
                ))}
             </div>
             {zones.length > 4 && (
                <div className="flex justify-center">
                    <Link href="/predictions">
                        <Button variant="outline" className="text-slate-500">View All Zones</Button>
                    </Link>
                </div>
             )}
          </div>

        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-6">
          {/* Donut Chart Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-auto">
            <div className="relative h-[250px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-slate-800">{occupancyRate}%</span>
                <span className="text-xs text-slate-400">Occupied</span>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-500">{item.name} Vehicles</span>
                  </div>
                  <span className="font-bold text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg shadow-orange-200 shadow-lg">
                Check Now
              </Button>
            </div>
          </div>
          
          {/* Admin Search Widget (Mini) */}
          {isAdmin && (
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">Quick Search</h3>
                <form onSubmit={handleSearch} className="flex flex-col gap-3">
                    <Input 
                        placeholder="Vehicle No." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-slate-50"
                    />
                    <Button type="submit" className="w-full bg-slate-900 text-white">Find Vehicle</Button>
                </form>
                {searchResult && (
                    <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md text-sm border border-green-100">
                        <p className="font-bold">{searchResult.vehicle.number}</p>
                        <p>Loc: {searchResult.zone.name}</p>
                    </div>
                )}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
