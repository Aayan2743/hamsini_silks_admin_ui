import { useState, useEffect, useRef } from "react";
import api from "../../../api/axios";

export default function StepBasic({ setStep, setProductId }) {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [priceError, setPriceError] = useState("");

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

  if (pageLoading) {
    return <div className="py-12 text-center">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <p className="text-sm text-gray-500">Enter product details</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* <FormGroup label="Price (₹)">
          <input
            type="number"
            className="input"
            value={form.base_price}
            onChange={(e) => handleChange("base_price", e.target.value)}
          />
        </FormGroup>

        <FormGroup label="Purchase Price (₹)">
          <input
            type="number"
            className={`input ${priceError ? "border-red-500" : ""}`}
            value={form.purchase_price}
            onChange={(e) => handleChange("purchase_price", e.target.value)}
          />
          {priceError && (
            <p className="text-xs text-red-600 mt-1">{priceError}</p>
          )}
        </FormGroup> */}
      </div>

      {/* <FormGroup label="Discount (₹)">
        <input
          type="number"
          className="input"
          value={form.discount}
          onChange={(e) => handleChange("discount", e.target.value)}
        />
      </FormGroup> */}

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
