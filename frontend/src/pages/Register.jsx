import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed.");
      }

      localStorage.setItem("access_token", data.access_token);

      setMessage("Account created successfully!");
      setMessageType("success");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);

      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        {/* Branding */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-md">
            <span className="text-xl font-bold text-white">✦</span>
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
            Create your account
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Start chatting with your documents.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Username */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              required
            />
          </div>

          {/* Register button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200"></div>

          <span className="text-xs text-gray-400">OR</span>

          <div className="h-px flex-1 bg-gray-200"></div>
        </div>

        {/* Continue with Google */}
        <button
          type="button"
          onClick={() => {
            window.location.href = "http://127.0.0.1:8000/auth/google";
          }}
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow active:scale-[0.98]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M21.35 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.22a4.46 4.46 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.93-4.18 2.93-7.39z"
            />
            <path
              fill="#34A853"
              d="M12 21.5c2.63 0 4.84-.87 6.45-2.34l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.51A9.74 9.74 0 0 0 12 21.5z"
            />
            <path
              fill="#FBBC05"
              d="M6.53 13.62A5.86 5.86 0 0 1 6.23 12c0-.56.1-1.1.3-1.62V7.87H3.28A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.03 4.13l3.25-2.51z"
            />
            <path
              fill="#EA4335"
              d="M12 6.35c1.43 0 2.72 0.49 3.73 1.45l2.8-2.8C16.84 3.4 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.72 5.37l3.25 2.51C7.3 8.07 9.46 6.35 12 6.35z"
            />
          </svg>

          <span>Continue with Google</span>
        </button>

        {message && (
          <div
            className={`flex mt-2 items-center gap-2 rounded-xl border px-3.5 py-3 text-sm  ${
              messageType === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <span className="text-base">
              {messageType === "success" ? "✓" : "⚠"}
            </span>

            <span>{message}</span>
          </div>
        )}

        {/* Login */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="cursor-pointer font-medium text-indigo-600 hover:text-indigo-700"
          >
            Login
          </span>
        </p>
      </div>
    </main>
  );
}

export default Register;
