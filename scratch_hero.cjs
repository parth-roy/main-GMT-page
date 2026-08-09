
const fs = require("fs");
let content = fs.readFileSync("src/components/Hero.jsx", "utf-8");

// Add imports
content = content.replace(
  `import { Link } from "react-router-dom"`,
  `import { Link, useParams } from "react-router-dom"\nimport CitySelectorModal from "./CitySelectorModal"`
);

// Add state
content = content.replace(
  `const [sliderValue, setSliderValue] = useState(10000)`,
  `const [sliderValue, setSliderValue] = useState(10000)\n  const [cityOpen, setCityOpen] = useState(false)\n  const { city: slug } = useParams()\n  const currentCity = slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ") : "Kolkata"`
);

// Update City: Kolkata string
const oldCityHtml = `            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm px-2 w-fit">
              <MapPin size={20} className="text-[#001f3f]" />
              <span>City: Kolkata</span>
            </div>`;

const newCityHtml = `            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm px-2 w-fit cursor-pointer hover:text-brand-600 transition-colors" onClick={() => setCityOpen(true)}>
              <MapPin size={20} className="text-brand-600" />
              <span>City: {currentCity}</span>
              <span className="text-xs text-brand-500 font-normal ml-1 underline underline-offset-2">Change</span>
            </div>`;

content = content.replace(oldCityHtml, newCityHtml);

// Append Modal
content = content.replace(
  `    </section>

      {/*  TRUST STRIP  */}`,
  `      <CitySelectorModal isOpen={cityOpen} onClose={() => setCityOpen(false)} />
    </section>

      {/*  TRUST STRIP  */}`
);

fs.writeFileSync("src/components/Hero.jsx", content);
console.log("Fixed Hero.jsx");

