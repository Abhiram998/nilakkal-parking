import { useParking } from "@/lib/parking-context";
import { ZoneCard } from "@/components/parking/ZoneCard";
import { MapPin, Search, MoreHorizontal, Check, Share2, ThumbsUp, Star, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "wouter";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { Calendar } from "@/components/ui/calendar";

export default function Home() {
  const { zones, totalCapacity, totalOccupied, isAdmin } = useParking();
  
  // Mock data for the dashboard look
  const earnings = totalOccupied * 50; // Mock calculation
  const shareCount = 2434; // Static from image
  const likesCount = 1259; // Static from image
  const rating = 8.5; // Static from image

  // Chart Data Preparation
  const barChartData = zones.map(zone => ({
    name: zone.name.replace('Nilakkal Zone ', 'Z'),
    value: zone.occupied,
    capacity: zone.capacity,
  }));

  const pieData = [
    { name: 'Heavy', value: zones.reduce((acc, z) => acc + z.stats.heavy, 0), color: '#1e293b' },
    { name: 'Medium', value: zones.reduce((acc, z) => acc + z.stats.medium, 0), color: '#f59e0b' },
    { name: 'Light', value: zones.reduce((acc, z) => acc + z.stats.light, 0), color: '#3b82f6' },
  ];

  const areaData = [
    { name: 'Jan', value: 30 },
    { name: 'Feb', value: 45 },
    { name: 'Mar', value: 35 },
    { name: 'Apr', value: 60 },
    { name: 'May', value: 40 },
    { name: 'Jun', value: 55 },
    { name: 'Jul', value: 50 },
  ];

  // Search state (keeping functionality)
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

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

  const TopCard = ({ title, value, icon: Icon, color, subValue }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <span className="text-slate-500 font-medium">{title}</span>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="text-3xl font-bold text-slate-800 mb-1">
        {value}
      </div>
      {subValue && <div className="text-sm text-slate-400">{subValue}</div>}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Parking</h1>
          <p className="text-slate-500">Overview of current status</p>
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
        <TopCard 
          title="Revenue" 
          value={`$ ${earnings}`} 
          icon={DollarSign} 
          color="text-blue-600" 
        />
        <TopCard 
          title="Vehicles" 
          value={totalOccupied} 
          icon={Share2} 
          color="text-orange-500" 
        />
        <TopCard 
          title="Free Spots" 
          value={totalCapacity - totalOccupied} 
          icon={ThumbsUp} 
          color="text-yellow-500" 
        />
        <TopCard 
          title="Efficiency" 
          value={`${Math.round((totalOccupied / totalCapacity) * 100)}%`} 
          icon={Star} 
          color="text-orange-400" 
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Bar Chart Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-700">Zone Occupancy</h3>
              <div className="flex items-center gap-2">
                 <span className="bg-slate-900 text-white text-xs px-2 py-1 rounded">2025</span>
                 <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white border-none">Check Now</Button>
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
                  <Bar dataKey="value" fill="#1e293b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="capacity" fill="#cbd5e1" radius={[4, 4, 0, 0]} hide /> 
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Row: Wave Chart + Calendar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Wave Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-400" />
                  <span className="text-xs text-slate-500">Traffic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-800" />
                  <span className="text-xs text-slate-500">Volume</span>
                </div>
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1e293b" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#1e293b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#f59e0b" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                    <Area type="monotone" dataKey="value" stroke="#1e293b" fillOpacity={0.3} fill="url(#colorValue2)" strokeWidth={3} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Calendar Widget */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border-none w-full"
                classNames={{
                  head_cell: "text-slate-400 font-normal",
                  day_selected: "bg-slate-900 text-white hover:bg-slate-800",
                  day_today: "bg-slate-100 text-slate-900",
                }}
              />
            </div>
          </div>

        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-6">
          {/* Donut Chart Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full flex flex-col justify-between">
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
                <span className="text-3xl font-bold text-slate-800">45%</span>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{item.name} Vehicles</span>
                  <span className="font-bold text-slate-700">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-6">
                Check Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Search Section (Preserved) */}
      {isAdmin && (
        <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
             <Search className="w-5 h-5 text-slate-700" />
             Find Your Vehicle
          </h2>
          <form onSubmit={handleSearch} className="flex gap-3 mb-4">
             <Input 
               placeholder="Enter Vehicle Number (e.g. KL-01...)" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="flex-1 bg-slate-50 border-slate-200"
             />
             <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">Search</Button>
          </form>

          {hasSearched && (
            <div className="animate-in fade-in slide-in-from-top-2">
              {searchResult ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-green-800">Vehicle Found!</h3>
                      <div className="mt-2 space-y-1 text-sm text-green-700">
                        <p>Vehicle: <span className="font-mono font-semibold">{searchResult.vehicle.number}</span></p>
                        <p>Location: <span className="font-bold">{searchResult.zone.name}</span></p>
                        <p>Ticket/Slot ID: <span className="font-mono font-semibold">{searchResult.vehicle.ticketId}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : searchQuery.trim() ? (
                 <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-600">
                   Vehicle not found in any active zone.
                 </div>
              ) : null}
            </div>
          )}
        </div>
      )}

      {/* Zones Grid (Preserved but styled better) */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Active Zones</h2>
          <Link href="/ticket">
             <span className="text-sm text-orange-500 font-medium cursor-pointer hover:underline">View All Tickets</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {zones.map((zone) => (
            <ZoneCard key={zone.id} zone={zone} />
          ))}
        </div>
      </div>
    </div>
  );
}
