import { useNavigate } from "react-router-dom";

function Sidebar({ currentUser }) {
  const navigate = useNavigate();

  console.log("Current user:", currentUser);
  console.log("Profile picture:", currentUser?.profile_picture);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
      {/* Branding */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-md">
            <span className="text-lg font-bold text-white">✦</span>
          </div>

          <div className="min-w-0">
            <h1 className="text-lg font-bold tracking-tight text-gray-900">
              DocuMind
            </h1>

            <p className="text-xs text-gray-500">AI PDF Assistant</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto border-t border-gray-200 p-4">
        {/* User */}
        <div className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
            {currentUser?.profile_picture ? (
              <img
                src={currentUser.profile_picture}
                alt="Profile"
                className="block h-full w-full object-cover"
                referrerPolicy="no-referrer"
                onLoad={() => console.log("PROFILE IMAGE LOADED")}
                onError={(e) => console.log("PROFILE IMAGE FAILED", e)}
              />
            ) : (
              currentUser?.username?.charAt(0).toUpperCase() || "U"
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">
              {currentUser?.username || "User"}
            </p>

            <p className="text-xs text-gray-400">Account</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-1 flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-gray-600 transition hover:bg-red-50 hover:text-red-600"
        >
          <span className="text-base">↪</span>

          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
