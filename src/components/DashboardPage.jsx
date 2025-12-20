// src/components/DashboardPage.jsx
function DashboardPage({ assets, fundingSummary }) {
  return (
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
          <div className="text-xs text-slate-500">Total aset</div>
          <div className="text-xl font-semibold">{assets.length}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 text-sm">
          <div className="text-xs text-slate-500">Sedang dipinjam</div>
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
                  <th className="text-left p-2">Sumber Dana</th>
                  <th className="text-right p-2">Jumlah Aset</th>
                  <th className="text-right p-2">Total Nilai (Rp)</th>
                </tr>
              </thead>
              <tbody>
                {fundingSummary.map((row) => (
                  <tr key={row.id} className="border-b">
                    <td className="p-2">{row.name}</td>
                    <td className="p-2 text-right">{row.count}</td>
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
    </>
  );
}

export default DashboardPage;
