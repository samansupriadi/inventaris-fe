// src/components/RolePage.jsx
import { useState } from "react";

function RolePage({
  roles = [],
  permissions = [],
  onCreate,
  onUpdate,
  onDelete,
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  // kelola permission untuk role yang dipilih
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);

  const resetForm = () => {
    setName("");
    setSlug("");
    setDescription("");
    setEditingId(null);
    setError("");
  };

  const startEdit = (role) => {
    setEditingId(role.id);
    setName(role.name);
    setSlug(role.slug);
    setDescription(role.description || "");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !slug) {
      setError("Nama dan slug role wajib diisi");
      return;
    }

    const payload = {
      name,
      slug,
      description,
      // saat create belum atur permission
      permission_ids: editingId ? selectedPermissionIds : undefined,
    };

    try {
      if (editingId) {
        await onUpdate(editingId, payload);
      } else {
        await onCreate(payload);
      }
      resetForm();
    } catch (err) {
      setError(err.message || "Gagal menyimpan role");
    }
  };

  const handleDeleteClick = async (role) => {
    if (!window.confirm(`Yakin menghapus role "${role.name}" ?`)) return;
    try {
      await onDelete(role.id);
    } catch (err) {
      alert(err.message || "Gagal menghapus role");
    }
  };

  // ================= PERMISSIONS PANEL =================

  const startManagePermissions = (role) => {
    setSelectedRoleId(role.id);
    const ids = (role.permissions || []).map((p) => p.id);
    setSelectedPermissionIds(ids);
  };

  const togglePermission = (permId) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permId)
        ? prev.filter((id) => id !== permId)
        : [...prev, permId]
    );
  };

  const saveRolePermissions = async () => {
    if (!selectedRoleId) return;
    const role = roles.find((r) => r.id === selectedRoleId);
    if (!role) return;

    try {
      await onUpdate(selectedRoleId, {
        name: role.name,
        slug: role.slug,
        description: role.description,
        permission_ids: selectedPermissionIds,
      });
      alert("Hak akses role berhasil disimpan");
    } catch (err) {
      alert(err.message || "Gagal menyimpan hak akses role");
    }
  };

  // group permissions by group_name
  const permissionsByGroup = (permissions || []).reduce((acc, p) => {
    const key = p.group_name || "Lainnya";
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  const currentRole =
    (roles || []).find((r) => r.id === selectedRoleId) || null;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Roles & Hak Akses
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola role dan permission (mirip Spatie di Laravel).
        </p>
      </div>

      {/* FORM ROLE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <h2 className="text-sm font-semibold mb-2">
          {editingId ? "Edit Role" : "Tambah Role Baru"}
        </h2>

        {error && (
          <div className="text-xs text-red-600 mb-2">{error}</div>
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
              placeholder="Misal: Admin, Staff, Viewer"
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Slug</label>
            <input
              className="border rounded w-full px-2 py-1.5"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="misal: admin, staff, viewer"
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Keterangan</label>
            <input
              className="border rounded w-full px-2 py-1.5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="opsional"
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

      {/* TABEL ROLE */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <h2 className="text-sm font-semibold mb-2">Daftar Role</h2>

        {(roles || []).length === 0 ? (
          <p className="text-xs text-slate-400">Belum ada role.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">Nama</th>
                  <th className="p-2 text-left">Slug</th>
                  <th className="p-2 text-left">Hak Akses</th>
                  <th className="p-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id} className="border-b">
                    <td className="p-2">{role.name}</td>
                    <td className="p-2">{role.slug}</td>
                    <td className="p-2">
                      {(role.permissions || [])
                        .map((p) => p.slug)
                        .join(", ") || "-"}
                    </td>
                    <td className="p-2 space-x-2">
                      <button
                        type="button"
                        onClick={() => startEdit(role)}
                        className="px-2 py-1 text-xs rounded border"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => startManagePermissions(role)}
                        className="px-2 py-1 text-xs rounded border"
                      >
                        Hak Akses
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(role)}
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

      {/* PANEL HAK AKSES ROLE TERPILIH */}
      {currentRole && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <h2 className="text-sm font-semibold mb-2">
            Hak Akses untuk Role: {currentRole.name}
          </h2>
          <p className="text-[11px] text-slate-500 mb-2">
            Centang permission yang dimiliki role ini.
          </p>

          {Object.keys(permissionsByGroup).length === 0 ? (
            <p className="text-xs text-slate-400">
              Belum ada permission di database.
            </p>
          ) : (
            <div className="space-y-3 text-xs">
              {Object.entries(permissionsByGroup).map(
                ([groupName, perms]) => (
                  <div key={groupName}>
                    <div className="font-semibold mb-1">
                      {groupName}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {perms.map((perm) => (
                        <label
                          key={perm.id}
                          className="inline-flex items-center gap-1"
                        >
                          <input
                            type="checkbox"
                            className="rounded border-slate-300"
                            checked={selectedPermissionIds.includes(
                              perm.id
                            )}
                            onChange={() => togglePermission(perm.id)}
                          />
                          <span>
                            {perm.name}{" "}
                            <span className="text-[10px] text-slate-400">
                              ({perm.slug})
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={saveRolePermissions}
              className="px-3 py-1.5 text-xs rounded bg-blue-600 text-white"
            >
              Simpan Hak Akses
            </button>
            <button
              type="button"
              onClick={() => setSelectedRoleId(null)}
              className="px-3 py-1.5 text-xs rounded border"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RolePage;
