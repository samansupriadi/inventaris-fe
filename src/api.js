export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";


const getAuthHeader = () => {
  const saved = localStorage.getItem("auth");
  if (!saved) return "";
  try {
    const parsed = JSON.parse(saved);
    return parsed.token ? `Bearer ${parsed.token}` : "";
  } catch {
    return "";
  }
};

// ==== AUTH / LOGIN ======================================
export async function login(email, password) {
  const res = await fetch(`${API_BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal login");
  }

  return res.json();
}

export async function logoutAPI() {
  const url = `${API_BASE_URL}/api/logout`;
  
  // Penting: credentials: "include" agar cookie dikirim ke server untuk dihapus
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", 
  });

  if (!res.ok) {
    // Kita abaikan error logout, karena tujuannya cuma clear session
    return {}; 
  }

  return res.json();
}


// === ASET ===
export async function fetchAssets(entityId) {
  const url = entityId
    ? `${API_BASE_URL}/api/assets?entity_id=${entityId}`
    : `${API_BASE_URL}/api/assets`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Gagal mengambil data aset");
  }
  return res.json();
}


export async function createAsset(asset) {
  const res = await fetch(`${API_BASE_URL}/api/assets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(asset),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal membuat aset");
  }

  return res.json();
}

// === FOTO ASET ===
export async function uploadAssetPhoto(assetId, file) {
  const formData = new FormData();
  formData.append("photo", file);

  const res = await fetch(`${API_BASE_URL}/api/assets/${assetId}/photo`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal upload foto");
  }

  return res.json();
}

// === PINJAM / KEMBALIKAN ASET ===
export async function borrowAsset(assetId, payload) {
  // FIX: Ensure the URL points to the correct endpoint path
  // If API_BASE_URL is "http://localhost:4000", this becomes "http://localhost:4000/api/assets/..."
  const url = `${API_BASE_URL}/api/assets/${assetId}/borrow`; 

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": getAuthHeader(), // Ensure this helper function exists at the top of api.js
    },
    body: JSON.stringify({
      borrower_user_id: payload.borrower_user_id,
      usage_location_id: payload.usage_location_id || null,
      due_date: payload.due_date || null,
      notes: payload.notes || "",
      detail_location: payload.detail_location || "", 
      condition_now: payload.condition_now || "baik",
    }),
  });

  if (!res.ok) {
    let errorMessage = "Gagal meminjam aset";
    try {
      // Try to parse error message from JSON response
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Fallback for non-JSON errors (like 404 HTML pages)
      const text = await res.text();
      console.error("Non-JSON Error Response:", text);
      errorMessage = `Server Error (${res.status}): Terjadi masalah di sisi server.`;
    }
    throw new Error(errorMessage);
  }

  return res.json();
}

export async function returnAsset(assetId, payload) {
  // Pastikan URL ada /api nya
  const url = `${API_BASE_URL}/api/assets/${assetId}/return`; 

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": getAuthHeader(),
    },
    // Pastikan BODY mengirim semua data
    body: JSON.stringify({
      condition_after: payload.condition_after,
      update_asset_location: payload.update_asset_location,
      
      // WAJIB ADA DI SINI JUGA:
      return_location_id: payload.return_location_id || null,
      return_detail_location: payload.return_detail_location || "",
      notes_return: payload.notes_return || ""
    }),
  });

  if (!res.ok) {
    let errorMessage = "Gagal mengembalikan aset";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = `Server Error (${res.status})`;
    }
    throw new Error(errorMessage);
  }

  return res.json();
}


// === RIWAYAT PEMINJAMAN ===
export async function fetchLoans() {
  const res = await fetch(`${API_BASE_URL}/api/loans`);
  if (!res.ok) {
    throw new Error("Gagal mengambil riwayat peminjaman");
  }
  return res.json();
}


// === UPLOAD FOTO KONDISI SAAT PINJAM (BEFORE PHOTO) ===
export async function uploadLoanBeforePhoto(loanId, file) {
  const formData = new FormData();
  formData.append("before_photo", file);

  const res = await fetch(`${API_BASE_URL}/api/loans/${loanId}/before-photo`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal upload foto kondisi (before)");
  }

  return res.json();
}


// === SUMBER DANA ===
export async function fetchFundingSources(entityId) {
  const url = entityId
    ? `${API_BASE_URL}/api/funding-sources?entity_id=${entityId}`
    : `${API_BASE_URL}/api/funding-sources`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Gagal mengambil sumber dana");
  }
  return res.json();
}


export async function createFundingSource(data) {
  const res = await fetch(`${API_BASE_URL}/api/funding-sources`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal membuat sumber dana");
  }

  return res.json();
}

export async function updateFundingSource(id, data) {
  const res = await fetch(`${API_BASE_URL}/api/funding-sources/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal mengubah sumber dana");
  }

  return res.json();
}

export async function deleteFundingSource(id) {
  const res = await fetch(`${API_BASE_URL}/api/funding-sources/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal menghapus sumber dana");
  }

  return res.json();
}



// ==== LOKASI ====

// ambil semua lokasi
export async function fetchLocations() {
  const res = await fetch(`${API_BASE_URL}/api/locations`);
  if (!res.ok) {
    throw new Error("Gagal mengambil lokasi");
  }
  return res.json();
}

export async function createLocation(data) {
  const res = await fetch(`${API_BASE_URL}/api/locations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal membuat lokasi");
  }

  return res.json();
}

export async function updateLocation(id, data) {
  const res = await fetch(`${API_BASE_URL}/api/locations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal mengubah lokasi");
  }

  return res.json();
}

