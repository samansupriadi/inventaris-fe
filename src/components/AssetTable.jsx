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
  onPrintQr,      
  onBulkPrintQr
}) {
  const getFundingName = (id) => {
    if (!id) return "-";
    const f = fundingSources?.find((x) => x.id === id);
    return f ? f.name : "-";
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

  const formatCurrency = (num) => {
    if (num === null || num === undefined) return "-";
    const n = Number(num);
    if (Number.isNaN(n)) return "-";
    return n.toLocaleString("id-ID");
  };

  // payload teks di dalam QR
  const buildQrText = (asset) => {
    const fundingName = getFundingName(asset.funding_source_id);
    const locationName = getLocationName(asset.location_id);
    const detailLocation = asset.location || "-";
    const condition = asset.condition || "-";
    const status = asset.status || "available";
    const pic =
      asset.last_borrower || asset.pic || asset.last_borrower_name || "-";

    return [
      `Nama: ${asset.name}`,
      `Kode: ${asset.code}`,
      `Kategori: ${getCategoryName(asset.category_id)}`,
      `Lokasi: ${locationName}`,
      `Detail lokasi: ${detailLocation}`,
      `Kondisi: ${condition}`,
      `Status: ${status}`,
      `Sumber dana: ${fundingName}`,
      `PIC: ${pic}`,
    ].join("\n");
  };

  const handlePrintSingle = (asset) => {
    const qrText = buildQrText(asset);
    if (onPrintQr) {
      onPrintQr(asset, qrText);
    } else {
      window.print();
    }
  };

  const handleBulkPrint = () => {
    if (onBulkPrintQr) {
      onBulkPrintQr(assets);
    } else {
      window.print();
    }
  };


  return (
    <div className="bg-white shadow rounded-xl p-4">
      {/* Header + tombol bulk print */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Daftar Aset</h2>
        {assets.length > 0 && (
          <button
            type="button"
            onClick={handleBulkPrint}
            className="px-3 py-1.5 text-xs rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Print QR semua
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Memuat...</p>
      ) : assets.length === 0 ? (
        <p className="text-gray-400 text-sm">Belum ada aset</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm border-collapse">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left p-2 whitespace-nowrap">Nama</th>
                <th className="text-left p-2 whitespace-nowrap">Kode</th>
                <th className="text-left p-2 whitespace-nowrap">Kategori</th>
                <th className="text-left p-2 whitespace-nowrap">Lokasi</th>
                <th className="text-left p-2 whitespace-nowrap">
                  Detail Lokasi
                </th>
                <th className="text-left p-2 whitespace-nowrap">Kondisi</th>
                <th className="text-left p-2 whitespace-nowrap">Status</th>
                <th className="text-left p-2 whitespace-nowrap">
                  Sumber Dana
                </th>
                <th className="text-left p-2 whitespace-nowrap">Nilai (Rp)</th>
                <th className="text-left p-2 whitespace-nowrap w-28">Foto</th>
                <th className="text-left p-2 whitespace-nowrap w-24">QR</th>
                <th className="text-left p-2 whitespace-nowrap w-28">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {assets.map((a) => {
                const qrText = buildQrText(a);

                return (
                  <tr
                    key={a.id}
                    className="border-b align-top hover:bg-slate-50"
                  >
                    <td className="p-2">{a.name}</td>
                    <td className="p-2 font-mono">{a.code}</td>
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
                      <div className="flex flex-col items-center gap-2">
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
                          <div className="w-20 h-20 flex items-center justify-center border rounded text-[10px] text-gray-400">
                            no photo
                          </div>
                        )}

                        <label className="cursor-pointer text-center bg-blue-600 text-white px-3 py-1 rounded text-[11px] hover:bg-blue-700 w-full">
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
                      <div className="flex flex-col items-center gap-1">
                        <div className="inline-block bg-white p-1 rounded shadow-sm">
                          <QRCode
                            value={qrText}
                            size={56} // agak kecil biar muat di barang
                            style={{ height: "56px", width: "56px" }}
                          />
                        </div>
                        <span className="text-[9px] text-slate-400 text-center leading-tight">
                          Scan info aset, lokasi &amp; PIC
                        </span>
                      </div>
                    </td>

                    {/* AKSI */}
                    <td className="p-2 space-y-1">
                      <button
                        type="button"
                        onClick={() => onShowDetail(a)}
                        className="block w-full px-3 py-1 text-[11px] rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
                      >
                        Detail
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePrintSingle(a)}
                        className="block w-full px-3 py-1 text-[11px] rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
                      >
                        Print QR
                      </button>

                      {a.status === "available" && (
                        <button
                          type="button"
                          onClick={() => onBorrow(a)}
                          className="block w-full px-3 py-1 text-[11px] rounded bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          Pinjam
                        </button>
                      )}

                      {a.status === "borrowed" && (
                        <button
                          type="button"
                          onClick={() => onReturn(a)}
                          className="block w-full px-3 py-1 text-[11px] rounded bg-orange-600 text-white hover:bg-orange-700"
                        >
                          Kembalikan
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AssetTable;
