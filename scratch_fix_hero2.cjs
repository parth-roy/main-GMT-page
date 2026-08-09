
const fs = require("fs");
let content = fs.readFileSync("src/components/truck/TruckHero.jsx", "utf-8");

const badBlock = `{/* Estimate Result Modal */}
      {showResult && estimateResult && (
        {/* Global City Selector Modal */}
      <CitySelectorModal
        isOpen={cityOpen}
        onClose={() => setCityOpen(false)}
      />

      <EstimateResultModal
          isOpen={showResult}
          onClose={() => setShowResult(false)}
          estimateData={estimateResult}
        />
      )}
    </>
  )
}`;

const goodBlock = `      {/* Global City Selector Modal */}
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
}`;

content = content.replace(badBlock, goodBlock);
fs.writeFileSync("src/components/truck/TruckHero.jsx", content);
console.log("Fixed TruckHero syntax");

