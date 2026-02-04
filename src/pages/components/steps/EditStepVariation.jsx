// import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
// import api from "../../../api/axios";
// import { EditgenerateVariants } from "./EditgenerateVariants";
// import EditVariantSelect from "./EditVariantSelect";
// import EditVariantTable from "./EditVariantTable";

// const EditStepVariation = forwardRef(
//   ({ productId, existingCombinations = [] }, ref) => {
//     const [variations, setVariations] = useState([]);
//     const [selected, setSelected] = useState({});
//     const [rows, setRows] = useState([]);
//     const [labels, setLabels] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const [initialized, setInitialized] = useState(false);

//     /* LOAD VARIATIONS */
//     useEffect(() => {
//       api.get("/admin-dashboard/get-variations").then((res) => {
//         const raw = Array.isArray(res.data?.data) ? res.data.data : [];

//         const normalized = raw.map((v) => ({
//           id: v.id,
//           name: v.name,
//           type: v.type,
//           values: (v.values || []).map((val) => ({
//             id: val.id,
//             value: val.value,
//             color_code: val.color_code ?? null,
//           })),
//         }));

//         setVariations(normalized);

//         // init selected map
//         const init = {};
//         normalized.forEach((v) => (init[v.id] = []));
//         setSelected(init);
//       });
//     }, []);

//     /* PREFILL EXISTING */
//     useEffect(() => {
//       if (!existingCombinations.length || !variations.length) return;

//       const sel = {};
//       const rowMap = {};

//       variations.forEach((v) => (sel[v.id] = []));

//       existingCombinations.forEach((combo) => {
//         if (!combo.combination_values) return;

//         const ids = combo.combination_values.map((cv) => cv.value.id).sort();

//         const key = ids.join("_");

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
//           purchase_price: combo.purchase_price || "",
//           extra_price: combo.extra_price ?? "",
//           discount: combo.discount || "",
//           qty: combo.quantity || "",
//           low_qty: combo.low_quantity || "",
//           images: combo.images || [],
//           imagesTouched: false,
//         };
//       });

//       Object.keys(sel).forEach((k) => {
//         sel[k] = Array.from(new Map(sel[k].map((v) => [v.id, v])).values());
//       });

//       setSelected(sel);

//       const combos = EditgenerateVariants(sel);

//       setRows(
//         combos.map((c) => ({
//           key: c.key,
//           label: c.label,
//           ...rowMap[c.key],
//         })),
//       );

//       setLabels(combos.map((c) => c.label));

//       // 🔥 MARK PREFILL COMPLETE
//       setInitialized(true);
//     }, [existingCombinations, variations]);

//     useEffect(() => {
//       // 🚫 DO NOTHING until prefill is done
//       if (!initialized) return;

//       const active = Object.values(selected).filter(
//         (vals) => Array.isArray(vals) && vals.length > 0,
//       );

//       if (!active.length) {
//         setRows([]);
//         setLabels([]);
//         return;
//       }

//       const combos = EditgenerateVariants(selected);

//       setRows((prev) =>
//         combos.map((c) => {
//           const existing = prev.find((r) => r.key === c.key);

//           return (
//             existing || {
//               id: null,
//               key: c.key,
//               label: c.label,
//               sku: "",
//               price: "",
//               purchase_price: "",
//               discount: "",
//               qty: "",
//               low_qty: "",
//               images: [],
//               imagesTouched: false,
//             }
//           );
//         }),
//       );

//       setLabels(combos.map((c) => c.label));
//     }, [selected, initialized]);

//     const addImages = (rowIndex, files) => {
//       setRows((prev) =>
//         prev.map((row, i) =>
//           i === rowIndex
//             ? {
//                 ...row,
//                 images: [...(row.images || []), ...files],
//                 imagesTouched: true, // ✅ REQUIRED
//               }
//             : row,
//         ),
//       );
//     };

//     const removeImage = (rowIndex, imgIndex) => {
//   setRows((prev) =>
//     prev.map((row, i) =>
//       i === rowIndex
//         ? {
//             ...row,
//             images: row.images.filter((_, j) => j !== imgIndex),
//             imagesTouched: true, // ✅ REQUIRED
//           }
//         : row
//     )
//   );

