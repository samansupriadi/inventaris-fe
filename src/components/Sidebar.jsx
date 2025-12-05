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
        "w-64 bg-slate-900 text-slate-100 min-h-screen flex flex-col " +
        className
      }
    >
      {/* Brand */}
      <button
        type="button"
        onClick={() => onChange("dashboard")}
        className="flex items-center gap-2 px-5 py-4 border-b border-slate-800 hover:bg-slate-800/60 text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold">
          IN
        </div>
        <div>
          <div className="text-sm font-semibold leading-tight">
            Inventaris NGO
          </div>
          <div className="text-[11px] text-slate-400">
            Asset Management
          </div>
        </div>
      </button>

      {/* Menu */}
      <nav className="flex-1 mt-3 px-3 space-y-1 text-sm">
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
                  : item.id === "roles"
                  ? "🛡️"
                  : "✅"}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-slate-800 text-[11px] text-slate-500">
        © {new Date().getFullYear()} Inventaris NGO
      </div>
    </aside>
  );
}

export default Sidebar;
