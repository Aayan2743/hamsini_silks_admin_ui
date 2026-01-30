// import {
//   useRef,
//   useState,
//   useEffect,
//   forwardRef,
//   useImperativeHandle,
// } from "react";
// import api from "../../../api/axios";

// const EditStepGallery = forwardRef(
//   (
//     {
//       productId,
//       existingImages = [],
//       existingVideo = null,
//     },
//     ref
//   ) => {
//     const inputRef = useRef(null);

//     /* ================= STATE ================= */

//     // Existing images from DB
//     const [savedImages, setSavedImages] = useState([]);

//     // Newly uploaded images
//     const [newImages, setNewImages] = useState([]);

//     // Primary image
//     const [mainImageId, setMainImageId] = useState(null);

//     // Video URL
//     const [videoUrl, setVideoUrl] = useState("");

//     const [loading, setLoading] = useState(false);

//     /* ================= LOAD EXISTING IMAGES ================= */

//     useEffect(() => {
//       if (!existingImages?.length) {
//         setSavedImages([]);
//         setMainImageId(null);
//         return;
//       }

//       const mapped = existingImages.map((img) => ({
//         id: img.id,
//         url: img.image_url, // ✅ backend sends full URL
//         is_primary: img.is_primary,
//       }));

//       setSavedImages(mapped);

//       const primary = mapped.find((i) => i.is_primary);
//       if (primary) setMainImageId(primary.id);
//     }, [existingImages]);

//     /* ================= LOAD EXISTING VIDEO ================= */

//     useEffect(() => {
//       if (existingVideo?.video_url) {
//         setVideoUrl(existingVideo.video_url);
//       }
//     }, [existingVideo]);

//     /* ================= FILE HANDLER ================= */

//     const handleFiles = (files) => {
//       setNewImages((prev) => [
//         ...prev,
//         ...Array.from(files),
//       ]);
//     };

//     /* ================= REMOVE EXISTING IMAGE ================= */

//     const removeSavedImage = async (imageId) => {
//       try {
//         await api.delete(
//           `/dashboard/product/product-delete/${imageId}`
//         );

//         setSavedImages((prev) =>
//           prev.filter((img) => img.id !== imageId)
//         );

//         if (mainImageId === imageId) {
//           setMainImageId(null);
//         }
//       } catch (error) {
//         console.error(error);
//         alert("Failed to delete image");
//       }
//     };

//     /* ================= REMOVE NEW IMAGE ================= */

//     const removeNewImage = (index) => {
//       setNewImages((prev) =>
//         prev.filter((_, i) => i !== index)
//       );
//     };

//     /* ================= SAVE STEP (EXPOSED TO PARENT) ================= */

//     useImperativeHandle(ref, () => ({
//       async saveStep() {
//         if (!productId) {
//           alert("Product ID missing");
//           return false;
//         }

//         try {
//           setLoading(true);

//           // Upload new images
//           if (newImages.length > 0) {
//             const formData = new FormData();
//             newImages.forEach((file) =>
//               formData.append("images", file)
//             );

//             await api.post(
//               `/dashboard/product/${productId}/images`,
//               formData
//             );
//           }

//           // Set main image
//           if (mainImageId) {
//             await api.post(
//               `/dashboard/product/${productId}/set-main-image`,
//               { image_id: mainImageId }
//             );
//           }

//           // Save / update video URL
//           if (videoUrl.trim()) {
//             await api.post(
//               `/dashboard/product/${productId}/video`,
//               { video_url: videoUrl }
//             );
//           }

//           return true;
//         } catch (err) {
//           console.error(err);
//           alert("Gallery save failed");
//           return false;
//         } finally {
//           setLoading(false);
//         }
//       },
//     }));

//     /* ================= UI ================= */

//     return (
//       <div className="space-y-6">
//         <h3 className="text-base font-semibold">
//           Product Gallery
//         </h3>

//         {/* UPLOAD */}
//         <div
//           onClick={() => inputRef.current.click()}
//           className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer"
//         >
//           Click to upload images
//           <input
//             ref={inputRef}
//             type="file"
//             multiple
//             accept="image/*"
//             hidden
//             onChange={(e) =>
//               handleFiles(e.target.files)
//             }
//           />
//         </div>

//         {/* EXISTING IMAGES */}
//         {savedImages.length > 0 && (
//           <>
//             <p className="font-medium">
//               Existing Images
//             </p>
//             <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
//               {savedImages.map((img) => (
//                 <div
//                   key={img.id}
//                   onClick={() =>
//                     setMainImageId(img.id)
//                   }
//                   className={`relative border rounded cursor-pointer
//                     ${
//                       mainImageId === img.id
//                         ? "ring-2 ring-blue-500"
//                         : ""
//                     }`}
//                 >
//                   {mainImageId === img.id && (
//                     <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 rounded">
//                       Main
//                     </span>
//                   )}

//                   <img
//                     src={img.url}
//                     alt="product"
//                     className="h-24 w-full object-cover"
//                   />

//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       removeSavedImage(img.id);
//                     }}
//                     className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 rounded"
//                   >
//                     ✕
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}

//         {/* NEW IMAGES */}
//         {newImages.length > 0 && (
//           <>
//             <p className="font-medium">
//               New Images
//             </p>
//             <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
//               {newImages.map((img, i) => (
//                 <div
//                   key={i}
//                   className="relative border rounded"
//                 >
//                   <img
//                     src={URL.createObjectURL(img)}
//                     className="h-24 w-full object-cover"
//                   />
//                   <button
//                     onClick={() =>
//                       removeNewImage(i)
//                     }
//                     className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 rounded"
//                   >
//                     ✕
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}

