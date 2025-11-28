export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

// === ASET ===
export async function fetchAssets() {
  const res = await fetch(`${API_BASE_URL}/api/assets`);
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
export async function borrowAsset(assetId, borrower, dueDate) {
  const res = await fetch(`${API_BASE_URL}/api/assets/${assetId}/borrow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      borrower,
      due_date: dueDate || null,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal meminjam aset");
  }

  return res.json();
}

export async function returnAsset(assetId) {
  const res = await fetch(`${API_BASE_URL}/api/assets/${assetId}/return`, {
    method: "POST",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal mengembalikan aset");
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

// === SUMBER DANA ===
export async function fetchFundingSources() {
  const res = await fetch(`${API_BASE_URL}/api/funding-sources`);
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

