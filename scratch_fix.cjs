
const fs = require("fs");
let content = fs.readFileSync("src/components/truck/TruckHero.jsx", "utf-8");

// Add import
content = content.replace(
  `import AddressAutocomplete from "../AddressAutocomplete"`,
  `import AddressAutocomplete from "../AddressAutocomplete"\nimport CitySelectorModal from "../CitySelectorModal"`
);

// Replace cityOpen block
const startStr = `{/* City Selector */}`;
const endStr = `            {/* Error Banner */}`;

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `{/* City Selector */}
            <div className="relative pb-2 border-b border-slate-100 mb-3">
              <button
                type="button"
                onClick={() => setCityOpen(true)}
                className="flex items-center gap-2 text-slate-900 font-bold text-sm cursor-pointer w-fit hover:text-brand-600 transition-colors"
              >
                <MapPin size={18} className="text-brand-600 shrink-0" />
                {cityDetecting ? (
                  <span className="flex items-center gap-1.5 text-slate-400 font-normal">
                    <Loader2 size={13} className="animate-spin" />
                    Detecting...
                  </span>
                ) : (
                  <span>{city}</span>
                )}
                <ChevronDown
                  size={14}
                  className="text-slate-400"
                />
              </button>
            </div>

`;
  content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
}

// Add Modal at end
content = content.replace(
  `      <EstimateResultModal`,
  `      {/* Global City Selector Modal */}
      <CitySelectorModal
        isOpen={cityOpen}
        onClose={() => setCityOpen(false)}
      />

      <EstimateResultModal`
);

fs.writeFileSync("src/components/truck/TruckHero.jsx", content);
console.log("Fixed TruckHero.jsx");

