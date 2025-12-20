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
    <div className="space-y-6 font-sans">
      {/* Header + tombol kanan */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Assets</h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola daftar aset, foto, peminjaman, dan QR code.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter sumber dana di header */}
          <select
            className="border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#009846] outline-none"
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
            className="px-4 py-2 text-xs md:text-sm rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors font-medium"
          >
            Export CSV
          </button>

          {/* TOMBOL TAMBAH ASET (HIJAU SF) */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-4 py-2 text-xs md:text-sm rounded-lg bg-[#009846] text-white hover:bg-[#007033] shadow-md hover:shadow-lg transition-all font-medium flex items-center gap-2"
          >
            <span>+</span> Tambah Aset
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white shadow-sm border border-slate-100 rounded-xl p-5 mb-2 space-y-4">
        {/* Bar 1: search + kondisi + lokasi + status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          {/* SEARCH */}
          <input
            className="border border-slate-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#009846] focus:border-[#009846] outline-none transition-all"
            placeholder="Cari nama atau kode aset..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />

          {/* KONDISI */}
          <select
            className="border border-slate-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#009846] focus:border-[#009846] outline-none"
            value={filterCondition}
            onChange={(e) => onConditionChange(e.target.value)}
          >
            <option value="">Semua kondisi</option>
            <option value="baik">Baik</option>
            <option value="cukup">Cukup</option>
            <option value="rusak">Rusak</option>
            <option value="maintenance">Maintenance</option>
            <option value="hilang">Hilang</option>
          </select>

          {/* LOKASI */}
          <select
            className="border border-slate-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#009846] focus:border-[#009846] outline-none"
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
            className="border border-slate-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#009846] focus:border-[#009846] outline-none"
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          {/* KATEGORI */}
          <select
            className="border border-slate-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#009846] focus:border-[#009846] outline-none"
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
            className="border border-slate-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#009846] focus:border-[#009846] outline-none"
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
              className="w-full md:w-auto border px-4 py-2 rounded-lg text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            >
              Reset filter
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 RINGKASAN HASIL FILTER (CARD STYLE SF) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs md:text-sm">
        {/* Card 1: Jumlah Aset (Hijau) */}
        <div className="bg-white border-l-4 border-[#009846] rounded-r-xl shadow-sm px-4 py-3 hover:shadow-md transition-shadow">
          <div className="text-slate-500 font-medium">Jumlah aset</div>
          <div className="mt-1 text-2xl font-bold text-slate-800">
            {assets.length}
          </div>
        </div>

        {/* Card 2: Total Nilai (Biru/Emas) */}
        <div className="bg-white border-l-4 border-blue-500 rounded-r-xl shadow-sm px-4 py-3 hover:shadow-md transition-shadow">
          <div className="text-slate-500 font-medium">Total nilai</div>
          <div className="mt-1 text-xl font-bold text-slate-800">
            Rp {totalFilteredValue.toLocaleString("id-ID")}
          </div>
        </div>

        {/* Card 3: Tersedia (Hijau Muda) */}
        <div className="bg-white border-l-4 border-emerald-400 rounded-r-xl shadow-sm px-4 py-3 hover:shadow-md transition-shadow">
          <div className="text-slate-500 font-medium">Tersedia</div>
          <div className="mt-1 text-2xl font-bold text-emerald-600">
            {availableCount}
          </div>
        </div>

        {/* Card 4: Sedang Dipinjam (Oranye SF) */}
        <div className="bg-white border-l-4 border-[#F68D2E] rounded-r-xl shadow-sm px-4 py-3 hover:shadow-md transition-shadow">
          <div className="text-slate-500 font-medium">Sedang dipinjam</div>
          <div className="mt-1 text-2xl font-bold text-[#F68D2E]">
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
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 mt-4 border-t pt-4">
        <div>
          Menampilkan{" "}
          <span className="font-bold text-slate-700">
            {totalItems === 0 ? 0 : startIndex + 1}
          </span>{" "}
          -{" "}
          <span className="font-bold text-slate-700">
            {totalItems === 0 ? 0 : endIndex}
          </span>{" "}
          dari <span className="font-bold text-slate-700">{totalItems}</span> aset
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="px-3 py-1.5 rounded-md border text-xs disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-[#009846] hover:text-white hover:border-[#009846] transition-colors"
          >
            &lt; Sebelumnya
          </button>
          <span className="bg-slate-100 px-3 py-1.5 rounded-md font-medium text-slate-700">
            Halaman {page} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1.5 rounded-md border text-xs disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-[#009846] hover:text-white hover:border-[#009846] transition-colors"
          >
            Berikutnya &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssetsPage;