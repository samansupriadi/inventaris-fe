import QRCode from "react-qr-code";
import { API_BASE_URL } from "../api";

function AssetTable({
  assets,
  loading,
  onUploadPhoto,
  onBorrow,
  onReturn,
  onShowDetail,
  onPreviewPhoto,
  fundingSources,
  locations,
  categories, 
}) {
  const getFundingName = (id) => {
    if (!id) return "-";
    const f = fundingSources?.find((x) => x.id === id);
    return f ? f.name : "-";
  };

  const formatCurrency = (num) => {
    if (num === null || num === undefined) return "-";
    const n = Number(num);
    if (Number.isNaN(n)) return "-";
    return n.toLocaleString("id-ID");
  };

  const getLocationName = (id) => {
    if (!id) return "-";
    const loc = locations?.find((x) => x.id === id);
    return loc ? loc.name : "-";
  };

  const getCategoryName = (id) => {
    if (!id) return "-";
    const cat = categories?.find((x) => x.id === id);
    return cat ? (cat.code ? `${cat.name} (${cat.code})` : cat.name) : "-";
  };



  return (
    <div className="bg-white shadow rounded-xl p-4">
      <h2 className="text-xl font-semibold mb-3">Daftar Aset</h2>

      {loading ? (
        <p className="text-gray-500">Memuat...</p>
      ) : assets.length === 0 ? (
        <p className="text-gray-400">Belum ada aset</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Nama</th>
                <th className="text-left p-2">Kode</th>
                <th className="text-left p-2">Kategori</th>
                <th className="text-left p-2">Lokasi</th>
                <th className="text-left p-2">Detail</th>
                <th className="text-left p-2">Kondisi</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Sumber Dana</th>
                <th className="text-left p-2">Nilai (Rp)</th>
                <th className="text-left p-2">Foto</th>
                <th className="text-left p-2">QR</th>
                <th className="text-left p-2">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {assets.map((a) => (
                <tr key={a.id} className="border-b align-top">
                  <td className="p-2">{a.name}</td>
                  <td className="p-2">{a.code}</td>
                  <td className="p-2">{getCategoryName(a.category_id)}</td>
                  <td className="p-2">{getLocationName(a.location_id)}</td>
                  <td className="p-2">{a.location || "-"}</td>
                  <td className="p-2">{a.condition || "-"}</td>
                  <td className="p-2">{a.status || "available"}</td>
                  <td className="p-2">
                    {getFundingName(a.funding_source_id)}
                  </td>
                  <td className="p-2">
                    Rp {formatCurrency(a.value)}
                  </td>

                  {/* FOTO */}
                  <td className="p-2">
                    <div className="flex flex-col gap-2">
                      {a.photo_url ? (
                        <button
                          type="button"
                          onClick={() =>
                            onPreviewPhoto(`${API_BASE_URL}${a.photo_url}`)
                          }
                          className="w-20 h-20 border rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <img
                            src={`${API_BASE_URL}${a.photo_url}`}
                            alt={a.name}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ) : (
                        <div className="w-20 h-20 flex items-center justify-center border rounded text-xs text-gray-400">
                          no photo
                        </div>
                      )}

                      <label className="cursor-pointer text-center bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 w-max">
                        Upload Foto
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => onUploadPhoto(a.id, e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </td>

                  {/* QR */}
                  <td className="p-2">
                    <div className="inline-block bg-white p-1 rounded shadow-sm">
                      <QRCode
                        value={a.code}
                        size={64}
                        style={{ height: "64px", width: "64px" }}
                      />
                    </div>
                  </td>

                  {/* AKSI */}
                  <td className="p-2 space-y-1">
                    <button
                      type="button"
                      onClick={() => onShowDetail(a)}
                      className="block w-full px-3 py-1 text-xs rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
                    >
                      Detail
                    </button>

                    {a.status === "available" && (
                      <button
                        type="button"
                        onClick={() => onBorrow(a)}
                        className="block w-full px-3 py-1 text-xs rounded bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        Pinjam
                      </button>
                    )}

                    {a.status === "borrowed" && (
                      <button
                        type="button"
                        onClick={() => onReturn(a)}
                        className="block w-full px-3 py-1 text-xs rounded bg-orange-600 text-white hover:bg-orange-700"
                      >
                        Kembalikan
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AssetTable;
