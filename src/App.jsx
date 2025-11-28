import { useEffect, useState } from "react";
import {
  fetchAssets,
  fetchLoans,
  createAsset,
  uploadAssetPhoto,
  borrowAsset,
  returnAsset,
  fetchFundingSources,
  createFundingSource,
  updateFundingSource,
  deleteFundingSource,
  fetchLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  uploadAssetReceipt,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  fetchRoles,
} from "./api";


import Sidebar from "./components/Sidebar";
import AssetTable from "./components/AssetTable";
import LoanHistory from "./components/LoanHistory";
import AssetDetailModal from "./components/AssetDetailModal";
import AddAssetModal from "./components/AddAssetModal";
import FundingSourcePage from "./components/FundingSourcePage";
import LocationPage from "./components/LocationPage";
import CategoryPage from "./components/CategoryPage";
import UserPage from "./components/UserPage";


function App() {
  const [assets, setAssets] = useState([]);
  const [loans, setLoans] = useState([]);
  const [fundingSources, setFundingSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState("assets"); // 'dashboard' | 'assets' | 'funding'
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarSlideIn, setSidebarSlideIn] = useState(false);
  const [selectedFundingFilter, setSelectedFundingFilter] = useState("all");
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCondition, setFilterCondition] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);


  //--reset filter
  const handleResetFilters = () => {
    setSearch("");
    setFilterCondition("");
    setFilterLocation("");
    setSelectedFundingFilter("all");
  };
    // ---------- Lokasi ----------
  const loadLocations = async () => {
    try {
      const data = await fetchLocations();
      setLocations(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------- LOAD DATA ----------
  const loadAssets = async () => {
    setLoading(true);
    try {
      const data = await fetchAssets();
      setAssets(data);
    } finally {
      setLoading(false);
    }
  };

  const loadLoans = async () => {
    const data = await fetchLoans();
    setLoans(data);
  };

  const loadFundingSources = async () => {
    try {
      const data = await fetchFundingSources();
      setFundingSources(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadRoles = async () => {
    try {
      const data = await fetchRoles();
      setRoles(data);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    loadAssets();
    loadLoans();
    loadFundingSources();
    loadLocations();
    loadCategories();
    loadUsers();
    loadRoles();
  }, []);

  // ---------- CREATE ASET ----------
  const handleCreateAsset = async (payload, photoFile, receiptFile) => {
    try {
      // 1. buat aset dulu (kode aset digenerate di backend)
      let newAsset = await createAsset(payload);

      // 2. upload foto aset (WAJIB dari frontend, tapi backend tetap dibuat aman)
      if (photoFile) {
        const updatedPhoto = await uploadAssetPhoto(newAsset.id, photoFile);
        newAsset = updatedPhoto;
      }

      // 3. upload kwitansi pembelian
      if (receiptFile) {
        const updatedReceipt = await uploadAssetReceipt(
          newAsset.id,
          receiptFile
        );
        newAsset = updatedReceipt;
      }

      // 4. simpan aset ke state (sudah mengandung photo_url & receipt_url)
      setAssets((prev) => [newAsset, ...prev]);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: err.message };
    }
  };

  // ---------- FOTO ----------
  const handleUploadPhoto = async (assetId, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const updated = await uploadAssetPhoto(assetId, file);
      setAssets((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
    } catch (err) {
      console.error(err);
    } finally {
      event.target.value = "";
    }
  };

  // ---------- PINJAM / KEMBALIKAN ----------
  const handleBorrow = async (asset) => {
    const borrower = window.prompt("Nama peminjam:", "");
    if (!borrower) return;

    const dueDate = window.prompt(
      "Tanggal jatuh tempo (format: YYYY-MM-DD), boleh dikosongkan:",
      ""
    );

    try {
      const updated = await borrowAsset(asset.id, borrower, dueDate || null);
      setAssets((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
      loadLoans();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleReturn = async (asset) => {
    if (!window.confirm("Yakin aset ini sudah dikembalikan?")) return;

    try {
      const updated = await returnAsset(asset.id);
      setAssets((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
      loadLoans();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // ---------- SUMBER DANA HANDLERS ----------
  const handleCreateFundingSource = async (payload) => {
    const created = await createFundingSource(payload);
    setFundingSources((prev) => [...prev, created]);
  };

  const handleUpdateFundingSource = async (id, payload) => {
    const updated = await updateFundingSource(id, payload);
    setFundingSources((prev) =>
      prev.map((f) => (f.id === updated.id ? updated : f))
    );
  };

  const handleDeleteFundingSource = async (id) => {
    await deleteFundingSource(id);
    setFundingSources((prev) => prev.filter((f) => f.id !== id));
  };

// ---------- FILTER & REKAP ----------
  const filteredAssets = assets.filter((a) => {
    const searchLower = search.toLowerCase();

    // 1) Filter berdasarkan sumber dana
    const matchesFunding =
      selectedFundingFilter === "all" ||
      String(a.funding_source_id) === String(selectedFundingFilter);

    // 2) Pencarian nama/kode
    const matchesSearch =
      searchLower === "" ||
      (a.name || "").toLowerCase().includes(searchLower) ||
      (a.code || "").toLowerCase().includes(searchLower);

    // 3) Filter kondisi
    const matchesCondition =
      filterCondition === "" ||
      (a.condition || "").toLowerCase() === filterCondition.toLowerCase();

    // 4) Filter lokasi utama (location_id)
    const matchesLocation =
      filterLocation === "" ||
      String(a.location_id) === String(filterLocation);

    return matchesFunding && matchesSearch && matchesCondition && matchesLocation;
  });


  const fundingSummary = fundingSources.map((fs) => {
    const asetFs = assets.filter((a) => a.funding_source_id === fs.id);
    const totalValue = asetFs.reduce((sum, a) => {
      const v = Number(a.value);
      if (Number.isNaN(v)) return sum;
      return sum + v;
    }, 0);
    return {
      id: fs.id,
      name: fs.name,
      count: asetFs.length,
      totalValue,
    };
  });

  const handleExportCsv = () => {
    const rows = filteredAssets;

    if (!rows.length) {
      alert("Tidak ada aset untuk diexport.");
      return;
    }

    const getFundingName = (id) => {
      if (!id) return "";
      const f = fundingSources.find((x) => x.id === id);
      return f ? f.name : "";
    };

    const header = [
      "Nama",
      "Kode",
      "Lokasi",
      "Kondisi",
      "Status",
      "Sumber Dana",
      "Nilai",
      "Tanggal Dibuat",
    ];

    const csvRows = [header];

    rows.forEach((a) => {
      csvRows.push([
        a.name || "",
        a.code || "",
        a.location || "",
        a.condition || "",
        a.status || "",
        getFundingName(a.funding_source_id),
        a.value != null ? String(a.value) : "",
        a.created_at || "",
      ]);
    });

    const csvContent = csvRows
      .map((r) =>
        r
          .map((cell) => {
            const v = String(cell ?? "");
            if (v.includes(",") || v.includes('"') || v.includes("\n")) {
              return `"${v.replace(/"/g, '""')}"`;
            }
            return v;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const selectedFsName =
      selectedFundingFilter === "all"
        ? "semua"
        : fundingSources.find(
            (x) => String(x.id) === String(selectedFundingFilter)
          )?.name || "unknown";

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan_aset_${selectedFsName}_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

    // ---------- SIDEBAR MOBILE ----------
    const openSidebar = () => {
      setSidebarOpen(true);
      setTimeout(() => setSidebarSlideIn(true), 10);
    };

    const closeSidebar = () => {
      setSidebarSlideIn(false);
      setTimeout(() => setSidebarOpen(false), 200);
    };

    const handleChangeMenu = (id) => {
      setActiveMenu(id);
      if (sidebarOpen) {
        closeSidebar();
      }
    };


  //----------------LOKASI ---------------------
    const handleCreateLocation = async (payload) => {
      const created = await createLocation(payload);
      setLocations((prev) => [...prev, created]);
    };

    const handleUpdateLocation = async (id, payload) => {
      const updated = await updateLocation(id, payload);
      setLocations((prev) =>
        prev.map((l) => (l.id === updated.id ? updated : l))
      );
    };

    const handleDeleteLocation = async (id) => {
      await deleteLocation(id);
      setLocations((prev) => prev.filter((l) => l.id !== id));
    };



    //------------------------------- Kategory ------------------------------
    const handleCreateCategory = async (payload) => {
      const created = await createCategory(payload);
      setCategories((prev) => [...prev, created]);
    };

    const handleUpdateCategory = async (id, payload) => {
      const updated = await updateCategory(id, payload);
      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
    };

    const handleDeleteCategory = async (id) => {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    };



    //------------------------------- USER ------------------------------
    const handleCreateUser = async (payload) => {
      // payload: { name, email, password, role_ids: [] }
      const created = await createUser(payload);
      // supaya roles ikut ke-update, ambil ulang list user dari server
      await loadUsers();
      return created;
    };

    const handleUpdateUser = async (id, payload) => {
      // payload: { name, email, password (opsional), role_ids: [] }
      const updated = await updateUser(id, payload);
      await loadUsers();
      return updated;
    };

    const handleDeleteUser = async (id) => {
      await deleteUser(id);   // soft delete di backend
      await loadUsers();
    };


  // ---------- RENDER ----------
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block">
        <Sidebar activeMenu={activeMenu} onChange={handleChangeMenu} />
      </div>

      {/* MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeSidebar}
          />
          <div
            className={
              "relative transform transition-transform duration-200 ease-out " +
              (sidebarSlideIn ? "translate-x-0" : "-translate-x-full")
            }
          >
            <Sidebar
              activeMenu={activeMenu}
              onChange={handleChangeMenu}
              className="min-h-screen"
            />
          </div>
        </div>
      )}

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* TOP BAR */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center px-2 py-1 border rounded text-xs text-slate-700 bg-slate-50"
              onClick={openSidebar}
            >
              ☰
            </button>
            <span className="text-sm text-slate-500">
              {activeMenu === "dashboard"
                ? "Dashboard"
                : activeMenu === "assets"
                ? "Assets"
                : activeMenu === "funding"
                ? "Sumber Dana"
                : activeMenu === "locations"
                ? "Lokasi"
                : activeMenu === "categories"
                ? "Kategori Aset"
                : "Users"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>Admin</span>
            <div className="w-7 h-7 rounded-full bg-slate-300" />
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* DASHBOARD */}
            {activeMenu === "dashboard" && (
              <>
                <div>
                  <h1 className="text-2xl font-semibold text-slate-800">
                    Dashboard
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Ringkasan aset dan aktivitas peminjaman.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 text-sm">
                    <div className="text-xs text-slate-500">
                      Total aset
                    </div>
                    <div className="text-xl font-semibold">
                      {assets.length}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 text-sm">
                    <div className="text-xs text-slate-500">
                      Sedang dipinjam
                    </div>
                    <div className="text-xl font-semibold">
                      {assets.filter((a) => a.status === "borrowed").length}
                    </div>
                  </div>
                </div>

                {/* Rekap per sumber dana */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                  <h2 className="text-sm font-semibold mb-2">
                    Rekap nilai aset per sumber dana
                  </h2>

                  {fundingSummary.length === 0 ? (
                    <p className="text-xs text-slate-400">
                      Belum ada sumber dana / aset.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs md:text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">
                              Sumber Dana
                            </th>
                            <th className="text-right p-2">
                              Jumlah Aset
                            </th>
                            <th className="text-right p-2">
                              Total Nilai (Rp)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {fundingSummary.map((row) => (
                            <tr key={row.id} className="border-b">
                              <td className="p-2">{row.name}</td>
                              <td className="p-2 text-right">
                                {row.count}
                              </td>
                              <td className="p-2 text-right">
                                {row.totalValue.toLocaleString("id-ID")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <LoanHistory loans={loans} />
              </>
            )}

            {/* ASSETS */}
            {activeMenu === "assets" && (
              <>
                {/* Header + filter sumber dana + tombol */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-semibold text-slate-800">
                      Assets
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      Kelola daftar aset, foto, dan peminjaman.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Filter sumber dana */}
                    <select
                      className="border rounded px-2 py-1 text-xs"
                      value={selectedFundingFilter}
                      onChange={(e) => setSelectedFundingFilter(e.target.value)}
                    >
                      <option value="all">Semua sumber dana</option>
                      {fundingSources.map((fs) => (
                        <option key={fs.id} value={fs.id}>
                          {fs.name}
                        </option>
                      ))}
                    </select>

                    {/* Export */}
                    <button
                      type="button"
                      onClick={handleExportCsv}
                      className="px-3 py-2 text-sm rounded-lg border text-slate-700 bg-white hover:bg-slate-50"
                    >
                      Export CSV
                    </button>

                    {/* Tambah aset */}
                    <button
                      type="button"
                      onClick={() => setAddModalOpen(true)}
                      className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                    >
                      + Tambah Aset
                    </button>
                  </div>
                </div>

                {/* 🔍 Pencarian + filter kondisi + filter lokasi */}
                <div className="bg-white shadow rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                    {/* SEARCH */}
                    <input
                      className="border px-3 py-2 rounded"
                      placeholder="Cari nama atau kode aset..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />

                    {/* FILTER KONDISI */}
                    <select
                      className="border px-3 py-2 rounded"
                      value={filterCondition}
                      onChange={(e) => setFilterCondition(e.target.value)}
                    >
                      <option value="">Semua kondisi</option>
                      <option value="baik">Baik</option>
                      <option value="rusak">Rusak</option>
                      <option value="cukup">Cukup</option>
                      <option value="maintenance">Maintenance</option>
                    </select>

                    {/* FILTER LOKASI */}
                    <select
                      className="border px-3 py-2 rounded"
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                    >
                      <option value="">Semua lokasi</option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>

                    {/* TOMBOL RESET */}
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="w-full md:w-auto border px-3 py-2 rounded text-xs text-slate-700 bg-slate-50 hover:bg-slate-100"
                      >
                        Reset filter
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tabel aset */}
                <AssetTable
                  assets={filteredAssets}
                  loading={loading}
                  onUploadPhoto={handleUploadPhoto}
                  onBorrow={handleBorrow}
                  onReturn={handleReturn}
                  onShowDetail={setSelectedAsset}
                  onPreviewPhoto={setPreviewUrl}
                  fundingSources={fundingSources}
                  locations={locations}
                  categories={categories}
                />
              </>
            )}


            {/* SUMBER DANA */}
            {activeMenu === "funding" && (
              <FundingSourcePage
                fundingSources={fundingSources}
                onCreate={handleCreateFundingSource}
                onUpdate={handleUpdateFundingSource}
                onDelete={handleDeleteFundingSource}
              />
            )}

            {/* LOKASI */}
            {activeMenu === "locations" && (
              <LocationPage
                locations={locations}
                onCreate={handleCreateLocation}
                onUpdate={handleUpdateLocation}
                onDelete={handleDeleteLocation}
              />
            )}
            {/* KATEGORI ASET */}
            {activeMenu === "categories" && (
              <CategoryPage
                categories={categories}
                onCreate={handleCreateCategory}
                onUpdate={handleUpdateCategory}
                onDelete={handleDeleteCategory}
              />
            )}
            {/* USERS */}
            {activeMenu === "users" && (
              <UserPage
                users={users}
                roles={roles}
                onCreate={handleCreateUser}
                onUpdate={handleUpdateUser}
                onDelete={handleDeleteUser}
              />
            )}
          </div>
        </main>
      </div>

      {/* MODAL PREVIEW FOTO */}
      {previewUrl && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-40"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="bg-white p-3 rounded-lg max-w-3xl max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewUrl}
              alt="Preview aset"
              className="max-h-[80vh] object-contain"
            />
            <div className="mt-2 flex justify-between items-center">
              <button
                onClick={() => setPreviewUrl(null)}
                className="px-3 py-1 text-sm bg-slate-800 text-white rounded"
              >
                Tutup
              </button>
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 text-sm border rounded text-slate-700"
              >
                Buka di tab baru
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETAIL ASET */}
      <AssetDetailModal
        asset={selectedAsset}
        loans={loans}
        fundingSources={fundingSources}
        locations={locations}
        categories={categories} 
        onClose={() => setSelectedAsset(null)}
      />

      {/* MODAL TAMBAH ASET */}
      <AddAssetModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onCreateAsset={handleCreateAsset}
        fundingSources={fundingSources}
        locations={locations}
        categories={categories} 
      />
    </div>
  );
}

export default App;
