// // src/pages/comp/EditStepVariation.jsx

// import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
// import api from "../../../api/axios";

// import { EditgenerateVariants } from "./EditgenerateVariants";
// import EditVariantTable from "./EditVariantTable";
// import EditVariantSelect from "./EditVariantSelect";

// const EditStepVariation = forwardRef(
//   ({ productId, existingCombinations = [] }, ref) => {
//     const [variations, setVariations] = useState([]);
//     const [selected, setSelected] = useState({});
//     const [labels, setLabels] = useState([]); // UI only
//     const [rows, setRows] = useState([]);
//     const [rowsforEdit, setRowsforEdit] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [lastKeys, setLastKeys] = useState([]);

//     /* ================= LOAD ADMIN VARIATIONS ================= */
//     useEffect(() => {
//       const loadVariations = async () => {
//         const res = await api.get("/dashboard/get-variations");
//         const raw = res.data.data || [];

//         const normalized = raw.map((v) => ({
//           id: v.id,
//           name: v.name,
//           values: (v.variation_values || []).map((val) => ({
//             id: val.id,
//             value: val.value,
//           })),
//         }));

//         setVariations(normalized);

//         const init = {};
//         normalized.forEach((v) => (init[v.id] = []));
//         setSelected(init);
//       };

//       loadVariations();
//     }, []);

//     /* ================= PREFILL FROM EXISTING COMBINATIONS ================= */
//     useEffect(() => {
//       if (!existingCombinations.length || !variations.length) return;

//       const sel = {};
//       const rowMap = {};

//       variations.forEach((v) => {
//         sel[v.id] = [];
//       });

//       // 🔥 build rowMap using VALUE IDS
//       existingCombinations.forEach((combo) => {
//         const key = combo.combination_values
//           .map((cv) => cv.value.id)
//           .sort()
//           .join("_");

//         combo.combination_values.forEach((cv) => {
//           sel[cv.value.variation_id].push({
//             id: cv.value.id,
//             value: cv.value.value,
//           });
//         });

//         rowMap[key] = {
//           id: combo.id,
//           sku: combo.sku || "",
//           price: combo.extra_price || "",
//           qty: combo.quantity || "",
//           low_qty: combo.low_quantity || "",
//           images: combo.images || [], // ✅ KEEP FULL OBJECT
//           imagesTouched: false, // ✅ IMPORTANT
//         };
//       });

//       Object.keys(sel).forEach((k) => {
//         sel[k] = Array.from(new Map(sel[k].map((v) => [v.id, v])).values());
//       });

//       setSelected(sel);

//       const combos = EditgenerateVariants(sel);

//       const finalRows = combos.map((c) => ({
//         id: rowMap[c.key]?.id || null,
//         key: c.key,
//         label: c.label,
//         sku: rowMap[c.key]?.sku || "",
//         price: rowMap[c.key]?.price || "",
//         qty: rowMap[c.key]?.qty || "",
//         low_qty: rowMap[c.key]?.low_qty || "",
//         images: rowMap[c.key]?.images || [],
//         imagesTouched: false, // ✅ ADD THIS LINE
//       }));

//       console.log("sssssssss", finalRows);
//       setRowsforEdit(finalRows);

//       setRows(finalRows);

//       setLabels(combos.map((c) => c.label)); // ✅ strings only
//     }, [existingCombinations, variations]);

//     /* ================= HANDLE SELECT ================= */

//     const handleSelect = (variationId, values) => {
//       setSelected((prev) => {
//         const updated = {
//           ...prev,
//           [variationId]: values,
//         };

//         const active = variations.filter(
//           (v) => updated[v.id] && updated[v.id].length > 0
//         );

//         if (!active.length) {
//           setRows([]);
//           setLabels([]);
//           return updated;
//         }

//         const combos = EditgenerateVariants(updated);

//         setRows((prevRows) =>
//           combos.map((c) => {
//             const existing = prevRows.find((r) => r.key === c.key);

//             return (
//               existing || {
//                 id: null,
//                 key: c.key,
//                 label: c.label,
//                 sku: "",
//                 price: "",
//                 qty: "",
//                 low_qty: "",
//                 images: [],
//               }
//             );
//           })
//         );

//         setLabels(combos.map((c) => c.label));

//         return updated;
//       });
//     };

//     /* ================= REGENERATE VARIANTS ================= */

//     useImperativeHandle(ref, () => ({
//       async saveStep() {
//         if (!productId) return false;

//         try {
//           setLoading(true);

//           const formData = new FormData();

//           rows.forEach((row, index) => {
//             /* ================= BASIC VARIANT DATA ================= */

//             formData.append(`variants[${index}][id]`, row.id || "");

//             formData.append(
//               `variants[${index}][variation_value_ids]`,
//               JSON.stringify(row.key.split("_").map(Number))
//             );

//             formData.append(`variants[${index}][sku]`, row.sku || "");
//             formData.append(`variants[${index}][extra_price]`, row.price || 0);
//             formData.append(`variants[${index}][quantity]`, row.qty || 0);
//             formData.append(
//               `variants[${index}][low_quantity]`,
//               row.low_qty || 0
//             );

