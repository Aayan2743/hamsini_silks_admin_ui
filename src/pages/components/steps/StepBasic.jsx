import { useState, useEffect, useRef } from "react";
import api from "../../../api/axios";

export default function StepBasic({ setStep, setProductId }) {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [priceError, setPriceError] = useState("");

  const [bulkFile, setBulkFile] = useState(null);
  const [bulkErrors, setBulkErrors] = useState([]);
  const [bulkSuccess, setBulkSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    category_id: "",
    subcategory_id: "",
    brand_id: "",
    description: "",
    base_price: "",
    purchase_price: "",
    discount: "",
  });

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get("/admin-dashboard/list-category-all"),
          api.get("/admin-dashboard/list-brand"),
        ]);

        setCategories(catRes.data?.data || []);
        setBrands(brandRes.data?.data || []); // 🔥 DO NOT FILTER HERE
      } catch {
        alert("Failed to load data");
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= CATEGORY SPLIT ================= */

  const mainCategories = categories.filter((c) => c.parent_id === null);
  const subCategories = categories.filter(
    (c) => c.parent_id === form.category_id,
  );

  /* ================= PRICE VALIDATION ================= */

  const validatePrices = (purchase, sell) => {
    if (!purchase || !sell) {
      setPriceError("");
      return true;
    }

    if (Number(purchase) > Number(sell)) {
      setPriceError("Purchase price cannot be greater than selling price");
      return false;
    }

    setPriceError("");
    return true;
  };

  /* ================= HANDLERS ================= */

  const handleChange = (key, value) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };

      if (key === "category_id") {
        updated.subcategory_id = "";
      }

      if (key === "base_price" || key === "purchase_price") {
        validatePrices(updated.purchase_price, updated.base_price);
      }

      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.category_id) {
      alert("Required fields missing");
      return;
    }

    if (!validatePrices(form.purchase_price, form.base_price)) return;

    try {
      setLoading(true);

      const res = await api.post("/admin-dashboard/create-product", {
        name: form.name,
        category_id: form.subcategory_id || form.category_id,
        brand_id: form.brand_id || null,
        description: form.description,
        base_price: form.base_price,
        purchase_price: form.purchase_price || 0,
        discount: form.discount || 0,
      });

      const productId = res.data?.product?.id;

      console.log("CREATED PRODUCT ID:", res.data?.product?.id);

      setProductId(productId);
      setStep(2);
    } catch (error) {
      console.error("API ERROR:", error);

      if (error.response) {
        // Backend responded with 4xx / 5xx
        console.error("STATUS:", error.response.status);
        console.error("DATA:", error.response.data);

        alert(error.response.data?.message || "Server error occurred");
      } else if (error.request) {
        // Request sent but no response
        alert("Server not responding");
      } else {
        // JS error
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) return;

    const formData = new FormData();
    formData.append("file", bulkFile);

    try {
      setLoading(true);
      setBulkErrors([]);
      setBulkSuccess("");

      const res = await api.post(
        "/admin-dashboard/product/bulk-upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      setBulkSuccess(`✅ ${res.data.inserted} products uploaded`);

      if (res.data.errors?.length) {
        setBulkErrors(res.data.errors);
      }

      setBulkFile(null);
    } catch (err) {
      console.error(err);

      if (err.response?.data?.errors) {
        // Laravel validation errors
        setBulkErrors(err.response.data.errors);
      } else {
        setBulkErrors([
          { row: "-", errors: { general: [err.message || "Upload failed"] } },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <div className="py-12 text-center">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
      {bulkSuccess && (
        <div className="p-3 rounded-lg bg-green-100 text-green-800 text-sm">
          {bulkSuccess}
        </div>
      )}

      {/* BULK UPLOAD ERRORS */}
      {bulkErrors.length > 0 && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
          <h4 className="text-sm font-semibold text-red-700 mb-2">
            Upload Errors
          </h4>

          <ul className="text-sm text-red-700 space-y-1 max-h-40 overflow-y-auto">
            {bulkErrors.map((item, i) => (
              <li key={i}>
                <strong>Row {item.row}:</strong>{" "}
                {Object.values(item.errors).flat().join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* HEADER */}
      <div>
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <p className="text-sm text-gray-500">Enter product details</p>
      </div>
      {/* ================= BULK UPLOAD ================= */}
      <div className="border rounded-xl p-4 bg-gray-50 space-y-3">
        <h4 className="font-medium text-gray-800">Bulk Upload Products</h4>

        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(e) => setBulkFile(e.target.files[0])}
          className="block w-full text-sm"
        />

        <button
          onClick={handleBulkUpload}
          disabled={!bulkFile || loading}
          className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm
               hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Excel"}
        </button>

        <p className="text-xs text-gray-500">
          Upload Excel file to create multiple products at once
        </p>
      </div>

      {/* PRODUCT NAME */}
      <FormGroup label="Product Name">
        <input
          className="input"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter product name"
        />
      </FormGroup>

      {/* CATEGORY */}
      <SearchableSelect
        label="Category"
        options={mainCategories}
        value={form.category_id}
        onChange={(id) => handleChange("category_id", id)}
        placeholder="Select category"
      />

      {/* SUB CATEGORY */}
      {form.category_id && subCategories.length > 0 && (
        <SearchableSelect
          label="Sub Category"
          options={subCategories}
          value={form.subcategory_id}
          onChange={(id) => handleChange("subcategory_id", id)}
          placeholder="Select sub category"
        />
      )}

      {/* BRAND */}
      <SearchableSelect
        label="Brand"
        options={brands}
        value={form.brand_id}
        onChange={(id) => handleChange("brand_id", id)}
        placeholder="Select brand"
        showStatus
      />

      {/* DESCRIPTION */}
      <FormGroup label="Description">
        <textarea
          rows="3"
          className="input resize-none"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </FormGroup>

      {/* PRICES */}

      {/* ACTION */}
      <button
        onClick={handleSubmit}
        disabled={loading || !!priceError}
        className="w-full py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save & Continue →"}
      </button>
    </div>
  );
}

/* ================= SEARCHABLE SELECT ================= */

function SearchableSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
  showStatus = false,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) =>
      ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const selected = options.find((o) => o.id == value);
  const filtered = options.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-1 relative" ref={ref}>
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="input flex justify-between items-center"
      >
        <span className={selected ? "" : "text-gray-400"}>
          {selected ? selected.name : placeholder}
        </span>
        <span className="text-gray-400">▾</span>
      </button>

      {open && (
        <div className="absolute z-40 w-full mt-1 rounded-lg border bg-white shadow-lg">
          <div className="p-2 border-b">
            <input
              autoFocus
              className="input"
              placeholder={`Search ${label}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="max-h-52 overflow-y-auto">
            {filtered.length ? (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (showStatus && item.status === "inactive") return;
                    onChange(item.id);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`px-3 py-2 text-sm cursor-pointer
                    ${
                      showStatus && item.status === "inactive"
                        ? "text-gray-400 cursor-not-allowed"
                        : "hover:bg-indigo-50"
                    }`}
                >
                  {item.name}
                  {showStatus && item.status === "inactive" && (
                    <span className="text-xs ml-2">(Inactive)</span>
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-400">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= UI HELPERS ================= */

function FormGroup({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}
