import React, { useState } from "react"
import { Sparkles, Navigation, Dumbbell, ShieldAlert, BadgeCent } from "lucide-react"
import { useCity } from "../context/CityContext"

export default function Services({ onSelectVehicle }) {
  const { currentCity } = useCity()
  const [filterWeight, setFilterWeight] = useState(500)
  const [filterDistance, setFilterDistance] = useState(15)

  // Expanded fleet data with 2-3 vehicles per category
  const fleet = [
    // 0-20kg
    {
      id: "bike-petrol", cat: "0-20", title: "Two Wheeler (Petrol)", image: "/bikes/bike.webp", capacity: "20 kg", dimensions: "1.5 x 1.5 x 1.5 ft", ideal: "Documents, keys, small boxes, fast delivery.", tag: "Super Fast", tagColor: "bg-amber-100 text-amber-800 border-amber-200"
    },
    {
      id: "bike-ev", cat: "0-20", title: "EV Scooter (Green)", image: "/bikes/scooter.webp", capacity: "20 kg", dimensions: "1.5 x 1.5 x 1.5 ft", ideal: "Smaller local deliveries where an EV partner is available.", tag: "Electric Option", tagColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
    },

    // 21-500kg
    {
      id: "auto-petrol", cat: "21-500", title: "Three Wheeler Auto", image: "/trucks/3-Wheeler.webp", capacity: "500 kg", dimensions: "5.5 x 4.5 x 4 ft", ideal: "Crates, small appliances, inventory.", tag: "Compact Cargo", tagColor: "bg-brand-100 text-brand-800 border-brand-200"
    },
    {
      id: "auto-ev", cat: "21-500", title: "EV Cargo Auto", image: "/trucks/E-Loader.webp", capacity: "500 kg", dimensions: "5.5 x 4.5 x 4 ft", ideal: "Local shops and urban logistics where an EV is available.", tag: "Electric Option", tagColor: "bg-emerald-100 text-emerald-800 border-emerald-200"
    },

    // 501-850kg
    {
      id: "ace-standard", cat: "501-850", title: "Tata Ace (Chota Hathi)", image: "/trucks/Tata Ace.webp", capacity: "850 kg", dimensions: "7 x 4.8 x 4.8 ft", ideal: "Furniture, commercial goods, hardware.", tag: "Versatile", tagColor: "bg-blue-100 text-blue-800 border-blue-200"
    },
    {
      id: "super-carry", cat: "501-850", title: "Maruti Super Carry", image: "/trucks/Tata Ace.webp", capacity: "740 kg", dimensions: "7.1 x 4.9 x 4.8 ft", ideal: "FMCG, hardware, textiles and local distribution.", tag: "Compact", tagColor: "bg-indigo-100 text-indigo-800 border-indigo-200"
    },
    {
      id: "ace-ht", cat: "501-850", title: "Tata Ace High Deck", image: "/trucks/Tata Ace.webp", capacity: "850 kg", dimensions: "7 x 4.8 x 6 ft", ideal: "Tall items, boxed goods and electronics.", tag: "Extra Height", tagColor: "bg-purple-100 text-purple-800 border-purple-200"
    },

    // 851-1500kg
    {
      id: "bolero", cat: "851-1500", title: "Bolero Pickup (1.5T)", image: "/trucks/Bolero-Pickup.webp", capacity: "1,500 kg", dimensions: "8.5 x 5 x 5 ft", ideal: "Machinery and building materials within declared limits.", tag: "Heavy Duty", tagColor: "bg-rose-100 text-rose-800 border-rose-200"
    },
    {
      id: "dost", cat: "851-1500", title: "Ashok Leyland Dost", image: "/trucks/Pickup.webp", capacity: "1,500 kg", dimensions: "8.8 x 5.2 x 5 ft", ideal: "Agricultural produce, crates and declared goods.", tag: "Spacious", tagColor: "bg-orange-100 text-orange-800 border-orange-200"
    },

    // 1501-3500kg+
    {
      id: "eicher-14", cat: "1501-3500", title: "Eicher 14ft (3.4 Ton)", image: "/trucks/14ft-Truck.webp", capacity: "3,400 kg", dimensions: "14 x 6 x 6.5 ft", ideal: "Bulk goods and larger moving inventories.", tag: "Enterprise", tagColor: "bg-slate-800 text-slate-100 border-slate-700"
    },
    {
      id: "canter-17", cat: "1501-3500", title: "Tata 407 / 17ft", image: "/trucks/17ft-Truck.webp", capacity: "4,000 kg", dimensions: "17 x 6.5 x 7 ft", ideal: "Factory supply, larger moves and pallets.", tag: "Larger Load", tagColor: "bg-red-100 text-red-800 border-red-200"
    }
  ]

  const getRecommendedCategory = (weight) => {
    if (weight <= 20) return "0-20"
    if (weight <= 500) return "21-500"
    if (weight <= 850) return "501-850"
    if (weight <= 1500) return "851-1500"
    return "1501-3500"
  }

  const activeCategory = getRecommendedCategory(filterWeight)
  const displayedVehicles = fleet.filter(v => v.cat === activeCategory)

  const getEstimatedPrice = () => {
    let base = 0;
    let perKm = 0;
    if (filterWeight <= 20) { base = 49; perKm = 10; }
    else if (filterWeight <= 500) { base = 149; perKm = 14; }
    else if (filterWeight <= 850) { base = 249; perKm = 18; }
    else if (filterWeight <= 1500) { base = 399; perKm = 22; }
    else { base = 699; perKm = 30; }

    const multiplier = filterDistance > 50 ? 0.9 : 1.0; 
    const minPrice = Math.floor((base + (filterDistance * perKm * multiplier)) * 0.95);
    const maxPrice = Math.floor((base + (filterDistance * perKm * multiplier)) * 1.15);
    
    return `₹${minPrice} - ₹${maxPrice}`;
  }

  const handleSelect = (vehicleId) => {
    let category = "truck"
    if (vehicleId.includes("bike")) category = "bike"
    if (vehicleId === "movers") category = "movers"
    
    onSelectVehicle(category)
  }

  return (
    <section id="services" className="py-24 bg-brand-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-brand-100 text-brand-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-brand-200">
            <Sparkles size={14} className="text-brand-500" />
            <span>Versatile Fleet</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
            Our Transport Fleet in {currentCity.name} For Every Business &amp; Shifting Need
          </h2>
          <div className="w-20 h-1.5 bg-brand-500 mx-auto rounded-full"></div>
          <p className="text-slate-600 font-medium text-lg sm:text-xl">
            Compare indicative load capacities across {currentCity.name} and {currentCity.state || "India"}, then enter the route and goods declaration to check current serviceability and pricing.
          </p>
        </div>

        {/* Interactive Estimator Widget (Unified Card) */}
        <div className="max-w-5xl mx-auto mb-20 bg-white rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Left Column: Dialers */}
          <div className="p-6 sm:p-8 lg:p-10 lg:w-[55%] flex flex-col justify-center relative">
            <h3 className="font-extrabold text-2xl sm:text-3xl text-slate-900 mb-2">Cargo & Route Estimator</h3>
            <p className="text-sm font-medium text-slate-500 mb-8 sm:mb-10">Slide to match your load and distance.</p>
            
            {/* Weight Dialer */}
            <div className="mb-8 sm:mb-10">
              <div className="flex justify-between items-end mb-4">
                <span className="font-bold text-slate-700 text-xs sm:text-sm uppercase tracking-widest flex items-center gap-2">
                  <Dumbbell size={16} className="text-brand-500" /> Weight
                </span>
                <span className="bg-slate-50 text-slate-900 font-black text-base sm:text-lg px-4 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                  {filterWeight} kg
                </span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="3500" 
                step="10" 
                value={filterWeight} 
                onChange={(e) => setFilterWeight(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-brand-500 mb-2"
              />
              <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase px-1">
                <span>1 kg</span>
                <span>3500+ kg</span>
              </div>
            </div>

            {/* Distance Dialer */}
            <div className="mb-6">
              <div className="flex justify-between items-end mb-4">
                <span className="font-bold text-slate-700 text-xs sm:text-sm uppercase tracking-widest flex items-center gap-2">
                  <Navigation size={16} className="text-brand-500" /> Distance
                </span>
                <span className="bg-slate-50 text-slate-900 font-black text-base sm:text-lg px-4 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                  {filterDistance} km
                </span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="500" 
                step="1" 
                value={filterDistance} 
                onChange={(e) => setFilterDistance(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-brand-500 mb-2"
              />
              <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase px-1">
                <span>1 km</span>
                <span>500 km</span>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-8 pt-6 border-t-2 border-slate-50 flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest">Recommended Vehicles</span>
              <span className="text-xs sm:text-sm font-black text-brand-700 bg-brand-50 px-3 sm:px-4 py-1.5 rounded-full border border-brand-100">
                {displayedVehicles.length} Options
              </span>
            </div>
          </div>

          {/* Right Column: Price Result (Light Panel) */}
          <div className="lg:w-[45%] bg-gradient-to-br from-brand-50/50 to-white text-slate-900 p-8 sm:p-10 flex flex-col justify-center items-center text-center relative border-t lg:border-t-0 lg:border-l border-slate-100">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-100/40 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="bg-white border border-brand-200 text-brand-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-1.5 z-10 shadow-sm">
              <Sparkles size={12} className="text-brand-500" /> Estimated Fare
            </div>
            
            <h4 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tighter whitespace-nowrap z-10">
              {getEstimatedPrice()}
            </h4>
            
            <p className="text-slate-600 text-sm font-medium mb-8 sm:mb-10 leading-relaxed z-10 max-w-[260px]">
              Dynamic pricing based on <strong className="text-slate-900">{filterDistance}km</strong> distance and up to <strong className="text-slate-900">{filterWeight}kg</strong> load capacity.
            </p>
            
            <button 
              onClick={() => handleSelect(displayedVehicles[0].id)}
              className="w-full max-w-[280px] bg-brand-600 hover:bg-brand-700 text-white font-black text-sm py-4 px-4 rounded-xl transition-all shadow-lg shadow-brand-500/30 hover:-translate-y-0.5 z-10 uppercase tracking-widest"
            >
              Get Exact Quote
            </button>

            {/* Zero Commission Banner inside the light panel */}
            <div className="mt-8 z-10 w-full pt-6 border-t border-slate-200">
              <span className="flex items-center justify-center gap-2 text-emerald-600 text-[11px] sm:text-xs font-black uppercase tracking-widest">
                <BadgeCent size={16} />
                0 - 5% Commission Charges
              </span>
            </div>
          </div>
        </div>

        {/* Fleet Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedVehicles.map((vehicle) => {
            return (
              <div 
                key={vehicle.id} 
                className="group relative bg-white border-2 border-slate-200 hover:border-brand-500 rounded-[2rem] p-8 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-2 flex flex-col justify-between animate-in fade-in slide-in-from-bottom-8"
              >
                <div>
                  {/* Tag */}
                  <span className={`absolute top-6 right-6 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border z-10 ${vehicle.tagColor}`}>
                    {vehicle.tag}
                  </span>

                  {/* High-quality 3D Image placeholder space */}
                  {/* Changed background to white and removed mix-blend to solve artifacting on solid white images */}
                  <div className="w-full mb-6 bg-slate-50 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={vehicle.image}
                      alt={vehicle.title}
                      width="640"
                      height="360"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto"
                    />
                  </div>

                  <h3 className="text-2xl font-display font-extrabold mb-2 text-slate-900 group-hover:text-brand-600 transition-colors">
                    {vehicle.title}
                  </h3>

                  {/* Vehicle Stats */}
                  <div className="grid grid-cols-2 gap-4 my-6 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1.5">
                        <Dumbbell size={12} className="text-brand-500" /> Capacity
                      </span>
                      <span className="text-base font-black text-slate-800 mt-1">{vehicle.capacity}</span>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest flex items-center gap-1.5">
                        <Navigation size={12} className="text-brand-500" /> Dimensions
                      </span>
                      <span className="text-base font-black text-slate-800 mt-1">{vehicle.dimensions}</span>
                    </div>
                  </div>

                  {/* Pricing is calculated by the live pricing engine for the submitted route and load. */}
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">Pricing</span>
                    <span className="text-lg font-black text-slate-900">Route and load based</span>
                  </div>

                  {/* Description */}
                  <div className="text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-5 text-left mb-6">
                    <p className="font-bold text-slate-900 text-xs uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <ShieldAlert size={14} className="text-amber-500" /> Ideal For
                    </p>
                    <p className="text-slate-600 font-medium text-sm">{vehicle.ideal}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleSelect(vehicle.id)}
                  className="w-full font-bold text-sm py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn cursor-pointer bg-slate-900 text-white shadow-xl hover:bg-brand-600 hover:shadow-brand-500/30"
                >
                  <BadgeCent size={18} />
                  <span className="tracking-wide">Select {vehicle.title.split(' ')[0]}</span>
                </button>
              </div>
            )
          })}

          {/* Packers & Movers Dedicated Card */}
          <div 
            className="relative bg-slate-900 border-2 border-slate-800 hover:border-emerald-500 rounded-[2rem] p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 flex flex-col justify-between hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8"
          >
            <div>
              <span className="absolute top-6 right-6 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 z-10">
                Premium Service
              </span>

              <div className="w-full h-48 mb-6 bg-slate-800/50 rounded-2xl flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <Sparkles size={80} className="text-emerald-500/40 group-hover:text-emerald-400 transition-colors duration-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              </div>

              <h3 className="text-2xl font-display font-extrabold text-white mb-2 tracking-wide">
                Packers & Movers
              </h3>

              <div className="grid grid-cols-2 gap-4 my-6 bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                    Full Shifting
                  </span>
                  <span className="text-base font-black text-emerald-400 mt-1">End-to-End</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                    Packaging
                  </span>
                  <span className="text-base font-black text-emerald-400 mt-1">Multi-Layered</span>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Pricing</span>
                <span className="text-lg font-black text-white">Quoted for your move</span>
              </div>

              <div className="text-slate-300 text-sm leading-relaxed border-t border-slate-800 pt-5 text-left mb-6">
                <p className="font-bold text-emerald-400 text-xs uppercase tracking-widest mb-2">
                  What's Included:
                </p>
                <p className="text-slate-300 font-medium text-sm">
                  Tell us the inventory, floors, access conditions, route, packing requirement, and preferred schedule. The confirmed scope is stated in your quote.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleSelect("movers")}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-sm py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-emerald-500/20"
            >
              <Sparkles size={18} />
              <span className="tracking-wide">Book Shifting Service</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}
