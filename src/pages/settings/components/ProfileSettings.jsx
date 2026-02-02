// import { useEffect, useState } from "react";
// import SettingsLayout from "../SettingsLayout";
// import api from "../../../api/axios";

// const DEFAULT_AVATAR = "/avatar-placeholder.png";

// import useDynamicTitle from "../../../hooks/useDynamicTitle";

// export default function ProfileSettings() {
//   useDynamicTitle("Profile Settings");
//   const [editMode, setEditMode] = useState(false);
//   const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
//   const [avatarFile, setAvatarFile] = useState(null);

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//   });

//   /* ---------------- GET PROFILE ---------------- */
//   const fetchProfile = async () => {
//     try {
//       const res = await api.get("/dashboard/profile");

//       const data = res.data.data;

//       setForm({
//         name: data.name || "",
//         email: data.email || "",
//         phone: data.phone || "",
//         password: "",
//       });
//     console.log("data",data)
//       setAvatar(data.avatar || DEFAULT_AVATAR);
//     } catch (err) {
//       console.error("Profile fetch failed", err);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   /* ---------------- HANDLERS ---------------- */
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setAvatar(URL.createObjectURL(file)); // preview
//     setAvatarFile(file);                  // store file
//   };

//   const handleSave = async () => {
//     try {
//       const formData = new FormData();

//       formData.append("name", form.name);
//       formData.append("email", form.email);
//       formData.append("phone", form.phone);

//       if (form.password) {
//         formData.append("password", form.password);
//       }

//       if (avatarFile) {
//         formData.append("avatar", avatarFile); // MUST be avatar
//       }

//       await api.put("/dashboard/update-profile", formData);

//       setEditMode(false);
//       setAvatarFile(null);
//       fetchProfile(); // refresh profile

//     } catch (err) {
//       console.error("Update failed", err);
//     }
//   };

//   const handleRemoveAvatar = () => {
//     setAvatar(DEFAULT_AVATAR);
//     setAvatarFile(null);
//   };

//   return (
//     <SettingsLayout>
//       <div className="bg-white rounded-xl border p-6 space-y-6">
//         {/* HEADER */}
//         <div className="flex items-center justify-between">
//           <h2 className="text-lg font-semibold">Profile</h2>

//           {!editMode ? (
//             <button
//               onClick={() => setEditMode(true)}
//               className="text-sm px-4 py-2 border rounded-lg hover:bg-gray-50"
//             >
//               Edit
//             </button>
//           ) : (
//             <div className="flex gap-2">
//               <button
//                 onClick={handleSave}
//                 className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={() => setEditMode(false)}
//                 className="text-sm px-4 py-2 border rounded-lg hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//             </div>
//           )}
//         </div>

//         {/* PROFILE IMAGE */}
//         <div className="flex items-center gap-6">
//           <div className="w-24 h-24 rounded-full border bg-gray-50 overflow-hidden flex items-center justify-center">
//             <img
//               src={avatar || DEFAULT_AVATAR}
//               alt="Avatar"
//               className="w-full h-full object-cover"
//             />
//           </div>

//           <div className="space-y-2">
//             <p className="text-sm font-medium">Profile Picture</p>
//             <p className="text-xs text-gray-500">
//               Recommended size: 256 × 256 px
//             </p>

//             {editMode && (
//               <div className="flex gap-3 mt-2">
//                 <label className="px-4 py-1.5 text-sm border rounded-lg cursor-pointer hover:bg-gray-50">
//                   Upload
//                   <input
//                     type="file"
//                     accept="image/*"
//                     hidden
//                     onChange={handleAvatarChange}
//                   />
//                 </label>

//                 <button
//                   onClick={handleRemoveAvatar}
//                   className="px-4 py-1.5 text-sm border text-red-600 rounded-lg hover:bg-red-50"
//                 >
//                   Remove
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         <hr />

//         {/* PROFILE INFO */}
//         <div className="space-y-5 text-sm">
//           {["name", "email", "phone"].map((field) => (
//             <div key={field}>
//               <p className="font-medium">{field}</p>
//               {editMode ? (
//                 <input
//                   name={field}
//                   value={form[field]}
//                   onChange={handleChange}
//                   className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
//                 />
//               ) : (
//                 <p className="text-gray-500">{form[field]}</p>
//               )}
//               <hr />
//             </div>
//           ))}

//           {/* PASSWORD */}
//           <div>
//             <p className="font-medium">Password</p>
//             {editMode ? (
//               <input
//                 type="password"
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 placeholder="New password"
//                 className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
//               />
//             ) : (
//               <p className="text-gray-500">••••••••</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </SettingsLayout>
//   );
// }


import { useEffect, useState } from "react";
import SettingsLayout from "../SettingsLayout";
import useDynamicTitle from "../../../hooks/useDynamicTitle";
import { useProfile } from "../../../context/ProfileContext";
import DefaultAvatar from "../../../assets/profile.jpg";


const DEFAULT_AVATAR = DefaultAvatar
const AVATAR_BASE_URL = "http://localhost:8000/storage";

export default function ProfileSettings() {
  useDynamicTitle("Profile Settings");

  const { profile, getProfile, updateProfile, removeAvatar } =
    useProfile();
console.log("test",getProfile)
  const [editMode, setEditMode] = useState(false);
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [avatarFile, setAvatarFile] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  /* ---------------- LOAD PROFILE ---------------- */
  useEffect(() => {
    getProfile();
  }, []);

  /* ---------------- MAP PROFILE → FORM ---------------- */
  useEffect(() => {
    if (!profile) return;

    setForm({
      name: profile.name ?? "",
      email: profile.email ?? "",
      phone: String(profile.phone ?? ""), // ensure string
      password: "",
    });

    // setAvatar(
    //   profile?.avatar
    //     ? `${AVATAR_BASE_URL}/${profile.avatar}`
    //     : DEFAULT_AVATAR
    // );

    setAvatar(DEFAULT_AVATAR)
  }, [profile]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatar(URL.createObjectURL(file));
    setAvatarFile(file);
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);

    if (form.password.trim().length > 0) {
      formData.append("password", form.password);
    }

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const success = await updateProfile(formData);

    if (success) {
      setEditMode(false);
      setAvatarFile(null);
      setForm((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleRemoveAvatar = async () => {
    await removeAvatar();
    setAvatar(DEFAULT_AVATAR);
    setAvatarFile(null);
  };

  return (
    <SettingsLayout>
      <div className="bg-white rounded-xl border p-6 space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Profile</h2>

          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="text-sm px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="text-sm px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* PROFILE IMAGE */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full border bg-gray-50 overflow-hidden flex items-center justify-center">
            <img
              src={avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          {editMode && (
            <div className="flex gap-3">
              <label className="px-4 py-1.5 text-sm border rounded-lg cursor-pointer hover:bg-gray-50">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarChange}
                />
              </label>

              <button
                onClick={handleRemoveAvatar}
                className="px-4 py-1.5 text-sm border text-red-600 rounded-lg hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <hr />

        {/* PROFILE INFO */}
        <div className="space-y-5 text-sm">
          {["name", "email", "phone"].map((field) => (
            <div key={field}>
              <p className="font-medium capitalize">{field}</p>
              {editMode ? (
                <input
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                />
              ) : (
                <p className="text-gray-500">{form[field]}</p>
              )}
              <hr />
            </div>
          ))}

          {/* PASSWORD */}
          <div>
            <p className="font-medium">Password</p>
            {editMode ? (
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="New password"
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
            ) : (
              <p className="text-gray-500">••••••••</p>
            )}
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}





