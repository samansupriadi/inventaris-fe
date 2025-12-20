// src/App.jsx
import { useEffect, useState } from "react";
import {
  login,
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
  fetchEntities,
  createEntity,
  updateEntity,
  deleteEntity,
  fetchPermissions,
  createRole,
  updateRole,
  deleteRole,
  createPermission,
  updatePermission,
  deletePermission,
  uploadLoanBeforePhoto,
  uploadLoanAfterPhoto,
  updateAsset,
  softDeleteAsset,
} from "./api";

import LoginPage from "./components/LoginPage";
import Sidebar from "./components/Sidebar";
import AssetDetailModal from "./components/AssetDetailModal";
import AddAssetModal from "./components/AddAssetModal";
import FundingSourcePage from "./components/FundingSourcePage";
import LocationPage from "./components/LocationPage";
import CategoryPage from "./components/CategoryPage";
import UserPage from "./components/UserPage";
import EntityPage from "./components/EntityPage";
import PermissionPage from "./components/PermissionPage";
import RolePage from "./components/RolePage";
import QrPrintSheet from "./components/QrPrintSheet.jsx";
import DashboardPage from "./components/DashboardPage.jsx";
import AssetsPage from "./components/AssetsPage.jsx";
import BorrowAssetModal from "./components/BorrowAssetModal";
import ReturnAssetModal from "./components/ReturnAssetModal";

