// src/components/ImportPage.jsx
import { useState } from "react";
import * as xlsx from "xlsx"; // Frontend juga butuh xlsx buat generate template
import { importAssetsExcel } from "../api";

function ImportPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // 1. Fungsi Download Template
  const handleDownloadTemplate = () => {
    // Data dummy untuk contoh user
    const templateData = [
      {
        "Nama Aset": "Laptop Lenovo Thinkpad",
        "Kode Aset": "AST-2025-001",
        "Kategori": "Elektronik",
        "Lokasi": "Kantor Pusat",
        "Sumber Dana": "Wakaf",
        "Kondisi": "Baik",
        "Nilai": 15000000,
        "Tanggal Pembelian": "2025-01-20",
        "Keterangan": "Aset operasional IT"
      },
      {
        "Nama Aset": "Meja Kerja Kayu",
        "Kode Aset": "", // Kosongkan biar auto-generate
        "Kategori": "Furniture",
        "Lokasi": "Gudang B",
        "Sumber Dana": "Hibah",
        "Kondisi": "Rusak Ringan",
        "Nilai": 500000,
        "Tanggal Pembelian": "2024-12-01",
        "Keterangan": ""
      }
    ];

    const ws = xlsx.utils.json_to_sheet(templateData);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Template_Import");
    xlsx.writeFile(wb, "Template_Import_Aset.xlsx");
  };

  // 2. Handle Upload
  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) return alert("Pilih file Excel dulu!");

    if (!window.confirm("Yakin ingin mengimport data ini? Pastikan format sesuai template.")) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await importAssetsExcel(file);
      setMessage({ type: "success", text: res.message });
      setFile(null);
      // Reset input file
      document.getElementById("fileInput").value = "";
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Import Data Massal</h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload file Excel untuk memasukkan banyak aset sekaligus.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CARD 1: DOWNLOAD TEMPLATE */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl mb-4">
              📥
            </div>
            <h3 className="text-lg font-bold text-slate-800">Langkah 1: Download Template</h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Gunakan file template Excel yang sudah kami sediakan agar format kolom sesuai dengan sistem.
              <br/><br/>
              <span className="font-semibold text-slate-700">Fitur Cerdas:</span> Jika Kategori, Lokasi, atau Sumber Dana di Excel belum ada di sistem, sistem akan <span className="text-green-600 font-bold">membuatnya secara otomatis</span>.
            </p>
          </div>
          <button 
            onClick={handleDownloadTemplate}
            className="mt-6 w-full py-2.5 bg-white border border-blue-600 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
          >
            Download Template.xlsx
          </button>
        </div>

        {/* CARD 2: UPLOAD FILE */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-2xl mb-4">
            📤
          </div>
          <h3 className="text-lg font-bold text-slate-800">Langkah 2: Upload File</h3>
          <p className="text-sm text-slate-500 mt-2 mb-6">
            Pilih file Excel yang sudah diisi, lalu klik Import.
          </p>

          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleImport} className="space-y-4">
            <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 hover:bg-slate-50 transition-colors text-center cursor-pointer group">
              <input 
                id="fileInput"
                type="file" 
                accept=".xlsx, .xls"
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center pointer-events-none">
                <svg className="w-8 h-8 text-slate-400 group-hover:text-green-500 mb-2 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                <p className="text-sm text-slate-600 font-medium">
                  {file ? file.name : "Klik atau seret file ke sini"}
                </p>
                <p className="text-xs text-slate-400 mt-1">Format .xlsx atau .xls</p>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || !file}
              className="w-full py-3 bg-[#009846] text-white font-bold rounded-lg shadow-lg shadow-green-900/20 hover:bg-[#007b3a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Sedang Memproses...
                </>
              ) : (
                "Mulai Import Data"
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default ImportPage;