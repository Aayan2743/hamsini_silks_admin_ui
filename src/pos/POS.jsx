// import { useEffect, useState } from "react";
// import CategoryPills from "./components/CategoryPills";
// import BrandFilter from "./components/BrandFilter";
// import ProductCard from "./components/ProductCard";
// import CartPanel from "./CartPanel";
// import VariationModal from "./components/VariationModal";
// import api from "../api/axios";

// export default function POS() {
//   const [categories, setCategories] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [products, setProducts] = useState([]);

//   const [category, setCategory] = useState("all");
//   const [brand, setBrand] = useState("all");

//   const [cart, setCart] = useState([]);

//   const [openModal, setOpenModal] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   const [showVariants, setShowVariants] = useState(false);

//   /* LOAD FILTERS */
//   useEffect(() => {
//     api
//       .get("/dashboard/pos/categories")
//       .then((r) => setCategories(r.data.data));
//     api.get("/dashboard/pos/brands").then((r) => setBrands(r.data.data));
//   }, []);

//   /* LOAD PRODUCTS */
//   useEffect(() => {
//     api
//       .get("/dashboard/pos/products", { params: { category, brand } })
//       .then((r) => setProducts(r.data.data));
//   }, [category, brand]);

//   /* OPEN VARIATION MODAL */
//   const handleProductClick = (product) => {
//     setSelectedProduct(product);
//     setOpenModal(true);
//   };

//   /* ADD TO CART (STOCK SAFE) */
//   const handleAddVariant = (variant) => {
//     if (variant.stock <= 0) {
//       alert("Out of stock");
//       return;
//     }

//     setCart((prev) => {
//       const index = prev.findIndex((i) => i.variant_id === variant.id);

//       if (index !== -1) {
//         if (prev[index].qty >= variant.stock) {
//           alert("Stock limit reached");
//           return prev;
//         }

//         const updated = [...prev];
//         updated[index].qty += 1;
//         return updated;
//       }

//       return [
//         ...prev,
//         {
//           variant_id: variant.id,
//           product_name: selectedProduct.name,
//           variation_name: variant.name,
//           price: variant.price,
//           stock: variant.stock, // 🔥 REQUIRED
//           qty: 1,
//         },
//       ];
//     });

//     setOpenModal(false);
//   };

//   return (
//     <div className="h-screen flex bg-gray-100">
//       {/* LEFT */}
//       <div className="flex-1 flex flex-col p-4 gap-4">
//         <CategoryPills
//           items={categories}
//           active={category}
//           onChange={setCategory}
//         />

//         <div className="flex flex-1 gap-4 overflow-hidden">
//           <div className="bg-white rounded-xl p-3 overflow-y-auto">
//             <BrandFilter items={brands} active={brand} onChange={setBrand} />
//           </div>

//           <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto">
//             {products.map((p) => (
//               <ProductCard
//                 key={p.id}
//                 product={p}
//                 onClick={handleProductClick}
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* CART */}
//       <CartPanel cart={cart} setCart={setCart} />

//       {/* VARIATION MODAL */}
//       <VariationModal
//         open={openModal}
//         product={selectedProduct}
//         onClose={() => setOpenModal(false)}
//         onConfirm={handleAddVariant}
//       />
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import CategoryPills from "./components/CategoryPills";
import BrandFilter from "./components/BrandFilter";
import ProductCard from "./components/ProductCard";
import CartPanel from "./CartPanel";
import VariationModal from "./components/VariationModal";
import api from "../api/axios";

export default function POS() {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);

  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");

  const [cart, setCart] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  /* ================= LOAD FILTERS ================= */
  useEffect(() => {
    api
      .get("/dashboard/pos/categories")
      .then((r) => setCategories(r.data.data));

    api.get("/dashboard/pos/brands").then((r) => setBrands(r.data.data));
  }, []);

  /* ================= LOAD PRODUCTS ================= */
  useEffect(() => {
    api
      .get("/dashboard/pos/products", {
        params: { category, brand },
      })
      .then((r) => setProducts(r.data.data));
  }, [category, brand]);

  /* ================= OPEN VARIATION MODAL ================= */
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  /* ================= ADD VARIANT TO CART ================= */
  const handleAddVariant = (variant) => {
    if (!selectedProduct) return;

    if (variant.stock <= 0) {
      alert("Out of stock");
      return;
    }

    setCart((prev) => {
      const index = prev.findIndex(
        (i) =>
          i.product_id === selectedProduct.id && i.variation_id === variant.id
      );

      // 🔁 If already exists → increase qty
      if (index !== -1) {
        if (prev[index].qty >= variant.stock) {
          alert("Stock limit reached");
          return prev;
        }

        const updated = [...prev];
        updated[index].qty += 1;
        return updated;
      }

      // ➕ Add new cart item
      return [
        ...prev,
        {
          product_id: selectedProduct.id,
          product_name: selectedProduct.name,

          variation_id: variant.id,
          variation_name: variant.name,

          price: variant.price,
          stock: variant.stock,
          qty: 1,
        },
      ];
    });

    setOpenModal(false);
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* LEFT PANEL */}
      <div className="flex-1 flex flex-col p-4 gap-4">
        <CategoryPills
          items={categories}
          active={category}
          onChange={setCategory}
        />

        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* BRAND FILTER */}
          <div className="bg-white rounded-xl p-3 overflow-y-auto">
            <BrandFilter items={brands} active={brand} onChange={setBrand} />
          </div>

          {/* PRODUCTS */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={() => handleProductClick(p)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CART PANEL */}
      <CartPanel cart={cart} setCart={setCart} />

      {/* VARIATION MODAL */}
      <VariationModal
        open={openModal}
        product={selectedProduct}
        onClose={() => setOpenModal(false)}
        onConfirm={handleAddVariant}
      />
    </div>
  );
}
