import { useState } from "react";

function UserPage({ users, roles, onCreate, onUpdate, onDelete }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]); // array of role_id
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
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
    };

    // hanya kirim password kalau diisi (untuk update)
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

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Users
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola akun pengguna dan hak akses (role).
        </p>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <h2 className="text-sm font-semibold mb-2">
          {editingId ? "Edit User" : "Tambah User Baru"}
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
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Email</label>
            <input
              type="email"
              className="border rounded w-full px-2 py-1.5"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

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

          {/* ROLE CHECKBOXES */}
          <div className="md:col-span-3">
            <label className="block text-xs mb-1">Role</label>
            {roles.length === 0 ? (
              <p className="text-xs text-slate-400">
                Belum ada role. Tambahkan dulu di database / API.
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {roles.map((role) => (
                  <label
                    key={role.id}
                    className="inline-flex items-center gap-1 text-xs"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-slate-300"
                      checked={selectedRoles.includes(role.id)}
                      onChange={() => handleToggleRole(role.id)}
                    />
                    <span>
                      {role.name}{" "}
                      {role.slug ? (
                        <span className="text-[10px] text-slate-400">
                          ({role.slug})
                        </span>
                      ) : null}
                    </span>
                  </label>
                ))}
              </div>
            )}
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

      {/* TABEL USER */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <h2 className="text-sm font-semibold mb-2">
          Daftar User
        </h2>

        {users.length === 0 ? (
          <p className="text-xs text-slate-400">
            Belum ada user.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Nama</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Dibuat</th>
                  <th className="text-left p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b">
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{renderRoleNames(u)}</td>
                    <td className="p-2">
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-2 space-x-2">
                      <button
                        type="button"
                        onClick={() => startEdit(u)}
                        className="px-2 py-1 text-xs rounded border"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
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
        )}
      </div>
    </div>
  );
}

export default UserPage;
