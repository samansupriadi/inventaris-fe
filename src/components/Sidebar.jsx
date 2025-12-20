function Sidebar({ activeMenu, onChange, className = "" }) {
  const items = [
    { id: "dashboard", label: "Dashboard" },
    { id: "assets", label: "Assets" },
    { id: "funding", label: "Sumber Dana" },
    { id: "entities", label: "Entitas" },
    { id: "locations", label: "Lokasi" },
    { id: "categories", label: "Kategori Aset" },
    { id: "roles", label: "Roles & Hak Akses" },
    { id: "users", label: "Users" },
    { id: "permissions", label: "Permissions" },
  ];

  return (
    <aside
      className={
        "w-64 bg-slate-900 text-slate-100 h-full flex flex-col " + // h-full, bukan min-h-screen
        className
      }
    >
      {/* Brand Sinergi Foundation */}
      <button
        type="button"
        onClick={() => onChange("dashboard")}
        className="flex items-center gap-3 px-5 py-5 border-b border-slate-800 hover:bg-slate-800/60 text-left transition-colors group"
      >
        {/* Container Logo */}
        <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
          {/* Pastikan file logo sudah ada di folder public/images/ */}
          <img 
            src="/images/logo-sf.png" 
            alt="SF" 
            className="w-full h-full object-contain"
            // Fallback script: Kalau gambar belum ada, otomatis jadi kotak Hijau inisial "SF"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentNode.style.backgroundColor = '#009846'; // Hijau SF
              e.currentTarget.parentNode.innerHTML = '<span class="text-white font-bold text-xs">SF</span>';
            }}
          />
        </div>
        
        {/* Teks Identitas */}
        <div>
          <div className="text-sm font-bold text-slate-100 leading-tight">
            Sinergi Foundation
          </div>
          <div className="text-[10px] font-medium text-emerald-500 mt-0.5 tracking-wide">
            ASSET MANAGEMENT
          </div>
        </div>
      </button>

      {/* Menu */}
      <nav className="flex-1 mt-3 px-3 space-y-1 text-sm overflow-y-auto">
        {items.map((item) => {
          const active = activeMenu === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={
                "w-full flex items-center gap-2 px-3 py-2 rounded-lg transition " +
                (active
                  ? "bg-slate-700 text-white"
                  : "text-slate-300 hover:bg-slate-800")
              }
            >
              <span className="text-lg">
                {item.id === "dashboard"
                  ? "📊"
                  : item.id === "assets"
                  ? "📦"
                  : item.id === "funding"
                  ? "💰"
                  : item.id === "entities"
                  ? "🏛️"
                  : item.id === "locations"
                  ? "🏢"
                  : item.id === "categories"
                  ? "🏷️"
                  : item.id === "roles"
                  ? "🛡️"
                  : item.id === "users"
                  ? "👤"
                  : "✅"}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-slate-800 text-[11px] text-slate-500 flex-shrink-0">
        © {new Date().getFullYear()} Inventaris NGO
      </div>
    </aside>
  );
}

export default Sidebar;
