// // import { useState, useEffect } from "react";
// // import CategoryForm from "./components/CategoryForm";
// // import useDynamicTitle from "../hooks/useDynamicTitle";
// // import api from "../api/axios";

// // const PAGE_SIZES = [5, 10, 20];

// // export default function Category() {
// //   useDynamicTitle("Categories");

// //   const [categories, setCategories] = useState([]);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [loading, setLoading] = useState(false);

// //   const [search, setSearch] = useState("");
// //   const [page, setPage] = useState(1);
// //   const [perPage, setPerPage] = useState(5);

// //   const [openForm, setOpenForm] = useState(false);
// //   const [editData, setEditData] = useState(null);

// //   /* ================= FETCH CATEGORIES ================= */
// //   const fetchCategories = async () => {
// //     try {
// //       setLoading(true);

// //       const res = await api.get("/dashboard/list-category", {
// //         params: {
// //           search,
// //           page,
// //           perPage,
// //         },
// //       });

// //       setCategories(res.data.data);
// //       setTotalPages(res.data.pagination.totalPages);
// //     } catch (error) {
// //       console.error(error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchCategories();
// //   }, [search, page, perPage]);

// //   /* ================= CRUD ================= */

// //   const handleAdd = () => {
// //     setEditData(null);
// //     setOpenForm(true);
// //   };

// //   const handleEdit = (cat) => {
// //     setEditData(cat);
// //     setOpenForm(true);
// //   };

// //   const handleDelete = async (id) => {
// //     if (!window.confirm("Are you sure you want to delete this category?"))
// //       return;

// //     try {
// //       await api.delete(`/dashboard/delete-category/${id}`);
// //       fetchCategories();
// //     } catch (error) {
// //       alert(error.response?.data?.message || "Delete failed");
// //     }
// //   };

// //   const handleSave = async (formData, id) => {
// //     try {
// //       if (id) {
// //         await api.put(`/dashboard/update-category/${id}`, formData, {
// //           headers: { "Content-Type": "multipart/form-data" },
// //         });
// //       } else {
// //         await api.post("/dashboard/add-category", formData, {
// //           headers: { "Content-Type": "multipart/form-data" },
// //         });
// //       }

// //       setOpenForm(false);
// //       setEditData(null);
// //       fetchCategories();
// //     } catch (error) {
// //       alert(error.response?.data?.message || "Something went wrong");
// //     }
// //   };

// //   /* ================= UI ================= */

// //   return (
// //     <div className="space-y-6">
// //       {/* HEADER */}
// //       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
// //         <h1 className="text-2xl font-semibold">Categories</h1>

// //         <div className="flex gap-3">
// //           <input
// //             placeholder="Search category..."
// //             value={search}
// //             onChange={(e) => {
// //               setSearch(e.target.value);
// //               setPage(1);
// //             }}
// //             className="h-10 px-3 border rounded-lg text-sm w-full md:w-64"
// //           />

// //           <button
// //             onClick={handleAdd}
// //             className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
// //           >
// //             + Add Category
// //           </button>
// //         </div>
// //       </div>

// //       {/* DESKTOP TABLE */}
// //       <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
// //         <table className="w-full text-sm">
// //           <thead className="bg-gray-100 text-gray-600">
// //             <tr>
// //               <th className="px-4 py-3 text-left">Image</th>
// //               <th className="px-4 py-3 text-left">Category Name</th>
// //               <th className="px-4 py-3 text-left">Action</th>
// //             </tr>
// //           </thead>