//     /* SAVE */
//     useImperativeHandle(ref, () => ({
//       async saveStep() {
//         try {
//           setLoading(true);

//           const fd = new FormData();

//         rows.forEach((row, index) => {
//   fd.append(`variants[${index}][id]`, row.id || "");
//   fd.append(`variants[${index}][sku]`, row.sku || "");
//   fd.append(`variants[${index}][purchase_price]`, row.purchase_price || 0);
//   fd.append(`variants[${index}][extra_price]`, row.price || 0);
//   fd.append(`variants[${index}][discount]`, row.discount || 0);
//   fd.append(`variants[${index}][quantity]`, row.qty || 0);
//   fd.append(`variants[${index}][low_quantity]`, row.low_qty || 0);

//   row.key.split("_").forEach((id) => {
//     fd.append(`variants[${index}][variation_value_ids][]`, id);
//   });

//   // ✅ IMAGE FIX HERE
//   if (row.imagesTouched) {
//     const keepIds = (row.images || [])
//       .filter((img) => !(img instanceof File) && img?.id)
//       .map((img) => String(img.id));

//     keepIds.forEach((id) =>
//       fd.append(`variants[${index}][keep_image_ids][]`, id)
//     );

//     (row.images || [])
//       .filter((img) => img instanceof File)
//       .forEach((file) =>
//         fd.append(`variants[${index}][images][]`, file)
//       );
//   }
//         });

//           await api.post(
//             `/admin-dashboard/product/update-variation/${productId}`,
//             fd,
//           );

//           return true;
//         } catch (e) {
//           alert("Failed to update variations");
//           return false;
//         } finally {
//           setLoading(false);
//         }
//       },
//     }));

//     return (
//       <div className="bg-white rounded-xl border p-6 space-y-6 overflow-visible">
//         <h3 className="text-lg font-semibold">Product Variations</h3>

//         {variations.map((v) => (
//           // <EditVariantSelect
//           //   key={v.id}
//           //   label={v.name}
//           //   options={v.values}
//           //   selected={selected[v.id] || []}
//           //   onChange={(vals) => setSelected((p) => ({ ...p, [v.id]: vals }))}
//           // />

//           <EditVariantSelect
//             key={v.id}
//             label={v.name}
//             options={v.values}
//             selected={selected[v.id] || []}
//             onChange={(vals) =>
//               setSelected((prev) => ({
//                 ...prev,
//                 [v.id]: vals,
//               }))
//             }
//           />
//         ))}

//         {labels.length > 0 && (
//           <EditVariantTable variants={labels} data={rows} setData={setRows} />
//         )}

//         {loading && <p>Saving variations…</p>}
//       </div>
//     );
//   },
// );

// export default EditStepVariation;
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import api from "../../../api/axios";
import { EditgenerateVariants } from "./EditgenerateVariants";
import EditVariantSelect from "./EditVariantSelect";
import EditVariantTable from "./EditVariantTable";

