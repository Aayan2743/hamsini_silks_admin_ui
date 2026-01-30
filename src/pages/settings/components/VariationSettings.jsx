// import { useEffect, useState } from "react";
// import SettingsLayout from "../SettingsLayout";
// import api from "../../../api/axios";

// export default function VariationSettings() {
//   const [variations, setVariations] = useState([]);
//   const [loading, setLoading] = useState(false);

//   /* ==============================
//       LOAD VARIATIONS
//   =============================== */
//   const loadVariations123 = async () => {
//     try {
//       const res = await api.get("/dashboard/get-variations");
//       setVariations(res.data.data || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

// const loadVariations = async () => {
//   try {
//     const res = await api.get("/dashboard/get-variations");

//     const normalized = (res.data.data || []).map((v) => ({
//       id: v.id,
//       name: v.name,
//       type: v.type,
//       values: (v.variation_values || []).map((val) =>
//         v.type === "color"
//           ? {
//               id: val.id,
//               label: val.value,                // color name
//               code: val.color_code || "#000000",
//             }
//           : {
//               id: val.id,
//               value: val.value,
//             }
//       ),
//     }));

//     setVariations(normalized);
//   } catch (err) {
//     console.error(err);
//   }
// };

//   useEffect(() => {
//     loadVariations();
//   }, []);

//   /* ==============================
//       VARIATION CRUD (UI)
//   =============================== */
//   const addVariation = () => {
//     setVariations([
//       ...variations,
//       {
//         tempId: Date.now(), // frontend temp id
//         name: "",
//         type: "text",
//         values: [],
//       },
//     ]);
//   };

//   const updateVariation = (id, field, value) => {
//     setVariations(
//       variations.map((v) =>
//         (v.id || v.tempId) === id ? { ...v, [field]: value } : v
//       )
//     );
//   };

//   const removeVariation = async (variation) => {
//     if (variation.id) {
//       await api.delete(`/dashboard/delete-variations/${variation.id}`);
//     }
//     setVariations(
//       variations.filter((v) => (v.id || v.tempId) !== (variation.id || variation.tempId))
//     );
//   };

//   /* ==============================
//       VALUES CRUD (UI)
//   =============================== */
// const addValue = (variationId, type) => {
//   setVariations(
//     variations.map((v) =>
//       (v.id || v.tempId) === variationId
//         ? {
//             ...v,
//             values:
//               type === "color"
//                 ? [...v.values, { id: null, label: "", code: "#000000" }]
//                 : [...v.values, { id: null, value: "" }],
//           }
//         : v
//     )
//   );
// };

// const updateValue = (variationId, index, field, value) => {
//   setVariations(
//     variations.map((v) =>
//       (v.id || v.tempId) === variationId
//         ? {
//             ...v,
//             values: v.values.map((val, i) =>
//               i === index ? { ...val, [field]: value } : val
//             ),
//           }
//         : v
//     )
//   );
// };

// const removeValue = async (variation, index) => {
//   const value = variation.values[index];

//   try {
//     // delete from DB only if already saved
//     if (value?.id) {
//       await api.delete(
//         `/dashboard/delete-variation-value/${value.id}`
//       );
//     }

//     // remove from UI
//     setVariations((prev) =>
//       prev.map((v) =>
//         (v.id || v.tempId) === (variation.id || variation.tempId)
//           ? {
//               ...v,
//               values: v.values.filter((_, i) => i !== index),
//             }
//           : v
//       )
//     );
//   } catch (err) {
//     console.error("Delete value failed", err);
//     alert("Failed to delete value");
//   }
// };

//   /* ==============================
//       SAVE TO BACKEND
//   =============================== */
// const handleSave = async () => {
//   try {
//     setLoading(true);

//     for (const variation of variations) {
//       let variationId = variation.id;

//       /* ======================
//          CREATE / UPDATE VARIATION
//       ======================= */
//       if (!variationId) {
//         const res = await api.post("/dashboard/add-variation", {
//           name: variation.name,
//           type: variation.type,
//         });