// //           <tbody>
// //             {loading ? (
// //               <tr>
// //                 <td colSpan="3" className="text-center py-8">
// //                   Loading...
// //                 </td>
// //               </tr>
// //             ) : categories.length > 0 ? (
// //               categories.map((cat) => (
// //                 <tr key={cat.id} className="border-t">
// //                   <td className="px-4 py-3">
// //                     <CategoryImage image={cat.full_image_url} />
// //                   </td>
// //                   <td className="px-4 py-3 font-medium">{cat.name}</td>
// //                   <td className="px-4 py-3 space-x-4">
// //                     <button
// //                       onClick={() => handleEdit(cat)}
// //                       className="text-indigo-600 hover:underline"
// //                     >
// //                       Edit
// //                     </button>
// //                     <button
// //                       onClick={() => handleDelete(cat.id)}
// //                       className="text-red-600 hover:underline"
// //                     >
// //                       Delete
// //                     </button>
// //                   </td>
// //                 </tr>
// //               ))
// //             ) : (
// //               <tr>
// //                 <td colSpan="3" className="text-center py-8 text-gray-500">
// //                   No categories found
// //                 </td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* MOBILE CARDS */}
// //       <div className="md:hidden space-y-4">
// //         {categories.map((cat) => (
// //           <div
// //             key={cat.id}
// //             className="bg-white border rounded-xl p-4 flex gap-4 items-center"
// //           >
// //             <CategoryImage image={cat.full_image_url} size="lg" />
// //             <div className="flex-1">
// //               <p className="font-medium">{cat.name}</p>
// //               <button
// //                 onClick={() => handleEdit(cat)}
// //                 className="text-indigo-600 text-sm mt-1"
// //               >
// //                 Edit
// //               </button>
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* PAGINATION */}
// //       {totalPages > 1 && (
// //         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
// //           <div className="flex items-center gap-2 text-sm">
// //             <span>Show</span>
// //             <select
// //               value={perPage}
// //               onChange={(e) => {
// //                 setPerPage(Number(e.target.value));
// //                 setPage(1);
// //               }}
// //               className="border rounded px-2 py-1"
// //             >
// //               {PAGE_SIZES.map((s) => (
// //                 <option key={s} value={s}>
// //                   {s}
// //                 </option>
// //               ))}
// //             </select>
// //             <span>entries</span>
// //           </div>

// //           <div className="flex items-center gap-2">
// //             <button
// //               disabled={page === 1}
// //               onClick={() => setPage(page - 1)}
// //               className="px-3 py-1 border rounded disabled:opacity-50"
// //             >
// //               Prev
// //             </button>

// //             {Array.from({ length: totalPages }).map((_, i) => (
// //               <button
// //                 key={i}
// //                 onClick={() => setPage(i + 1)}
// //                 className={`px-3 py-1 rounded border text-sm ${
// //                   page === i + 1
// //                     ? "bg-indigo-600 text-white border-indigo-600"
// //                     : "hover:bg-gray-100"
// //                 }`}
// //               >
// //                 {i + 1}
// //               </button>
// //             ))}

