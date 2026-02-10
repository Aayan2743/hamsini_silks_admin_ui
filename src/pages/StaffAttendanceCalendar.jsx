// import { useEffect, useMemo, useState } from "react";
// import api from "../api/axios";

// export default function StaffAttendanceCalendar() {
//   /* ================= TAB ================= */
//   const [activeTab, setActiveTab] = useState("attendance");

//   /* ================= STAFF ================= */
//   const [staffList, setStaffList] = useState([]);
//   const [selectedStaff, setSelectedStaff] = useState(null);

//   /* ================= ADD STAFF DRAWER ================= */
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [staffForm, setStaffForm] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     role: "Staff",
//   });

//   /* ================= ATTENDANCE ================= */
//   const [attendance, setAttendance] = useState({});
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [popupOpen, setPopupOpen] = useState(false);
//   const [selectedDay, setSelectedDay] = useState(null);
//   const [attendanceForm, setAttendanceForm] = useState({
//     status: "present",
//     inTime: "",
//     outTime: "",
//   });

//   /* ================= FETCH STAFF (API) ================= */
//   const fetchStaff = async () => {
//     try {
//       const res = await api.get("/admin-dashboard/staff");
//       setStaffList(res.data.data);

//       if (res.data.data.length && !selectedStaff) {
//         setSelectedStaff(res.data.data[0].id);
//       }
//     } catch (err) {
//       console.error("Failed to fetch staff", err);
//     }
//   };

//   useEffect(() => {
//     fetchStaff();
//   }, []);

//   /* ================= ADD STAFF (API) ================= */
//   const addStaff = async () => {
//     if (!staffForm.name || !staffForm.phone || !staffForm.email) return;

//     try {
//       await api.post("/admin-dashboard/add-staff", {
//         name: staffForm.name,
//         email: staffForm.email,
//         phone: staffForm.phone,
//         password: "default@123",
//         role: staffForm.role === "Manager" ? "employeer" : "employee",
//       });

//       setDrawerOpen(false);
//       setStaffForm({ name: "", phone: "", email: "", role: "Staff" });
//       fetchStaff();
//     } catch (err) {
//       alert(err.response?.data?.error || "Failed to add staff");
//     }
//   };

//   /* ================= CALENDAR LOGIC ================= */
//   const year = currentMonth.getFullYear();
//   const month = currentMonth.getMonth();

//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const firstDay = new Date(year, month, 1).getDay();

//   const days = useMemo(() => {
//     const arr = [];
//     for (let i = 0; i < firstDay; i++) arr.push(null);
//     for (let d = 1; d <= daysInMonth; d++) arr.push(d);
//     return arr;
//   }, [firstDay, daysInMonth]);

//   const formatDate = (day) =>
//     `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
//       2,
//       "0",
//     )}`;

//   /* ================= ATTENDANCE POPUP ================= */
//   const openPopup = (day) => {
//     const existing = attendance[selectedStaff]?.[formatDate(day)];
//     setSelectedDay(day);
//     setAttendanceForm(
//       existing || { status: "present", inTime: "", outTime: "" },
//     );
//     setPopupOpen(true);
//   };

//   const saveAttendance = () => {
//     const dateKey = formatDate(selectedDay);
//     setAttendance((prev) => ({
//       ...prev,
//       [selectedStaff]: {
//         ...prev[selectedStaff],
//         [dateKey]: attendanceForm,
//       },
//     }));
//     setPopupOpen(false);
//   };

//   const getStatusColor = (obj) => {
//     if (!obj) return "";
//     if (obj.status === "present") return "bg-green-100 text-green-700";
//     if (obj.status === "absent") return "bg-red-100 text-red-700";
//     if (obj.status === "leave") return "bg-yellow-100 text-yellow-700";
//     return "";
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="space-y-4 relative">
//       {/* ================= TABS ================= */}
//       <div className="flex gap-2 border-b">
//         {["attendance", "staff"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-4 py-2 font-medium capitalize ${
//               activeTab === tab ? "border-b-2 border-black" : "text-gray-500"
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {/* ================= ATTENDANCE ================= */}
//       {activeTab === "attendance" && (
//         <>
//           <div className="flex gap-3 items-center">
//             <select
//               value={selectedStaff || ""}
//               onChange={(e) => setSelectedStaff(Number(e.target.value))}
//               className="border rounded px-3 py-2 text-sm"
//             >
//               {staffList.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.name}
//                 </option>
//               ))}
//             </select>

//             <button
//               onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
//               className="px-3 py-1 border rounded"
//             >
//               ◀
//             </button>