//         variationId = res.data.data.id;
//         variation.id = variationId; // sync frontend
//       } else {
//         await api.put(`/dashboard/update-variations/${variationId}`, {
//           name: variation.name,
//           type: variation.type,
//         });
//       }

//       /* ======================
//          ADD / UPDATE VALUES
//       ======================= */
// for (const val of variation.values) {
//   // TEXT
//   if (variation.type === "text") {
//     if (!val.value) continue;

//     if (!val.id) {
//       const res = await api.post(
//         `/dashboard/add-variation-value/${variationId}`,
//         { value: val.value }
//       );
//       val.id = res.data.data.id;
//     } else {
//       await api.put(
//         `/dashboard/update-variation-value/${val.id}`,
//         { value: val.value }
//       );
//     }
//   }

//   // COLOR
//   if (variation.type === "color") {
//     if (!val.label) continue;

//     if (!val.id) {
//       const res = await api.post(
//         `/dashboard/add-variation-value/${variationId}`,
//         {
//           value: val.label,
//           color_code: val.code,
//         }
//       );
//       val.id = res.data.data.id;
//     } else {
//       await api.put(
//         `/dashboard/update-variation-value/${val.id}`,
//         {
//           value: val.label,
//           color_code: val.code,
//         }
//       );
//     }
//   }
// }

//     }

//     alert("Variations saved successfully");
//     loadVariations();
//   } catch (err) {
//     console.error(err);
//     alert("Save failed");
//   } finally {
//     setLoading(false);
//   }
// };

//   /* ==============================
//       UI
//   =============================== */
//   return (
//     <SettingsLayout>
//       <div className="bg-white rounded-xl border p-6 space-y-6">
//         {/* HEADER */}
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg font-semibold">Variation Settings</h2>
//           <button
//             onClick={addVariation}
//             className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
//           >
//             + Add Variation
//           </button>
//         </div>

//         {/* VARIATIONS */}
//         {variations.map((variation) => {
//           const vId = variation.id || variation.tempId;

//           return (
//             <div key={vId} className="border rounded-xl p-4 space-y-4">
//               {/* HEADER */}
//               <div className="grid grid-cols-12 gap-4 items-center">
//                 <input
//                   value={variation.name}
//                   onChange={(e) =>
//                     updateVariation(vId, "name", e.target.value)
//                   }
//                   placeholder="Variation name"
//                   className="col-span-4 border rounded-lg px-3 py-2 text-sm"
//                 />

//                 <select
//                   value={variation.type}
//                   onChange={(e) =>
//                     updateVariation(vId, "type", e.target.value)
//                   }
//                   className="col-span-3 border rounded-lg px-3 py-2 text-sm"
//                 >
//                   <option value="text">Text</option>
//                   <option value="color">Color</option>
//                 </select>

//                 <div className="col-span-5 text-right">
//                   <button
//                     onClick={() => removeVariation(variation)}
//                     className="text-sm text-red-600 hover:underline"
//                   >
//                     Remove Variation
//                   </button>
//                 </div>
//               </div>

//               {/* VALUES */}
//               <div className="space-y-3">
//                 {variation.values.map((val, index) => (
//                   <div
//                     key={index}
//                     className="grid grid-cols-12 gap-3 items-center"
//                   >
//                     {variation.type === "color" ? (
//                       <>
//                         <input
//                           value={val.label}
//                           onChange={(e) =>
//                             updateValue(vId, index, "label", e.target.value)
//                           }
//                           placeholder="Color name"
//                           className="col-span-4 border rounded-lg px-3 py-2 text-sm"
//                         />

//                         <input
//                           type="color"
//                           value={val.code}
//                           onChange={(e) =>
//                             updateValue(vId, index, "code", e.target.value)
//                           }
//                           className="col-span-2 h-10 border rounded-lg"
//                         />

