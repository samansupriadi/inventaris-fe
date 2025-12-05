import { useState } from "react";

function UserPage({ users, roles, entities, onCreate, onUpdate, onDelete }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [entityId, setEntityId] = useState(null);        // ★ NEW
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setEntityId(null);                                   // ★ NEW
    setSelectedRoles([]);
    setEditingId(null);
    setError("");
  };

  const handleToggleRole = (roleId) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email) {
      setError("Nama dan email wajib diisi");
      return;
    }

    if (!editingId && !password) {
      setError("Password wajib diisi untuk user baru");
      return;
    }

    const payload = {
      name,
      email,
      role_ids: selectedRoles,
      entity_id: entityId || null,                       // ★ NEW
    };

    if (password) {
      payload.password = password;
    }

    try {
      if (editingId) {
        await onUpdate(editingId, payload);
      } else {
        await onCreate(payload);
      }
      resetForm();
    } catch (err) {
      setError(err.message || "Gagal menyimpan user");
    }
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
    setPassword("");
    setEntityId(user.entity_id || null);                 // ★ NEW
    setSelectedRoles(user.roles ? user.roles.map((r) => r.id) : []);
    setError("");
  };

  const handleDeleteClick = async (user) => {
    if (!window.confirm(`Yakin menghapus user "${user.name}" ?`)) return;

    try {
      await onDelete(user.id);
    } catch (err) {
      alert(err.message || "Gagal menghapus user");
    }
  };

  const renderRoleNames = (user) => {
    if (!user.roles || user.roles.length === 0) return "-";
    return user.roles.map((r) => r.name).join(", ");
  };

  const renderEntityName = (user) => {                 // ★ NEW
    return user.entity_name || "-";
  };

  return (
    <div className="space-y-4">

      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Users</h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola akun pengguna, entitas, dan hak akses (role).
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <h2 className="text-sm font-semibold mb-2">
          {editingId ? "Edit User" : "Tambah User Baru"}
        </h2>

        {error && <div className="text-xs text-red-600 mb-2">{error}</div>}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm"
        >
          {/* Nama */}
          <div>
            <label className="block text-xs mb-1">Nama</label>
            <input
              className="border rounded w-full px-2 py-1.5"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs mb-1">Email</label>
            <input
              type="email"
              className="border rounded w-full px-2 py-1.5"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs mb-1">
              Password {editingId && "(kosongkan jika tidak diubah)"}
            </label>
            <input
              type="password"
              className="border rounded w-full px-2 py-1.5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* ENTITAS — NEW */}
          <div className="md:col-span-3">
            <label className="block text-xs mb-1">Entitas</label>
            {entities.length === 0 ? (
              <p className="text-xs text-slate-400">
                Belum ada entitas. Tambahkan dahulu di menu Entitas.
              </p>
            ) : (
              <select
                className="border rounded w-full px-2 py-1.5"
                value={entityId || ""}
                onChange={(e) =>
                  setEntityId(e.target.value === "" ? null : Number(e.target.value))
                }
              >
                <option value="">Tidak ada entitas</option>
                {entities.map((ent) => (
                  <option key={ent.id} value={ent.id}>
                    {ent.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* ROLE CHECKBOX */}
          <div className="md:col-span-3">
            <label className="block text-xs mb-1">Role</label>
            <div className="flex flex-wrap gap-3">
              {roles.map((role) => (
                <label key={role.id} className="inline-flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role.id)}
                    onChange={() => handleToggleRole(role.id)}
                  />
                  {role.name}
                </label>
              ))}
            </div>
          </div>

          {/* Button */}
          <div className="md:col-span-3 flex items-center gap-2 mt-1">
            <button
              type="submit"
              className="px-3 py-2 text-xs rounded bg-blue-600 text-white"
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

      {/* TABEL USER */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <h2 className="text-sm font-semibold mb-2">Daftar User</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2">Nama</th>
                <th className="p-2">Email</th>
                <th className="p-2">Entitas</th>            {/* ★ NEW */}
                <th className="p-2">Role</th>
                <th className="p-2">Dibuat</th>
                <th className="p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{renderEntityName(u)}</td> {/* ★ NEW */}
                  <td className="p-2">{renderRoleNames(u)}</td>
                  <td className="p-2">
                    {u.created_at
                      ? new Date(u.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => startEdit(u)}
                      className="px-2 py-1 text-xs rounded border"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(u)}
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
      </div>
    </div>
  );
}

export default UserPage;
