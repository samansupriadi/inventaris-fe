import { useState } from "react";

function LocationPage({ locations, onCreate, onUpdate, onDelete }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setName("");
    setCode("");
    setError("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (!name) {
      setError("Nama lokasi wajib diisi");
      return;
    }

    try {
      await onCreate({ name, code });
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (loc) => {
    setEditingId(loc.id);
    setEditName(loc.name);
    setEditCode(loc.code || "");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!editName) {
      setError("Nama lokasi wajib diisi");
      return;
    }

    try {
      await onUpdate(editingId, {
        name: editName,
        code: editCode,
      });
      setEditingId(null);
      setEditName("");
      setEditCode("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (loc) => {
    if (
      !window.confirm(
        `Yakin ingin menghapus lokasi "${loc.name}"?\nSyarat: tidak boleh dipakai oleh aset.`
      )
    ) {
      return;
    }

    try {
      await onDelete(loc.id);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Lokasi</h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola master lokasi aset (misal: Kantor Pusat, Gudang A, dll).
        </p>
      </div>

      {/* Form tambah / edit */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <h2 className="text-sm font-semibold mb-2">
          {editingId ? "Edit Lokasi" : "Tambah Lokasi Baru"}
        </h2>

        {error && (
          <div className="text-xs text-red-600 mb-2">{error}</div>
        )}

        <form
          onSubmit={editingId ? handleEditSubmit : handleCreate}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm"
        >
          <div>
            <label className="block text-xs mb-1">Nama</label>
            <input
              className="border rounded w-full px-2 py-1.5"
              value={editingId ? editName : name}
              onChange={(e) =>
                editingId
                  ? setEditName(e.target.value)
                  : setName(e.target.value)
              }
              placeholder="Misal: Kantor Pusat"
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Kode (opsional)</label>
            <input
              className="border rounded w-full px-2 py-1.5"
              value={editingId ? editCode : code}
              onChange={(e) =>
                editingId
                  ? setEditCode(e.target.value)
                  : setCode(e.target.value)
              }
              placeholder="Misal: KPUSAT"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="px-3 py-2 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {editingId ? "Simpan Perubahan" : "Tambah"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setEditName("");
                  setEditCode("");
                  setError("");
                }}
                className="px-3 py-2 text-xs rounded border"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabel lokasi */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <h2 className="text-sm font-semibold mb-2">Daftar Lokasi</h2>

        {locations.length === 0 ? (
          <p className="text-xs text-slate-400">
            Belum ada lokasi. Tambahkan minimal Kantor Pusat / Gudang A.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Nama</th>
                  <th className="text-left p-2">Kode</th>
                  <th className="text-left p-2">Dibuat</th>
                  <th className="text-left p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((loc) => (
                  <tr key={loc.id} className="border-b">
                    <td className="p-2">{loc.name}</td>
                    <td className="p-2">{loc.code || "-"}</td>
                    <td className="p-2">
                      {loc.created_at
                        ? new Date(loc.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-2 space-x-2">
                      <button
                        type="button"
                        onClick={() => startEdit(loc)}
                        className="px-2 py-1 text-xs rounded border"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(loc)}
                        className="px-2 py-1 text-xs rounded bg-red-600 text-white"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default LocationPage;