//                         <input
//                           value={val.code}
//                           onChange={(e) =>
//                             updateValue(vId, index, "code", e.target.value)
//                           }
//                           className="col-span-3 border rounded-lg px-3 py-2 text-sm"
//                         />
//                       </>
//                     ) : (
//                        <input
//                         value={val.value}
//                         onChange={(e) =>
//                           updateValue(vId, index, "value", e.target.value)
//                         }
//                         placeholder="Value"
//                         className="col-span-9 border rounded-lg px-3 py-2 text-sm"
//                       />

//                     )}

//                     <button
//                       onClick={() => removeValue(variation, index)}
//                       className="col-span-3 text-sm text-red-600 hover:underline"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 ))}

//                 <button
//                   onClick={() => addValue(vId, variation.type)}
//                   className="text-sm text-blue-600 hover:underline"
//                 >
//                   + Add Value
//                 </button>
//               </div>
//             </div>
//           );
//         })}

//         {/* FOOTER */}
//         <div className="flex justify-end">
//           <button
//             disabled={loading}
//             onClick={handleSave}
//             className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//           >
//             {loading ? "Saving..." : "Save Variations"}
//           </button>
//         </div>
//       </div>
//     </SettingsLayout>
//   );
// }

import { useEffect, useState } from "react";
import SettingsLayout from "../SettingsLayout";
import api from "../../../api/axios";