// //             <button
// //               disabled={page === totalPages}
// //               onClick={() => setPage(page + 1)}
// //               className="px-3 py-1 border rounded disabled:opacity-50"
// //             >
// //               Next
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       {openForm && (
// //         <CategoryForm
// //           data={editData}
// //           onClose={() => setOpenForm(false)}
// //           onSave={handleSave}
// //         />
// //       )}
// //     </div>
// //   );
// // }

// // /* ================= IMAGE COMPONENT ================= */

// // function CategoryImage({ image, size = "sm" }) {
// //   const sizes = size === "lg" ? "w-16 h-16" : "w-12 h-12";

// //   return (
// //     <div
// //       className={`${sizes} rounded-lg bg-gray-100 border flex items-center justify-center overflow-hidden`}
// //     >
// //       {image ? (
// //         <img src={image} alt="" className="w-full h-full object-cover" />
// //       ) : (
// //         <span className="text-gray-400 text-xs">No Image</span>
// //       )}
// //     </div>
// //   );
// // }

// import { useEffect, useState } from "react";

// import api from "../api/axios";

// export default function CategoryForm({ data, onClose, onSave }) {
//   const [form, setForm] = useState({
//     name: "",
//     parent_id: "",
//     image: null,
//   });

//   const [parents, setParents] = useState([]);
//   const [loading, setLoading] = useState(false);

//   /* ================= LOAD PARENTS ================= */
//   useEffect(() => {
//     api
//       .get("/admin-dashboard/list-category", {
//         params: { perPage: 100 },
//       })
//       .then((res) => {
//         // only main categories
//         const mainCats = res.data.data.filter(
//           (c) => !c.parent_id || c.id !== data?.id,
//         );
//         setParents(mainCats);
//       });
//   }, [data]);

//   /* ================= EDIT MODE ================= */
//   useEffect(() => {
//     if (data) {
//       setForm({
//         name: data.name || "",
//         parent_id: data.parent_id || "",
//         image: null,
//       });
//     }
//   }, [data]);

//   /* ================= HANDLERS ================= */
//   const handleChange = (field, value) => {
//     setForm({ ...form, [field]: value });
//   };

//   const handleSubmit = async () => {
//     const formData = new FormData();
//     formData.append("name", form.name);
//     if (form.parent_id) formData.append("parent_id", form.parent_id);
//     if (form.image) formData.append("image", form.image);

//     setLoading(true);
//     await onSave(formData, data?.id);
//     setLoading(false);
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
//       <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 space-y-5">
//         {/* HEADER */}
//         <div className="flex justify-between items-center">
//           <h2 className="text-lg font-semibold">
//             {data ? "Edit Category" : "Add Category"}
//           </h2>
//           <button onClick={onClose} className="text-gray-500">
//             ✕
//           </button>
//         </div>

//         {/* CATEGORY NAME */}
//         <div>
//           <label className="block text-sm text-gray-600 mb-1">
//             Category Name
//           </label>
//           <input
//             value={form.name}
//             onChange={(e) => handleChange("name", e.target.value)}
//             placeholder="Enter category name"
//             className="w-full border rounded-lg px-3 py-2 text-sm"
//           />
//         </div>

//         {/* PARENT CATEGORY (SUB CATEGORY FEATURE) */}
//         <div>
//           <label className="block text-sm text-gray-600 mb-1">
//             Parent Category
//           </label>
//           <select
//             value={form.parent_id}
//             onChange={(e) => handleChange("parent_id", e.target.value)}
//             className="w-full border rounded-lg px-3 py-2 text-sm"
//           >
//             <option value="">— Main Category —</option>
//             {parents.map((p) => (
//               <option key={p.id} value={p.id}>
//                 {p.name}
//               </option>
//             ))}
//           </select>
//           <p className="text-xs text-gray-400 mt-1">
//             Leave empty to create main category
//           </p>
//         </div>

//         {/* IMAGE */}
//         <div>
//           <label className="block text-sm text-gray-600 mb-1">
//             Category Image
//           </label>
//           <input
//             type="file"
//             onChange={(e) => handleChange("image", e.target.files[0])}
//             className="w-full text-sm"
//           />
//         </div>

//         {/* ACTIONS */}
//         <div className="flex justify-end gap-3 pt-4">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border rounded-lg text-sm"
//           >
//             Cancel
//           </button>

//           <button
//             disabled={loading}
//             onClick={handleSubmit}
//             className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm disabled:opacity-50"
//           >
//             {loading ? "Saving..." : "Save"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import CategoryForm from "./CategoryForm";
import useDynamicTitle from "../hooks/useDynamicTitle";
import api from "../api/axios";

const PAGE_SIZES = [5, 10, 20];

export default function Category() {
  useDynamicTitle("Categories");

  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);

  /* ================= FETCH ================= */
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin-dashboard/list-category", {
        params: { search, page, perPage },
      });

      setCategories(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [search, page, perPage]);

  /* ================= CRUD ================= */

  const handleAdd = () => {
    setEditData(null);
    setOpenForm(true);
  };

  const handleEdit = (cat) => {
    setEditData(cat);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;

    try {
      await api.delete(`/admin-dashboard/delete-category/${id}`);
      fetchCategories();
    } catch (e) {
      alert(e.response?.data?.message || "Delete failed");
    }
  };

  const handleSave = async (formData, id) => {
    try {
      if (id) {
        await api.post(`/admin-dashboard/update-category/${id}`, formData);
      } else {
        await api.post("/admin-dashboard/add-category", formData);
      }

      setOpenForm(false);
      setEditData(null);
      fetchCategories();
    } catch (e) {
      alert(e.response?.data?.message || "Save failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <h1 className="text-2xl font-semibold">Categories</h1>

        <div className="flex gap-3">
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border px-3 py-2 rounded-lg w-60"
          />

          <button
            onClick={handleAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Category
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden hidden md:block">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Parent</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : categories.length ? (
              categories.map((cat) => (
                <tr key={cat.id} className="border-t">
                  <td className="p-3">
                    <CategoryImage image={cat.full_image_url} />
                  </td>
                  <td className="p-3 font-medium">{cat.name}</td>
                  <td className="p-3 text-gray-500">
                    {cat.parent_name || "—"}
                  </td>
                  <td className="p-3 space-x-3">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-indigo-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(+e.target.value);
              setPage(1);
            }}
            className="border px-2 py-1 rounded"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  page === i + 1 ? "bg-indigo-600 text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {openForm && (
        <CategoryForm
          data={editData}
          onClose={() => setOpenForm(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

/* ================= IMAGE ================= */

function CategoryImage({ image }) {
  return (
    <div className="w-12 h-12 border rounded bg-gray-100 overflow-hidden">
      {image ? (
        <img src={image} className="w-full h-full object-cover" />
      ) : (
        <div className="text-xs text-gray-400 flex items-center justify-center h-full">
          No Image
        </div>
      )}
    </div>
  );
}