//             <span className="font-medium">
//               {currentMonth.toLocaleString("default", {
//                 month: "long",
//                 year: "numeric",
//               })}
//             </span>

//             <button
//               onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
//               className="px-3 py-1 border rounded"
//             >
//               ▶
//             </button>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-4">
//             <div className="grid grid-cols-7 gap-2 text-center font-medium text-sm mb-2">
//               {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
//                 <div key={d}>{d}</div>
//               ))}
//             </div>

//             <div className="grid grid-cols-7 gap-2 text-sm">
//               {days.map((day, i) =>
//                 day ? (
//                   <div
//                     key={i}
//                     onClick={() => openPopup(day)}
//                     className={`h-20 border rounded cursor-pointer p-1 hover:bg-gray-50 ${getStatusColor(
//                       attendance[selectedStaff]?.[formatDate(day)],
//                     )}`}
//                   >
//                     <div className="text-right font-medium">{day}</div>
//                     <div className="mt-2 capitalize text-xs">
//                       {attendance[selectedStaff]?.[formatDate(day)]?.status ||
//                         ""}
//                     </div>
//                   </div>
//                 ) : (
//                   <div key={i}></div>
//                 ),
//               )}
//             </div>
//           </div>
//         </>
//       )}

//       {/* ================= STAFF ================= */}
//       {activeTab === "staff" && (
//         <>
//           <div className="flex justify-between">
//             <h2 className="text-lg font-semibold">Staff List</h2>
//             <button
//               onClick={() => setDrawerOpen(true)}
//               className="bg-black text-white px-4 py-2 rounded"
//             >
//               + Add Staff
//             </button>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-3 text-left">Name</th>
//                   <th className="p-3 text-left">Phone</th>
//                   <th className="p-3 text-left">Email</th>
//                   <th className="p-3 text-left">Role</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {staffList.map((s) => (
//                   <tr key={s.id} className="border-t">
//                     <td className="p-3">{s.name}</td>
//                     <td className="p-3">{s.phone}</td>
//                     <td className="p-3">{s.email}</td>
//                     <td className="p-3">{s.role}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}

//       {/* ================= ATTENDANCE POPUP ================= */}
//       {popupOpen && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white w-80 rounded-xl p-5 space-y-4 shadow-xl">
//             <h3 className="text-lg font-semibold text-center">
//               {formatDate(selectedDay)}
//             </h3>

//             <div className="flex flex-col gap-1">
//               <label className="text-sm font-medium text-gray-700">
//                 Attendance Type
//               </label>
//               <select
//                 value={attendanceForm.status}
//                 onChange={(e) =>
//                   setAttendanceForm({
//                     ...attendanceForm,
//                     status: e.target.value,
//                   })
//                 }
//                 className="border px-3 py-2 rounded"
//               >
//                 <option value="present">Present</option>
//                 <option value="absent">Absent</option>
//                 <option value="leave">Leave</option>
//               </select>
//             </div>

//             <div className="flex flex-col gap-1">
//               <label className="text-sm font-medium text-gray-700">
//                 In Time
//               </label>
//               <input
//                 type="time"
//                 value={attendanceForm.inTime}
//                 onChange={(e) =>
//                   setAttendanceForm({
//                     ...attendanceForm,
//                     inTime: e.target.value,
//                   })
//                 }
//                 className="border px-3 py-2 rounded"
//               />
//             </div>

//             <div className="flex flex-col gap-1">
//               <label className="text-sm font-medium text-gray-700">
//                 Out Time
//               </label>
//               <input
//                 type="time"
//                 value={attendanceForm.outTime}
//                 onChange={(e) =>
//                   setAttendanceForm({
//                     ...attendanceForm,
//                     outTime: e.target.value,
//                   })
//                 }
//                 className="border px-3 py-2 rounded"
//               />
//             </div>

//             <div className="flex gap-3 pt-3">
//               <button
//                 onClick={saveAttendance}
//                 className="flex-1 bg-black text-white py-2 rounded"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={() => setPopupOpen(false)}
//                 className="flex-1 border py-2 rounded"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================= STAFF DRAWER ================= */}
//       {drawerOpen && (
//         <div className="fixed inset-0 z-40 flex">
//           <div
//             className="flex-1 bg-black/40"
//             onClick={() => setDrawerOpen(false)}
//           />

//           <div className="w-96 bg-white h-full shadow-xl p-6 space-y-5">
//             <h3 className="text-lg font-semibold">Add Staff</h3>

//             {["name", "phone", "email"].map((f) => (
//               <input
//                 key={f}
//                 placeholder={f}
//                 value={staffForm[f]}
//                 onChange={(e) =>
//                   setStaffForm({ ...staffForm, [f]: e.target.value })
//                 }
//                 className="w-full border px-3 py-2 rounded"
//               />
//             ))}

