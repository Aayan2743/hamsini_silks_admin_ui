// export default function ProductCard({ product, onClick }) {
//   const minPrice =
//     product.variations?.length > 0
//       ? Math.min(...product.variations.map((v) => v.price))
//       : product.price;

//   const maxPrice =
//     product.variations?.length > 0
//       ? Math.max(...product.variations.map((v) => v.price))
//       : product.price;

//   return (
//     <div
//       onClick={() => onClick(product)}
//       className="
//         bg-white rounded-2xl border cursor-pointer
//         hover:shadow-lg hover:-translate-y-0.5
//         transition-all duration-200
//         flex flex-col overflow-hidden
//       "
//     >
//       {/* IMAGE */}
//       <div className="relative h-28 bg-gray-50">
//         {product.image ? (
//           <img
//             src={product.image}
//             alt={product.name}
//             className="h-full w-full object-cover"
//           />
//         ) : (
//           <div className="h-full flex items-center justify-center text-gray-400 text-sm">
//             No Image
//           </div>
//         )}

//         {/* VARIATION BADGE */}
//         <span className="absolute top-2 left-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded-full">
//           {product.variations.length} variants
//         </span>

//         {/* GST BADGE */}
//         {product.gst?.enabled && (
//           <span
//             className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full ${
//               product.gst.type === "inclusive"
//                 ? "bg-green-600 text-white"
//                 : "bg-orange-500 text-white"
//             }`}
//           >
//             GST {product.gst.type}
//           </span>
//         )}
//       </div>

//       {/* CONTENT */}
//       <div className="p-3 flex flex-col gap-1 flex-1">
//         {/* NAME */}
//         <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>

//         {/* PRICE */}
//         <div className="mt-auto">
//           {minPrice === maxPrice ? (
//             <p className="text-base font-semibold">₹ {minPrice}</p>
//           ) : (
//             <p className="text-sm font-semibold">
//               ₹ {minPrice} – ₹ {maxPrice}
//             </p>
//           )}

//           <p className="text-[11px] text-gray-500">Tap to select variation</p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";

export default function ProductCard({ product, onClick }) {
  const images = product.images || [];
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const startHover = () => {
    if (images.length <= 1) return;

    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 900);
  };

  const stopHover = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setIndex(0);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div
      onMouseEnter={startHover}
      onMouseLeave={stopHover}
      onClick={() => onClick(product)}
      className="
        bg-white rounded-2xl border cursor-pointer
        hover:shadow-lg transition overflow-hidden
      "
    >
      {/* IMAGE */}
      <div className="relative h-32 bg-gray-100">
        {images.length > 0 ? (
          <img
            src={images[index]?.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-all"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}

        {/* IMAGE DOTS */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${
                  i === index ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="p-3">
        <h4 className="text-sm font-medium line-clamp-2">{product.name}</h4>

        <p className="text-sm font-semibold mt-1">₹ {product.price}</p>

        <p className="text-xs text-gray-500">
          {product.variations.length} variants
        </p>
      </div>
    </div>
  );
}
