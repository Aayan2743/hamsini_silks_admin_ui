import { useState, useEffect, useRef } from "react";
import api from "../../../api/axios";

export default function EditStepBasic({ setStep, setProductId, product }) {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [form, setForm] = useState({
    name: "",
    category_id: "",
    subcategory_id: "",
    brand_id: "",
    description: "",
    base_price: "",
    discount: "",
  });

  /* ================= PREFILL FROM PRODUCT ================= */

  useEffect(() => {
    if (!product) return;

    const isSubCategory = product.category?.parent_id;

    setForm({
      name: product.name ?? "",
      category_id: isSubCategory
        ? String(product.category.parent_id) // MAIN category
        : String(product.category_id ?? ""),

      subcategory_id: isSubCategory
        ? String(product.category_id) // SUB category
        : "",

      brand_id: product.brand_id ? String(product.brand_id) : "",
      description: product.description ?? "",
      base_price: product.base_price ?? "",
      discount: product.discount ?? "",
    });
  }, [product]);

  /* ================= FETCH CATEGORY & BRAND ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get("/admin-dashboard/list-category-all"),
          api.get("/admin-dashboard/list-brand"),
        ]);

        setCategories(catRes.data?.data || []);
        setBrands(brandRes.data?.data || []);
      } catch (err) {
        alert("Failed to load data");
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= CATEGORY SPLIT (SAME AS ADD) ================= */

  const mainCategories = categories.filter((c) => c.parent_id === null);

  const subCategories = categories.filter(
    (c) => String(c.parent_id) === String(form.category_id),
  );

  /* ================= HANDLERS ================= */

  const handleChange = (key, value) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };

      if (key === "category_id") {
        updated.subcategory_id = "";
      }

      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.category_id) {
      alert("Required fields missing");
      return;
    }

    try {
      setLoading(true);

      await api.post(`/admin-dashboard/update-product/${product.id}`, {
        name: form.name,
        category_id: form.subcategory_id || form.category_id,
        brand_id: form.brand_id || null,
        description: form.description,
        base_price: form.base_price,
        discount: form.discount || 0,
      });

      setProductId(product.id);
      setStep(2);
    } catch (err) {
      alert("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <div className="py-12 text-center">Loading...</div>;
  }

  const hasSubCategory = form.category_id && subCategories.length > 0;

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <p className="text-sm text-gray-500">Update product details</p>
      </div>

      {/* PRODUCT NAME - ALWAYS FULL WIDTH */}
      <FormGroup label="Product Name">
        <input
          className="input"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </FormGroup>

      {/* CATEGORY SECTION (DYNAMIC) */}
      <div
        className={`grid gap-6 ${
          hasSubCategory ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {/* CATEGORY */}
        <SearchableSelect
          label="Category"
          options={mainCategories}
          value={form.category_id}
          onChange={(id) => handleChange("category_id", id)}
          placeholder="Select category"
        />

        {/* SUB CATEGORY */}
        {hasSubCategory && (
          <SearchableSelect
            label="Sub Category"
            options={subCategories}
            value={form.subcategory_id}
            onChange={(id) => handleChange("subcategory_id", id)}
            placeholder="Select sub category"
          />
        )}
      </div>

      {/* DESCRIPTION - FULL WIDTH */}
      <FormGroup label="Description">
        <textarea
          rows="3"
          className="input resize-none"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </FormGroup>

      {/* UPDATE BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
      >
        {loading ? "Updating..." : "Update & Continue →"}
      </button>
    </div>
  );
}

/* ================= SHARED COMPONENTS ================= */

function SearchableSelect({ label, options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) =>
      ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // const selected = options.find((o) => String(o.id) === String(value));
  const selected = options.find((o) => String(o.id) === String(value));

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
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onChange(item.id);
                  setOpen(false);
                  setSearch("");
                }}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50"
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FormGroup({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}
