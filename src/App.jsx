import { useState, useEffect } from "react";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

function App() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [language, setLanguage] = useState("javascript");
  const [dark, setDark] = useState(true);

  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  /* LOGIN */
  const handleLogin = async () => {
  if (!username) return alert("Enter email");

  const res = await axios.post("https://backend-j3lr.onrender.com/login", {
    email: username,
  });

  setUserId(res.data.userId);
  setUsername(res.data.email); 

  localStorage.setItem("userId", res.data.userId);
  localStorage.setItem("username", res.data.email);

  setShowModal(false);
};
  /* FETCH HISTORY */
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`https://backend-j3lr.onrender.com/history/${userId}`)
      .then((res) => setHistory(res.data));
  }, [userId]);

  /* ANALYZE */
  const analyzeCode = async () => {
    if (!code.trim()) return alert("Enter code");

    setLoading(true);

    try {
      const res = await axios.post("https://backend-j3lr.onrender.com/analyze", {
        code,
        language,
        userId,
      });

      setResult(res.data.result);

      if (userId) {
        const h = await axios.get(`https://backend-j3lr.onrender.com/history/${userId}`);
        setHistory(h.data);
      }
    } catch {
      alert("Server error");
    }

    setLoading(false);
  };

  /* DELETE */
  const deleteOne = async (id) => {
    await axios.delete(`https://backend-j3lr.onrender.com/history/${id}`);
    setHistory(history.filter((h) => h._id !== id));
  };

  const deleteAll = async () => {
    await axios.delete(`https://backend-j3lr.onrender.com/history/user/${userId}`);
    setHistory([]);
  };

  /* RESULT PARSE */
  const improvements =
    result.split("Improvements:")[1]?.split("Optimized Code:")[0] || "";

  const optimizedCode = result.split("Optimized Code:")[1] || "";

 

  useEffect(() => {
    const savedUser = localStorage.getItem("userId");
    const savedName = localStorage.getItem("username");

    if (savedUser) {
      setUserId(savedUser);
      setUsername(savedName);
    }
  }, []);

  return (
    <div
      className={`${
        dark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      } min-h-screen flex flex-col items-center p-6`}
    >
      {/* LOGIN / USER */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
        {!userId ? (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 px-3 py-1 rounded text-white"
          >
            Login
          </button>
        ) : (
          <div
            className={`text-sm ${dark ? "text-gray-300" : "text-gray-700"}`}
          >
            👤 {username}
          </div>
        )}
      </div>

      {/* THEME TOGGLE */}
      <button
        onClick={() => setDark(!dark)}
        className="absolute top-10 right-24 px-3 py-1 bg-gray-700 text-white rounded"
      >
        {dark ? "Light" : "Dark"}
      </button>

      {/* LOGIN MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white text-black p-5 rounded w-80">
            <h2 className="mb-3 font-semibold">Login</h2>

            <input
              placeholder="Enter email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button
                onClick={handleLogin}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-6 text-blue-400">
        AI Code Reviewer
      </h1>

      {/* CONTROLS */}
      <div className="flex w-full max-w-3xl justify-between mt-3">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-800 text-white px-3 py-2 rounded"
        >
          <option>javascript</option>
          <option>python</option>
          <option>java</option>
        </select>

        <button
          onClick={() => {
            setCode("");
            setResult("");
          }}
          className="bg-red-500 px-3 py-1 rounded"
        >
          Clear
        </button>
      </div>

      {/* INPUT */}
      <div className="mt-4 bg-gray-800 p-5 rounded w-full max-w-3xl">
        <textarea
          className="w-full h-40 p-3 bg-gray-900 rounded"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button
          onClick={analyzeCode}
          className="mt-4 w-full bg-blue-500 p-3 rounded"
        >
          Analyze Code
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      )}

      {/* OUTPUT */}
      {result && (
        <div className="mt-6 w-full max-w-3xl space-y-4">
          {/* ERROR BOX */}
          <div className="bg-red-900/30 border border-red-500 p-4 rounded">
            <h3 className="text-red-400 mb-2">Errors</h3>
            <p className="text-sm text-gray-300">
              No critical errors (AI based review)
            </p>
          </div>

          {/* IMPROVEMENTS */}
          <div className="bg-blue-900/30 border border-blue-500 p-4 rounded">
            <h3 className="mb-2">Improvements</h3>
            <pre className="text-sm whitespace-pre-wrap break-words">
              {improvements}
            </pre>
          </div>

          {/* CODE */}
          <div className="bg-green-900/30 border border-green-500 p-4 rounded relative">
            <h3>Optimized Code</h3>

            <button
              onClick={() => {
                navigator.clipboard.writeText(optimizedCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="absolute top-2 right-2 bg-green-600 px-2 py-1 text-xs rounded"
            >
              Copy
            </button>

            {copied && (
              <p className="text-green-400 text-xs absolute top-2 left-2">
                Copied!
              </p>
            )}

            <div className="mt-2 rounded overflow-hidden">
              <SyntaxHighlighter
                language={language}
                style={dark ? vscDarkPlus : oneLight}
                customStyle={{
                  padding: "16px",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
              >
                {optimizedCode}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      )}

      {/* HISTORY */}
      {userId && (
        <div className="mt-10 w-full max-w-3xl">
          <div className="flex justify-between mb-3">
            <h2>History</h2>

            <button
              onClick={deleteAll}
              className="bg-red-600 px-3 py-1 text-xs rounded"
            >
              Delete All
            </button>
          </div>

          {history.map((item) => (
            <div key={item._id} className="bg-gray-800 p-3 mb-3 rounded">
              <pre className="whitespace-pre-wrap">{item.code}</pre>

              <button
                onClick={() => deleteOne(item._id)}
                className="bg-red-500 px-2 py-1 text-xs mt-2 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
