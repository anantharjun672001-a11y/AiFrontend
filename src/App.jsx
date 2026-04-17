import { useState } from "react";
import axios from "axios";

function App() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeCode = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/analyze", { code });
      setResult(res.data.result);
    } catch (err) {
      setResult("Error analyzing code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">
        AI Code Reviewer
      </h1>
      <p className="text-gray-400 mt-2 text-sm">
        Analyze your code and get AI-powered suggestions instantly
      </p>

      {/* Input Card */}
      <div className="mt-2 bg-gray-800 p-5 rounded-xl shadow-lg w-full max-w-3xl">
        <textarea
          className="w-full h-40 p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none"
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button
          onClick={analyzeCode}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 p-3 rounded-lg font-semibold transition duration-300 shadow-lg hover:shadow-blue-500/50 active:bg-blue-700 active:shadow-blue-500/50 active:scale-95"
        >
          {loading ? "Analyzing..." : "Analyze Code"}
        </button>
      </div>

      {/* Output */}
      {result && (
        <div className="mt-6 w-full max-w-3xl space-y-4">
          {/* Errors */}
          <div className="bg-red-900/30 border border-red-500 p-4 rounded-lg">
            <h3 className="text-red-400 font-semibold mb-2">Errors / Issues</h3>
            <pre className="whitespace-pre-wrap text-sm text-gray-300">
              {result.split("Improvements")[0]}
            </pre>
          </div>

          {/* Improvements */}
          <div className="bg-blue-900/30 border border-blue-500 p-4 rounded-lg">
            <h3 className="text-blue-400 font-semibold mb-2">Improvements</h3>
            <pre className="whitespace-pre-wrap text-sm text-gray-300">
              {result.split("Improvements")[1]?.split("Optimized")[0]}
            </pre>
          </div>

          {/* Optimized Code */}
          <div className="bg-green-900/30 border border-green-500 p-4 rounded-lg relative">
            <h3 className="text-green-400 font-semibold mb-2">
              Optimized Code
            </h3>

            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="absolute top-2 right-2 bg-green-600 px-2 py-1 text-xs rounded hover:bg-green-700"
            >
              Copy
            </button>

            <pre className="whitespace-pre-wrap text-sm text-gray-300">
              {result.split("Optimized")[1]}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
