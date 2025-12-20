// src/components/AssetsPage.jsx
import AssetTable from "./AssetTable";

function AssetsPage({
  assets,
  loading,
  fundingSources,
  locations,
  categories,
  search,
  filterCondition,
  filterLocation,
  selectedFundingFilter,
  filterCategory,
  filterStatus,
  filterYear,
  years,
  onSearchChange,
  onConditionChange,
  onLocationChange,
  onFundingFilterChange,
  onCategoryChange,
  onStatusChange,
  onYearChange,
  onResetFilters,
  onUploadPhoto,
  onBorrow,
  onReturn,
  onShowDetail,
  onPreviewPhoto,
  onExportCsv,
  onPrintQr,
  onBulkPrintQr,
  page,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
  onOpenAddModal,
  onEditAsset,
  onDeleteAsset,
}) {
  // assets di sini = semua aset yang SUDAH difilter (dari App)

  // 🔢 Pagination (ambil aset untuk halaman aktif)
  const startIndex = totalItems === 0 ? 0 : (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pageAssets = assets.slice(startIndex, endIndex);

  // 📊 Ringkasan hasil filter
  const totalFilteredValue = assets.reduce((sum, a) => {
    const v = Number(a.value);
    if (Number.isNaN(v)) return sum;
    return sum + v;
  }, 0);

  const availableCount = assets.filter(
    (a) => (a.status || "").toLowerCase() === "available"
  ).length;

  const borrowedCount = assets.filter(
    (a) => (a.status || "").toLowerCase() === "borrowed"
  ).length;

  return (
    <div className="space-y-4">
      {/* Header + tombol kanan */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Assets</h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola daftar aset, foto, peminjaman, dan QR code.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter sumber dana di header */}
          <select
            className="border rounded px-2 py-1 text-xs"
            value={selectedFundingFilter}
            onChange={(e) => onFundingFilterChange(e.target.value)}
          >
            <option value="all">Semua sumber dana</option>
            {fundingSources.map((fs) => (
              <option key={fs.id} value={fs.id}>
                {fs.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onExportCsv}
            className="px-3 py-2 text-xs md:text-sm rounded-lg border text-slate-700 bg-white hover:bg-slate-50"
          >
            Export CSV
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-3 py-2 text-xs md:text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          >
            + Tambah Aset
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white shadow rounded-xl p-4 mb-2 space-y-3">
        {/* Bar 1: search + kondisi + lokasi + status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
          {/* SEARCH */}
          <input
            className="border px-3 py-2 rounded"
            placeholder="Cari nama atau kode aset..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />

          {/* KONDISI */}
          <select
            className="border px-3 py-2 rounded"
            value={filterCondition}
            onChange={(e) => onConditionChange(e.target.value)}
          >
            <option value="">Semua kondisi</option>
            <option value="baik">Baik</option>
            <option value="cukup">Cukup</option>
            <option value="rusak">Rusak</option>
            <option value="maintenance">Maintenance</option>
          </select>

          {/* LOKASI */}
          <select
            className="border px-3 py-2 rounded"
            value={filterLocation}
            onChange={(e) => onLocationChange(e.target.value)}
          >
            <option value="">Semua lokasi</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>

          {/* STATUS */}
          <select
            className="border px-3 py-2 rounded"
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="">Semua status</option>
            <option value="available">Tersedia</option>
            <option value="borrowed">Dipinjam</option>
            <option value="maintenance">Maintenance</option>
            <option value="lost">Hilang</option>
          </select>
        </div>

        {/* Bar 2: kategori + tahun + tombol reset */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
          {/* KATEGORI */}
          <select
            className="border px-3 py-2 rounded"
            value={filterCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">Semua kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.code ? `${cat.name} (${cat.code})` : cat.name}
              </option>
            ))}
          </select>

          {/* TAHUN (berdasarkan created_at) */}
          <select
            className="border px-3 py-2 rounded"
            value={filterYear}
            onChange={(e) => onYearChange(e.target.value)}
          >
            <option value="">Semua tahun</option>
            {years.map((y) => (
              <option key={y} value={y}>
                Tahun {y}
              </option>
            ))}
          </select>

          {/* spacer biar layout rapi */}
          <div className="hidden md:block" />

          {/* RESET */}
          <div className="flex items-stretch md:justify-end">
            <button
              type="button"
              onClick={onResetFilters}
              className="w-full md:w-auto border px-3 py-2 rounded text-xs text-slate-700 bg-slate-50 hover:bg-slate-100"
            >
              Reset filter
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 RINGKASAN HASIL FILTER */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs md:text-sm">
        <div className="bg-white border border-slate-200 rounded-xl px-3 py-2">
          <div className="text-slate-500">Jumlah aset (hasil filter)</div>
          <div className="mt-1 text-lg font-semibold text-slate-800">
            {assets.length}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-3 py-2">
          <div className="text-slate-500">Total nilai (hasil filter)</div>
          <div className="mt-1 text-lg font-semibold text-slate-800">
            Rp {totalFilteredValue.toLocaleString("id-ID")}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-3 py-2">
          <div className="text-slate-500">Tersedia</div>
          <div className="mt-1 text-lg font-semibold text-emerald-700">
            {availableCount}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl px-3 py-2">
          <div className="text-slate-500">Sedang dipinjam</div>
          <div className="mt-1 text-lg font-semibold text-orange-700">
            {borrowedCount}
          </div>
        </div>
      </div>

      {/* TABEL ASET */}
      <AssetTable
        assets={pageAssets}          
        loading={loading}
        onUploadPhoto={onUploadPhoto}
        onBorrow={onBorrow}
        onReturn={onReturn}
        onShowDetail={onShowDetail}
        onPreviewPhoto={onPreviewPhoto}
        fundingSources={fundingSources}
        locations={locations}
        categories={categories}
        onPrintQr={onPrintQr}
        onBulkPrintQr={onBulkPrintQr}
        onEdit={onEditAsset}
        onDelete={onDeleteAsset}
      />

      {/* PAGINATION */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 mt-2">
        <div>
          Menampilkan{" "}
          <span className="font-semibold">
            {totalItems === 0 ? 0 : startIndex + 1}
          </span>{" "}
          -{" "}
          <span className="font-semibold">
            {totalItems === 0 ? 0 : endIndex}
          </span>{" "}
          dari <span className="font-semibold">{totalItems}</span> aset
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="px-3 py-1 rounded border text-xs disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-slate-50"
          >
            &lt; Sebelumnya
          </button>
          <span>
            Halaman <span className="font-semibold">{page}</span> / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1 rounded border text-xs disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-slate-50"
          >
            Berikutnya &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssetsPage;
