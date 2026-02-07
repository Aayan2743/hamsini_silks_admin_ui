import { useMemo, useState } from "react";

/* ================= MOCK STAFF ================= */
const STAFF_LIST = [
  { id: 1, name: "Arun" },
  { id: 2, name: "Sneha" },
  { id: 3, name: "Rahul" },
];

export default function StaffAttendanceCalendar() {
  const [selectedStaff, setSelectedStaff] = useState(STAFF_LIST[0].id);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // attendance[staffId][date] = status
  const [attendance, setAttendance] = useState({
    1: { "2026-02-01": "present", "2026-02-02": "absent" },
    2: { "2026-02-01": "leave" },
    3: {},
  });

  /* ================= CALENDAR HELPERS ================= */
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const days = useMemo(() => {
    const arr = [];
    for (let i = 0; i < firstDay; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [firstDay, daysInMonth]);

  const formatDate = (day) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
      2,
      "0",
    )}`;

  /* ================= MARK ATTENDANCE ================= */
  const markAttendance = (day) => {
    const status = prompt("Mark attendance: present / absent / leave");
    if (!status) return;

    const dateKey = formatDate(day);

    setAttendance((prev) => ({
      ...prev,
      [selectedStaff]: {
        ...prev[selectedStaff],
        [dateKey]: status,
      },
    }));
  };

  const getStatusColor = (status) => {
    if (status === "present") return "bg-green-100 text-green-700";
    if (status === "absent") return "bg-red-100 text-red-700";
    if (status === "leave") return "bg-yellow-100 text-yellow-700";
    return "";
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Staff Attendance</h1>

      {/* STAFF + MONTH CONTROLS */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={selectedStaff}
          onChange={(e) => setSelectedStaff(Number(e.target.value))}
          className="border rounded px-3 py-2 text-sm"
        >
          {STAFF_LIST.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
            className="px-3 py-1 border rounded"
          >
            ◀
          </button>

          <span className="font-medium">
            {currentMonth.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </span>

          <button
            onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
            className="px-3 py-1 border rounded"
          >
            ▶
          </button>
        </div>
      </div>

      {/* CALENDAR */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 text-sm">
          {days.map((day, i) =>
            day ? (
              <div
                key={i}
                onClick={() => markAttendance(day)}
                className={`h-20 border rounded cursor-pointer p-1 hover:bg-gray-50 ${getStatusColor(
                  attendance[selectedStaff]?.[formatDate(day)],
                )}`}
              >
                <div className="text-right font-medium">{day}</div>

                <div className="mt-2 capitalize text-xs">
                  {attendance[selectedStaff]?.[formatDate(day)] || ""}
                </div>
              </div>
            ) : (
              <div key={i}></div>
            ),
          )}
        </div>
      </div>

      {/* LEGEND */}
      <div className="flex gap-4 text-sm">
        <span className="text-green-700">Present</span>
        <span className="text-red-700">Absent</span>
        <span className="text-yellow-700">Leave</span>
      </div>
    </div>
  );
}
