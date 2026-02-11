// import { useState } from "react";

// export default function VariantSelect({
//   label,
//   options = [],
//   selected = [],
//   onChange,
// }) {
//   const [open, setOpen] = useState(false);

//   const isSelected = (opt) =>
//     selected.some((s) => s.id === opt.id);

//   const toggle = (opt) => {
//     onChange(
//       isSelected(opt)
//         ? selected.filter((s) => s.id !== opt.id)
//         : [...selected, opt]
//     );
//   };

//   return (
//     <div className="border rounded-xl p-4">
//       <label className="text-sm font-medium">
//         {label}
//       </label>

//       <button
//         type="button"
//         onClick={() => setOpen(!open)}
//         className="mt-2 w-full border rounded-lg px-4 py-3 text-left flex justify-between items-center"
//       >
//         {selected.length
//           ? `${selected.length} selected`
//           : `Select ${label}`}
//         <span>▾</span>
//       </button>

//       {open && (
//         <div className="mt-3 space-y-2">
//           {options.map((opt) => (
//             <label
//               key={opt.id}
//               className="flex items-center gap-2 text-sm"
//             >
//               <input
//                 type="checkbox"
//                 checked={isSelected(opt)}
//                 onChange={() => toggle(opt)}
//               />
//               {opt.value}
//             </label>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useRef, useEffect } from "react";

export default function VariantSelect({
  label,
  options = [],
  selected = [],
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const isSelected = (opt) => selected.some((s) => s.id === opt.id);

  const toggle = (opt) => {
    onChange(
      isSelected(opt)
        ? selected.filter((s) => s.id !== opt.id)
        : [...selected, opt],
    );
  };

  // close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="w-full relative" ref={ref}>
      <label className="text-sm font-medium text-gray-700">{label}</label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="mt-2 w-full h-11 px-4 border rounded-lg text-left flex justify-between items-center bg-white"
      >
        <span>
          {selected.length ? `${selected.length} selected` : `Select ${label}`}
        </span>
        <span className="text-gray-400">▾</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-50 max-h-56 overflow-y-auto p-3 space-y-2">
          {options.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={isSelected(opt)}
                onChange={() => toggle(opt)}
              />
              {opt.value}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
