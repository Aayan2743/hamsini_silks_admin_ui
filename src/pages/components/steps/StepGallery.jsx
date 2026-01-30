import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import api from "../../../api/axios";

const StepGallery = forwardRef(({ productId }, ref) => {
  const inputRef = useRef(null);

  const [images, setImages] = useState([]);
  const [mainIndex, setMainIndex] = useState(0);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= HANDLERS ================= */

  const handleFiles = (files) => {
    const list = Array.from(files);
    setImages((prev) => [...prev, ...list]);
    if (images.length === 0 && list.length > 0) {
      setMainIndex(0);
    }
  };

  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);

    if (index === mainIndex) setMainIndex(0);
    else if (index < mainIndex) setMainIndex((prev) => prev - 1);
  };

  /* ================= EXPOSE SAVE ================= */

  useImperativeHandle(ref, () => ({
    async saveStep() {
      if (!productId) {
        alert("Product not created yet");
        return false;
      }

      try {
        setLoading(true);

        if (images.length > 0) {
          const formData = new FormData();
          images.forEach((file) => formData.append("images", file));

          await api.post(`/dashboard/product/${productId}/images`, formData);
        }

        if (videoUrl.trim()) {
          await api.post(`/dashboard/product/${productId}/video`, {
            video_url: videoUrl,
          });
        }

        return true;
      } catch (error) {
        alert("Failed to save product gallery");
        return false;
      } finally {
        setLoading(false);
      }
    },
  }));

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Product Gallery</h3>
        <p className="text-sm text-gray-500">
          Upload product images and add a video link
        </p>
      </div>

      {/* IMAGE UPLOAD */}
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
          accept="image/*"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* IMAGE GRID */}
      {images.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Select main image</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img, i) => (
              <div
                key={i}
                onClick={() => setMainIndex(i)}
                className={`relative rounded-xl overflow-hidden border cursor-pointer
                transition
                ${
                  i === mainIndex
                    ? "ring-2 ring-indigo-500"
                    : "hover:ring-2 hover:ring-gray-300"
                }`}
              >
                {i === mainIndex && (
                  <span
                    className="absolute top-2 left-2
                  bg-indigo-600 text-white text-xs px-2 py-0.5 rounded"
                  >
                    Main
                  </span>
                )}

                <img
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="h-32 w-full object-cover"
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(i);
                  }}
                  className="absolute top-2 right-2
                  bg-black/70 text-white text-xs px-2 py-0.5 rounded
                  hover:bg-black transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIDEO URL */}
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

      {loading && <p className="text-sm text-indigo-600">Saving gallery...</p>}
    </div>
  );
});

export default StepGallery;

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
