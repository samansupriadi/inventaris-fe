import { useState } from "react";

function EntityPage({ entities, onCreate, onUpdate, onDelete }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const resetForm = () => {
    setName("");
    setCode("");
    setDescription("");
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name) {
      setError("Nama entitas wajib diisi");
      return;
    }

    const payload = {
      name,
      code: code || null,
      description: description || null,
    };

    try {
      if (editingId) {
        await onUpdate(editingId, payload);
      } else {
        await onCreate(payload);
      }
      resetForm();
    } catch (err) {
      setError(err.message || "Gagal menyimpan entitas");
    }
  };

  const startEdit = (ent) => {
    setEditingId(ent.id);
    setName(ent.name);
    setCode(ent.code || "");
    setDescription(ent.description || "");
    setError("");
  };

  const handleDeleteClick = async (ent) => {
    if (
      !window.confirm(
        `Yakin menghapus entitas "${ent.name}" ?\n(Hanya bisa jika tidak dipakai sumber dana / user)`
      )
    )
      return;

    try {
      await onDelete(ent.id);
    } catch (err) {
      alert(err.message || "Gagal menghapus entitas");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Entitas</h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola cabang / lembaga (entitas) yang terhubung ke sumber dana dan user.
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <h2 className="text-sm font-semibold mb-2">
          {editingId ? "Edit Entitas" : "Tambah Entitas Baru"}
        </h2>

        {error && <div className="text-xs text-red-600 mb-2">{error}</div>}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm"
        >
          <div>
            <label className="block text-xs mb-1">Nama Entitas</label>
            <input
              className="border rounded w-full px-2 py-1.5"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Misal: LAZ, SASAKA, SINAWA"
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Kode (opsional)</label>
            <input
              className="border rounded w-full px-2 py-1.5"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Misal: LAZ"
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Keterangan (opsional)</label>
            <input
              className="border rounded w-full px-2 py-1.5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Lembaga amil zakat"
            />
          </div>

          <div className="md:col-span-3 flex items-center gap-2 mt-1">
            <button
              type="submit"
              className="px-3 py-2 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {editingId ? "Simpan Perubahan" : "Tambah"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-2 text-xs rounded border"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TABEL ENTITAS */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <h2 className="text-sm font-semibold mb-2">Daftar Entitas</h2>

        {entities.length === 0 ? (
          <p className="text-xs text-slate-400">Belum ada entitas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">Nama</th>
                  <th className="p-2 text-left">Kode</th>
                  <th className="p-2 text-left">Keterangan</th>
                  <th className="p-2 text-left">Dibuat</th>
                  <th className="p-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {entities.map((ent) => (
                  <tr key={ent.id} className="border-b">
                    <td className="p-2">{ent.name}</td>
                    <td className="p-2">{ent.code || "-"}</td>
                    <td className="p-2">
                      {ent.description && ent.description !== ""
                        ? ent.description
                        : "-"}
                    </td>
                    <td className="p-2">
                      {ent.created_at
                        ? new Date(ent.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-2 space-x-2">
                      <button
                        type="button"
                        onClick={() => startEdit(ent)}
                        className="px-2 py-1 text-xs rounded border"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(ent)}
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

export default EntityPage;