//             <select
//               value={staffForm.role}
//               onChange={(e) =>
//                 setStaffForm({ ...staffForm, role: e.target.value })
//               }
//               className="w-full border px-3 py-2 rounded"
//             >
//               <option>Staff</option>
//               <option>Manager</option>
//             </select>

//             <div className="flex gap-3">
//               <button
//                 onClick={addStaff}
//                 className="flex-1 bg-black text-white py-2 rounded"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={() => setDrawerOpen(false)}
//                 className="flex-1 border py-2 rounded"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

export default function StaffAttendanceCalendar() {
  /* ================= TAB ================= */
  const [activeTab, setActiveTab] = useState("attendance");

  /* ================= STAFF ================= */
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);

  /* ================= ADD STAFF DRAWER ================= */
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: "",
    phone: "",
    email: "",
    role: "Staff",
  });

  /* ================= ATTENDANCE ================= */
  const [attendance, setAttendance] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [attendanceForm, setAttendanceForm] = useState({
    status: "present",
    inTime: "",
    outTime: "",
  });

  /* ================= FETCH STAFF ================= */
  const fetchStaff = async () => {
    try {
      const res = await api.get("/admin-dashboard/staff");
      setStaffList(res.data.data);

      if (res.data.data.length && !selectedStaff) {
        setSelectedStaff(res.data.data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch staff", err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  /* ================= ADD STAFF ================= */
  const addStaff = async () => {
    if (!staffForm.name || !staffForm.phone || !staffForm.email) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await api.post("/admin-dashboard/add-staff", {
        name: staffForm.name,
        phone: staffForm.phone,
        email: staffForm.email,
        password: "default@123",
        role: staffForm.role === "Manager" ? "employeer" : "employee",
      });

      setDrawerOpen(false);
      setStaffForm({ name: "", phone: "", email: "", role: "Staff" });
      fetchStaff();
    } catch (err) {
      if (err.response?.status === 422) {
        alert(err.response.data.error || "Validation error");
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };

  /* ================= CALENDAR LOGIC ================= */
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

  /* ================= FETCH ATTENDANCE ================= */
  useEffect(() => {
    if (!selectedStaff) return;

    const fetchAttendance = async () => {
      try {
        const res = await api.get("/admin-dashboard/attendance", {
          params: {
            user_id: selectedStaff,
            month: `${year}-${String(month + 1).padStart(2, "0")}`,
          },
        });

        setAttendance((prev) => ({
          ...prev,
          [selectedStaff]: res.data.data,
        }));
      } catch (err) {
        console.error("Failed to fetch attendance", err);
      }
    };

    fetchAttendance();
  }, [selectedStaff, currentMonth]);

  /* ================= ATTENDANCE POPUP ================= */
  const openPopup = (day) => {
    const existing = attendance[selectedStaff]?.[formatDate(day)];

    setSelectedDay(day);
    setAttendanceForm(
      existing
        ? {
            status: existing.status,
            inTime: existing.in_time || "",
            outTime: existing.out_time || "",
          }
        : { status: "present", inTime: "", outTime: "" },
    );
    setPopupOpen(true);
  };

  const saveAttendance = async () => {
    try {
      await api.post("/admin-dashboard/attendance", {
        user_id: selectedStaff,
        date: formatDate(selectedDay),
        status: attendanceForm.status,
        in_time: attendanceForm.inTime,
        out_time: attendanceForm.outTime,
      });

      setAttendance((prev) => ({
        ...prev,
        [selectedStaff]: {
          ...prev[selectedStaff],
          [formatDate(selectedDay)]: {
            status: attendanceForm.status,
            in_time: attendanceForm.inTime,
            out_time: attendanceForm.outTime,
          },
        },
      }));

      setPopupOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save attendance");
    }
  };

  const getStatusColor = (obj) => {
    if (!obj) return "";
    if (obj.status === "present") return "bg-green-100 text-green-700";
    if (obj.status === "absent") return "bg-red-100 text-red-700";
    if (obj.status === "leave") return "bg-yellow-100 text-yellow-700";
    return "";
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-4 relative">
      {/* TABS */}
      <div className="flex gap-2 border-b">
        {["attendance", "staff"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize ${
              activeTab === tab ? "border-b-2 border-black" : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ================= ATTENDANCE ================= */}
      {activeTab === "attendance" && (
        <>
          <div className="flex gap-3 items-center">
            <select
              value={selectedStaff || ""}
              onChange={(e) => setSelectedStaff(Number(e.target.value))}
              className="border rounded px-3 py-2 text-sm"
            >
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

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

          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="grid grid-cols-7 gap-2 text-center font-medium text-sm mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 text-sm">
              {days.map((day, i) =>
                day ? (
                  <div
                    key={i}
                    onClick={() => openPopup(day)}
                    className={`h-20 border rounded cursor-pointer p-1 hover:bg-gray-50 ${getStatusColor(
                      attendance[selectedStaff]?.[formatDate(day)],
                    )}`}
                  >
                    <div className="text-right font-medium">{day}</div>
                    <div className="mt-2 capitalize text-xs">
                      {attendance[selectedStaff]?.[formatDate(day)]?.status ||
                        ""}
                    </div>
                  </div>
                ) : (
                  <div key={i}></div>
                ),
              )}
            </div>
          </div>
        </>
      )}

      {/* ================= STAFF ================= */}
      {activeTab === "staff" && (
        <>
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold">Staff List</h2>
            <button
              onClick={() => setDrawerOpen(true)}
              className="bg-black text-white px-4 py-2 rounded"
            >
              + Add Staff
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td className="p-3">{s.name}</td>
                    <td className="p-3">{s.phone}</td>
                    <td className="p-3">{s.email}</td>
                    <td className="p-3">{s.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ================= POPUP ================= */}
      {popupOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-96 rounded-2xl p-6 space-y-5 shadow-xl">
            {/* HEADER */}
            <div className="text-center">
              <h3 className="text-lg font-semibold">
                {new Date(formatDate(selectedDay)).toLocaleDateString("en-US", {
                  weekday: "long",
                })}
              </h3>
              <p className="text-sm text-gray-500">{formatDate(selectedDay)}</p>
            </div>

            {/* STATUS */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Attendance Status
              </label>
              <select
                value={attendanceForm.status}
                onChange={(e) => {
                  const status = e.target.value;
                  setAttendanceForm({
                    ...attendanceForm,
                    status,
                    inTime: status === "present" ? attendanceForm.inTime : "",
                    outTime: status === "present" ? attendanceForm.outTime : "",
                  });
                }}
                className="border px-3 py-2 rounded-lg w-full"
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="leave">Leave</option>
              </select>
            </div>

            {/* IN TIME */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                In Time
              </label>
              <input
                type="time"
                value={attendanceForm.inTime}
                disabled={attendanceForm.status !== "present"}
                onChange={(e) =>
                  setAttendanceForm({
                    ...attendanceForm,
                    inTime: e.target.value,
                  })
                }
                className={`border px-3 py-2 rounded-lg w-full ${
                  attendanceForm.status !== "present"
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
              />
            </div>

            {/* OUT TIME */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Out Time
              </label>
              <input
                type="time"
                value={attendanceForm.outTime}
                disabled={attendanceForm.status !== "present"}
                onChange={(e) =>
                  setAttendanceForm({
                    ...attendanceForm,
                    outTime: e.target.value,
                  })
                }
                className={`border px-3 py-2 rounded-lg w-full ${
                  attendanceForm.status !== "present"
                    ? "bg-gray-100 cursor-not-allowed"
                    : ""
                }`}
              />
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-3">
              <button
                onClick={saveAttendance}
                className="flex-1 bg-black text-white py-2 rounded-lg font-medium hover:opacity-90"
              >
                Save
              </button>
              <button
                onClick={() => setPopupOpen(false)}
                className="flex-1 border py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DRAWER ================= */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* OVERLAY */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />

          {/* DRAWER */}
          <div className="w-96 bg-white h-full shadow-2xl p-6 space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add Staff</h3>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            {/* NAME */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                placeholder="Enter staff name"
                value={staffForm.name}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, name: e.target.value })
                }
                className="border px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-black outline-none"
              />
            </div>

            {/* PHONE */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                placeholder="Enter phone number"
                value={staffForm.phone}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, phone: e.target.value })
                }
                className="border px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-black outline-none"
              />
            </div>

            {/* EMAIL */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                placeholder="Enter email address"
                value={staffForm.email}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, email: e.target.value })
                }
                className="border px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-black outline-none"
              />
            </div>

            {/* ROLE */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select
                value={staffForm.role}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, role: e.target.value })
                }
                className="border px-3 py-2 rounded-lg w-full bg-white focus:ring-2 focus:ring-black outline-none"
              >
                <option>Staff</option>
                <option>Manager</option>
              </select>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={addStaff}
                className="flex-1 bg-black text-white py-2 rounded-lg font-medium hover:opacity-90"
              >
                Save
              </button>
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex-1 border py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
