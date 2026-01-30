const STEPS = [
  { label: "Basic", active: "bg-indigo-600 text-white", glow: "bg-indigo-600" },
  { label: "Gallery", active: "bg-blue-600 text-white", glow: "bg-blue-600" },
  {
    label: "Variation",
    active: "bg-amber-600 text-white",
    glow: "bg-amber-600",
  },
  { label: "SEO", active: "bg-violet-600 text-white", glow: "bg-violet-600" },
  { label: "Tax", active: "bg-rose-600 text-white", glow: "bg-rose-600" },
];

export default function ProductWizardHeader({ title, step, setStep, onClose }) {
  const progress = (step / STEPS.length) * 100;

  return (
    <div className="bg-white border-b sticky top-0 z-50">
      {/* TOP BAR */}
      <div className="h-16 px-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">
            Step {step} of {STEPS.length}
          </p>
        </div>

        <button
          onClick={onClose}
          className="h-9 w-9 rounded-full flex items-center justify-center
          text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          ✕
        </button>
      </div>

      {/* CENTERED STEPS */}
      <div className="px-6 pb-4">
        <div className="flex justify-center">
          <div className="flex gap-4">
            {STEPS.map((s, index) => {
              const tabStep = index + 1;
              const isActive = step === tabStep;
              const isCompleted = step > tabStep;

              return (
                <button
                  key={s.label}
                  disabled={isCompleted}
                  onClick={() => !isCompleted && setStep(tabStep)}
                  className={`
                    relative px-6 py-2 rounded-full text-sm font-medium
                    transition-all duration-300
                    ${
                      isActive
                        ? `${s.active} scale-105 shadow-lg`
                        : isCompleted
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 shadow hover:shadow-md"
                    }
                  `}
                >
                  {s.label}

                  {isActive && (
                    <span
                      className={`absolute inset-0 rounded-full opacity-20 blur-md ${s.glow}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="mt-4 h-[3px] w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out
            bg-gradient-to-r from-indigo-500 via-violet-500 to-rose-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