export default function VariationSettings() {
  const [variations, setVariations] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD VARIATIONS ================= */
  const loadVariations = async () => {
    try {
      const res = await api.get("/dashboard/get-variations");

      const normalized = (res.data.data || []).map((v) => ({
        id: v.id,
        name: v.name,
        type: v.type,
        values: (v.variation_values || []).map((val) =>
          v.type === "color"
            ? {
                id: val.id,
                label: val.value,
                code: val.color_code || "#000000",
              }
            : {
                id: val.id,
                value: val.value,
              }
        ),
      }));

      setVariations(normalized);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadVariations();
  }, []);

  /* ================= VARIATION CRUD ================= */
  const addVariation = () => {
    setVariations((prev) => [
      ...prev,
      {
        tempId: Date.now(),
        name: "",
        type: "text",
        values: [],
      },
    ]);
  };

  const updateVariation = (id, field, value) => {
    setVariations((prev) =>
      prev.map((v) =>
        (v.id || v.tempId) === id ? { ...v, [field]: value } : v
      )
    );
  };

  const removeVariation = async (variation) => {
    if (variation.id) {
      await api.delete(`/dashboard/delete-variations/${variation.id}`);
    }

    setVariations((prev) =>
      prev.filter(
        (v) => (v.id || v.tempId) !== (variation.id || variation.tempId)
      )
    );
  };

  /* ================= VALUES CRUD ================= */
  const addValue = (variationId, type) => {
    setVariations((prev) =>
      prev.map((v) =>
        (v.id || v.tempId) === variationId
          ? {
              ...v,
              values:
                type === "color"
                  ? [...v.values, { id: null, label: "", code: "#000000" }]
                  : [...v.values, { id: null, value: "" }],
            }
          : v
      )
    );
  };

  const updateValue = (variationId, index, field, value) => {
    setVariations((prev) =>
      prev.map((v) =>
        (v.id || v.tempId) === variationId
          ? {
              ...v,
              values: v.values.map((val, i) =>
                i === index ? { ...val, [field]: value } : val
              ),
            }
          : v
      )
    );
  };

  const removeValue = async (variation, index) => {
    const value = variation.values[index];

    if (value?.id) {
      await api.delete(`/dashboard/delete-variation-value/${value.id}`);
    }

    setVariations((prev) =>
      prev.map((v) =>
        (v.id || v.tempId) === (variation.id || variation.tempId)
          ? {
              ...v,
              values: v.values.filter((_, i) => i !== index),
            }
          : v
      )
    );
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    try {
      setLoading(true);

      for (const variation of variations) {
        let variationId = variation.id;

        if (!variationId) {
          const res = await api.post("/dashboard/add-variation", {
            name: variation.name,
            type: variation.type,
          });
          variationId = res.data.data.id;
          variation.id = variationId;
        } else {
          await api.put(`/dashboard/update-variations/${variationId}`, {
            name: variation.name,
            type: variation.type,
          });
        }

        for (const val of variation.values) {
          if (variation.type === "text") {
            if (!val.value) continue;

            if (!val.id) {
              const res = await api.post(
                `/dashboard/add-variation-value/${variationId}`,
                { value: val.value }
              );
              val.id = res.data.data.id;
            } else {
              await api.put(`/dashboard/update-variation-value/${val.id}`, {
                value: val.value,
              });
            }
          }

          if (variation.type === "color") {
            if (!val.label) continue;

            if (!val.id) {
              const res = await api.post(
                `/dashboard/add-variation-value/${variationId}`,
                {
                  value: val.label,
                  color_code: val.code,
                }
              );
              val.id = res.data.data.id;
            } else {
              await api.put(`/dashboard/update-variation-value/${val.id}`, {
                value: val.label,
                color_code: val.code,
              });
            }
          }
        }
      }

      alert("Variations saved successfully");
      loadVariations();
    } catch (err) {
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <SettingsLayout>
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Variation Settings
            </h2>
            <p className="text-sm text-gray-500">
              Manage product variations and values
            </p>
          </div>

          <button
            onClick={addVariation}
            className="px-4 py-2 rounded-lg border text-sm
            hover:bg-gray-50 transition"
          >
            + Add Variation
          </button>
        </div>

        {/* VARIATIONS */}
        {variations.map((variation) => {
          const vId = variation.id || variation.tempId;

          return (
            <div key={vId} className="border rounded-xl p-4 space-y-4">
              {/* VAR HEADER */}
              <div className="grid grid-cols-12 gap-4 items-center">
                <input
                  value={variation.name}
                  onChange={(e) => updateVariation(vId, "name", e.target.value)}
                  placeholder="Variation name (e.g. Size)"
                  className="input col-span-5"
                />

                <select
                  value={variation.type}
                  onChange={(e) => updateVariation(vId, "type", e.target.value)}
                  className="input col-span-3"
                >
                  <option value="text">Text</option>
                  <option value="color">Color</option>
                </select>

                <div className="col-span-4 text-right">
                  <button
                    onClick={() => removeVariation(variation)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* VALUES */}
              <div className="space-y-3">
                {variation.values.map((val, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-3 items-center"
                  >
                    {variation.type === "color" ? (
                      <>
                        <input
                          value={val.label}
                          onChange={(e) =>
                            updateValue(vId, index, "label", e.target.value)
                          }
                          placeholder="Color name"
                          className="input col-span-4"
                        />

                        <input
                          type="color"
                          value={val.code}
                          onChange={(e) =>
                            updateValue(vId, index, "code", e.target.value)
                          }
                          className="col-span-2 h-10 rounded-lg border"
                        />

                        <input
                          value={val.code}
                          onChange={(e) =>
                            updateValue(vId, index, "code", e.target.value)
                          }
                          className="input col-span-3"
                        />
                      </>
                    ) : (
                      <input
                        value={val.value}
                        onChange={(e) =>
                          updateValue(vId, index, "value", e.target.value)
                        }
                        placeholder="Value"
                        className="input col-span-9"
                      />
                    )}

                    <button
                      onClick={() => removeValue(variation, index)}
                      className="col-span-3 text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => addValue(vId, variation.type)}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  + Add Value
                </button>
              </div>
            </div>
          );
        })}

        {/* FOOTER */}
        <div className="flex justify-end">
          <button
            disabled={loading}
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white
            hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            {loading ? "Saving..." : "Save Variations"}
          </button>
        </div>
      </div>
    </SettingsLayout>
  );
}
