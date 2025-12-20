// src/components/AssetTable.jsx
import QRCode from "react-qr-code";
import { API_BASE_URL } from "../api";
import { useEffect, useState } from "react";

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
  onBulkPrintQr,
  onEdit,
  onDelete,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);
  
  // STATE MODAL DELETE
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    asset: null,
  });

  // STATE TOAST (NOTIFIKASI)
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Fungsi Helper tampilkan toast
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    // Hilang otomatis setelah 3 detik
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    const onDocClick = () => setOpenMenuId(null);
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

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

  const handlePrintSingle = (asset) => onPrintQr?.(asset);
  const handleBulkPrint = () => onBulkPrintQr?.();

  // 1. BUKA MODAL DELETE
  const handleDeleteClick = (asset) => {
    setDeleteModal({ open: true, asset });
  };

  // 2. EKSEKUSI HAPUS (DIPERBAIKI)
  const handleConfirmDelete = async () => {
    if (!deleteModal.asset) return;
    
    try {
      await onDelete?.(deleteModal.asset);
      
      // SUKSES: Tutup modal & Tampilkan Toast Hijau
      setDeleteModal({ open: false, asset: null });
      showToast("Berhasil menghapus aset.", "success");

    } catch (err) {
      // GAGAL: Tutup modal & Tampilkan Toast Merah
      setDeleteModal({ open: false, asset: null });
      showToast(err?.message || "Gagal menghapus aset.", "error");
    }
  };

  return (
    <>
      <div className="bg-white shadow-sm border border-slate-100 rounded-xl overflow-hidden relative">
        
        {/* TOAST NOTIFICATION (Fixed Position) */}
        {toast.show && (
            <div className={`fixed top-5 right-5 z-[60] px-4 py-3 rounded-lg shadow-lg border flex items-center gap-2 animate-bounce-in transition-all ${
                toast.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
                <span className="text-xl">
                    {toast.type === 'success' ? '✅' : '❌'}
                </span>
                <span className="text-sm font-medium">{toast.message}</span>
            </div>
        )}

        {/* Header + tombol bulk print */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Daftar Aset</h2>
          {assets.length > 0 && (
            <button
              type="button"
              onClick={handleBulkPrint}
              className="px-3 py-1.5 text-xs font-medium rounded border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              🖨️ Print QR semua
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#009846] border-t-transparent"></div>
              <p className="mt-2 text-slate-500 text-sm">Memuat data aset...</p>
          </div>
        ) : assets.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
              <p>Belum ada aset yang ditemukan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm border-collapse">
              {/* HEADER TABEL KHAS SF (Hijau Lembut) */}
              <thead className="bg-[#009846]/5 border-b border-[#009846]/10">
                <tr>
                  <th className="text-left p-3 font-bold text-[#007033] whitespace-nowrap">Nama</th>
                  <th className="text-left p-3 font-bold text-[#007033] whitespace-nowrap">Kode</th>
                  <th className="text-left p-3 font-bold text-[#007033] whitespace-nowrap">Kategori</th>
                  <th className="text-left p-3 font-bold text-[#007033] whitespace-nowrap">Lokasi</th>
                  <th className="text-left p-3 font-bold text-[#007033] whitespace-nowrap">Detail Lokasi</th>
                  <th className="text-left p-3 font-bold text-[#007033] whitespace-nowrap">Kondisi</th>
                  <th className="text-left p-3 font-bold text-[#007033] whitespace-nowrap">Status</th>
                  <th className="text-left p-3 font-bold text-[#007033] whitespace-nowrap">Sumber Dana</th>
                  <th className="text-left p-3 font-bold text-[#007033] whitespace-nowrap">Nilai (Rp)</th>
                  <th className="text-left p-3 font-bold text-[#007033] whitespace-nowrap w-28">Foto</th>
                  <th className="text-left p-3 font-bold text-[#007033] whitespace-nowrap w-24">QR</th>
                  <th className="text-right p-3 font-bold text-[#007033] whitespace-nowrap w-32">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {assets.map((a) => {
                  const qrText = buildQrText(a);

                  return (
                    <tr key={a.id} className="align-top hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-medium text-slate-700">{a.name}</td>
                      <td className="p-3 font-mono text-slate-500 text-xs">{a.code}</td>
                      <td className="p-3">{getCategoryName(a.category_id)}</td>
                      <td className="p-3">{getLocationName(a.location_id)}</td>
                      <td className="p-3 text-slate-500">{a.location || "-"}</td>
                      <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] border ${
                              a.condition === 'baik' ? 'bg-green-50 text-green-700 border-green-200' :
                              a.condition === 'rusak' ? 'bg-red-50 text-red-700 border-red-200' : 
                              'bg-gray-50 text-gray-600 border-gray-200'
                          }`}>
                              {a.condition || "-"}
                          </span>
                      </td>
                      <td className="p-3">
                          {a.status === 'borrowed' ? (
                              <span className="text-orange-600 font-medium">Dipinjam</span>
                          ) : (
                              <span className="text-slate-500">Tersedia</span>
                          )}
                      </td>
                      <td className="p-3">{getFundingName(a.funding_source_id)}</td>
                      <td className="p-3 text-slate-600">Rp {formatCurrency(a.value)}</td>

                      {/* FOTO */}
                      <td className="p-3">
                        <div className="flex flex-col items-center gap-2">
                          {a.photo_url ? (
                            <button
                              type="button"
                              onClick={() =>
                                onPreviewPhoto?.(`${API_BASE_URL}${a.photo_url}`)
                              }
                              className="w-16 h-16 rounded-lg border border-slate-200 overflow-hidden hover:opacity-80 transition-opacity bg-slate-100"
                            >
                              <img
                                src={`${API_BASE_URL}${a.photo_url}`}
                                alt={a.name}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ) : (
                            <div className="w-16 h-16 flex items-center justify-center border border-slate-200 rounded-lg text-[10px] text-gray-400 bg-slate-50">
                              No IMG
                            </div>
                          )}

                          {/* Tombol Upload */}
                          <label className="cursor-pointer text-center w-full px-2 py-1 rounded text-[10px] font-medium border border-[#F68D2E] text-[#F68D2E] bg-orange-50 hover:bg-[#F68D2E] hover:text-white transition-all">
                            Upload Foto
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => onUploadPhoto?.(a.id, e)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </td>

                      {/* QR */}
                      <td className="p-3">
                        <div className="flex flex-col items-center gap-1">
                          <div className="inline-block bg-white p-1 rounded border border-slate-200">
                            <QRCode value={qrText} size={48} />
                          </div>
                          <span className="text-[9px] text-slate-400 text-center leading-tight mt-1">
                            Scan info
                          </span>
                        </div>
                      </td>

                      {/* AKSI */}
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => onShowDetail?.(a)}
                            className="px-2 py-1 text-[10px] font-medium rounded border border-slate-300 text-slate-600 bg-white hover:bg-slate-50"
                          >
                            Detail
                          </button>

                          {a.status === "available" ? (
                            <button
                              type="button"
                              onClick={() => onBorrow?.(a)}
                              className="px-2 py-1 text-[10px] font-medium rounded bg-[#009846] text-white hover:bg-[#007033] shadow-sm transition-colors"
                            >
                              Pinjam
                            </button>
                          ) : a.status === "borrowed" ? (
                            <button
                              type="button"
                              onClick={() => onReturn?.(a)}
                              className="px-2 py-1 text-[10px] font-medium rounded bg-[#F68D2E] text-white hover:bg-[#d8761e] shadow-sm transition-colors"
                            >
                              Kembalikan
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-300">—</span>
                          )}

                          {/* More menu */}
                          <div className="relative" onClick={(e) => e.stopPropagation()}>
                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenuId(openMenuId === a.id ? null : a.id)
                              }
                              className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-100"
                              title="Aksi lainnya"
                            >
                              ⋯
                            </button>

                            {openMenuId === a.id && (
                              <div className="absolute right-0 mt-1 w-36 rounded-lg border border-slate-100 bg-white shadow-xl z-20 overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    handlePrintSingle(a);
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#009846]"
                                >
                                  🖨️ Print QR
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    onEdit?.(a);
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                                >
                                  ✏️ Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    handleDeleteClick(a);
                                  }}
                                  className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 border-t border-slate-50"
                                >
                                  🗑️ Hapus
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 🔹 MODAL KONFIRMASI HAPUS 🔹 */}
      {deleteModal.open && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setDeleteModal({ open: false, asset: null })}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Merah */}
            <div className="bg-red-50 p-4 flex items-center gap-3 border-b border-red-100">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-700">Hapus Aset?</h3>
                <p className="text-xs text-red-500">Tindakan ini tidak bisa dibatalkan instan.</p>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 text-sm text-slate-600">
              <p>Apakah Anda yakin ingin menghapus aset:</p>
              <div className="mt-3 bg-slate-50 p-3 rounded border border-slate-200">
                <div className="font-bold text-slate-800">{deleteModal.asset?.name}</div>
                <div className="font-mono text-xs text-slate-500 mt-1">{deleteModal.asset?.code}</div>
              </div>
              <p className="mt-3 text-xs text-slate-400">
                *Data akan dipindahkan ke sampah (Soft Delete) dan tidak muncul di daftar aktif.
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 p-4 border-t bg-slate-50">
              <button
                type="button"
                onClick={() => setDeleteModal({ open: false, asset: null })}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 shadow-md flex items-center gap-2"
              >
                🗑️ Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AssetTable;