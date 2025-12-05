// src/components/QrPrintSheet.jsx
import QRCode from "react-qr-code";

function QrPrintSheet({
  assets,
  fundingSources,
  locations,   // masih dipakai untuk payload QR
  categories,  // masih dipakai untuk payload QR
  onBack,
}) {
  if (!assets || assets.length === 0) return null;

  const findFunding = (id) =>
    id ? fundingSources.find((f) => f.id === id) || null : null;

  const findLocation = (id) =>
    id ? locations.find((l) => l.id === id) || null : null;

  const findCategory = (id) =>
    id ? categories.find((c) => c.id === id) || null : null;

  // Payload yang disimpan di QR (tetap lengkap)
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

    // simpan sebagai JSON string
    return JSON.stringify(payload);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Toolbar non-print */}
      <div className="flex items-center justify-between mb-4 print:hidden">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            Print QR Aset
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            QR menyimpan info lengkap aset, tetapi teks yang tercetak hanya nama, kode, dan sumber.
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

      {/* Grid label QR – ini yang akan di-print */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4">
        {assets.map((asset) => {
          const funding = findFunding(asset.funding_source_id);
          const sourceLabel = funding
            ? funding.name.toUpperCase()
            : "________";

          return (
            <div
              key={asset.id}
              className="border rounded-lg p-2 flex flex-col items-center text-center"
            >
              <QRCode value={buildQrPayload(asset)} size={96} />

              <div className="mt-2 leading-tight">
                {/* Nama aset */}
                <div className="text-[11px] font-semibold">
                  {asset.name}
                </div>

                {/* Kode aset */}
                <div className="text-[10px] font-mono text-slate-700">
                  {asset.code}
                </div>

                {/* Hanya satu baris ini, tidak ada Lokasi/Kondisi/Status lagi */}
                <div className="text-[9px] text-slate-500 mt-1 uppercase">
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
