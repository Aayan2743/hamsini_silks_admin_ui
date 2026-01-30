export default function EditVariantTable({
  variants,
  data,
  setData,
  removeImage,
  addImages,
}) {
  const update = (index, field, value) => {
    setData((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // const addImages = (index, files) => {
  //   const newFiles = Array.from(files);

  //   setData((prev) => {
  //     const copy = [...prev];
  //     copy[index] = {
  //       ...copy[index],
  //       images: [...(copy[index].images || []), ...newFiles],
  //     };
  //     return copy;
  //   });
  // };

  // const removeImage = (rowIndex, imgIndex) => {
  //   setData((prev) => {
  //     const copy = [...prev];
  //     const imgs = [...(copy[rowIndex].images || [])];
  //     imgs.splice(imgIndex, 1);
  //     copy[rowIndex] = { ...copy[rowIndex], images: imgs };
  //     return copy;
  //   });
  // };

  // const addImages = (rowIndex, files) => {
  //   setRows((prev) =>
  //     prev.map((row, i) =>
  //       i === rowIndex
  //         ? {
  //             ...row,
  //             images: [...row.images, ...files],
  //             imagesTouched: true, // 🔴 IMPORTANT
  //           }
  //         : row
  //     )
  //   );
  // };

  return (
    <div className="border rounded-xl bg-white shadow-sm">
      {/* HEADER */}
      <div className="px-5 py-3 border-b">
        <h4 className="font-semibold text-gray-800">Generated Variants</h4>
        <p className="text-sm text-gray-500">
          Configure SKU, pricing, inventory and images per variant
        </p>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left">Variant</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">SKU</th>
              <th className="px-3 py-2">Qty</th>
              <th className="px-3 py-2">Low Qty</th>
              <th className="px-3 py-2">Images</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={row.key} className="border-t align-top hover:bg-gray-50">
                {/* LABEL */}
                <td className="px-3 py-2 font-medium whitespace-nowrap">
                  {row.label}
                </td>

                {/* PRICE */}
                <td className="px-3 py-2">
                  <input
                    type="number"
                    className="w-24 border rounded px-2 py-1"
                    value={row.price}
                    onChange={(e) => update(rowIndex, "price", e.target.value)}
                  />
                </td>

                {/* SKU */}
                <td className="px-3 py-2">
                  <input
                    className="w-32 border rounded px-2 py-1"
                    value={row.sku}
                    onChange={(e) => update(rowIndex, "sku", e.target.value)}
                  />
                </td>

                {/* QTY */}
                <td className="px-3 py-2">
                  <input
                    type="number"
                    className="w-20 border rounded px-2 py-1"
                    value={row.qty}
                    onChange={(e) => update(rowIndex, "qty", e.target.value)}
                  />
                </td>

                {/* LOW QTY */}
                <td className="px-3 py-2">
                  <input
                    type="number"
                    className="w-20 border rounded px-2 py-1"
                    value={row.low_qty}
                    onChange={(e) =>
                      update(rowIndex, "low_qty", e.target.value)
                    }
                  />
                </td>

                {/* IMAGES */}
                <td className="px-3 py-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) =>
                      addImages(rowIndex, Array.from(e.target.files))
                    }
                  />

                  {row.images?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {row.images.map((img, idx) => {
                        const preview =
                          img instanceof File
                            ? URL.createObjectURL(img) // new upload
                            : img.image_url; // existing image (FULL URL)
                        console.log("Preview URL:", preview);
                        return (
                          <div
                            key={img.id || idx}
                            className="relative h-14 w-14 border rounded overflow-hidden"
                          >
                            <img
                              src={preview}
                              alt="variant"
                              className="h-full w-full object-cover"
                            />

                            <button
                              type="button"
                              onClick={() => removeImage(rowIndex, idx)}
                              className="absolute top-0 right-0 bg-black/70 text-white text-xs px-1"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
