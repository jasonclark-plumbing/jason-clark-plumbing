import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/trpc/admin.login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || "Login failed");
      }

      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-black border-2 border-gold/40 p-8">
          <h1 className="text-3xl font-playfair text-gold mb-2 text-center">Admin Login</h1>
          <p className="text-cream/60 text-center mb-8">Jason Clark Plumbing</p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/40 text-red-400 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gold text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/50 border border-gold/30 text-cream px-4 py-3 focus:border-gold outline-none transition"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-gold text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/50 border border-gold/30 text-cream px-4 py-3 focus:border-gold outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 border-2 border-gold text-gold hover:bg-gold hover:text-black transition-all duration-300 font-semibold disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-cream/60 text-center text-sm mt-6">
            Only authorized administrators can access this page.
          </p>
        </div>
      </div>
    </div>
  );
}
