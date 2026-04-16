import { useState } from "react";
import axios from "axios";

function App() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeCode = async () => {
    try {
      setLoading(true);

      const res = await axios.post("http://localhost:3000/analyze", {
        code,
      });

      setResult(res.data.result);
    } catch (err) {
      console.error(err);
      setResult("Error analyzing code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>AI Code Reviewer </h2>

      <textarea
        rows="10"
        cols="60"
        placeholder="Paste your code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <br /><br />

      <button onClick={analyzeCode}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      <pre style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
        {result}
      </pre>
    </div>
  );
}

export default App;