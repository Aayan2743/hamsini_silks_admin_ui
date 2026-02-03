// // // src/pages/comp/EditgenerateVariants.js

// export function EditgenerateVariants(selected) {
//   const groups = Object.entries(selected)
//     .filter(([_, values]) => Array.isArray(values) && values.length > 0)
//     .sort(([a], [b]) => Number(a) - Number(b))
//     .map(([_, values]) => values);

//   if (!groups.length) return [];

//   const cartesian = groups.reduce(
//     (acc, curr) => acc.flatMap((a) => curr.map((c) => [...a, c])),
//     [[]],
//   );

//   // ✅ RETURN OBJECTS (ID-SAFE)
//   return cartesian.map((combo) => {
//     const valueIds = combo.map((v) => v.id).sort();

//     return {
//       key: valueIds.join("_"),
//       label: combo.map((v) => v.value).join(" / "),
//       valueIds,
//     };
//   });
// }

export function EditgenerateVariants(selected) {
  const groups = Object.values(selected).filter(
    (vals) => Array.isArray(vals) && vals.length > 0,
  );

  if (!groups.length) return [];

  const cartesian = groups.reduce(
    (acc, curr) => acc.flatMap((a) => curr.map((c) => [...a, c])),
    [[]],
  );

  return cartesian.map((combo) => {
    const ids = combo.map((v) => v.id).sort();

    return {
      key: ids.join("_"),
      label: combo.map((v) => v.value).join(" / "),
    };
  });
}
