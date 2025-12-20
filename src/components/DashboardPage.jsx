// src/components/DashboardPage.jsx
import { useMemo } from "react";

function DashboardPage({ assets, fundingSummary }) {
  // Hitung statistik tambahan biar dashboard lebih kaya
  const stats = useMemo(() => {
    const totalAssets = assets.length;
    const borrowed = assets.filter((a) => a.status === "borrowed").length;
    const available = assets.filter((a) => a.status === "available").length;
    const totalValue = assets.reduce((sum, a) => sum + (Number(a.value) || 0), 0);

    return { totalAssets, borrowed, available, totalValue };
  }, [assets]);

  return (
    <div className="space-y-6 font-sans">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Dashboard
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Ringkasan aset, nilai kekayaan, dan aktivitas peminjaman Sinergi Foundation.
        </p>
      </div>

      {/* STATS CARDS - Menggunakan Style SF (Border Kiri Tebal) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Total Aset (Hijau SF) */}
        <div className="bg-white rounded-r-xl border-l-4 border-[#009846] shadow-sm p-4 hover:shadow-md transition-all">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Aset</div>
          <div className="mt-1 text-2xl font-bold text-slate-800">{stats.totalAssets}</div>
          <div className="text-[10px] text-slate-400 mt-1">Unit barang terdaftar</div>
        </div>

        {/* Card 2: Total Nilai (Biru Keuangan) */}
        <div className="bg-white rounded-r-xl border-l-4 border-blue-500 shadow-sm p-4 hover:shadow-md transition-all">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total Nilai Aset</div>
          <div className="mt-1 text-xl font-bold text-slate-800">
            Rp {stats.totalValue.toLocaleString("id-ID")}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Estimasi valuasi</div>
        </div>

        {/* Card 3: Tersedia (Hijau Muda) */}
        <div className="bg-white rounded-r-xl border-l-4 border-emerald-400 shadow-sm p-4 hover:shadow-md transition-all">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tersedia</div>
          <div className="mt-1 text-2xl font-bold text-emerald-600">{stats.available}</div>
          <div className="text-[10px] text-slate-400 mt-1">Siap digunakan</div>
        </div>

        {/* Card 4: Dipinjam (Oranye SF) */}
        <div className="bg-white rounded-r-xl border-l-4 border-[#F68D2E] shadow-sm p-4 hover:shadow-md transition-all">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Sedang Dipinjam</div>
          <div className="mt-1 text-2xl font-bold text-[#F68D2E]">{stats.borrowed}</div>
          <div className="text-[10px] text-slate-400 mt-1">Butuh pemantauan</div>
        </div>
      </div>

      {/* REKAP SUMBER DANA */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-800">
            📊 Rekap Aset per Sumber Dana
          </h2>
        </div>

        {fundingSummary.length === 0 ? (
          <div className="p-8 text-center">
             <p className="text-sm text-slate-400">Belum ada data sumber dana.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              {/* HEADER TABEL HIJAU SF */}
              <thead className="bg-[#009846]/5 border-b border-[#009846]/10">
                <tr>
                  <th className="text-left p-3 font-bold text-[#007033]">Sumber Dana</th>
                  <th className="text-right p-3 font-bold text-[#007033]">Jumlah Unit</th>
                  <th className="text-right p-3 font-bold text-[#007033]">Total Nilai (Rp)</th>
                  <th className="text-right p-3 font-bold text-[#007033]">Proporsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fundingSummary.map((row) => {
                  // Hitung persentase sederhana
                  const percentage = stats.totalValue > 0 
                    ? Math.round((row.totalValue / stats.totalValue) * 100) 
                    : 0;

                  return (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-medium text-slate-700">{row.name}</td>
                      <td className="p-3 text-right text-slate-600">{row.count}</td>
                      <td className="p-3 text-right font-medium text-slate-800">
                        {row.totalValue.toLocaleString("id-ID")}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-[10px] text-slate-400">{percentage}%</span>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#009846]" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
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

export default DashboardPage;