//             /* ================= IMAGE DELETE LOGIC ================= */
//             // 🔴 IMPORTANT: Only run if user touched images
//             if (row.imagesTouched) {
//               const keepImageIds = (row.images || [])
//                 .filter(
//                   (img) =>
//                     !(img instanceof File) &&
//                     img?.id !== undefined &&
//                     img?.id !== null
//                 )
//                 .map((img) => String(img.id));

//               if (keepImageIds.length > 0) {
//                 // keep selected images
//                 keepImageIds.forEach((id) => {
//                   formData.append(`variants[${index}][keep_image_ids][]`, id);
//                 });
//               } else {
//                 // 🔥 user deleted ALL images
//                 formData.append(`variants[${index}][keep_image_ids]`, "");
//               }
//             }

//             /* ================= NEW IMAGE UPLOAD ================= */

//             (row.images || [])
//               .filter((img) => img instanceof File)
//               .forEach((file) => {
//                 formData.append(`variants[${index}][images][]`, file);
//               });
//           });

//           /* ================= API CALL ================= */

//           await api.post(
//             `/dashboard/product/sync-variations/${productId}`,
//             formData
//           );

//           return true;
//         } catch (error) {
//           console.error("Save variations failed:", error);
//           alert("Failed to save variations");
//           return false;
//         } finally {
//           setLoading(false);
//         }
//       },
//     }));

//     const addImages = (rowIndex, files) => {
//       setRows((prev) =>
//         prev.map((row, i) =>
//           i === rowIndex
//             ? {
//                 ...row,
//                 images: [...(row.images || []), ...files], // 🔥 ADD FILES
//                 imagesTouched: true, // 🔥 MARK AS CHANGED
//               }
//             : row
//         )
//       );
//     };

//     const removeImage = (rowIndex, imgIndex) => {
//       setRows((prev) =>
//         prev.map((row, i) =>
//           i === rowIndex
//             ? {
//                 ...row,
//                 images: row.images.filter((_, j) => j !== imgIndex),
//                 imagesTouched: true, // 🔴 IMPORTANT
//               }
//             : row
//         )
//       );
//     };

//     /* ================= UI ================= */
//     return (
//       <div className="space-y-6">
//         <h3 className="font-semibold">Product Variants</h3>

//         {variations.map((v) => (
//           <EditVariantSelect
//             key={v.id}
//             label={v.name}
//             options={v.values}
//             selected={selected[v.id] || []}
//             onChange={(vals) => handleSelect(v.id, vals)}
//           />
//         ))}

//         {labels.length > 0 && (
//           <EditVariantTable
//             variants={labels}
//             data={rows}
//             setData={setRows}
//             removeImage={removeImage}
//             addImages={addImages}
//           />
//         )}

//         {loading && <p className="text-sm text-blue-600">Saving variants...</p>}
//       </div>
//     );
//   }
// );

// export default EditStepVariation;

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import api from "../../../api/axios";

import { EditgenerateVariants } from "./EditgenerateVariants";
import EditVariantTable from "./EditVariantTable";
import EditVariantSelect from "./EditVariantSelect";

