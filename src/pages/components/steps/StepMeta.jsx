// import {
//   forwardRef,
//   useImperativeHandle,
//   useState,
// } from "react";
// import api from "../../../api/axios";

// const StepMeta = forwardRef(({ productId }, ref) => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [tags, setTags] = useState([]);
//   const [tagInput, setTagInput] = useState("");

//   /* ================= ADD TAG ================= */

//   const addTag = (e) => {
//     if (e.key === "Enter" && tagInput.trim()) {
//       e.preventDefault();

//       if (!tags.includes(tagInput.trim())) {
//         setTags((prev) => [...prev, tagInput.trim()]);
//       }

//       setTagInput("");
//     }
//   };

//   const removeTag = (index) => {
//     setTags(tags.filter((_, i) => i !== index));
//   };

//   /* ================= SAVE STEP (CALLED BY DRAWER) ================= */

//   useImperativeHandle(ref, () => ({
//     async saveStep() {
//       console.log("🔥 Step 4 saveStep triggered");

//       if (!productId) {
//         alert("Product ID missing");
//         return false;
//       }

//       try {
//         await api.post(
//           `/dashboard/product/create-seo/${productId}`,
//           {
//             meta_title: title,
//             meta_description: description,
//             meta_tags: tags,
//           }
//         );

//         return true;
//       } catch (error) {
//         console.error("SEO SAVE ERROR:", error);
//         alert("Failed to save SEO meta");
//         return false;
//       }
//     },
//   }));

//   return (
//     <div className="bg-white border rounded-xl p-6 space-y-6">
//       {/* HEADER */}
//       <div>
//         <h3 className="text-lg font-semibold">
//           SEO Meta Information
//         </h3>
//         <p className="text-sm text-gray-500">
//           Optimize how this product appears on search engines.
//         </p>
//       </div>

//       {/* META TITLE */}
//       <div>
//         <label className="text-sm font-medium">
//           Meta Title
//         </label>
//         <input
//           type="text"
//           value={title}
//           maxLength={60}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Product title for search engines"
//           className="input mt-1"
//         />
//         <p className="text-xs text-gray-400 mt-1">
//           {title.length}/60 characters
//         </p>
//       </div>

//       {/* META DESCRIPTION */}
//       <div>
//         <label className="text-sm font-medium">
//           Meta Description
//         </label>
//         <textarea
//           rows={3}
//           value={description}
//           maxLength={160}
//           onChange={(e) =>
//             setDescription(e.target.value)
//           }
//           placeholder="Short description shown in search results"
//           className="input mt-1 resize-none"
//         />
//         <p className="text-xs text-gray-400 mt-1">
//           {description.length}/160 characters
//         </p>
//       </div>

//       {/* META TAGS */}
//       <div>
//         <label className="text-sm font-medium">
//           Meta Tags
//         </label>
//         <input
//           type="text"
//           value={tagInput}
//           onChange={(e) =>
//             setTagInput(e.target.value)
//           }
//           onKeyDown={addTag}
//           placeholder="Type & press Enter"
//           className="input mt-1"
//         />

//         {tags.length > 0 && (
//           <div className="flex flex-wrap gap-2 mt-2">
//             {tags.map((tag, i) => (
//               <span
//                 key={i}
//                 className="bg-gray-200 px-3 py-1 rounded text-sm flex items-center gap-2"
//               >
//                 {tag}
//                 <button
//                   type="button"
//                   onClick={() => removeTag(i)}
//                   className="text-gray-600 hover:text-black"
//                 >
//                   ✕
//                 </button>
//               </span>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// });

// export default StepMeta;

import { forwardRef, useImperativeHandle, useState } from "react";
import api from "../../../api/axios";

const StepMeta = forwardRef(({ productId }, ref) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  /* ================= ADD TAG ================= */

  const addTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();

      if (!tags.includes(tagInput.trim())) {
        setTags((prev) => [...prev, tagInput.trim()]);
      }

      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= SAVE STEP ================= */

  useImperativeHandle(ref, () => ({
    async saveStep() {
      if (!productId) {
        alert("Product ID missing");
        return false;
      }

      try {
        await api.post(`/dashboard/product/create-seo/${productId}`, {
          meta_title: title,
          meta_description: description,
          meta_tags: tags,
        });

        return true;
      } catch (error) {
        alert("Failed to save SEO meta");
        return false;
      }
    },
  }));

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          SEO Meta Information
        </h3>
        <p className="text-sm text-gray-500">
          Optimize how this product appears on search engines
        </p>
      </div>

      {/* META TITLE */}
      <div>
        <label className="text-sm font-medium text-gray-700">Meta Title</label>
        <input
          type="text"
          value={title}
          maxLength={60}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Product title for search engines"
          className="input mt-1"
        />
        <p className="text-xs text-gray-400 mt-1">
          {title.length}/60 characters
        </p>
      </div>

      {/* META DESCRIPTION */}
      <div>
        <label className="text-sm font-medium text-gray-700">
          Meta Description
        </label>
        <textarea
          rows={3}
          value={description}
          maxLength={160}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description shown in search results"
          className="input mt-1 resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">
          {description.length}/160 characters
        </p>
      </div>

      {/* META TAGS */}
      <div>
        <label className="text-sm font-medium text-gray-700">Meta Tags</label>

        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={addTag}
          placeholder="Type a tag and press Enter"
          className="input mt-1"
        />

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2
                bg-indigo-50 text-indigo-700
                px-3 py-1 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(i)}
                  className="text-indigo-500 hover:text-indigo-700"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default StepMeta;
