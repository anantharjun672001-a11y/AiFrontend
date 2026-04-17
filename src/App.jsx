import { useState } from "react";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function App() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [language, setLanguage] = useState("javascript");

  const analyzeCode = async () => {
    if (!code.trim()) {
      alert("Please enter code");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:3000/analyze", {
        code,
        language,
      });

      setResult(res.data.result);

      setHistory((prev) => [...prev, { code, result: res.data.result }]);
    } catch (err) {
      setResult("Server busy or API issue. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const optimizedCode = result.split("Optimized Code:")[1] || "";

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">
        AI Code Reviewer
      </h1>

      <p className="text-gray-400 mt-2 text-sm">
        Analyze your code and get AI-powered suggestions instantly
      </p>

      {/* Language */}

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-lg mt-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
      </select>

      {/* Clear */}
      <button
        onClick={() => {
          setCode("");
          setResult("");
        }}
        className="mt-3 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm self-end"
      >
        Clear
      </button>

      {/* Input */}
      <div className="mt-2 bg-gray-800 p-5 rounded-xl shadow-lg w-full max-w-3xl">
        <textarea
          className="w-full h-40 p-3 rounded-lg bg-gray-900 border border-gray-700"
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button
          onClick={analyzeCode}
          className="mt-4 w-full bg-blue-500 p-3 rounded-lg font-semibold"
        >
          {loading ? "Analyzing..." : "Analyze Code"}
        </button>
      </div>

      {/* Output */}
      {result && (
        <div className="mt-6 w-full max-w-3xl space-y-4">
          {/* Improvements */}
          <div className="bg-blue-900/30 border border-blue-500 p-4 rounded-lg">
            <h3 className="text-blue-400 font-semibold mb-2">Improvements</h3>
            <pre className="whitespace-pre-wrap text-sm text-gray-300">
              {result.split("Improvements:")[1]?.split("Optimized Code:")[0]}
            </pre>
          </div>

          {/* Optimized Code */}
          <div className="bg-green-900/30 border border-green-500 p-4 rounded-lg relative">
            <h3 className="text-green-400 font-semibold mb-2">
              Optimized Code
            </h3>

            <button
              onClick={() => {
                navigator.clipboard.writeText(optimizedCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 1000);
              }}
              className="absolute top-2 right-2 bg-green-600 px-2 py-1 text-xs rounded"
            >
              {copied ? "Copied!" : "Copy"}
            </button>

            <SyntaxHighlighter language={language} style={vscDarkPlus}>
              {optimizedCode}
            </SyntaxHighlighter>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="mt-10 w-full max-w-3xl">
          <h2 className="text-xl text-purple-400 mb-3">History</h2>

          {history.map((item, index) => (
            <div key={index} className="bg-gray-800 p-3 rounded mb-3">
              <pre className="text-sm">{item.code}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
