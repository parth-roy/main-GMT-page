
const fs = require("fs");
let content = fs.readFileSync("src/components/truck/TruckHero.jsx", "utf-8");

const startStr = `{/* Estimate Result Modal */}`;
const startIndex = content.indexOf(startStr);

if (startIndex !== -1) {
  content = content.substring(0, startIndex) + `{/* Global City Selector Modal */}
      <CitySelectorModal
        isOpen={cityOpen}
        onClose={() => setCityOpen(false)}
      />

      {/* Estimate Result Modal */}
      {showResult && estimateResult && (
        <EstimateResultModal
          isOpen={showResult}
          onClose={() => setShowResult(false)}
          estimateData={estimateResult}
        />
      )}
    </>
  )
}
`;
  fs.writeFileSync("src/components/truck/TruckHero.jsx", content);
  console.log("Fixed TruckHero syntax completely");
}

