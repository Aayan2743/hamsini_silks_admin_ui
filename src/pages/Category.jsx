// //src/pages/Category.jsx

// import { useState, useMemo,useEffect } from "react";
// import CategoryForm from "./components/CategoryForm";

// import useDynamicTitle from "../hooks/useDynamicTitle";

// import api from "../api/axios";
// const PAGE_SIZES = [5, 10, 20];

// export default function Category() {
//   useDynamicTitle("Categories");
// const [categories, setCategories] = useState([]);
// const [totalPages, setTotalPages] = useState(1);
// const [loading, setLoading] = useState(false);

//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [perPage, setPerPage] = useState(5);

//   const [openForm, setOpenForm] = useState(false);
//   const [editData, setEditData] = useState(null);

//   /* 🔍 SEARCH */
//   const filtered = useMemo(() => {
//     return categories.filter((c) =>
//       c.name.toLowerCase().includes(search.toLowerCase())
//     );
//   }, [categories, search]);

//   /* 📄 PAGINATION */
//   // const totalPages = Math.ceil(filtered.length / perPage);
//   const paginated = filtered.slice(
//     (page - 1) * perPage,
//     page * perPage
//   );

//   const handleAdd = () => {
//     setEditData(null);
//     setOpenForm(true);
//   };

//   const handleEdit = (cat) => {
//     setEditData(cat);
//     setOpenForm(true);
//   };

//   const handleDelete = async (id) => {
//   const confirmDelete = window.confirm(
//     "Are you sure you want to delete this category?"
//   );

//   if (!confirmDelete) return;

//   try {
//     await api.delete(`/dashboard/delete-category/${id}`);
//     fetchCategories(); // reload list
//   } catch (error) {
//     alert(error.response?.data?.message || "Delete failed");
//   }
// };

//   const handleSave = async (formData, id) => {
//     try {
//       if (id) {
//         // UPDATE
//         await api.put(`/dashboard/update-category/${id}`, formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       } else {
//         // CREATE
//         await api.post("/dashboard/add-category", formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       }

//       setOpenForm(false);
//       setEditData(null);
//       fetchCategories(); // 🔥 reload list
//     } catch (error) {
//       alert(error.response?.data?.message || "Something went wrong");
//     }
//   };

//   const fetchCategories = async () => {
//   try {
//     setLoading(true);

//     const res = await api.get("/dashboard/list-category", {
//       params: {
//         search,
//         page,
//         perPage,
//       },
//     });

//     setCategories(res.data.data);
//     setTotalPages(res.data.pagination.totalPages);
//   } catch (error) {
//     console.error(error);
//   } finally {
//     setLoading(false);
//   }
// };
// useEffect(() => {
//   fetchCategories();
// }, [search, page, perPage]);

//   return (
//     <div className="space-y-6">
//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <h1 className="text-2xl font-semibold">Categories</h1>

//         <div className="flex gap-3">
//           <input
//             placeholder="Search category..."
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setPage(1);
//             }}
//             className="h-10 px-3 border rounded-lg text-sm w-full md:w-64"
//           />

//           <button
//             onClick={handleAdd}
//             className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
//           >
//             + Add Category
//           </button>
//         </div>
//       </div>

//       {/* DESKTOP TABLE */}
//       <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
//         <table className="w-full text-sm">
//           <thead className="bg-gray-100 text-gray-600">
//             <tr>
//               <th className="px-4 py-3 text-left">Image</th>
//               <th className="px-4 py-3 text-left">Category Name</th>
//               <th className="px-4 py-3 text-left">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {paginated.map((cat) => (
//               <tr key={cat.id} className="border-t">
//                 <td className="px-4 py-3">
//                   <CategoryImage image={cat.full_image_url} />
//                 </td>
//                 <td className="px-4 py-3 font-medium">
//                   {cat.name}
//                 </td>

//                 <td className="px-4 py-3 space-x-4">
//                 <button
//                   onClick={() => handleEdit(cat)}
//                   className="text-indigo-600 hover:underline"
//                 >
//                   Edit
//                 </button>

//                 <button
//                   onClick={() => handleDelete(cat.id)}
//                   className="text-red-600 hover:underline"
//                 >
//                   Delete
//                 </button>
//               </td>

//               </tr>
//             ))}

