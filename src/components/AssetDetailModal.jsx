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

  const formatCurrency = (num) => {
    if (num === null || num === undefined) return "-";
    const n = Number(num);
    if (Number.isNaN(n)) return "-";
    return n.toLocaleString("id-ID");
  };

  const locationMaster = asset.location_id
    ? locations.find((l) => l.id === asset.location_id)
    : null;

  const category = asset?.category_id
    ? categories?.find((c) => c.id === asset.category_id)
    : null;


  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start gap-4 mb-4">
          <div>
            <h3 className="text-xl font-semibold">{asset.name}</h3>
            <p className="text-sm text-slate-500">Kode: {asset.code}</p>
            <p className="text-sm text-slate-500">
              Kategori: {category
                ? category.code
                  ? `${category.name} (${category.code})`
                  : category.name
                : "-"}
            </p>
            <p className="text-sm text-slate-500">
              Lokasi: {locationMaster ? locationMaster.name : "-"}
            </p>
            <p className="text-sm text-slate-500">
              Detail lokasi: {asset.location || "-"}
            </p>

            <p className="text-sm text-slate-500">
              Kondisi: {asset.condition || "-"}
            </p>
            <p className="text-sm text-slate-500">
              Status: {asset.status || "-"}
            </p>
            <p className="text-sm text-slate-500">
              Sumber dana: {funding ? funding.name : "-"}
            </p>
            <p className="text-sm text-slate-500">
              Nilai aset: Rp {formatCurrency(asset.value)}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            {asset.photo_url && (
              <img
                src={`${API_BASE_URL}${asset.photo_url}`}
                alt={asset.name}
                className="w-32 h-32 object-cover rounded border"
              />
            )}
            <QRCode value={asset.code} size={96} />
          </div>
        </div>

        <h4 className="text-sm font-semibold mb-2">
          Riwayat peminjaman aset ini
        </h4>
        {assetLoans.length === 0 ? (
          <p className="text-xs text-slate-400 mb-2">
            Belum pernah dipinjam.
          </p>
        ) : (
          <div className="overflow-x-auto mb-2">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Peminjam</th>
                  <th className="text-left p-2">Dipinjam</th>
                  <th className="text-left p-2">Jatuh Tempo</th>
                  <th className="text-left p-2">Dikembalikan</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {assetLoans.map((loan) => (
                  <tr key={loan.id} className="border-b">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-3 text-right">
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm bg-slate-800 text-white rounded"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssetDetailModal;
