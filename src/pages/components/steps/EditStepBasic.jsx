// import { useState, useEffect } from "react";
// import api from "../../../api/axios";

// export default function EditStepBasic({
//   setStep,
//   setProductId,
//   product,        // 👈 FULL PRODUCT OBJECT (null for add)
//   mode = "add",   // "add" | "edit"
// }) {
//   const [loading, setLoading] = useState(false);
//   const [pageLoading, setPageLoading] = useState(true);

//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);

//   const [form, setForm] = useState({
//     name: "",
//     category_id: "",
//     brand_id: "",
//     description: "",
//     base_price: "",
//     discount: "",
//   });

//   /* =================================================
//      PREFILL FORM (🔥 THIS WAS MISSING)
//   ================================================= */
//   useEffect(() => {
//     if (!product) return;

//     console.log("✅ Prefilling EditStepBasic:", product);

//     setForm({
//       name: product.name || "",
//       category_id: product.category_id || "",
//       brand_id: product.brand_id || "",
//       description: product.description || "",
//       base_price: product.base_price || "",
//       discount: product.discount || "",
//     });
//   }, [product]);

//   /* =================================================
//      FETCH CATEGORY & BRAND
//   ================================================= */
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [catRes, brandRes] = await Promise.all([
//           api.get("/dashboard/list-category"),
//           api.get("/dashboard/get-brands"),
//         ]);

//         setCategories(
//           (catRes.data.data || []).filter(
//             (c) => c.status === "active"
//           )
//         );

//         setBrands(
//           (brandRes.data.data || []).filter(
//             (b) => b.status === "active"
//           )
//         );
//       } catch (error) {
//         console.error(error);
//         alert("Failed to load categories or brands");
//       } finally {
//         setPageLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   /* =================================================
//      FORM HANDLERS
//   ================================================= */
//   const handleChange = (key, value) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   /* =================================================
//      SUBMIT (ADD / EDIT)
//   ================================================= */
//   const handleSubmit = async () => {
//     if (!form.name || !form.category_id || !form.base_price) {
//       alert("Please fill required fields");
//       return;
//     }

//     try {
//       setLoading(true);

//       let res;

//       if (mode === "edit" && product?.id) {
//         // 🔁 UPDATE PRODUCT
//         res = await api.put(
//           `/dashboard/product/update-product/${product.id}`,
//           {
//             name: form.name,
//             category_id: form.category_id,
//             brand_id: form.brand_id || null,
//             description: form.description,
//             base_price: form.base_price,
//             discount: form.discount || 0,
//           }
//         );

//         setProductId(product.id);
//       } else {
//         // ➕ CREATE PRODUCT
//         res = await api.post(
//           "/dashboard/product/create-product",
//           {
//             name: form.name,
//             category_id: form.category_id,
//             brand_id: form.brand_id || null,
//             description: form.description,
//             base_price: form.base_price,
//             discount: form.discount || 0,
//           }
//         );

//         const newId =
//           res.data?.data?.product_id || res.data?.data?.id;

//         if (!newId) {
//           throw new Error("Product ID missing in response");
//         }

//         setProductId(newId);
//       }

//       setStep(2);
//     } catch (err) {
//       console.error(err);
//       alert(
//         err.response?.data?.message ||
//           err.message ||
//           "Failed to save product"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (pageLoading) {
//     return (
//       <div className="text-center py-10">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* HEADER */}
//       <div>
//         <h3 className="text-base font-semibold text-gray-800">
//           Basic Info
//         </h3>
//         <p className="text-sm text-gray-500">
//           Enter the basic details of the product
//         </p>
//       </div>

//       {/* PRODUCT NAME */}
//       <FormGroup label="Product Name">
//         <input
//           type="text"
//           className="input"
//           value={form.name}
//           onChange={(e) =>
//             handleChange("name", e.target.value)
//           }
//         />
//       </FormGroup>

//       {/* CATEGORY */}
//       <FormGroup label="Category">
//         <select
//           className="input"
//           value={form.category_id}
//           onChange={(e) =>
//             handleChange("category_id", e.target.value)
//           }
//         >
//           <option value="">Select category</option>
//           {categories.map((cat) => (
//             <option key={cat.id} value={cat.id}>
//               {cat.name}
//             </option>
//           ))}
//         </select>
//       </FormGroup>

//       {/* BRAND */}
//       <FormGroup label="Brand">
//         <select
//           className="input"
//           value={form.brand_id}
//           onChange={(e) =>
//             handleChange("brand_id", e.target.value)
//           }
//         >
//           <option value="">Select brand</option>
//           {brands.map((brand) => (
//             <option key={brand.id} value={brand.id}>
//               {brand.name}
//             </option>
//           ))}
//         </select>
//       </FormGroup>

//       {/* DESCRIPTION */}
//       <FormGroup label="Description">
//         <textarea
//           rows="3"
//           className="input resize-none"
//           value={form.description}
//           onChange={(e) =>
//             handleChange("description", e.target.value)
//           }
//         />
//       </FormGroup>

//       {/* PRICE */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <FormGroup label="Price (₹)">
//           <input
//             type="number"
//             className="input"
//             value={form.base_price}
//             onChange={(e) =>
//               handleChange("base_price", e.target.value)
//             }
//           />
//         </FormGroup>

//         <FormGroup label="Discount (₹)">
//           <input
//             type="number"
//             className="input"
//             value={form.discount}
//             onChange={(e) =>
//               handleChange("discount", e.target.value)
//             }
//           />
//         </FormGroup>
//       </div>

//       {/* ACTION */}
//       <button
//         onClick={handleSubmit}
//         disabled={loading}
//         className="w-full py-2 rounded bg-indigo-600 text-white disabled:opacity-60"
//       >
//         {loading
//           ? "Saving..."
//           : mode === "edit"
//           ? "Update & Continue"
//           : "Save & Continue"}
//       </button>
//     </div>
//   );
// }

// /* ================= UI HELPER ================= */

// function FormGroup({ label, children }) {
//   return (
//     <div className="space-y-1">
//       <label className="text-sm font-medium text-gray-700">
//         {label}
//       </label>
//       {children}
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";
import api from "../../../api/axios";

export default function EditStepBasic({
  setStep,
  setProductId,
  product,
  mode = "edit",
}) {
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);

  const [newCategory, setNewCategory] = useState("");
  const [newBrand, setNewBrand] = useState("");

  const [form, setForm] = useState({
    name: "",
    category_id: "",
    brand_id: "",
    description: "",
    base_price: "",
    discount: "",
  });

  /* ================= PREFILL ================= */

  useEffect(() => {
    if (!product) return;

    setForm({
      name: product.name || "",
      category_id: product.category_id || "",
      brand_id: product.brand_id || "",
      description: product.description || "",
      base_price: product.base_price || "",
      discount: product.discount || "",
    });
  }, [product]);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get("/dashboard/list-category"),
          api.get("/dashboard/get-brands"),
        ]);

        setCategories(
          (catRes.data?.data || []).filter((c) => c.status === "active")
        );

        setBrands(
          (brandRes.data?.data || []).filter((b) => b.status === "active")
        );
      } catch {
        alert("Failed to load data");
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================= HANDLERS ================= */

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.category_id || !form.base_price) {
      alert("Required fields missing");
      return;
    }

    try {
      setLoading(true);

      await api.put(`/dashboard/product/update-product/${product.id}`, {
        name: form.name,
        category_id: form.category_id,
        brand_id: form.brand_id || null,
        description: form.description,
        base_price: form.base_price,
        discount: form.discount || 0,
      });

      setProductId(product.id);
      setStep(2);
    } catch {
      alert("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD CATEGORY ================= */

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    const res = await api.post("/dashboard/add-category", {
      name: newCategory,
    });

    const created = res.data?.data;
    setCategories((p) => [...p, created]);
    setForm((f) => ({ ...f, category_id: created.id }));
    setNewCategory("");
    setShowCategoryModal(false);
  };

  /* ================= ADD BRAND ================= */

  const handleAddBrand = async () => {
    if (!newBrand.trim()) return;

    const res = await api.post("/dashboard/add-brand", {
      name: newBrand,
    });

    const created = res.data?.data;
    setBrands((p) => [...p, created]);
    setForm((f) => ({ ...f, brand_id: created.id }));
    setNewBrand("");
    setShowBrandModal(false);
  };

  if (pageLoading) {
    return <div className="py-12 text-center">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <p className="text-sm text-gray-500">Update product details</p>
      </div>

      {/* PRODUCT NAME */}
      <FormGroup label="Product Name">
        <input
          className="input"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </FormGroup>

      {/* CATEGORY */}
      <SearchableSelect
        label="Category"
        options={categories}
        value={form.category_id}
        onChange={(id) => handleChange("category_id", id)}
        onAdd={() => setShowCategoryModal(true)}
        placeholder="Select category"
      />

      {/* BRAND */}
      <SearchableSelect
        label="Brand"
        options={brands}
        value={form.brand_id}
        onChange={(id) => handleChange("brand_id", id)}
        onAdd={() => setShowBrandModal(true)}
        placeholder="Select brand"
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

      {/* PRICE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormGroup label="Price (₹)">
          <input
            type="number"
            className="input"
            value={form.base_price}
            onChange={(e) => handleChange("base_price", e.target.value)}
          />
        </FormGroup>

        <FormGroup label="Discount (₹)">
          <input
            type="number"
            className="input"
            value={form.discount}
            onChange={(e) => handleChange("discount", e.target.value)}
          />
        </FormGroup>
      </div>

      {/* ACTION */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-2.5 rounded-lg bg-indigo-600
        text-white hover:bg-indigo-700 transition"
      >
        {loading ? "Updating..." : "Update & Continue →"}
      </button>

      {/* MODALS */}
      {showCategoryModal && (
        <AddModal
          title="Category"
          value={newCategory}
          setValue={setNewCategory}
          onClose={() => setShowCategoryModal(false)}
          onSave={handleAddCategory}
        />
      )}

      {showBrandModal && (
        <AddModal
          title="Brand"
          value={newBrand}
          setValue={setNewBrand}
          onClose={() => setShowBrandModal(false)}
          onSave={handleAddBrand}
        />
      )}
    </div>
  );
}

/* ================= SHARED UI ================= */

function SearchableSelect({
  label,
  options,
  value,
  onChange,
  onAdd,
  placeholder,
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
    o.name.toLowerCase().includes(search.toLowerCase())
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
                    onChange(item.id);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50"
                >
                  {item.name}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-400">
                No results found
              </div>
            )}
          </div>

          <div className="border-t p-2">
            <button
              onClick={() => {
                setOpen(false);
                onAdd();
              }}
              className="text-xs text-indigo-600 hover:underline"
            >
              + Add new {label}
            </button>
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

function AddModal({ title, value, setValue, onClose, onSave }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm
    flex items-center justify-center"
    >
      <div
        className="bg-white rounded-xl shadow-xl
      w-full max-w-sm p-6"
      >
        <div className="flex justify-between mb-4">
          <h3 className="font-semibold text-lg">Add {title}</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <input
          className="input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Enter ${title} name`}
          autoFocus
        />

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-indigo-600
            text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