const EditStepVariation = forwardRef(
  ({ productId, existingCombinations = [] }, ref) => {
    const [variations, setVariations] = useState([]);
    const [selected, setSelected] = useState({});
    const [rows, setRows] = useState([]);
    const [labels, setLabels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);

    /* ================= LOAD VARIATIONS ================= */
    useEffect(() => {
      (async () => {
        const res = await api.get("/admin-dashboard/get-variations");
        const raw = Array.isArray(res.data?.data) ? res.data.data : [];

        const normalized = raw.map((v) => ({
          id: v.id,
          name: v.name,
          values: Array.isArray(v.values)
            ? v.values.map((val) => ({
                id: val.id,
                value: val.value,
              }))
            : [],
        }));

        setVariations(normalized);

        const init = {};
        normalized.forEach((v) => (init[v.id] = []));
        setSelected(init);
      })();
    }, []);

    /* ================= PREFILL EXISTING ================= */
    useEffect(() => {
      if (!existingCombinations.length || !variations.length) return;

      const sel = {};
      const rowMap = {};

      variations.forEach((v) => (sel[v.id] = []));

      existingCombinations.forEach((combo) => {
        if (!Array.isArray(combo.combination_values)) return;

        const ids = combo.combination_values
          .map((cv) => cv?.value?.id)
          .filter(Boolean)
          .sort();

        if (!ids.length) return;

        const key = ids.join("_");

        combo.combination_values.forEach((cv) => {
          const variationId = cv.value.variation_id;
          sel[variationId].push({
            id: cv.value.id,
            value: cv.value.value,
          });
        });

        rowMap[key] = {
          id: combo.id,
          label: combo.combination_values.map((v) => v.value.value).join(" / "),
          sku: combo.sku ?? "",
          purchase_price: combo.purchase_price ?? "",
          price: combo.extra_price ?? "",
          discount: combo.discount ?? "",
          qty: combo.quantity ?? "",
          low_qty: combo.low_quantity ?? "",
          images: combo.images ?? [],
          imagesTouched: false,
        };
      });

      Object.keys(sel).forEach((k) => {
        sel[k] = Array.from(new Map(sel[k].map((v) => [v.id, v])).values());
      });

      setSelected(sel);

      const combos = EditgenerateVariants(sel);

      setRows(
        combos.map((c) => ({
          key: c.key,
          label: c.label,
          ...rowMap[c.key],
        })),
      );

      setLabels(combos.map((c) => c.label));
      setInitialized(true);
    }, [existingCombinations, variations]);

    /* ================= REGENERATE ON SELECT ================= */
    useEffect(() => {
      if (!initialized) return;

      const active = Object.values(selected).some((v) => v.length);
      if (!active) {
        setRows([]);
        setLabels([]);
        return;
      }

      const combos = EditgenerateVariants(selected);

      setRows((prev) =>
        combos.map((c) => {
          const existing = prev.find((r) => r.key === c.key);
          return (
            existing || {
              key: c.key,
              label: c.label,
              sku: "",
              purchase_price: "",
              price: "",
              discount: "",
              qty: "",
              low_qty: "",
              images: [],
              imagesTouched: false,
            }
          );
        }),
      );

      setLabels(combos.map((c) => c.label));
    }, [selected, initialized]);

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
            : row,
        ),
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
            : row,
        ),
      );
    };

    /* ================= SAVE ================= */
    useImperativeHandle(ref, () => ({
      async saveStep() {
        try {
          setLoading(true);

          const fd = new FormData();

          rows.forEach((row, index) => {
            fd.append(`variants[${index}][id]`, row.id || "");
            fd.append(`variants[${index}][sku]`, row.sku || "");
            fd.append(
              `variants[${index}][purchase_price]`,
              row.purchase_price || 0,
            );
            fd.append(`variants[${index}][extra_price]`, row.price || 0);
            fd.append(`variants[${index}][discount]`, row.discount || 0);
            fd.append(`variants[${index}][quantity]`, row.qty || 0);
            fd.append(`variants[${index}][low_quantity]`, row.low_qty || 0);

            row.key
              .split("_")
              .forEach((id) =>
                fd.append(`variants[${index}][variation_value_ids][]`, id),
              );

            if (row.imagesTouched) {
              row.images
                .filter((img) => !(img instanceof File) && img.id)
                .forEach((img) =>
                  fd.append(`variants[${index}][keep_image_ids][]`, img.id),
                );

              row.images
                .filter((img) => img instanceof File)
                .forEach((file) =>
                  fd.append(`variants[${index}][images][]`, file),
                );
            }
          });

          await api.post(
            `/admin-dashboard/product/update-variation/${productId}`,
            fd,
          );

          return true;
        } finally {
          setLoading(false);
        }
      },
    }));

    return (
      <div className="bg-white rounded-xl border p-6 space-y-6">
        <h3 className="text-lg font-semibold">Product Variations</h3>

        {variations.map((v) => (
          <EditVariantSelect
            key={v.id}
            label={v.name}
            options={v.values}
            selected={selected[v.id] || []}
            onChange={(vals) => setSelected((p) => ({ ...p, [v.id]: vals }))}
          />
        ))}

        {labels.length > 0 && (
          <EditVariantTable
            variants={labels}
            data={rows}
            setData={setRows}
            addImages={addImages}
            removeImage={removeImage}
          />
        )}

        {loading && <p>Saving variations…</p>}
      </div>
    );
  },
);

export default EditStepVariation;