const EditStepVariation = forwardRef(
  ({ productId, existingCombinations = [] }, ref) => {
    const [variations, setVariations] = useState([]);
    const [selected, setSelected] = useState({});
    const [labels, setLabels] = useState([]);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);

    /* ================= LOAD VARIATIONS ================= */

    useEffect(() => {
      const loadVariations = async () => {
        const res = await api.get("/dashboard/get-variations");
        const raw = res.data.data || [];

        const normalized = raw.map((v) => ({
          id: v.id,
          name: v.name,
          values: (v.variation_values || []).map((val) => ({
            id: val.id,
            value: val.value,
          })),
        }));

        setVariations(normalized);

        const init = {};
        normalized.forEach((v) => (init[v.id] = []));
        setSelected(init);
      };

      loadVariations();
    }, []);

    /* ================= PREFILL EXISTING VARIANTS ================= */

    useEffect(() => {
      if (!existingCombinations.length || !variations.length) return;

      const sel = {};
      const rowMap = {};

      variations.forEach((v) => {
        sel[v.id] = [];
      });

      existingCombinations.forEach((combo) => {
        const key = combo.combination_values
          .map((cv) => cv.value.id)
          .sort()
          .join("_");

        combo.combination_values.forEach((cv) => {
          sel[cv.value.variation_id].push({
            id: cv.value.id,
            value: cv.value.value,
          });
        });

        rowMap[key] = {
          id: combo.id,
          sku: combo.sku || "",
          price: combo.extra_price || "",
          qty: combo.quantity || "",
          low_qty: combo.low_quantity || "",
          images: combo.images || [],
          imagesTouched: false,
        };
      });

      Object.keys(sel).forEach((k) => {
        sel[k] = Array.from(new Map(sel[k].map((v) => [v.id, v])).values());
      });

      setSelected(sel);

      const combos = EditgenerateVariants(sel);

      const finalRows = combos.map((c) => ({
        id: rowMap[c.key]?.id || null,
        key: c.key,
        label: c.label,
        sku: rowMap[c.key]?.sku || "",
        price: rowMap[c.key]?.price || "",
        qty: rowMap[c.key]?.qty || "",
        low_qty: rowMap[c.key]?.low_qty || "",
        images: rowMap[c.key]?.images || [],
        imagesTouched: false,
      }));

      setRows(finalRows);
      setLabels(combos.map((c) => c.label));
    }, [existingCombinations, variations]);

    /* ================= HANDLE SELECT ================= */

    const handleSelect = (variationId, values) => {
      setSelected((prev) => {
        const updated = { ...prev, [variationId]: values };

        const active = variations.filter((v) => updated[v.id]?.length > 0);

        if (!active.length) {
          setRows([]);
          setLabels([]);
          return updated;
        }

        const combos = EditgenerateVariants(updated);

        setRows((prevRows) =>
          combos.map((c) => {
            const existing = prevRows.find((r) => r.key === c.key);
            return (
              existing || {
                id: null,
                key: c.key,
                label: c.label,
                sku: "",
                price: "",
                qty: "",
                low_qty: "",
                images: [],
                imagesTouched: false,
              }
            );
          })
        );

        setLabels(combos.map((c) => c.label));
        return updated;
      });
    };

    /* ================= IMAGE HANDLERS ================= */

    const addImages = (rowIndex, files) => {
      setRows((prev) =>
        prev.map((row, i) =>
          i === rowIndex
            ? {
                ...row,
                images: [...(row.images || []), ...files],
                imagesTouched: true,
              }
            : row
        )
      );
    };

    const removeImage = (rowIndex, imgIndex) => {
      setRows((prev) =>
        prev.map((row, i) =>
          i === rowIndex
            ? {
                ...row,
                images: row.images.filter((_, j) => j !== imgIndex),
                imagesTouched: true,
              }
            : row
        )
      );
    };

    /* ================= SAVE STEP ================= */

    useImperativeHandle(ref, () => ({
      async saveStep() {
        if (!productId) return false;

        try {
          setLoading(true);

          const formData = new FormData();

          rows.forEach((row, index) => {
            formData.append(`variants[${index}][id]`, row.id || "");
            formData.append(
              `variants[${index}][variation_value_ids]`,
              JSON.stringify(row.key.split("_").map(Number))
            );
            formData.append(`variants[${index}][sku]`, row.sku || "");
            formData.append(`variants[${index}][extra_price]`, row.price || 0);
            formData.append(`variants[${index}][quantity]`, row.qty || 0);
            formData.append(
              `variants[${index}][low_quantity]`,
              row.low_qty || 0
            );

            if (row.imagesTouched) {
              const keepIds = (row.images || [])
                .filter((img) => !(img instanceof File) && img?.id)
                .map((img) => String(img.id));

              if (keepIds.length) {
                keepIds.forEach((id) =>
                  formData.append(`variants[${index}][keep_image_ids][]`, id)
                );
              } else {
                formData.append(`variants[${index}][keep_image_ids]`, "");
              }
            }

            (row.images || [])
              .filter((img) => img instanceof File)
              .forEach((file) => {
                formData.append(`variants[${index}][images][]`, file);
              });
          });

          await api.post(
            `/dashboard/product/sync-variations/${productId}`,
            formData
          );

          return true;
        } catch (err) {
          console.error(err);
          alert("Failed to save variations");
          return false;
        } finally {
          setLoading(false);
        }
      },
    }));

    /* ================= UI (MATCHED TO StepVariation) ================= */

    return (
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Product Variations
            </h3>
            <p className="text-sm text-gray-500">
              Select values to generate variants
            </p>
          </div>

          <a
            href="/settings/variation-settings"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50 transition"
          >
            + Add Variation
          </a>
        </div>

        {/* SELECTS */}
        <div className="space-y-4">
          {variations.map((v) => (
            <EditVariantSelect
              key={v.id}
              label={v.name}
              options={v.values}
              selected={selected[v.id] || []}
              onChange={(vals) => handleSelect(v.id, vals)}
            />
          ))}
        </div>

        {/* TABLE */}
        {labels.length > 0 && (
          <div className="border rounded-xl p-4">
            <EditVariantTable
              variants={labels}
              data={rows}
              setData={setRows}
              addImages={addImages}
              removeImage={removeImage}
            />
          </div>
        )}

        {/* EMPTY */}
        {variations.length > 0 &&
          variations.every((v) => !v.values?.length) && (
            <div className="rounded-lg border border-dashed p-4 text-center text-sm text-gray-500">
              No variation values found. Add values from{" "}
              <strong>Variation Settings</strong>.
            </div>
          )}

        {loading && <p className="text-sm text-indigo-600">Saving variants…</p>}
      </div>
    );
  }
);

export default EditStepVariation;
