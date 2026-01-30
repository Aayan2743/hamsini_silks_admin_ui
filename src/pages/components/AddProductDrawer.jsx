import { useRef, useState } from "react";

import StepBasic from "./steps/StepBasic";
import StepGallery from "./steps/StepGallery";
import StepVariation from "./steps/StepVariation";
import StepMeta from "./steps/StepMeta";
import StepTax from "./steps/StepTax";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../api/axios";
import { celebrateSuccess } from "../../utils/celebrate";
import ProductWizardHeader from "./ProductWizardHeader";

export default function AddProductDrawer({ open, onClose }) {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [productId, setProductId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 refs for steps that save data
  const galleryRef = useRef(null);
  const variationRef = useRef(null);
  const metaRef = useRef(null);
  const taxRef = useRef(null);

  if (!open) return null;

  /* ================= NEXT HANDLER ================= */

  const handleNext = async () => {
    if (loading) return;

    try {
      setLoading(true);

      if (step === 2 && galleryRef.current) {
        if (!(await galleryRef.current.saveStep())) return;
      }

      if (step === 3 && variationRef.current) {
        if (!(await variationRef.current.saveStep())) return;
      }

      if (step === 5 && taxRef.current) {
        if (!(await taxRef.current.saveStep())) return;

        await api.post(`/dashboard/product/${productId}/publish`);

        // toast.success("Product published successfully 🎉");

        celebrateSuccess();

        // ✅ TOAST
        toast.success("Product published successfully 🎉");

        // ⏳ Small delay so animation is visible
        setTimeout(() => {
          onClose();
          navigate("/products");
        }, 1200);

        onClose();
        // navigate("/products");
        // return;
      }

      setStep((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  /* ================= BACK HANDLER ================= */

  const handleBack = () => {
    if (loading) return;
    setStep((prev) => Math.max(1, prev - 1));
  };

  return (
    <>
      {/* OVERLAY */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* DRAWER */}
      <div className="fixed top-0 right-0 z-50 h-full w-full md:w-[50%] bg-gray-50 flex flex-col shadow-2xl">
        {/* HEADER */}
        {/* <Header onClose={onClose} step={step} setStep={setStep} /> */}

        <ProductWizardHeader
          title="Add Product"
          step={step}
          setStep={setStep}
          onClose={onClose}
        />

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="mx-auto max-w-3xl space-y-10">
            {step === 1 && (
              <StepBasic setProductId={setProductId} setStep={setStep} />
            )}

            {step === 2 && (
              <StepGallery ref={galleryRef} productId={productId} />
            )}

            {step === 3 && (
              <StepVariation ref={variationRef} productId={productId} />
            )}

            {step === 4 && <StepMeta ref={metaRef} productId={productId} />}

            {step === 5 && <StepTax ref={taxRef} productId={productId} />}
          </div>
        </div>

        {/* FOOTER */}
        <div className="h-16 px-6 border-t bg-white flex items-center justify-between">
          <button
            disabled={step === 1 || loading}
            onClick={handleBack}
            className="px-4 py-2 rounded border disabled:opacity-50"
          >
            Back
          </button>

          <div className="flex gap-3">
            {step < 5 ? (
              <button
                onClick={handleNext}
                disabled={loading}
                className="px-6 py-2 rounded bg-indigo-600 text-white disabled:opacity-50"
              >
                {loading ? "Saving..." : "Next"}
              </button>
            ) : (
              <button
                onClick={handleNext} // 🔥 REQUIRED
                disabled={loading}
                className="px-6 py-2 rounded bg-green-600 text-white disabled:opacity-50"
              >
                {loading ? "Publishing......" : "Save Product"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ================= HEADER ================= */
