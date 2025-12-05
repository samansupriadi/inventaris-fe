import React, { useState } from "react";

function PermissionPage({ permissions, onCreate, onUpdate, onDelete }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [groupName, setGroupName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const resetForm = () => {
    setName("");
    setSlug("");
    setGroupName("");
    setEditingId(null);
    setError("");
  };

  const startEdit = (perm) => {
    setEditingId(perm.id);
    setName(perm.name);
    setSlug(perm.slug);
    setGroupName(perm.group_name || "");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !slug) {
      setError("Nama dan slug permission wajib diisi");
      return;
    }

    const payload = {
      name,
      slug,
      group_name: groupName || null,
    };

    try {
      if (editingId) {
        await onUpdate(editingId, payload);
      } else {
        await onCreate(payload);
      }
      resetForm();
    } catch (err) {
      setError(err.message || "Gagal menyimpan permission");
    }
  };

  const handleDeleteClick = async (perm) => {
    if (!window.confirm(`Hapus permission "${perm.name}" ?`)) return;

    try {
      await onDelete(perm.id);
    } catch (err) {
      alert(err.message || "Gagal menghapus permission");
    }
  };

  // ==== Grouping untuk tampilan rapi ====
  const permissionsByGroup = permissions.reduce((acc, p) => {
    const key = p.group_name || "Lainnya";
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  const sortedGroups = Object.keys(permissionsByGroup).sort();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Permissions (Hak Akses Menu)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola daftar permission yang nanti bisa di-assign ke Role.
        </p>
      </div>

      {/* FORM TAMBAH / EDIT */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <h2 className="text-sm font-semibold mb-2">
          {editingId ? "Edit Permission" : "Tambah Permission Baru"}
        </h2>

        {error && (
          <div className="text-xs text-red-600 mb-2">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm"
        >
          <div>
            <label className="block text-xs mb-1">Nama</label>
            <input
              className="border rounded w-full px-2 py-1.5"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Misal: Lihat entitas"
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Slug</label>
            <input
              className="border rounded w-full px-2 py-1.5"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Misal: entities.view"
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Group</label>
            <input
              className="border rounded w-full px-2 py-1.5"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Misal: Aset, Entitas, User"
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

      {/* TABEL PERMISSION */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <h2 className="text-sm font-semibold mb-2">
          Daftar Permission
        </h2>

        {permissions.length === 0 ? (
          <p className="text-xs text-slate-400">
            Belum ada permission. Tambahkan minimal untuk aset, role, dan user.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm border-collapse">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left p-2 w-1/3">Nama</th>
                  <th className="text-left p-2 w-1/3">Slug</th>
                  <th className="text-left p-2 w-1/3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sortedGroups.map((group) => (
                  <React.Fragment key={group}>
                    {/* Baris judul grup */}
                    <tr className="bg-slate-100/80">
                      <td
                        colSpan={3}
                        className="p-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600"
                      >
                        {group}
                      </td>
                    </tr>

                    {/* Baris permission di dalam grup */}
                    {permissionsByGroup[group].map((perm) => (
                      <tr key={perm.id} className="border-b last:border-b-0">
                        <td className="p-2">
                          {perm.name}
                        </td>
                        <td className="p-2 text-slate-500">
                          {perm.slug}
                        </td>
                        <td className="p-2 space-x-2">
                          <button
                            type="button"
                            onClick={() => startEdit(perm)}
                            className="px-2 py-1 text-[11px] rounded border"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(perm)}
                            className="px-2 py-1 text-[11px] rounded bg-red-600 text-white"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PermissionPage;
