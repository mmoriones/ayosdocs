import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  Filter,
  ChevronDown,
  Info,
  CheckCircle2,
  Users,
  Zap,
  MessageSquare
} from 'lucide-react';
import { getGuideIcon } from '../utils/guideIcons';

/**
 * Offices Page Component
 * A community-driven directory of government offices with real-world insights.
 */
const Offices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgency, setSelectedAgency] = useState('All Agencies');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Government Office Insights | AyosDocs";
    window.scrollTo(0, 0);
  }, []);

  // Mock data for offices - in a real app, this would come from an API
  const offices = [
    {
      id: 1,
      name: 'DFA Manila Aseana',
      agency: 'DFA',
      location: 'Parañaque, Metro Manila',
      rating: 4.3,
      reviews: 182,
      waitTime: '2-3 hrs',
      speed: 85,
      friendliness: 78,
      queue: 92,
      proTip: "Slots open at midnight. Photocopy services available across the street.",
      icon: getGuideIcon('passport-appointment'),
      status: 'Regular Hours'
    },
    {
      id: 2,
      name: 'PSA Quezon City Main Office',
      agency: 'PSA',
      location: 'East Ave, Quezon City',
      rating: 4.5,
      reviews: 156,
      waitTime: '1-2 hrs',
      speed: 90,
      friendliness: 82,
      queue: 88,
      proTip: "Apply online first to use the priority lane.",
      icon: getGuideIcon('psa-birth-certificate'),
      status: 'Regular Hours'
    },
    {
      id: 3,
      name: 'NBI Clearance Center - UN Avenue',
      agency: 'NBI',
      location: 'Manila, Metro Manila',
      rating: 4.1,
      reviews: 98,
      waitTime: '2-4 hrs',
      speed: 75,
      friendliness: 70,
      queue: 65,
      proTip: "Go before 8 AM for walk-ins, though online appointment is preferred.",
      icon: getGuideIcon('nbi-clearance'),
      status: 'Busy'
    }
  ];

  const filteredOffices = offices.filter(office => 
    (office.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     office.location.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedAgency === 'All Agencies' || office.agency === selectedAgency)
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
        
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
                Government Office Insights
              </h1>
              <p className="text-gray-500 text-base max-w-2xl">
                Research the best locations for your government tasks. Real-time community data on wait times, staff friendliness, and processing speed.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white border border-gray-100 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-gray-700 uppercase tracking-tight">5,402 Reports this month</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content - Left Column */}
          <div className="flex-1 space-y-8">
            
            {/* Search and Filters */}
            <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="Search by office name, city, or province..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>
                <div className="relative">
                  <select 
                    value={selectedAgency}
                    onChange={(e) => setSelectedAgency(e.target.value)}
                    className="appearance-none bg-gray-50 border-none rounded-2xl pl-4 pr-10 py-3 text-sm font-bold text-gray-700 cursor-pointer focus:ring-2 focus:ring-teal-500/20 transition-all"
                  >
                    <option>All Agencies</option>
                    <option>DFA</option>
                    <option>PSA</option>
                    <option>NBI</option>
                    <option>LTO</option>
                    <option>SSS</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </section>

            {/* Results Grid */}
            <div className="grid grid-cols-1 gap-6">
              {filteredOffices.length > 0 ? (
                filteredOffices.map((office) => (
                  <OfficeCard key={office.id} office={office} navigate={navigate} />
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <Building2 size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">No offices found</h3>
                  <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <aside className="w-full lg:w-[380px] shrink-0 space-y-8">
            
            {/* Leaderboard/Best Performing */}
            <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={20} className="text-teal-600" />
                <h3 className="text-base font-bold text-gray-900">Best Performing</h3>
              </div>
              
              <div className="space-y-6">
                {offices.slice(0, 3).map((office, i) => (
                  <div key={office.id} className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-xs font-black">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-teal-600 transition-colors">{office.name}</h4>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter mt-0.5">{office.agency} • {office.rating} rating</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">Fast</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-8 py-3 bg-gray-50 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all uppercase tracking-widest">
                View Full Rankings
              </button>
            </section>

            {/* Why it works */}
            <section className="bg-teal-900 rounded-3xl p-6 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-800 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700" />
              
              <div className="relative z-10">
                <ShieldCheck size={28} className="text-teal-400 mb-4" />
                <h3 className="text-lg font-bold mb-2">Community Intelligence</h3>
                <p className="text-teal-100/80 text-xs leading-relaxed mb-6">
                  Our insights are powered by real people sharing their actual experiences. All reports are moderated to ensure accuracy and prevent misinformation.
                </p>
                
                <div className="space-y-4">
                  {[
                    "100% Anonymous reports",
                    "Moderated for quality",
                    "Real-time wait updates"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 size={14} className="text-teal-400" />
                      <span className="text-xs font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Help/Contribute */}
            <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-4">
                <Zap size={32} className="fill-orange-500/10" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Recently visited an office?</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">
                Your experience helps thousands of others plan their visits better.
              </p>
              <button 
                onClick={() => navigate('/rate')}
                className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold text-xs shadow-md shadow-teal-600/20 hover:bg-teal-700 transition-all active:scale-95"
              >
                Share Your Experience
              </button>
            </section>

          </aside>
        </div>
      </div>
    </div>
  );
};

/**
 * OfficeCard Component
 * High-density information card for government offices.
 */
const OfficeCard = ({ office, navigate }) => {
  return (
    <div className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:items-start">
          
          {/* Office Icon & Agency */}
          <div className="flex md:flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center p-3 group-hover:bg-teal-50 transition-colors">
              <img src={office.icon} alt="" className="w-full h-full object-contain" />
            </div>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-tighter">
              {office.agency}
            </span>
          </div>

          {/* Main Info */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-700 transition-colors leading-tight">
                  {office.name}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 text-gray-400">
                  <MapPin size={12} />
                  <span className="text-xs font-medium">{office.location}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-bold text-gray-900">{office.rating}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{office.reviews} reports</p>
                </div>
                <div className="h-10 w-px bg-gray-100 hidden md:block" />
                <div className="bg-teal-50 px-4 py-2 rounded-2xl border border-teal-100 flex flex-col items-center">
                  <span className="text-[10px] font-black text-teal-600 uppercase tracking-tighter">Avg. Wait</span>
                  <span className="text-xs font-bold text-teal-700">{office.waitTime}</span>
                </div>
              </div>
            </div>

            {/* Sentiment Sparklines */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
              {[
                { label: 'Speed', value: office.speed, icon: Zap },
                { label: 'Staff', value: office.friendliness, icon: Users },
                { label: 'Queue', value: office.queue, icon: Clock },
                { label: 'Facility', value: 85, icon: Building2 }
              ].map((stat) => (
                <div key={stat.label} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <stat.icon size={10} className="text-teal-500" />
                      {stat.label}
                    </span>
                    <span className="text-[10px] font-bold text-gray-700">{stat.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-500 rounded-full" 
                      style={{ width: `${stat.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Pro Tip */}
            {office.proTip && (
              <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-4 flex items-start gap-3">
                <Info size={16} className="text-orange-500 shrink-0 mt-0.5" />
                <p className="text-xs text-orange-800 leading-relaxed italic">
                  <span className="font-bold not-italic">Community Pro-Tip:</span> "{office.proTip}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Card Footer */}
      <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <MessageSquare size={14} className="text-gray-400" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">3 Recent reports today</span>
        </div>
        <button 
          onClick={() => navigate(`/offices/${office.id}`)}
          className="text-teal-600 font-bold text-xs flex items-center gap-1.5 hover:gap-2.5 transition-all"
        >
          View detailed insights
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Offices;
