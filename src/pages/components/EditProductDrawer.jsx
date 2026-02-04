"use client";

import { useEffect, useState, useRef } from "react";
import api from "../../api/axios";

import EditStepBasic from "./steps/EditStepBasic";
import StepGallery from "./steps/StepGallery";
import StepVariation from "./steps/StepVariation";
import StepMeta from "./steps/StepMeta";
import StepTax from "./steps/StepTax";
import EditStepGallery from "./steps/EditStepGallery";
import EditStepVariation from "./steps/EditStepVariation";
import EditStepMeta from "./steps/EditStepMeta";
import EditStepTax from "./steps/EditStepTax";
import ProductWizardHeader from "../components/ProductWizardHeader";

export default function EditProductDrawer({
  open,
  onClose,
  productId, // 👈 coming from Products.jsx
}) {
  const [step, setStep] = useState(1);

  const galleryRef = useRef(null);
  const variationRef = useRef(null);
  const metaRef = useRef(null);
  const taxRef = useRef(null);

  // ✅ THIS WAS MISSING
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    basic: {
      name: "",
      category_id: "",
      brand_id: "",
      description: "",
      base_price: "",
      discount: "",
    },
    gallery: [],
    variations: [],
    meta: {},
    tax: {},
  });

  /* =====================================
     🔥 FETCH PRODUCT USING productId
  ===================================== */
  useEffect(() => {
    if (!open || !productId) return;

    console.log("🟢 Fetching product with ID:", productId);

    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/admin-dashboard/product/fetch-products-by-id/${productId}`,
        );

        const productData = res.data.data;

        console.log("🟢 Product API response:", productData);

        // ✅ set product state
        setProduct(productData);

        // ✅ hydrate form for other steps if needed
        setForm({
          basic: {
            name: productData.name || "",
            category_id: productData.category_id || "",
            brand_id: productData.brand_id || "",
            description: productData.description || "",
            base_price: productData.base_price || "",
            discount: productData.discount || "",
          },
          gallery: productData.gallery || [],
          variations: productData.variations || [],
          meta: productData.meta || {},
          tax: productData.product_tax || {},
        });
      } catch (err) {
        console.error("❌ Failed to fetch product", err);
        alert("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [open, productId]);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 z-50 h-full w-full md:w-[50%] bg-white shadow-xl flex flex-col">
        {/* <Header step={step} onClose={onClose} /> */}
        <ProductWizardHeader
          title="Edit Product"
          step={step}
          setStep={setStep}
          onClose={onClose}
        />

        <div className="flex-1 overflow-y-auto px-6 py-8">
          {loading ? (
            <div className="text-center py-10">Loading product...</div>
          ) : (
            <>
              {step === 1 && (
                <EditStepBasic
                  mode="edit"
                  product={product} // ✅ NOW DEFINED
                  setStep={setStep}
                  setProductId={() => {}}
                />
              )}

              {step === 2 && (
                <EditStepGallery
                  ref={galleryRef}
                  productId={productId}
                  existingImages={form.gallery} // 👈 FROM API
                  existingVideo={product?.video}
                />
              )}

              {step === 3 && (
                <EditStepVariation
                  ref={variationRef}
                  productId={productId}
                  // existingCombinations={product?.variantCombinations || []}
                  existingCombinations={product?.variantCombinations || []}
                />
              )}

              {step === 4 && (
                <EditStepMeta
                  ref={metaRef}
                  productId={productId}
                  meta={form.meta} // 🔥 PASS FETCHED META
                />
              )}

              {step === 5 && (
                <EditStepTax
                  ref={taxRef}
                  productId={product?.id}
                  productStatus={product?.status}
                  data={
                    Array.isArray(product?.product_tax) &&
                    product.product_tax.length > 0
                      ? product.product_tax[0]
                      : null
                  }
                />
              )}
            </>
          )}
        </div>

        <Footer
          step={step}
          onBack={() => setStep(step - 1)}
          onNext={async () => {
            // STEP 2 → SAVE GALLERY
            if (step === 2) {
              if (!galleryRef.current) {
                alert("Gallery not ready");
                return;
              }

              const ok = await galleryRef.current.saveStep();
              if (!ok) return;
            }

            // 🔥 STEP 3 → SAVE VARIATIONS
            if (step === 3) {
              if (!variationRef.current) {
                alert("Variations not ready");
                return;
              }

              const ok = await variationRef.current.saveStep();
              if (!ok) return;
            }

            if (step === 4) {
              const ok = await metaRef.current.saveStep();
              if (!ok) return;
            }

            setStep(step + 1);
          }}
          // onSubmit={() => console.log("UPDATE PRODUCT PAYLOAD:", form)}
          onSubmit={async () => {
            // 🔥 STEP 5 SAVE
            const ok = await taxRef.current.saveStep();
            if (!ok) return;

            alert("Product updated successfully");
            onClose();
          }}
        />
      </div>
    </>
  );
}

/* ================= HEADER ================= */

function Header({ step, onClose }) {
  return (
    <div className="h-16 px-6 border-b bg-gray-50 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">Edit Product</h2>
        <p className="text-sm text-gray-500">Step {step} of 5</p>
      </div>

      <button
        onClick={onClose}
        className="text-xl text-gray-500 hover:text-black"
      >
        ✕
      </button>
    </div>
  );
}

/* ================= FOOTER ================= */

function Footer({ step, onBack, onNext, onSubmit }) {
  return (
    <div className="h-16 px-6 border-t bg-gray-50 flex items-center justify-between">
      {/* BACK */}
      <button
        disabled={step === 1}
        onClick={onBack}
        className="px-4 py-2 rounded border disabled:opacity-50"
      >
        Back
      </button>

      {/* NEXT / SUBMIT */}
      {step < 5 ? (
        <button
          onClick={onNext}
          className="px-6 py-2 rounded bg-indigo-600 text-white"
        >
          Next
        </button>
      ) : (
        <button
          onClick={onSubmit}
          className="px-6 py-2 rounded bg-green-600 text-white"
        >
          Update Product
        </button>
      )}
    </div>
  );
}