function App() {
  const [assets, setAssets] = useState([]);
  const [loans, setLoans] = useState([]);
  const [fundingSources, setFundingSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState("assets");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarSlideIn, setSidebarSlideIn] = useState(false);

  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [entities, setEntities] = useState([]);
  const [qrPrintAssets, setQrPrintAssets] = useState(null);

  // FILTER aset
  const [selectedFundingFilter, setSelectedFundingFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [filterCondition, setFilterCondition] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterYear, setFilterYear] = useState("");

  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [borrowAssetTarget, setBorrowAssetTarget] = useState(null);
  const [borrowLoading, setBorrowLoading] = useState(false);

  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnAssetTarget, setReturnAssetTarget] = useState(null);
  const [returnLoading, setReturnLoading] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAssetTarget, setEditAssetTarget] = useState(null);

  // PAGINATION aset
  const [assetPage, setAssetPage] = useState(1);
  const ASSET_PAGE_SIZE = 10;

  // ---------- AUTH ----------
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem("auth");
    if (!saved) return { user: null, token: null };
    try {
      return JSON.parse(saved);
    } catch {
      return { user: null, token: null };
    }
  });

  const isLoggedIn = !!auth.user && !!auth.token;

  const handleLogin = async (email, password) => {
    const data = await login(email, password);
    const newAuth = {
      token: data.token,
      user: data.user,
    };
    setAuth(newAuth);
    localStorage.setItem("auth", JSON.stringify(newAuth));
  };

  const handleLogout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem("auth");
    setAssets([]);
    setLoans([]);
    setFundingSources([]);
    setLocations([]);
    setCategories([]);
    setUsers([]);
    setRoles([]);
    setPermissions([]);
    setEntities([]);
  };

  // ---------- PRINT QR ----------
  const handlePrintQr = (asset) => {
    setQrPrintAssets([asset]);
  };

  const handleBulkPrintQr = () => {
    // gunakan semua aset HASIL FILTER (bukan cuma halaman ini)
    setQrPrintAssets(filteredAssets);
  };

  // ---------- RESET FILTER ----------
  const handleResetFilters = () => {
    setSearch("");
    setFilterCondition("");
    setFilterLocation("");
    setSelectedFundingFilter("all");
    setFilterCategory("");
    setFilterStatus("");
    setFilterYear("");
    setAssetPage(1);
  };


  // ---------- LOADERS ----------
  const loadLocations = async () => {
    try {
      const data = await fetchLocations();
      setLocations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadPermissions = async () => {
    try {
      const data = await fetchPermissions();
      setPermissions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAssets = async () => {
    setLoading(true);
    try {
      const entityId = auth.user?.entity?.id || null;
      const data = await fetchAssets(entityId);
      setAssets(data);
    } finally {
      setLoading(false);
    }
  };

  const loadEntities = async () => {
    try {
      const data = await fetchEntities();
      setEntities(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadLoans = async () => {
    const data = await fetchLoans();
    setLoans(data);
  };

  const loadFundingSources = async () => {
    try {
      const entityId = auth.user?.entity?.id || null;
      const data = await fetchFundingSources(entityId);
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
    if (!isLoggedIn) return;
    loadAssets();
    loadLoans();
    loadFundingSources();
    loadLocations();
    loadCategories();
    loadUsers();
    loadRoles();
    loadEntities();
    loadPermissions();
  }, [isLoggedIn]);


  const handleCreateRole = async (payload) => {
    const created = await createRole(payload);
    await loadRoles();
    return created;
  };

  const handleUpdateRole = async (id, payload) => {
    const updated = await updateRole(id, payload);
    await loadRoles();
    return updated;
  };

  const handleDeleteRole = async (id) => {
    await deleteRole(id);
    await loadRoles();
  };

  // ---------- PERMISSION ----------

  const handleCreatePermission = async (payload) => {
    const created = await createPermission(payload);
    setPermissions((prev) => [...prev, created]);
  };

  const handleUpdatePermission = async (id, payload) => {
    const updated = await updatePermission(id, payload);
    setPermissions((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };
  
  const handleDeletePermission = async (id) => {
    await deletePermission(id);
    setPermissions((prev) => prev.filter((p) => p.id !== id));
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

    const handleCategoryChange = (value) => {
      setFilterCategory(value);
      setAssetPage(1);
    };

    const handleStatusChange = (value) => {
      setFilterStatus(value);
      setAssetPage(1);
    };

    const handleYearChange = (value) => {
      setFilterYear(value);
      setAssetPage(1);
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


      // ---------- ENTITAS ----------
    const handleCreateEntity = async (payload) => {
      const created = await createEntity(payload);
      setEntities((prev) => [...prev, created]);
    };

    const handleUpdateEntity = async (id, payload) => {
      const updated = await updateEntity(id, payload);
      setEntities((prev) =>
        prev.map((e) => (e.id === updated.id ? updated : e))
      );
    };

    const handleDeleteEntity = async (id) => {
      await deleteEntity(id);
      setEntities((prev) => prev.filter((e) => e.id !== id));
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
  }


  // ---------- PINJAM (OPEN MODAL) ----------
  const handleBorrow = (asset) => {
    setBorrowAssetTarget(asset);
    setBorrowModalOpen(true);
  };

  const handleSubmitBorrow = async (payload) => {
    try {
      setBorrowLoading(true);

      // payload = data yang dikirim dari BorrowAssetModal
      // Pastikan kita mengambil 'detail_location' dan 'notes' dari payload
      
      const res = await borrowAsset(borrowAssetTarget.id, {
        borrower_user_id: payload.borrower_user_id,
        usage_location_id: payload.usage_location_id,
        due_date: payload.due_date || null,
        
        // --- BAGIAN INI WAJIB ADA AGAR DATA TIDAK KOSONG ---
        detail_location: payload.detail_location, // Mengirim Detail Lokasi
        notes: payload.notes,                     // Mengirim Catatan
        condition_now: payload.condition_now      // Mengirim Kondisi
        // ----------------------------------------------------
      });

      // Upload foto jika ada
      if (payload.photo && res?.loan?.id) {
        await uploadLoanBeforePhoto(res.loan.id, payload.photo);
      }

      // Update state aset di tabel utama secara langsung
      if (res?.asset?.id) {
        setAssets((prev) => 
          prev.map((a) => (a.id === res.asset.id ? res.asset : a))
        );
      } else {
        await loadAssets(); // Fallback reload jika response backend beda
      }

      await loadLoans(); // Refresh history

      // Tutup modal
      setBorrowModalOpen(false);
      setBorrowAssetTarget(null);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setBorrowLoading(false);
    }
  };;

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

  // ---------- FILTER ASET ----------
  const filteredAssets = assets.filter((a) => {
    const searchLower = search.toLowerCase();

    const matchesFunding =
      selectedFundingFilter === "all" ||
      String(a.funding_source_id) === String(selectedFundingFilter);

    const matchesSearch =
      searchLower === "" ||
      (a.name || "").toLowerCase().includes(searchLower) ||
      (a.code || "").toLowerCase().includes(searchLower);

    const matchesCondition =
      filterCondition === "" ||
      (a.condition || "").toLowerCase() === filterCondition.toLowerCase();

    const matchesLocation =
      filterLocation === "" ||
      String(a.location_id) === String(filterLocation);

    const matchesCategory =
      filterCategory === "" ||
      String(a.category_id) === String(filterCategory);

    const matchesStatus =
      filterStatus === "" ||
      (a.status || "").toLowerCase() === filterStatus.toLowerCase();

    const matchesYear =
      filterYear === "" ||
      (a.created_at &&
        new Date(a.created_at).getFullYear().toString() === filterYear);

    return (
      matchesFunding &&
      matchesSearch &&
      matchesCondition &&
      matchesLocation &&
      matchesCategory &&
      matchesStatus &&
      matchesYear
    );
  });


  // ---------- PAGINATION ASET ----------
  const totalAssetPages =
    filteredAssets.length === 0
      ? 1
      : Math.ceil(filteredAssets.length / ASSET_PAGE_SIZE);

  // jaga-jaga kalau setelah filter halaman jadi kebanyakan
  useEffect(() => {
    if (assetPage > totalAssetPages) {
      setAssetPage(totalAssetPages);
    }
  }, [assetPage, totalAssetPages]);

  const paginatedAssets = filteredAssets.slice(
    (assetPage - 1) * ASSET_PAGE_SIZE,
    assetPage * ASSET_PAGE_SIZE
  );

  // ---------- REKAP SUMBER DANA ----------
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

  const assetYears = Array.from(
    new Set(
      assets
        .map((a) =>
          a.created_at ? new Date(a.created_at).getFullYear().toString() : null
        )
        .filter(Boolean)
    )
  ).sort((a, b) => b.localeCompare(a)); // tahun terbaru dulu


  // ---------- EXPORT CSV ----------
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

  // ---------- HANDLER FILTER utk AssetsPage ----------
  const handleSearchChange = (value) => {
    setSearch(value);
    setAssetPage(1);
  };

  const handleConditionChange = (value) => {
    setFilterCondition(value);
    setAssetPage(1);
  };

  const handleLocationChange = (value) => {
    setFilterLocation(value);
    setAssetPage(1);
  };

  const handleFundingFilterChange = (value) => {
    setSelectedFundingFilter(value);
    setAssetPage(1);
  };

  // ---------- LOGIN GATE ----------
  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLogin} />;
  }

  // const handleReturn = async (asset) => {
  // if (!window.confirm("Yakin aset ini sudah dikembalikan?")) return;

  // try {
  //   const updated = await returnAsset(asset.id);

  //   setAssets((prev) =>
  //     prev.map((a) => (a.id === updated.id ? updated : a))
  //   );

  //   await loadLoans();
  // } catch (err) {
  //   console.error(err);
  //   alert(err.message);
  // }
  // };

  const handleReturn = async (asset) => {
    setReturnAssetTarget(asset);
    setReturnModalOpen(true);
  };

  const handleSubmitReturn = async (payload) => {
    try {
      setReturnLoading(true);

      const res = await returnAsset(returnAssetTarget.id, {
        condition_after: payload.condition_after,
        update_asset_location: payload.update_asset_location,
      });

      if (payload.photo && res.loan?.id) {
        await uploadLoanAfterPhoto(res.loan.id, payload.photo);
      }

      setAssets((prev) =>
        prev.map((a) => (a.id === res.asset.id ? res.asset : a))
      );

      setReturnModalOpen(false);
      setReturnAssetTarget(null);
      loadLoans();
    } catch (err) {
      alert(err.message);
    } finally {
      setReturnLoading(false);
    }
  };


  const handleOpenEdit = (asset) => {
    setEditAssetTarget(asset);
    setEditModalOpen(true);
  };

  // ---------- UPDATE ASET (PERBAIKAN) ----------
  // Terima ID dari modal supaya sinkron
  const handleSubmitEdit = async (id, payload, photoFile, receiptFile) => {
    try {
      let updated = await updateAsset(id, payload);

      // optional: kalau kamu mau edit juga bisa upload photo/receipt lagi
      if (photoFile) updated = await uploadAssetPhoto(updated.id, photoFile);
      if (receiptFile) updated = await uploadAssetReceipt(updated.id, receiptFile);

      setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));

      setEditModalOpen(false);
      setEditAssetTarget(null);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const handleDeleteAsset = async (asset) => {
    try {
      await softDeleteAsset(asset.id);
      // remove dari list (karena backend GET sudah filter deleted_at)
      setAssets((prev) => prev.filter((a) => a.id !== asset.id));
    } catch (err) {
      alert(err.message);
    }
  };


  // ---------- RENDER ----------
  return (
    <div className="h-screen bg-slate-100 flex overflow-hidden">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex md:flex-col md:h-full">
        <Sidebar
          activeMenu={activeMenu}
          onChange={handleChangeMenu}
          className="h-full"
        />
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
              className="h-full"
            />
          </div>
        </div>
      )}

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* TOP BAR */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
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
                : activeMenu === "entities"
                ? "Entitas"
                : activeMenu === "locations"
                ? "Lokasi"
                : activeMenu === "categories"
                ? "Kategori Aset"
                : activeMenu === "roles"
                ? "Roles & Hak Akses"
                : activeMenu === "users"
                ? "Users"
                : "Permissions"}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>{auth.user?.name || "User"}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="px-2 py-1 border rounded bg-slate-50 hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="w-full max-w-7xl mx-auto space-y-6">
            {qrPrintAssets ? (
              <QrPrintSheet
                assets={qrPrintAssets}
                fundingSources={fundingSources}
                locations={locations}
                categories={categories}
                onBack={() => setQrPrintAssets(null)}
              />
            ) : (
              <>
                {activeMenu === "dashboard" && (
                  <DashboardPage
                    assets={assets}
                    fundingSummary={fundingSummary}
                  />
                )}

                {activeMenu === "assets" && (
                  <AssetsPage
                    assets={filteredAssets}
                    loading={loading}
                    fundingSources={fundingSources}
                    locations={locations}
                    categories={categories}
                    search={search}
                    filterCondition={filterCondition}
                    filterLocation={filterLocation}
                    selectedFundingFilter={selectedFundingFilter}
                    filterCategory={filterCategory}
                    filterStatus={filterStatus}
                    filterYear={filterYear}
                    years={assetYears}
                    onSearchChange={handleSearchChange}
                    onConditionChange={handleConditionChange}
                    onLocationChange={handleLocationChange}
                    onFundingFilterChange={handleFundingFilterChange}
                    onCategoryChange={handleCategoryChange}
                    onStatusChange={handleStatusChange}
                    onYearChange={handleYearChange}
                    onResetFilters={handleResetFilters}
                    onUploadPhoto={handleUploadPhoto}
                    onBorrow={handleBorrow}
                    onReturn={handleReturn}
                    onShowDetail={setSelectedAsset}
                    onPreviewPhoto={setPreviewUrl}
                    onExportCsv={handleExportCsv}
                    onPrintQr={handlePrintQr}
                    onBulkPrintQr={handleBulkPrintQr}
                    page={assetPage}
                    pageSize={ASSET_PAGE_SIZE}
                    totalItems={filteredAssets.length}
                    totalPages={totalAssetPages}
                    onPageChange={setAssetPage}
                    onOpenAddModal={() => setAddModalOpen(true)}
                    onEditAsset={handleOpenEdit}
                    onDeleteAsset={handleDeleteAsset}
                  />
                )}



                {activeMenu === "funding" && (
                  <FundingSourcePage
                    fundingSources={fundingSources}
                    entities={entities}
                    onCreate={handleCreateFundingSource}
                    onUpdate={handleUpdateFundingSource}
                    onDelete={handleDeleteFundingSource}
                  />
                )}

                {activeMenu === "locations" && (
                  <LocationPage
                    locations={locations}
                    onCreate={handleCreateLocation}
                    onUpdate={handleUpdateLocation}
                    onDelete={handleDeleteLocation}
                  />
                )}

                {activeMenu === "categories" && (
                  <CategoryPage
                    categories={categories}
                    onCreate={handleCreateCategory}
                    onUpdate={handleUpdateCategory}
                    onDelete={handleDeleteCategory}
                  />
                )}

                {activeMenu === "roles" && (
                  <RolePage
                    roles={roles}
                    permissions={permissions}
                    onCreate={handleCreateRole}
                    onUpdate={handleUpdateRole}
                    onDelete={handleDeleteRole}
                  />
                )}

                {activeMenu === "permissions" && (
                  <PermissionPage
                    permissions={permissions}
                    onCreate={handleCreatePermission}
                    onUpdate={handleUpdatePermission}
                    onDelete={handleDeletePermission}
                  />
                )}

                {activeMenu === "users" && (
                  <UserPage
                    users={users}
                    roles={roles}
                    entities={entities}
                    onCreate={handleCreateUser}
                    onUpdate={handleUpdateUser}
                    onDelete={handleDeleteUser}
                  />
                )}

                {activeMenu === "entities" && (
                  <EntityPage
                    entities={entities}
                    onCreate={handleCreateEntity}
                    onUpdate={handleUpdateEntity}
                    onDelete={handleDeleteEntity}
                  />
                )}
              </>
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

      {/* MODAL TAMBAH ASET (Create) */}
      <AddAssetModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onCreateAsset={handleCreateAsset}
        fundingSources={fundingSources}
        locations={locations}
        categories={categories}
      />

      {/* MODAL PINJAM ASET */}
      <BorrowAssetModal
        open={borrowModalOpen}
        asset={borrowAssetTarget}
        users={users}
        locations={locations}
        loading={borrowLoading}
        onClose={() => {
          setBorrowModalOpen(false);
          setBorrowAssetTarget(null);
        }}
        onSubmit={handleSubmitBorrow}
      />

      <ReturnAssetModal
        open={returnModalOpen}
        asset={returnAssetTarget}
        loading={returnLoading}
        onClose={() => {
          setReturnModalOpen(false);
          setReturnAssetTarget(null);
        }}
        onSubmit={handleSubmitReturn}
      />

      {/* MODAL EDIT ASET (SUDAH DIPERBAIKI) */}
      <AddAssetModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setEditAssetTarget(null);
        }}
        onSaveAsset={handleSubmitEdit} // <-- Pakai onSaveAsset untuk edit
        fundingSources={fundingSources}
        locations={locations}
        categories={categories}
        mode="edit"
        asset={editAssetTarget} // <-- Ganti initialData jadi asset agar terbaca
      />


    </div>
  );
}


export default App;