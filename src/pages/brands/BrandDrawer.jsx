// import { useEffect, useState } from "react";

// export default function BrandDrawer({ open, onClose, data }) {
//   const [name, setName] = useState("");

//   useEffect(() => {
//     if (data) setName(data.name);
//     else setName("");
//   }, [data]);

//   if (!open) return null;

//   return (
//     <>
//       {/* OVERLAY */}
//       <div
//         className="fixed inset-0 bg-black/40 z-40"
//         onClick={onClose}
//       />

//       {/* DRAWER */}
//       <div className="fixed top-0 right-0 z-50 h-full w-full md:w-[35%] bg-white shadow-xl flex flex-col">
//         {/* HEADER */}
//         <div className="h-16 px-6 border-b flex items-center justify-between">
//           <h2 className="text-lg font-semibold">
//             {data ? "Edit Brand" : "Add Brand"}
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-xl text-gray-500"
//           >
//             ✕
//           </button>
//         </div>

//         {/* CONTENT */}
//         <div className="flex-1 px-6 py-6 space-y-4">
//           {/* IMAGE */}
//           <div>
//             <label className="text-sm text-gray-600">
//               Brand Image
//             </label>
//             <div className="mt-2 w-24 h-24 rounded-lg bg-gray-100 border flex items-center justify-center text-xs text-gray-400">
//               Upload
//             </div>
//           </div>

//           {/* NAME */}
//           <div>
//             <label className="text-sm text-gray-600">
//               Brand Name
//             </label>
//             <input
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="mt-1 w-full border rounded-lg px-3 py-2"
//               placeholder="Enter brand name"
//             />
//           </div>
//         </div>

//         {/* FOOTER */}
//         <div className="h-16 px-6 border-t flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border rounded"
//           >
//             Cancel
//           </button>
//           <button className="px-4 py-2 bg-indigo-600 text-white rounded">
//             {data ? "Update Brand" : "Save Brand"}
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }


// import { useEffect, useState } from "react";

// import api from "../../api/axios";

// export default function BrandDrawer({ open, onClose, data, onSaved }) {
//   const [name, setName] = useState("");
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState("");

//   useEffect(() => {
//     if (data) {
//       setName(data.name);
//       setPreview(data.full_image_url || "");
//       setImage(null);
//     } else {
//       setName("");
//       setPreview("");
//       setImage(null);
//     }
//   }, [data]);

//   if (!open) return null;

//   const handleSave = async () => {
//     const formData = new FormData();
//     formData.append("name", name);
//     if (image) formData.append("image", image);

//     if (data?.id) {
//       await api.put(`/dashboard/update-brand/${data.id}`, formData);
//     } else {
//       await api.post("/dashboard/add-brand", formData);
//     }

//     onSaved();
//     onClose();
//   };

//   return (
//     <>
//       <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

//       <div className="fixed top-0 right-0 z-50 h-full w-full md:w-[35%] bg-white shadow-xl flex flex-col">
//         <div className="h-16 px-6 border-b flex justify-between items-center">
//           <h2 className="text-lg font-semibold">
//             {data ? "Edit Brand" : "Add Brand"}
//           </h2>
//           <button onClick={onClose}>✕</button>
//         </div>

//         <div className="flex-1 px-6 py-6 space-y-4">
//           <div>
//             <label className="text-sm text-gray-600">Brand Image</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => {
//                 setImage(e.target.files[0]);
//                 setPreview(URL.createObjectURL(e.target.files[0]));
//               }}
//             />
//             {preview && (
//               <img src={preview} className="mt-2 w-24 h-24 rounded object-cover" />
//             )}
//           </div>

//           <div>
//             <label className="text-sm text-gray-600">Brand Name</label>
//             <input
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="mt-1 w-full border rounded-lg px-3 py-2"
//             />
//           </div>
//         </div>

//         <div className="h-16 px-6 border-t flex justify-end gap-3">
//           <button onClick={onClose} className="px-4 py-2 border rounded">
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             className="px-4 py-2 bg-indigo-600 text-white rounded"
//           >
//             {data ? "Update Brand" : "Save Brand"}
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }


import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function BrandDrawer({ open, onClose, data, onSaved }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setPreview(data.full_image_url || "");
      setImage(null);
    } else {
      setName("");
      setPreview("");
      setImage(null);
    }
  }, [data]);

  if (!open) return null;

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Brand name is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    try {
      if (data?.id) {
        await api.put(`/dashboard/update-brand/${data.id}`, formData);
      } else {
        await api.post("/dashboard/add-brand", formData);
      }

      onSaved(); // refresh list
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* DRAWER */}
      <div className="fixed top-0 right-0 z-50 h-full w-full md:w-[35%] bg-white shadow-xl flex flex-col">
        {/* HEADER */}
        <div className="h-16 px-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {data ? "Edit Brand" : "Add Brand"}
          </h2>
          <button
            onClick={onClose}
            className="text-xl text-gray-500"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 px-6 py-6 space-y-4">
          {/* IMAGE */}
          <div>
            <label className="text-sm text-gray-600">
              Brand Image
            </label>

            <div className="mt-2 flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg bg-gray-100 border flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img
                    src={preview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-400">
                    Upload
                  </span>
                )}
              </div>

              <label className="text-indigo-600 text-sm cursor-pointer">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImage}
                />
              </label>
            </div>
          </div>

          {/* NAME */}
          <div>
            <label className="text-sm text-gray-600">
              Brand Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2"
              placeholder="Enter brand name"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="h-16 px-6 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            {data ? "Update Brand" : "Save Brand"}
          </button>
        </div>
      </div>
    </>
  );
}

