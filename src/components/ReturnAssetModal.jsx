import { useEffect, useRef, useState } from "react";

function ReturnAssetModal({ open, asset, loading, onClose, onSubmit }) {
  const [conditionAfter, setConditionAfter] = useState("baik");
  const [updateAssetLocation, setUpdateAssetLocation] = useState(true);
  const [photo, setPhoto] = useState(null);

  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setConditionAfter("baik");
    setUpdateAssetLocation(true);
    setPhoto(null);
  }, [open]);

  if (!open || !asset) return null;

  const handleBackdropMouseDown = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) onClose?.();
  };

  const handleSubmit = () => {
    onSubmit?.({
      condition_after: conditionAfter,
      update_asset_location: updateAssetLocation,
      photo,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        ref={modalRef}
        className="bg-white w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-xl"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold">
            Pengembalian — {asset.name}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Tutup"
            title="Tutup"
          >
            ✕
          </button>
        </div>

        {/* KONDISI AFTER */}
        <div>
          <label className="text-xs text-slate-500">Kondisi Saat Dikembalikan</label>
          <select
            className="w-full border rounded px-3 py-2 mt-1"
            value={conditionAfter}
            onChange={(e) => setConditionAfter(e.target.value)}
          >
            <option value="baik">Baik</option>
            <option value="cukup">Cukup</option>
            <option value="rusak">Rusak</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        {/* UPDATE ASSET LOCATION */}
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={updateAssetLocation}
            onChange={(e) => setUpdateAssetLocation(e.target.checked)}
          />
          Update lokasi aset menjadi lokasi penggunaan terakhir
        </label>

        {/* FOTO AFTER */}
        <div className="space-y-2">
          <label className="block text-xs text-slate-600">Foto Setelah Dikembalikan</label>

          <div className="border border-dashed border-slate-300 rounded-lg p-3 bg-slate-50">
            <div className="flex items-start gap-3">
              <div className="w-20 h-20 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                {photo ? (
                  <img
                    src={URL.createObjectURL(photo)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                  />
                ) : (
                  <div className="text-[11px] text-slate-400 text-center px-2">
                    no photo
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="text-sm font-medium text-slate-800">
                  {photo ? "Foto terpilih" : "Upload foto kondisi setelah kembali"}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  JPG/PNG, maksimal 5MB (opsional).
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs hover:bg-blue-700"
                  >
                    Pilih Foto
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;

                      if (f.size > 5 * 1024 * 1024) {
                        alert("Maksimal ukuran file 5MB");
                        e.target.value = "";
                        return;
                      }

                      setPhoto(f);
                      e.target.value = "";
                    }}
                  />

                  {photo && (
                    <button
                      type="button"
                      onClick={() => setPhoto(null)}
                      className="px-3 py-1.5 rounded-md border text-xs text-slate-700 bg-white hover:bg-slate-50"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReturnAssetModal;
