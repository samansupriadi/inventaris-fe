import React, { useEffect, useState } from "react";
import {
  fetchBudgetCodes,
  createBudgetCode,
  updateBudgetCode,
  deleteBudgetCode,
} from "../api";

function FundingSourcePage({
  fundingSources,
  entities,          // <<< TERIMA ENTITIES DI SINI
  onCreate,
  onUpdate,
  onDelete,
}) {
  // ---------- STATE SUMBER DANA ----------
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [entityId, setEntityId] = useState("");        // entitas untuk create

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editEntityId, setEditEntityId] = useState(""); // entitas untuk edit

  const [error, setError] = useState("");

  // ---------- STATE KMA (KODE MATA ANGGARAN) ----------
  const [budgetCodes, setBudgetCodes] = useState([]);
  const [expandedSourceId, setExpandedSourceId] = useState(null);

  const [kmaCode, setKmaCode] = useState("");
  const [kmaName, setKmaName] = useState("");
  const [kmaFundingSourceId, setKmaFundingSourceId] = useState(null);
  const [kmaEditingId, setKmaEditingId] = useState(null);
  const [kmaError, setKmaError] = useState("");

  // ---------- LOAD KMA ----------
  const loadBudgetCodes = async () => {
    try {
      const data = await fetchBudgetCodes();
      setBudgetCodes(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadBudgetCodes();
  }, []);

  // helper untuk menampilkan nama entitas
  const getEntityName = (id) => {
    if (!id || !entities) return "-";
    const ent = entities.find((e) => String(e.id) === String(id));
    return ent ? ent.name : "-";
  };

  // ---------- FORM SUMBER DANA ----------
  const resetForm = () => {
    setName("");
    setCode("");
    setEntityId("");
    setEditingId(null);
    setEditName("");
    setEditCode("");
    setEditEntityId("");
    setError("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !code) {
      setError("Nama dan kode sumber dana wajib diisi");
      return;
    }

    if (!entityId) {
      setError("Entitas sumber dana wajib dipilih");
      return;
    }

    try {
      await onCreate({
        name,
        code,
        entity_id: entityId,
      });
      resetForm();
    } catch (err) {
      setError(err.message || "Gagal menyimpan sumber dana");
    }
  };

  const startEdit = (fs) => {
    setEditingId(fs.id);
    setEditName(fs.name);
    setEditCode(fs.code || "");
    setEditEntityId(fs.entity_id || "");
    setError("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!editName || !editCode) {
      setError("Nama dan kode sumber dana wajib diisi");
      return;
    }

    if (!editEntityId) {
      setError("Entitas sumber dana wajib dipilih");
      return;
    }

    try {
      await onUpdate(editingId, {
        name: editName,
        code: editCode,
        entity_id: editEntityId,
      });
      resetForm();
    } catch (err) {
      setError(err.message || "Gagal mengubah sumber dana");
    }
  };

  const handleDelete = async (fs) => {
    if (
      !window.confirm(
        `Yakin ingin menghapus sumber dana "${fs.name}"?\nSyarat: tidak boleh dipakai oleh aset.`
      )
    ) {
      return;
    }

    try {
      await onDelete(fs.id);
    } catch (err) {
      alert(err.message || "Gagal menghapus sumber dana");
    }
  };

  // ---------- FORM KMA ----------
  const resetKmaForm = () => {
    setKmaCode("");
    setKmaName("");
    setKmaFundingSourceId(null);
    setKmaEditingId(null);
    setKmaError("");
  };

  const handleOpenKmaForSource = (fsId) => {
    setExpandedSourceId((prev) => (prev === fsId ? null : fsId));
    setKmaFundingSourceId(fsId);
    setKmaCode("");
    setKmaName("");
    setKmaEditingId(null);
    setKmaError("");
  };

  const handleSubmitKma = async (e) => {
    e.preventDefault();
    setKmaError("");

    if (!kmaCode || !kmaName || !kmaFundingSourceId) {
      setKmaError(
        "Kode anggaran, nama anggaran, dan sumber dana wajib diisi"
      );
      return;
    }

    const payload = {
      code: kmaCode,
      name: kmaName,
      funding_source_id: kmaFundingSourceId,
    };

    try {
      if (kmaEditingId) {
        await updateBudgetCode(kmaEditingId, payload);
      } else {
        await createBudgetCode(payload);
      }
      await loadBudgetCodes();
      resetKmaForm();
    } catch (err) {
      setKmaError(err.message || "Gagal menyimpan kode mata anggaran");
    }
  };

  const handleEditKma = (kma) => {
    setKmaEditingId(kma.id);
    setKmaCode(kma.code);
    setKmaName(kma.name);
    setKmaFundingSourceId(kma.funding_source_id);
    setKmaError("");
    setExpandedSourceId(kma.funding_source_id);
  };

  const handleDeleteKma = async (kma) => {
    if (!window.confirm(`Hapus KMA ${kma.code} - ${kma.name}?`)) return;

    try {
      await deleteBudgetCode(kma.id);
      await loadBudgetCodes();
    } catch (err) {
      alert(err.message || "Gagal menghapus kode mata anggaran");
    }
  };

  // ---------- RENDER ----------
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Sumber Dana
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kelola kategori sumber dana (ZAKAT, INFAK, AMIL, WAKAF, dll) dan kode
          mata anggaran (KMA), per entitas.
        </p>
      </div>

      {/* Form tambah / edit sumber dana */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <h2 className="text-sm font-semibold mb-2">
          {editingId ? "Edit Sumber Dana" : "Tambah Sumber Dana Baru"}
        </h2>

        {error && (
          <div className="text-xs text-red-600 mb-2">{error}</div>
        )}

        <form
          onSubmit={editingId ? handleEditSubmit : handleCreate}
          className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm"
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
              placeholder="Misal: WAKAF"
            />
          </div>

          <div>
            <label className="block text-xs mb-1">
              Kode (wajib, misal: W)
            </label>
            <input
              className="border rounded w-full px-2 py-1.5"
              value={editingId ? editCode : code}
              onChange={(e) =>
                editingId
                  ? setEditCode(e.target.value)
                  : setCode(e.target.value)
              }
              placeholder="Misal: W"
            />
          </div>

          <div>
            <label className="block text-xs mb-1">Entitas</label>
            {entities && entities.length > 0 ? (
              <select
                className="border rounded w-full px-2 py-1.5"
                value={editingId ? editEntityId : entityId}
                onChange={(e) =>
                  editingId
                    ? setEditEntityId(e.target.value)
                    : setEntityId(e.target.value)
                }
              >
                <option value="">Pilih entitas...</option>
                {entities.map((ent) => (
                  <option key={ent.id} value={ent.id}>
                    {ent.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-[11px] text-amber-600">
                Belum ada entitas. Tambahkan dulu di menu Entitas.
              </div>
            )}
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="px-3 py-2 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
              disabled={!entities || entities.length === 0}
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

      {/* Tabel sumber dana + collapse KMA */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <h2 className="text-sm font-semibold mb-2">
          Daftar Sumber Dana
        </h2>

        {fundingSources.length === 0 ? (
          <p className="text-xs text-slate-400">
            Belum ada sumber dana. Tambahkan minimal ZAKAT, INFAK, AMIL, WAKAF.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">No</th>
                  <th className="text-left p-2">Tipe Dana</th>
                  <th className="text-left p-2">Entitas</th>
                  <th className="text-left p-2">Kode</th>
                  <th className="text-left p-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {fundingSources.map((fs, idx) => {
                  const kmaForFs = budgetCodes.filter(
                    (k) => k.funding_source_id === fs.id
                  );
                  const expanded = expandedSourceId === fs.id;

                  return (
                    <React.Fragment key={fs.id}>
                      <tr className="border-b">
                        <td className="p-2">{idx + 1}</td>
                        <td className="p-2">{fs.name}</td>
                        <td className="p-2">
                          {getEntityName(fs.entity_id)}
                        </td>
                        <td className="p-2">{fs.code}</td>
                        <td className="p-2 space-x-2">
                          <button
                            type="button"
                            onClick={() => handleOpenKmaForSource(fs.id)}
                            className="px-2 py-1 text-xs rounded border"
                          >
                            {expanded
                              ? "Sembunyikan KMA"
                              : "KMA Baru / Lihat"}
                          </button>
                          <button
                            type="button"
                            onClick={() => startEdit(fs)}
                            className="px-2 py-1 text-xs rounded border"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(fs)}
                            className="px-2 py-1 text-xs rounded bg-red-600 text-white"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>

                      {expanded && (
                        <tr className="bg-slate-50 border-b">
                          <td colSpan={5} className="p-3">
                            <div className="text-xs font-semibold mb-2">
                              Kode Mata Anggaran untuk {fs.name} ({fs.code})
                            </div>

                            {/* Error KMA */}
                            {kmaError &&
                              kmaFundingSourceId === fs.id && (
                                <div className="text-[11px] text-red-600 mb-2">
                                  {kmaError}
                                </div>
                              )}

                            {/* Form tambah / edit KMA */}
                            <form
                              onSubmit={handleSubmitKma}
                              className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3 text-xs"
                            >
                              <input
                                className="border rounded px-2 py-1.5"
                                placeholder="Kode anggaran (contoh: 122154)"
                                value={kmaCode}
                                onChange={(e) =>
                                  setKmaCode(e.target.value)
                                }
                                onFocus={() =>
                                  setKmaFundingSourceId(fs.id)
                                }
                              />
                              <input
                                className="border rounded px-2 py-1.5"
                                placeholder="Nama anggaran (misal: Inventaris Kantor)"
                                value={kmaName}
                                onChange={(e) =>
                                  setKmaName(e.target.value)
                                }
                                onFocus={() =>
                                  setKmaFundingSourceId(fs.id)
                                }
                              />
                              <div className="flex items-center gap-2">
                                <button
                                  type="submit"
                                  className="px-3 py-1.5 rounded bg-blue-600 text-white"
                                >
                                  {kmaEditingId
                                    ? "Simpan KMA"
                                    : "Tambah KMA"}
                                </button>
                                {kmaEditingId && (
                                  <button
                                    type="button"
                                    onClick={resetKmaForm}
                                    className="px-3 py-1.5 rounded border"
                                  >
                                    Batal
                                  </button>
                                )}
                              </div>
                            </form>

                            {/* Tabel KMA */}
                            {kmaForFs.length === 0 ? (
                              <p className="text-[11px] text-slate-400">
                                Belum ada KMA untuk sumber dana ini.
                              </p>
                            ) : (
                              <table className="w-full text-[11px] md:text-xs">
                                <thead>
                                  <tr className="border-b">
                                    <th className="text-left p-2">
                                      Kode Anggaran
                                    </th>
                                    <th className="text-left p-2">
                                      Nama Anggaran
                                    </th>
                                    <th className="text-left p-2">
                                      Aksi
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {kmaForFs.map((kma) => (
                                    <tr key={kma.id} className="border-b">
                                      <td className="p-2">
                                        {kma.code}
                                      </td>
                                      <td className="p-2">
                                        {kma.name}
                                      </td>
                                      <td className="p-2 space-x-2">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleEditKma(kma)
                                          }
                                          className="px-2 py-1 rounded border"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleDeleteKma(kma)
                                          }
                                          className="px-2 py-1 rounded bg-red-600 text-white"
                                        >
                                          Hapus
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default FundingSourcePage;
