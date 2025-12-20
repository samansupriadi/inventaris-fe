import { useEffect, useMemo, useRef, useState } from "react";

function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

function BorrowAssetModal({
  open,
  asset,
  users = [],
  locations = [],
  loading,
  onClose,
  onSubmit,
}) {
  const [selectedUser, setSelectedUser] = useState(null);

  // single source of truth untuk input user
  const [userQuery, setUserQuery] = useState("");

  // debounce supaya ringan kalau user banyak
  const debouncedQuery = useDebouncedValue(userQuery, 250);

  const [showUserList, setShowUserList] = useState(false);

  const [locationId, setLocationId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [conditionNow, setConditionNow] = useState("baik"); // ✅ kondisi saat ini
  const [photo, setPhoto] = useState(null);

  const modalRef = useRef(null);
  const userBoxRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    // reset tiap modal dibuka
    setSelectedUser(null);
    setUserQuery("");
    setShowUserList(false);
    setLocationId("");
    setDueDate("");
    setConditionNow("baik");
    setPhoto(null);
  }, [open]);

  // close modal kalau klik backdrop
  const handleBackdropMouseDown = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose?.();
    }
  };

  // tutup dropdown kalau klik di luar box user
  useEffect(() => {
    if (!open) return;

    const onDocMouseDown = (e) => {
      if (!userBoxRef.current) return;
      if (!userBoxRef.current.contains(e.target)) setShowUserList(false);
    };

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  const filteredUsers = useMemo(() => {
    const q = (debouncedQuery || "").trim().toLowerCase();

    // kalau kosong, tampilkan top 30
    if (!q) return users.slice(0, 30);

    const result = users.filter((u) => {
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });

    return result.slice(0, 30);
  }, [users, debouncedQuery]);

  const canShowList =
    showUserList &&
    // tampilkan list kalau belum memilih user atau sedang mengetik
    (!selectedUser || userQuery.trim().length > 0);

  const handlePickUser = (u) => {
    setSelectedUser(u);
    setUserQuery(`${u.name} (${u.email})`); // ✅ ini yang bikin input kereplace
    setShowUserList(false);
  };

  const handleSubmit = () => {
    if (!selectedUser) return alert("Pilih user peminjam");
    if (!locationId) return alert("Pilih lokasi penggunaan");

    onSubmit?.({
      borrower_user_id: selectedUser.id,
      usage_location_id: locationId,
      due_date: dueDate || null,
      condition_now: conditionNow, // ✅ NEW
      photo,
    });
  };

  if (!open || !asset) return null;

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
            Pinjam Aset — {asset.name}
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

        {/* USER SEARCH */}
        <div ref={userBoxRef} className="relative">
          <label className="text-xs text-slate-500">Peminjam (User)</label>

          <input
            className="border px-3 py-2 rounded w-full mt-1"
            placeholder="Cari user..."
            value={userQuery}
            onChange={(e) => {
              // saat mulai ngetik ulang, batalin selectedUser
              setSelectedUser(null);
              setUserQuery(e.target.value);
              setShowUserList(true);
            }}
            onFocus={() => setShowUserList(true)}
            autoComplete="off"
          />

          {/* clear */}
          {userQuery && (
            <button
              type="button"
              onClick={() => {
                setSelectedUser(null);
                setUserQuery("");
                setShowUserList(true);
              }}
              className="absolute right-2 top-8 text-xs text-slate-400 hover:text-slate-600"
              title="Clear"
            >
              ✕
            </button>
          )}

          {/* Dropdown */}
          {canShowList && (
            <div className="absolute left-0 right-0 z-10 mt-1 border rounded-lg bg-white shadow max-h-40 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()} // ✅ cegah blur duluan
                    onClick={() => handlePickUser(u)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-sm"
                  >
                    <div className="font-medium text-slate-800">{u.name}</div>
                    <div className="text-xs text-slate-500">{u.email}</div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-xs text-slate-400">
                  User tidak ditemukan.
                </div>
              )}
            </div>
          )}
        </div>

        {/* LOKASI */}
        <div>
          <label className="text-xs text-slate-500">Lokasi Penggunaan</label>
          <select
            className="w-full border rounded px-3 py-2 mt-1"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
          >
            <option value="">Pilih lokasi</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* DUE DATE */}
        <div>
          <label className="text-xs text-slate-500">Tanggal Jatuh Tempo</label>
          <input
            type="date"
            className="w-full border rounded px-3 py-2 mt-1"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {/* ✅ KONDISI SAAT INI */}
        <div>
          <label className="text-xs text-slate-500">Kondisi Saat Ini</label>
          <select
            className="w-full border rounded px-3 py-2 mt-1"
            value={conditionNow}
            onChange={(e) => setConditionNow(e.target.value)}
          >
            <option value="baik">Baik</option>
            <option value="cukup">Cukup</option>
            <option value="rusak">Rusak</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        {/* FOTO KONDISI SAAT INI */}
        <div className="space-y-2">
          <label className="block text-xs text-slate-600">
            Foto Kondisi Saat Ini
          </label>

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
                  {photo ? "Foto terpilih" : "Upload foto kondisi perangkat"}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  JPG/PNG, maksimal 5MB (opsional).
                </div>

                {photo && (
                  <div className="mt-2 text-xs text-slate-600">
                    <div className="font-mono truncate">{photo.name}</div>
                    <div className="text-slate-500">
                      {(photo.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                )}

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

export default BorrowAssetModal;
