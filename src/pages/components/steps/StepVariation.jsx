

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import api from "../../../api/axios";

import VariantSelect from "./VariantSelect";
import VariantTable from "./VariantTable";
import { generateVariants } from "./generateVariants";

const StepVariation = forwardRef(({ productId }, ref) => {
  const [variations, setVariations] = useState([]);
  const [selected, setSelected] = useState({});
  const [variants, setVariants] = useState([]);
  const [variantData, setVariantData] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD VARIATIONS ================= */

  const loadVariations = () => {
    api
      .get("/dashboard/get-variations")
      .then((res) => {
        const raw = res.data.data || [];

        const normalized = raw.map((v) => ({
          id: v.id,
          name: v.name,
          type: v.type,
          values: (v.variation_values || []).map((val) => ({
            id: val.id,
            value: val.value,
            color_code: val.color_code,
          })),
        }));

        setVariations(normalized);

        const init = {};
        normalized.forEach((v) => (init[v.id] = []));
        setSelected(init);
      })
      .catch(() => alert("Failed to load variations"));
  };

  useEffect(() => {
    loadVariations();
  }, []);

  /* ================= HANDLE SELECT ================= */

  const handleChange = (variationId, values) => {
    setSelected((prev) => ({
      ...prev,
      [variationId]: values,
    }));
  };

  /* ================= GENERATE VARIANTS ================= */

  useEffect(() => {
    const active = variations.filter((v) => selected[v.id]?.length > 0);

    if (!active.length) {
      setVariants([]);
      setVariantData([]);
      return;
    }

    const input = {};
    active.forEach((v) => {
      input[v.name] = selected[v.id].map((val) => val.value);
    });

    const combos = generateVariants(input);

    setVariants(combos);
    setVariantData((prev) => combos.map((_, i) => prev[i] || {}));
  }, [selected, variations]);

  /* ================= SAVE STEP ================= */

  useImperativeHandle(ref, () => ({
    async saveStep() {
      if (!productId) {
        alert("Product not created");
        return false;
      }

      if (!variants.length) return true;

      try {
        setLoading(true);

        const payload = variants.map((label, i) => ({
          variation_value_ids: Object.values(selected)
            .flat()
            .filter((v) => label.includes(v.value))
            .map((v) => v.id),

          sku: variantData[i]?.sku || null,
          extra_price: variantData[i]?.price || 0,
          quantity: variantData[i]?.qty || 0,
          low_quantity: variantData[i]?.low_qty || 0,
        }));

        const res = await api.post(
          `/dashboard/product/create-variation/${productId}`,
          { variants: payload }
        );

        const createdVariants = res.data.data || [];

        for (let i = 0; i < createdVariants.length; i++) {
          const images = variantData[i]?.images;
          if (!images?.length) continue;

          const fd = new FormData();
          images.forEach((img) => fd.append("images", img));

          await api.post(
            `/dashboard/product/variant/${createdVariants[i].id}/images`,
            fd
          );
        }

        return true;
      } catch (err) {
        alert("Failed to save variants");
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
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Product Variations
          </h3>
          <p className="text-sm text-gray-500">
            Select values to generate variants
          </p>
        </div>

        {/* QUICK ADD VARIATION */}
        <a
          href="/dashboard/settings/variations"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-lg border text-sm
          hover:bg-gray-50 transition"
        >
          + Add Variation
        </a>
      </div>

      {/* VARIATION SELECTS */}
      <div className="space-y-4">
        {variations.map((variation) => (
          <VariantSelect
            key={variation.id}
            label={variation.name}
            options={variation.values || []}
            selected={selected[variation.id] || []}
            onChange={(vals) => handleChange(variation.id, vals)}
            disabled={!variation.values?.length}
          />
        ))}
      </div>

      {/* VARIANT TABLE */}
      {variants.length > 0 && (
        <div className="border rounded-xl p-4">
          <VariantTable
            variants={variants}
            data={variantData}
            setData={setVariantData}
          />
        </div>
      )}

      {/* EMPTY STATE */}
      {variations.length > 0 && variations.every((v) => !v.values?.length) && (
        <div className="rounded-lg border border-dashed p-4 text-center text-sm text-gray-500">
          No variation values found. Add values from{" "}
          <strong>Variation Settings</strong>.
        </div>
      )}

      {loading && <p className="text-sm text-indigo-600">Saving variants…</p>}
    </div>
  );
});

export default StepVariation;
