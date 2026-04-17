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

      {/* Input Card */}
      <div className="bg-gray-800 p-5 rounded-xl shadow-lg w-full max-w-3xl">
        <textarea
          className="w-full h-40 p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none"
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button
          onClick={analyzeCode}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 p-2 rounded-lg font-semibold"
        >
          {loading ? "Analyzing..." : "Analyze Code"}
        </button>
      </div>

      {/* Output */}
      {result && (
        <div className="mt-6 bg-gray-800 p-5 rounded-xl w-full max-w-3xl shadow-lg">
          <h2 className="text-xl mb-3 text-green-400">Result</h2>
          <pre className="whitespace-pre-wrap text-gray-300">{result}</pre>
        </div>
      )}

    </div>
  );
}

export default App;