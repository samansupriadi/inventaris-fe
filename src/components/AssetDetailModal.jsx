import QRCode from "react-qr-code";
import { API_BASE_URL } from "../api";

function AssetDetailModal({
  asset,
  loans,
  fundingSources,
  locations,
  categories = [],
  onClose,
}) {
  if (!asset) return null;

  const assetLoans = loans.filter((l) => l.asset_id === asset.id);

  const funding = asset.funding_source_id
    ? fundingSources.find((f) => f.id === asset.funding_source_id)
    : null;

  const locationMaster = asset.location_id
    ? locations.find((l) => l.id === asset.location_id)
    : null;

  const category = asset?.category_id
    ? categories?.find((c) => c.id === asset.category_id)
    : null;

  const formatCurrency = (num) => {
    if (num === null || num === undefined) return "-";
    const n = Number(num);
    if (Number.isNaN(n)) return "-";
    return n.toLocaleString("id-ID");
  };

  const fullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}${path}`;
  };

  // ==== PIC / Peminjam terakhir ====
  // Prioritas: kalau backend kirim asset.last_borrower, pakai itu.
  // Kalau tidak, ambil peminjam terakhir dari riwayat peminjaman.
  let lastBorrower = asset.last_borrower || "-";
  if (!asset.last_borrower && assetLoans.length > 0) {
    const sorted = [...assetLoans].sort(
      (a, b) => new Date(b.borrowed_at) - new Date(a.borrowed_at)
    );
    lastBorrower = sorted[0].borrower || "-";
  }

  // ==== QR payload (isi teks QR) ====
  const buildQrPayload = () => {
    const fundingName = funding ? funding.name : "-";

    const lines = [
      `Nama: ${asset.name}`,
      `Kode: ${asset.code}`,
      `Kondisi: ${asset.condition || "-"}`,
      `Status: ${asset.status || "-"}`,
      `Sumber Dana: ${fundingName}`,
      `PIC Terakhir: ${lastBorrower}`,
    ];

    return lines.join("\n");
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-5xl w-full p-6 max-h-[90vh] overflow-y-auto text-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER: INFO + FOTO + QR */}
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-4">
          {/* Info teks */}
          <div className="flex-1 space-y-1">
            <h3 className="text-xl font-semibold">{asset.name}</h3>
            <p className="text-xs text-slate-500">
              Kode aset: <span className="font-mono">{asset.code}</span>
            </p>

            <p className="text-xs text-slate-500">
              Kategori:{" "}
              {category
                ? category.code
                  ? `${category.name} (${category.code})`
                  : category.name
                : "-"}
            </p>
            <p className="text-xs text-slate-500">
              Lokasi induk: {locationMaster ? locationMaster.name : "-"}
            </p>
            <p className="text-xs text-slate-500">
              Detail lokasi: {asset.location || "-"}
            </p>
            <p className="text-xs text-slate-500">
              Kondisi saat ini: {asset.condition || "-"}
            </p>
            <p className="text-xs text-slate-500">
              Status: {asset.status || "-"}
            </p>
            <p className="text-xs text-slate-500">
              Sumber dana: {funding ? funding.name : "-"}
            </p>
            <p className="text-xs text-slate-500">
              Nilai aset: Rp {formatCurrency(asset.value)}
            </p>
            <p className="text-xs text-slate-500">
              PIC / peminjam terakhir: {lastBorrower}
            </p>
          </div>

          {/* Foto & QR */}
          <div className="flex flex-col items-center gap-3 w-full md:w-60">
            {/* Foto aset */}
            <div className="w-full">
              <p className="text-[11px] text-slate-500 mb-1">
                Foto aset
              </p>
              {asset.photo_url ? (
                <img
                  src={fullUrl(asset.photo_url)}
                  alt={asset.name}
                  className="w-full h-32 object-cover rounded border"
                />
              ) : (
                <div className="w-full h-32 border rounded flex items-center justify-center text-[11px] text-slate-400">
                  Tidak ada foto aset
                </div>
              )}
            </div>

            {/* Foto kwitansi */}
            <div className="w-full">
              <p className="text-[11px] text-slate-500 mb-1">
                Foto kwitansi pembelian
              </p>
              {asset.receipt_url ? (
                <img
                  src={fullUrl(asset.receipt_url)}
                  alt={`Kwitansi ${asset.name}`}
                  className="w-full h-24 object-cover rounded border"
                />
              ) : (
                <div className="w-full h-24 border rounded flex items-center justify-center text-[11px] text-slate-400">
                  Tidak ada kwitansi
                </div>
              )}
            </div>

            {/* QR Code */}
            <div className="mt-1 flex flex-col items-center gap-1">
              <QRCode value={buildQrPayload()} size={96} />
              <p className="text-[10px] text-slate-400 text-center">
                QR berisi info aset + PIC terakhir
              </p>
            </div>
          </div>
        </div>

        {/* RIWAYAT PEMINJAMAN */}
        <h4 className="text-sm font-semibold mb-2">
          Riwayat peminjaman aset ini
        </h4>

        {assetLoans.length === 0 ? (
          <p className="text-xs text-slate-400 mb-2">
            Belum pernah dipinjam.
          </p>
        ) : (
          <div className="overflow-x-auto mb-3">
            <table className="w-full text-[11px] md:text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Peminjam</th>
                  <th className="text-left p-2">Dipinjam</th>
                  <th className="text-left p-2">Jatuh Tempo</th>
                  <th className="text-left p-2">Dikembalikan</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">
                    Kondisi<br />Before / After
                  </th>
                  <th className="text-left p-2">
                    Foto<br />Before / After
                  </th>
                </tr>
              </thead>
              <tbody>
                {assetLoans.map((loan) => (
                  <tr key={loan.id} className="border-b align-top">
                    <td className="p-2">{loan.borrower}</td>
                    <td className="p-2">
                      {loan.borrowed_at
                        ? new Date(loan.borrowed_at).toLocaleString()
                        : "-"}
                    </td>
                    <td className="p-2">
                      {loan.due_date
                        ? new Date(loan.due_date).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-2">
                      {loan.returned_at
                        ? new Date(loan.returned_at).toLocaleString()
                        : "-"}
                    </td>
                    <td className="p-2">{loan.status}</td>

                    {/* Kondisi before / after */}
                    <td className="p-2">
                      <div>
                        <span className="font-semibold">Before:</span>{" "}
                        {loan.condition_before || "-"}
                      </div>
                      <div>
                        <span className="font-semibold">After:</span>{" "}
                        {loan.condition_after || "-"}
                      </div>
                    </td>

                    {/* Foto before / after */}
                    <td className="p-2">
                      <div className="flex gap-2">
                        {/* BEFORE */}
                        {loan.before_photo_url ? (
                          <a
                            href={fullUrl(loan.before_photo_url)}
                            target="_blank"
                            rel="noreferrer"
                            title="Lihat foto sebelum peminjaman"
                          >
                            <img
                              src={fullUrl(loan.before_photo_url)}
                              alt="Before"
                              className="w-10 h-10 object-cover rounded border"
                            />
                          </a>
                        ) : (
                          <div className="w-10 h-10 border rounded flex items-center justify-center text-[9px] text-slate-300">
                            -
                          </div>
                        )}

                        {/* AFTER */}
                        {loan.after_photo_url ? (
                          <a
                            href={fullUrl(loan.after_photo_url)}
                            target="_blank"
                            rel="noreferrer"
                            title="Lihat foto setelah dikembalikan"
                          >
                            <img
                              src={fullUrl(loan.after_photo_url)}
                              alt="After"
                              className="w-10 h-10 object-cover rounded border"
                            />
                          </a>
                        ) : (
                          <div className="w-10 h-10 border rounded flex items-center justify-center text-[9px] text-slate-300">
                            -
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-3 text-right">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs md:text-sm bg-slate-800 text-white rounded"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssetDetailModal;
