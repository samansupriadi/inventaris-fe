import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL, fetchBudgetCodes } from "../api";

function AddAssetModal({
  open,
  onClose,
  mode = "add",     
  asset = null,     
  onCreateAsset,
  onSaveAsset,      
  fundingSources,
  locations,
  categories,     
}) {
  const isEdit = mode === "edit";

  const [name, setName] = useState("");
  const [locationDetail, setLocationDetail] = useState("");
  const [condition, setCondition] = useState("baik");
  const [fundingSourceId, setFundingSourceId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [value, setValue] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [budgetCodeId, setBudgetCodeId] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [notes, setNotes] = useState("");

  const [photoFile, setPhotoFile] = useState(null);     // file baru
  const [receiptFile, setReceiptFile] = useState(null); // file baru

  // ✅ existing URLs (buat edit)
  const existingPhotoUrl = useMemo(() => {
    if (!isEdit) return "";
    if (!initialData?.photo_url) return "";
    return initialData.photo_url.startsWith("http")
      ? initialData.photo_url
      : `${API_BASE_URL}${initialData.photo_url}`;
  }, [isEdit, initialData]);

  const existingReceiptUrl = useMemo(() => {
    if (!isEdit) return "";
    if (!initialData?.receipt_url) return "";
    return initialData.receipt_url.startsWith("http")
      ? initialData.receipt_url
      : `${API_BASE_URL}${initialData.receipt_url}`;
  }, [isEdit, initialData]);

  const [budgetOptions, setBudgetOptions] = useState([]);
  const [error, setError] = useState("");

  // Reset / Prefill tiap modal dibuka
  useEffect(() => {
    if (!open) return;

    setError("");
    setBudgetOptions([]);

    if (isEdit && initialData) {
      setName(initialData.name || "");
      setLocationDetail(initialData.location || "");
      setCondition(initialData.condition || "baik");
      setFundingSourceId(initialData.funding_source_id ? String(initialData.funding_source_id) : "");
      setLocationId(initialData.location_id ? String(initialData.location_id) : "");
      setValue(initialData.value != null ? String(initialData.value) : "");
      setCategoryId(initialData.category_id ? String(initialData.category_id) : "");
      setBudgetCodeId(initialData.budget_code_id ? String(initialData.budget_code_id) : "");
      setPurchaseDate(
        initialData.purchase_date
          ? String(initialData.purchase_date).slice(0, 10)
          : ""
      );
      setNotes(initialData.notes || "");
      setPhotoFile(null);
      setReceiptFile(null);
      return;
    }

    // CREATE mode reset
    setName("");
    setLocationDetail("");
    setCondition("baik");
    setFundingSourceId("");
    setLocationId("");
    setValue("");
    setCategoryId("");
    setBudgetCodeId("");
    setPurchaseDate("");
    setNotes("");
    setPhotoFile(null);
    setReceiptFile(null);
  }, [open, isEdit, initialData]);

  // Load KMA berdasarkan fundingSourceId
  useEffect(() => {
    const loadKma = async () => {
      if (!fundingSourceId) {
        setBudgetOptions([]);
        setBudgetCodeId("");
        return;
      }
      try {
        const data = await fetchBudgetCodes(fundingSourceId);
        setBudgetOptions(data);

        // kalau budgetCodeId saat ini tidak ada di options, reset
        if (
          budgetCodeId &&
          !data.some((b) => String(b.id) === String(budgetCodeId))
        ) {
          setBudgetCodeId("");
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadKma();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fundingSourceId]);

  if (!open) return null;

  const title = isEdit ? "Edit Aset" : "Tambah Aset Baru";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name) return setError("Nama aset wajib diisi");
    if (!fundingSourceId) return setError("Sumber dana wajib dipilih");
    if (!categoryId) return setError("Kategori aset wajib dipilih");

    // CREATE: purchaseDate wajib, foto & kwitansi wajib
    if (!isEdit) {
      if (!purchaseDate) return setError("Tanggal pembelian wajib diisi");
      if (!photoFile) return setError("Foto aset wajib diupload");
      if (!receiptFile) return setError("Kwitansi pembelian wajib diupload");
    }

    // EDIT: purchase_date boleh tetap dikirim (kalau kosong, biarin backend null atau keep)
    // (Kalau kamu mau "wajib saat edit", tinggal aktifkan validasi purchaseDate)
    const payload = {
      name,
      location: locationDetail,
      condition,
      funding_source_id: fundingSourceId,
      value: value ? Number(value) : null,
      location_id: locationId || null,
      category_id: categoryId,
      budget_code_id: budgetCodeId || null,
      notes,
      purchase_date: purchaseDate || null,
    };

    const result = await onCreateAsset(payload, photoFile, receiptFile);
    if (!result?.success) {
      setError(result?.message || "Gagal menyimpan aset");
      return;
    }

    onClose?.();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    e.target.value = "";
  };

  const handleReceiptChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReceiptFile(file);
    e.target.value = "";
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-lg p-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            {isEdit && (
              <p className="text-[11px] text-slate-500 mt-1">
                Kode aset tidak berubah. Foto/Kwitansi opsional kalau ingin diganti.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            title="Tutup"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {error && <div className="text-xs text-red-600 mb-2">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          {/* NAMA */}
          <div>
            <label className="block mb-1 text-xs">Nama aset</label>
            <input
              className="border rounded w-full px-2 py-1.5"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          {/* SUMBER DANA */}
          <div>
            <label className="block mb-1 text-xs">Sumber dana</label>
            <select
              className="border rounded w-full px-2 py-1.5 text-sm"
              value={fundingSourceId}
              onChange={(e) => setFundingSourceId(e.target.value)}
            >
              <option value="">Pilih sumber dana...</option>
              {fundingSources.map((fs) => (
                <option key={fs.id} value={fs.id}>
                  {fs.name} ({fs.code})
                </option>
              ))}
            </select>
          </div>

          {/* KATEGORI ASET */}
          <div>
            <label className="block mb-1 text-xs">Kategori aset</label>
            <select
              className="border rounded w-full px-2 py-1.5 text-sm"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Pilih kategori...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} {cat.code ? `(${cat.code})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* KMA */}
          <div>
            <label className="block mb-1 text-xs">
              Kode Mata Anggaran (opsional)
            </label>
            <select
              className="border rounded w-full px-2 py-1.5 text-sm"
              value={budgetCodeId}
              onChange={(e) => setBudgetCodeId(e.target.value)}
              disabled={!fundingSourceId}
            >
              <option value="">
                {fundingSourceId ? "Pilih KMA (jika ada)..." : "Pilih sumber dana dulu"}
              </option>
              {budgetOptions.map((kma) => (
                <option key={kma.id} value={kma.id}>
                  {kma.code} - {kma.name}
                </option>
              ))}
            </select>
          </div>

          {/* LOKASI UTAMA */}
          <div>
            <label className="block mb-1 text-xs">Lokasi utama</label>
            <select
              className="border rounded w-full px-2 py-1.5 text-sm"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
            >
              <option value="">Pilih lokasi...</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* DETAIL LOKASI */}
          <div>
            <label className="block mb-1 text-xs">
              Detail lokasi (opsional, misal: lemari 3 / rak B)
            </label>
            <input
              className="border rounded w-full px-2 py-1.5"
              value={locationDetail}
              onChange={(e) => setLocationDetail(e.target.value)}
            />
          </div>

          {/* KONDISI */}
          <div>
            <label className="block mb-1 text-xs">Kondisi aset</label>
            <select
              className="border rounded w-full px-2 py-1.5 text-sm"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="baik">Baik</option>
              <option value="cukup">Cukup</option>
              <option value="rusak">Rusak</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          {/* TANGGAL PEMBELIAN */}
          <div>
            <label className="block mb-1 text-xs">
              Tanggal pembelian {isEdit ? "(opsional)" : ""}
            </label>
            <input
              type="date"
              className="border rounded w-full px-2 py-1.5"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
          </div>

          {/* NILAI */}
          <div>
            <label className="block mb-1 text-xs">Nilai aset (Rp)</label>
            <input
              type="number"
              min="0"
              className="border rounded w-full px-2 py-1.5 text-sm"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="contoh: 1500000"
            />
          </div>

          {/* CATATAN */}
          <div>
            <label className="block mb-1 text-xs">Catatan / Spesifikasi (opsional)</label>
            <textarea
              className="border rounded w-full px-2 py-1.5 text-sm"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Laptop i5, RAM 8GB, SSD 256GB..."
            />
          </div>

          {/* UPLOAD FOTO & KWITANSI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* FOTO ASET */}
            <div>
              <p className="block mb-1 text-xs font-medium">
                Foto aset {!isEdit && <span className="text-red-500">*</span>}
              </p>

              <label className="flex flex-col items-start justify-between border-2 border-dashed rounded-lg px-3 py-2 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm">
                    📷
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">
                      {photoFile ? "Ganti foto aset" : "Pilih foto aset"}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      JPG/PNG, sebaiknya tampak jelas
                    </div>
                  </div>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>

              {/* Preview: file baru > existing */}
              {(photoFile || existingPhotoUrl) && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-14 h-14 rounded border overflow-hidden bg-slate-100">
                    <img
                      src={photoFile ? URL.createObjectURL(photoFile) : existingPhotoUrl}
                      alt="Preview foto"
                      className="w-full h-full object-cover"
                      onLoad={(e) => {
                        // revoke kalau dari file baru
                        if (photoFile) URL.revokeObjectURL(e.currentTarget.src);
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] text-slate-600 truncate">
                      {photoFile ? photoFile.name : "Foto saat ini"}
                    </p>
                    {photoFile && (
                      <p className="text-[11px] text-slate-400">
                        {(photoFile.size / 1024).toFixed(1)} KB
                      </p>
                    )}
                    {existingPhotoUrl && !photoFile && (
                      <a
                        href={existingPhotoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-blue-600 hover:underline"
                      >
                        Lihat foto
                      </a>
                    )}
                  </div>
                  {photoFile && (
                    <button
                      type="button"
                      onClick={() => setPhotoFile(null)}
                      className="text-[11px] px-2 py-1 border rounded hover:bg-slate-50"
                    >
                      Hapus
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* KWITANSI */}
            <div>
              <p className="block mb-1 text-xs font-medium">
                Kwitansi pembelian {!isEdit && <span className="text-red-500">*</span>}
              </p>

              <label className="flex flex-col items-start justify-between border-2 border-dashed rounded-lg px-3 py-2 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm">
                    📄
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">
                      {receiptFile ? "Ganti kwitansi" : "Upload kwitansi"}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      JPG/PNG/PDF
                    </div>
                  </div>
                </div>

                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleReceiptChange}
                  className="hidden"
                />
              </label>

              {(receiptFile || existingReceiptUrl) && (
                <div className="mt-2">
                  <p className="text-[11px] text-slate-600 truncate">
                    {receiptFile ? receiptFile.name : "Kwitansi saat ini"}
                  </p>
                  {receiptFile && (
                    <p className="text-[11px] text-slate-400">
                      {(receiptFile.size / 1024).toFixed(1)} KB
                    </p>
                  )}
                  {existingReceiptUrl && !receiptFile && (
                    <a
                      href={existingReceiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-600 hover:underline"
                    >
                      Lihat kwitansi
                    </a>
                  )}

                  {receiptFile && (
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={() => setReceiptFile(null)}
                        className="text-[11px] px-2 py-1 border rounded hover:bg-slate-50"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* FOOTER BUTTON */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs border rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {isEdit ? "Simpan Perubahan" : "Simpan"}
            </button>
          </div>

          {!isEdit && (
            <p className="mt-2 text-[11px] text-slate-400">
              Kode aset akan digenerate otomatis berdasarkan sumber dana, kategori,
              dan tanggal pembelian. Contoh: 0001/W-IK/12-2021
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddAssetModal;