export async function deleteLocation(id) {
  const res = await fetch(`${API_BASE_URL}/api/locations/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal menghapus lokasi");
  }

  return res.json();
}


// === API UPLOAD KWITANSI ===
export async function uploadAssetReceipt(assetId, file) {
  const formData = new FormData();
  formData.append("receipt", file);

  const res = await fetch(`${API_BASE_URL}/api/assets/${assetId}/receipt`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal upload kwitansi");
  }

  return res.json();
}


// ==== KATEGORI ASET ====

export async function fetchCategories() {
  const res = await fetch(`${API_BASE_URL}/api/categories`);
  if (!res.ok) {
    throw new Error("Gagal mengambil kategori aset");
  }
  return res.json();
}

export async function createCategory(data) {
  const res = await fetch(`${API_BASE_URL}/api/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal membuat kategori");
  }

  return res.json();
}

export async function updateCategory(id, data) {
  const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal mengubah kategori");
  }

  return res.json();
}

export async function deleteCategory(id) {
  const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal menghapus kategori");
  }

  return res.json();
}

// ==== ROLES (HAK AKSES) =================================

export async function fetchRoles() {
  const res = await fetch(`${API_BASE_URL}/api/roles`);
  if (!res.ok) {
    throw new Error("Gagal mengambil data role");
  }
  return res.json();
}

export async function createRole(data) {
  const res = await fetch(`${API_BASE_URL}/api/roles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal membuat role");
  }

  return res.json();
}

export async function updateRole(id, data) {
  const res = await fetch(`${API_BASE_URL}/api/roles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal mengubah role");
  }

  return res.json();
}

export async function deleteRole(id) {
  const res = await fetch(`${API_BASE_URL}/api/roles/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal menghapus role");
  }

  return res.json();
}

// ==== PERMISSIONS (HAK AKSES MENU) =========================
export async function fetchPermissions() {
  const res = await fetch(`${API_BASE_URL}/api/permissions`);
  if (!res.ok) {
    throw new Error("Gagal mengambil data permission");
  }
  return res.json();
}

export async function createPermission(data) {
  const res = await fetch(`${API_BASE_URL}/api/permissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal membuat permission");
  }

  return res.json();
}

export async function updatePermission(id, data) {
  const res = await fetch(`${API_BASE_URL}/api/permissions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal mengubah permission");
  }

  return res.json();
}

export async function deletePermission(id) {
  const res = await fetch(`${API_BASE_URL}/api/permissions/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal menghapus permission");
  }

  return res.json();
}


// ==== USERS =============================================

export async function fetchUsers() {
  const res = await fetch(`${API_BASE_URL}/api/users`);
  if (!res.ok) {
    throw new Error("Gagal mengambil data user");
  }
  return res.json();
}

export async function createUser(data) {
  const res = await fetch(`${API_BASE_URL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal membuat user");
  }

  return res.json();
}

export async function updateUser(id, data) {
  const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal mengubah user");
  }

  return res.json();
}

// soft delete
export async function deleteUser(id) {
  const res = await fetch(`${API_BASE_URL}/api/users/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal menghapus user");
  }

  return res.json();
}

// kalau nanti mau dipakai restore (opsional)
export async function restoreUser(id) {
  const res = await fetch(`${API_BASE_URL}/api/users/${id}/restore`, {
    method: "POST",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal me-restore user");
  }

  return res.json();
}


// ==== KODE MATA ANGGARAN (KMA) ======================
export async function fetchBudgetCodes(fundingSourceId) {
  const url = fundingSourceId
    ? `${API_BASE_URL}/api/budget-codes?funding_source_id=${fundingSourceId}`
    : `${API_BASE_URL}/api/budget-codes`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Gagal mengambil kode mata anggaran");
  }
  return res.json();
}


export async function createBudgetCode(data) {
  const res = await fetch(`${API_BASE_URL}/api/budget-codes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal membuat kode mata anggaran");
  }

  return res.json();
}

export async function updateBudgetCode(id, data) {
  const res = await fetch(`${API_BASE_URL}/api/budget-codes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal mengubah kode mata anggaran");
  }

  return res.json();
}

export async function deleteBudgetCode(id) {
  const res = await fetch(`${API_BASE_URL}/api/budget-codes/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal menghapus kode mata anggaran");
  }

  return res.json();
}

// ==== ENTITIES =====================================

export async function fetchEntities() {
  const res = await fetch(`${API_BASE_URL}/api/entities`);
  if (!res.ok) {
    throw new Error("Gagal mengambil entitas");
  }
  return res.json();
}

export async function createEntity(data) {
  const res = await fetch(`${API_BASE_URL}/api/entities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal membuat entitas");
  }

  return res.json();
}

export async function updateEntity(id, data) {
  const res = await fetch(`${API_BASE_URL}/api/entities/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal mengubah entitas");
  }

  return res.json();
}

export async function deleteEntity(id) {
  const res = await fetch(`${API_BASE_URL}/api/entities/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal menghapus entitas");
  }

  return res.json();
}

export async function uploadLoanAfterPhoto(loanId, file) {
  const formData = new FormData();
  formData.append("after_photo", file);

  const res = await fetch(`${API_BASE_URL}/api/loans/${loanId}/after-photo`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal upload foto AFTER");
  }

  return res.json();
}



// === UPDATE ASET ===
export async function updateAsset(assetId, payload) {
  const res = await fetch(`${API_BASE_URL}/api/assets/${assetId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal mengubah aset");
  }

  return res.json();
}

// === SOFT DELETE ASET ===
export async function softDeleteAsset(assetId) {
  const res = await fetch(`${API_BASE_URL}/api/assets/${assetId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal menghapus aset");
  }

  return res.json();
}


// OPTIONAL restore
export async function restoreAsset(assetId) {
  const res = await fetch(`${API_BASE_URL}/api/assets/${assetId}/restore`, {
    method: "POST",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal restore aset");
  }

  return res.json();
}