//         {/* VIDEO URL */}
//         <div>
//           <label className="text-sm font-medium text-gray-700">
//             Product Video URL (optional)
//           </label>
//           <input
//             type="url"
//             value={videoUrl}
//             onChange={(e) =>
//               setVideoUrl(e.target.value)
//             }
//             placeholder="https://youtube.com/watch?v=..."
//             className="input mt-1"
//           />
//         </div>

//         {loading && (
//           <p className="text-blue-600 text-sm">
//             Saving gallery...
//           </p>
//         )}
//       </div>
//     );
//   }
// );

// export default EditStepGallery;

import {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import api from "../../../api/axios";

const EditStepGallery = forwardRef(
  ({ productId, existingImages = [], existingVideo = null }, ref) => {
    const inputRef = useRef(null);

    /* ================= STATE ================= */

    const [savedImages, setSavedImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [mainImageId, setMainImageId] = useState(null);
    const [videoUrl, setVideoUrl] = useState("");
    const [loading, setLoading] = useState(false);

    /* ================= LOAD EXISTING ================= */

    useEffect(() => {
      if (!existingImages?.length) return;

      const mapped = existingImages.map((img) => ({
        id: img.id,
        url: img.image_url,
        is_primary: img.is_primary,
      }));

      setSavedImages(mapped);

      const primary = mapped.find((i) => i.is_primary);
      if (primary) setMainImageId(primary.id);
    }, [existingImages]);

    useEffect(() => {
      if (existingVideo?.video_url) {
        setVideoUrl(existingVideo.video_url);
      }
    }, [existingVideo]);

    /* ================= HANDLERS ================= */

    const handleFiles = (files) => {
      setNewImages((prev) => [...prev, ...Array.from(files)]);
    };

    const removeSavedImage = async (id) => {
      try {
        await api.delete(`/dashboard/product/product-delete/${id}`);
        setSavedImages((prev) => prev.filter((i) => i.id !== id));
        if (mainImageId === id) setMainImageId(null);
      } catch {
        alert("Failed to delete image");
      }
    };

    const removeNewImage = (index) => {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    };

    /* ================= SAVE STEP ================= */

    useImperativeHandle(ref, () => ({
      async saveStep() {
        if (!productId) {
          alert("Product ID missing");
          return false;
        }

        try {
          setLoading(true);

          if (newImages.length > 0) {
            const fd = new FormData();
            newImages.forEach((f) => fd.append("images", f));
            await api.post(`/dashboard/product/${productId}/images`, fd);
          }

          if (mainImageId) {
            await api.post(`/dashboard/product/${productId}/set-main-image`, {
              image_id: mainImageId,
            });
          }

          if (videoUrl.trim()) {
            await api.post(`/dashboard/product/${productId}/video`, {
              video_url: videoUrl,
            });
          }

          return true;
        } catch {
          alert("Gallery save failed");
          return false;
        } finally {
          setLoading(false);
        }
      },
    }));

    /* ================= UI ================= */

    return (
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
        {/* HEADER */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Product Gallery
          </h3>
          <p className="text-sm text-gray-500">
            Upload product images and add a video link
          </p>
        </div>

        {/* UPLOAD */}
        <div
          onClick={() => inputRef.current.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-8
          flex flex-col items-center justify-center text-center
          cursor-pointer hover:border-indigo-500 transition"
        >
          <UploadIcon />
          <p className="mt-2 text-sm font-medium text-gray-700">
            Click to upload images
          </p>
          <p className="text-xs text-gray-400">
            JPG, PNG • Multiple files allowed
          </p>

          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            hidden
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* EXISTING IMAGES */}
        {savedImages.length > 0 && (
          <ImageGrid
            title="Existing Images"
            images={savedImages}
            isSaved
            mainImageId={mainImageId}
            onSelect={setMainImageId}
            onRemove={removeSavedImage}
          />
        )}

        {/* NEW IMAGES */}
        {newImages.length > 0 && (
          <ImageGrid
            title="New Images"
            images={newImages}
            onRemove={removeNewImage}
          />
        )}

        {/* VIDEO */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Product Video URL (optional)
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="input mt-1"
          />
          <p className="text-xs text-gray-400 mt-1">
            YouTube, Vimeo or any public video link
          </p>
        </div>

        {loading && (
          <p className="text-sm text-indigo-600">Saving gallery...</p>
        )}
      </div>
    );
  }
);

export default EditStepGallery;

/* ================= IMAGE GRID ================= */

function ImageGrid({
  title,
  images,
  isSaved = false,
  mainImageId,
  onSelect,
  onRemove,
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700">{title}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((img, i) => {
          const isMain = isSaved && mainImageId === img.id;

          const src = isSaved ? img.url : URL.createObjectURL(img);

          return (
            <div
              key={isSaved ? img.id : i}
              onClick={() => isSaved && onSelect(img.id)}
              className={`relative rounded-xl overflow-hidden border cursor-pointer transition
                ${
                  isMain
                    ? "ring-2 ring-indigo-500"
                    : "hover:ring-2 hover:ring-gray-300"
                }`}
            >
              {isMain && (
                <span
                  className="absolute top-2 left-2 bg-indigo-600
                text-white text-xs px-2 py-0.5 rounded"
                >
                  Main
                </span>
              )}

              <img src={src} className="h-32 w-full object-cover" alt="" />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(isSaved ? img.id : i);
                }}
                className="absolute top-2 right-2 bg-black/70
                text-white text-xs px-2 py-0.5 rounded hover:bg-black"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= ICON ================= */

function UploadIcon() {
  return (
    <svg
      className="w-10 h-10 text-gray-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path d="M12 16V4m0 0l-4 4m4-4l4 4" />
      <path d="M20 16v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2" />
    </svg>
  );
}
