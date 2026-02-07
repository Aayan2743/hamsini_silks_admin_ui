import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import AddProductDrawer from "./components/AddProductDrawer";
import EditProductDrawer from "./components/EditProductDrawer";
import StatusBadge from "./components/StatusBadge";

import useDynamicTitle from "../hooks/useDynamicTitle";

export default function Products() {
  useDynamicTitle("Products");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // const [selectedProduct, setSelectedProduct] = useState(null);

  /* ================= FETCH PRODUCTS ================= */

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin-dashboard/products", {
        params: {
          search: query,
          page,
          perPage,
        },
      });

      setProducts(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("FETCH PRODUCTS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD ON CHANGE ================= */

  useEffect(() => {
    fetchProducts();
  }, [query, page, perPage]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Products</h1>

        <div className="flex gap-2">
          <input
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 px-4 border rounded-lg text-sm w-64"
          />

          <button
            onClick={() => {
              setQuery(search);
              setPage(1);
            }}
            className="px-4 py-2 bg-gray-100 border rounded-lg text-sm"
          >
            Search
          </button>

          <button
            onClick={() => setOpenAdd(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">S No</th>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Product Name</th>
              <th className="px-4 py-3 text-left">Category</th>

              {/*<th className="px-4 py-3 text-left">Brand</th> */}

              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="text-center py-10">
                  Loading products...
                </td>
              </tr>
            )}

            {!loading &&
              products.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{p.id}</td>
                  <td className="px-4 py-3">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-12 h-12 rounded-lg object-cover border"
                        onError={(e) => {
                          e.target.src = "/no-image.png"; // optional fallback
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  {/* <td className="px-4 py-3">
                    {p.category_name || "-"} - {p.category_main}
                  </td> */}

                  <td className="px-4 py-3 text-sm">
                    {p.category_main ? (
                      <>
                        <span className="text-gray-500">{p.category_main}</span>
                        <span className="mx-1">/</span>
                        <span className="font-medium text-gray-800">
                          {p.category_name}
                        </span>
                      </>
                    ) : (
                      <span className="font-medium">
                        {p.category_name || "-"}
                      </span>
                    )}
                  </td>

                  {/* <td className="px-4 py-3">{p.brand_name || "-"}</td> */}
                  <td className="px-4 py-3">₹{p.final_price}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>

                  <td>
                    <button
                      type="button" // ✅ THIS IS THE FIX
                      onClick={() => {
                        setSelectedProduct(p);
                        setOpenEdit(true);
                      }}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit {p.id}
                    </button>
                  </td>
                </tr>
              ))}

            {!loading && products.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center">
        {/* PAGE SIZE */}
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
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span>entries</span>
        </div>

        {/* PAGINATION */}
        <div className="flex gap-1">
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
              className={`px-3 py-1 rounded border ${
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

      {/* DRAWERS */}
      <AddProductDrawer
        open={openAdd}
        onClose={() => {
          setOpenAdd(false);
          fetchProducts(); // 🔥 refresh list
        }}
      />

      <EditProductDrawer
        open={openEdit}
        product={selectedProduct} // FULL PRODUCT
        productId={selectedProduct?.id}
        onClose={() => {
          setOpenEdit(false);
          setSelectedProduct(null);
          fetchProducts();
        }}
      />
    </div>
  );
}
