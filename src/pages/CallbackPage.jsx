import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      // Exchange code for token
      fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: import.meta.env.VITE_GITHUB_CLIENT_ID,
          client_secret: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
          code,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          const accessToken = data.access_token;
          localStorage.setItem("github_token", accessToken);
          // Redirect to dashboard
          navigate("/");
        })
        .catch((err) => {
          console.error("OAuth failed", err);
          navigate("/login");
        });
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-gray-600">Logging you in...</p>
    </div>
  );
}