//             {paginated.length === 0 && (
//               <tr>
//                 <td
//                   colSpan="3"
//                   className="text-center py-8 text-gray-500"
//                 >
//                   No categories found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* MOBILE CARDS */}
//       <div className="md:hidden space-y-4">
//         {paginated.map((cat) => (
//           <div
//             key={cat.id}
//             className="bg-white border rounded-xl p-4 flex gap-4 items-center"
//           >
//             <CategoryImage image={cat.full_image_url} size="lg" />
//             <div className="flex-1">
//               <p className="font-medium">{cat.name}</p>
//               <button
//                 onClick={() => handleEdit(cat)}
//                 className="text-indigo-600 text-sm mt-1"
//               >
//                 Edit
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* PAGINATION CONTROLS */}
//       {totalPages > 1 && (
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           {/* PAGE SIZE */}
//           <div className="flex items-center gap-2 text-sm">
//             <span>Show</span>
//             <select
//               value={perPage}
//               onChange={(e) => {
//                 setPerPage(Number(e.target.value));
//                 setPage(1);
//               }}
//               className="border rounded px-2 py-1"
//             >
//               {PAGE_SIZES.map((s) => (
//                 <option key={s} value={s}>
//                   {s}
//                 </option>
//               ))}
//             </select>
//             <span>entries</span>
//           </div>

//           {/* PAGE NUMBERS */}
//           <div className="flex items-center gap-2">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage(page - 1)}
//               className="px-3 py-1 border rounded disabled:opacity-50"
//             >
//               Prev
//             </button>

//             {Array.from({ length: totalPages }).map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setPage(i + 1)}
//                 className={`px-3 py-1 rounded border text-sm ${
//                   page === i + 1
//                     ? "bg-indigo-600 text-white border-indigo-600"
//                     : "hover:bg-gray-100"
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}

//             <button
//               disabled={page === totalPages}
//               onClick={() => setPage(page + 1)}
//               className="px-3 py-1 border rounded disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {openForm && (
//         <CategoryForm
//           data={editData}
//           onClose={() => setOpenForm(false)}
//           onSave={handleSave}
//         />
//       )}
//     </div>
//   );
// }

// /* ================= IMAGE PLACEHOLDER ================= */

// function CategoryImage({ image, size = "sm" }) {
//   const sizes =
//     size === "lg"
//       ? "w-16 h-16"
//       : "w-12 h-12";

//   return (
//     <div
//       className={`${sizes} rounded-lg bg-gray-100 border flex items-center justify-center overflow-hidden`}
//     >
//       {image ? (
//         <img
//           src={image}
//           alt=""
//           className="w-full h-full object-cover"
//         />
//       ) : (
//         <span className="text-gray-400 text-xs">
//           No Image
//         </span>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import CategoryForm from "./components/CategoryForm";
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

  /* ================= FETCH CATEGORIES ================= */
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await api.get("/dashboard/list-category", {
        params: {
          search,
          page,
          perPage,
        },
      });

      setCategories(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (error) {
      console.error(error);
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
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await api.delete(`/dashboard/delete-category/${id}`);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const handleSave = async (formData, id) => {
    try {
      if (id) {
        await api.put(`/dashboard/update-category/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/dashboard/add-category", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setOpenForm(false);
      setEditData(null);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold">Categories</h1>

        <div className="flex gap-3">
          <input
            placeholder="Search category..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 border rounded-lg text-sm w-full md:w-64"
          />

          <button
            onClick={handleAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Category
          </button>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Category Name</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : categories.length > 0 ? (
              categories.map((cat) => (
                <tr key={cat.id} className="border-t">
                  <td className="px-4 py-3">
                    <CategoryImage image={cat.full_image_url} />
                  </td>
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="px-4 py-3 space-x-4">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-8 text-gray-500">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white border rounded-xl p-4 flex gap-4 items-center"
          >
            <CategoryImage image={cat.full_image_url} size="lg" />
            <div className="flex-1">
              <p className="font-medium">{cat.name}</p>
              <button
                onClick={() => handleEdit(cat)}
                className="text-indigo-600 text-sm mt-1"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span>Show</span>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="border rounded px-2 py-1"
            >
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded border text-sm ${
                  page === i + 1
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
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

/* ================= IMAGE COMPONENT ================= */

function CategoryImage({ image, size = "sm" }) {
  const sizes = size === "lg" ? "w-16 h-16" : "w-12 h-12";

  return (
    <div
      className={`${sizes} rounded-lg bg-gray-100 border flex items-center justify-center overflow-hidden`}
    >
      {image ? (
        <img src={image} alt="" className="w-full h-full object-cover" />
      ) : (
        <span className="text-gray-400 text-xs">No Image</span>
      )}
    </div>
  );
}
