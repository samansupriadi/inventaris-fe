// src/components/QrPrintSheet.jsx
import QRCode from "react-qr-code";

function QrPrintSheet({
  assets,
  fundingSources,
  locations, // dipakai untuk payload QR
  categories, // dipakai untuk payload QR
  onBack,
}) {
  if (!assets || assets.length === 0) return null;

  const findFunding = (id) =>
    id ? fundingSources.find((f) => f.id === id) || null : null;

  const findLocation = (id) =>
    id ? locations.find((l) => l.id === id) || null : null;

  const findCategory = (id) =>
    id ? categories.find((c) => c.id === id) || null : null;

  // Payload QR (tetap lengkap)
  const buildQrPayload = (asset) => {
    const funding = findFunding(asset.funding_source_id);
    const location = findLocation(asset.location_id);
    const category = findCategory(asset.category_id);

    const payload = {
      name: asset.name,
      code: asset.code,
      category: category ? category.name : null,
      category_code: category ? category.code : null,
      location: location ? location.name : null,
      detail_location: asset.location || null,
      condition: asset.condition || null,
      status: asset.status || null,
      funding_source: funding ? funding.name : null,
    };

    return JSON.stringify(payload);
  };

  return (
    <div className="qr-print-root max-w-5xl mx-auto">
      {/* PRINT CSS (isolasi: hanya QrPrintSheet yang ke-print) */}
      <style>{`
        @page { size: A4; margin: 10mm; }

        @media print {
          html, body { height: auto !important; }
          body { background: #fff !important; }

          /* Hide ALL by default */
          body * { visibility: hidden !important; }

          /* Show ONLY this component */
          .qr-print-root,
          .qr-print-root * { visibility: visible !important; }

          /* Place printable area at top-left */
          .qr-print-root { position: absolute; left: 0; top: 0; width: 100%; }

          /* No toolbar on print */
          .qr-no-print { display: none !important; }

          /* Remove borders/shadows that look ugly on paper (optional) */
          .qr-label { box-shadow: none !important; }
        }
      `}</style>

      {/* Toolbar (non-print) */}
      <div className="qr-no-print flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Print QR Aset</h1>
          <p className="text-xs text-slate-500 mt-1">
            QR menyimpan info lengkap aset, teks label: nama, kode, sumber.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onBack}
            className="px-3 py-2 text-xs rounded border bg-white hover:bg-slate-50"
          >
            Kembali
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-2 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Print
          </button>
        </div>
      </div>

      {/* Grid label */}
      {/* Ukuran label fixed biar rapi saat print */}
      <div
        className="
          grid gap-3
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
        "
      >
        {assets.map((asset) => {
          const funding = findFunding(asset.funding_source_id);
          const sourceLabel = funding ? funding.name.toUpperCase() : "________";

          return (
            <div
              key={asset.id}
              className="
                qr-label
                border rounded-lg
                flex flex-col items-center text-center
                bg-white
              "
              style={{
                // ukuran label (silakan ubah kalau mau lebih besar/kecil)
                width: "48mm",
                height: "48mm",
                padding: "6mm",
                pageBreakInside: "avoid",
                breakInside: "avoid",
              }}
            >
              <div style={{ width: "26mm", height: "26mm" }}>
                <QRCode
                  value={buildQrPayload(asset)}
                  size={256} // besar internal, di-scale oleh container
                  style={{ width: "100%", height: "100%" }}
                />
              </div>

              <div className="mt-2 leading-tight w-full">
                <div
                  className="font-semibold"
                  style={{
                    fontSize: "10px",
                    lineHeight: "12px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={asset.name}
                >
                  {asset.name}
                </div>

                <div
                  className="font-mono text-slate-700"
                  style={{
                    fontSize: "9px",
                    lineHeight: "11px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={asset.code}
                >
                  {asset.code}
                </div>

                <div
                  className="text-slate-500 uppercase"
                  style={{ fontSize: "8px", marginTop: "4px" }}
                >
                  ASSET OF {sourceLabel}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QrPrintSheet;
