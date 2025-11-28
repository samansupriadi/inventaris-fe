import { useState } from "react";

function CategoryPage({ categories, onCreate, onUpdate, onDelete }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setName("");
    setCode("");
    setDescription("");
    setError("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (!name) {
      setError("Nama kategori wajib diisi");
      return;
    }

    try {
      await onCreate({ name, code, description });
      resetForm();          // kalau sukses, error hilang & form kosong
    } catch (err) {
      setError(err.message || "Gagal membuat kategori baru");
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditCode(cat.code || "");
    setEditDescription(cat.description || "");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!editName) {
      setError("Nama kategori wajib diisi");
      return;
    }

    try {
      await onUpdate(editingId, {
        name: editName,
        code: editCode,
        description: editDescription,
      });
      setEditingId(null);
      setEditName("");
      setEditCode("");
      setEditDescription("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (cat) => {
    if (
      !window.confirm(
        `Yakin ingin menghapus kategori "${cat.name}"?\nSyarat: tidak boleh dipakai oleh aset.`
      )
    ) {
      return;
    }

    try {
      await onDelete(cat.id);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Kategori Aset
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola kategori aset, misalnya Office Inventory (IK), Furniture
          (IKF), Electronic (IKE).
        </p>
      </div>

      {/* Form tambah / edit */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <h2 className="text-sm font-semibold mb-2">
          {editingId ? "Edit Kategori" : "Tambah Kategori Baru"}
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
              placeholder="Misal: Office Inventory"
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Kode</label>
            <input
              className="border rounded w-full px-2 py-1.5"
              value={editingId ? editCode : code}
              onChange={(e) =>
                editingId
                  ? setEditCode(e.target.value)
                  : setCode(e.target.value)
              }
              placeholder="Misal: IK"
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Deskripsi</label>
            <input
              className="border rounded w-full px-2 py-1.5"
              value={editingId ? editDescription : description}
              onChange={(e) =>
                editingId
                  ? setEditDescription(e.target.value)
                  : setDescription(e.target.value)
              }
              placeholder="Opsional"
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
                onClick={() => {
                  setEditingId(null);
                  setEditName("");
                  setEditCode("");
                  setEditDescription("");
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

      {/* Tabel kategori */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <h2 className="text-sm font-semibold mb-2">
          Daftar Kategori Aset
        </h2>

        {categories.length === 0 ? (
          <p className="text-xs text-slate-400">
            Belum ada kategori. Contoh: Office Inventory (IK), Furniture (IKF),
            Electronic (IKE).
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Nama</th>
                  <th className="text-left p-2">Kode</th>
                  <th className="text-left p-2">Deskripsi</th>
                  <th className="text-left p-2">Dibuat</th>
                  <th className="text-left p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b">
                    <td className="p-2">{cat.name}</td>
                    <td className="p-2">{cat.code || "-"}</td>
                    <td className="p-2">
                      {cat.description || "-"}
                    </td>
                    <td className="p-2">
                      {cat.created_at
                        ? new Date(cat.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-2 space-x-2">
                      <button
                        type="button"
                        onClick={() => startEdit(cat)}
                        className="px-2 py-1 text-xs rounded border"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
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

export default CategoryPage;
