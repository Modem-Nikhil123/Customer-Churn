import { useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function App() {
  const [form, setForm] = useState({
    Age: "",
    Gender: "Male",
    Usage_Frequency: "",
    Support_Calls: "",
    Total_Spend: "",
    Subscription_Type: "Basic",
    Contract_Length: "Monthly"
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const API_URL = import.meta.env.VITE_API_URL;
  
  const predict = async () => {
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/predict`, {
        Age: Number(form.Age),
        Gender: form.Gender,
        Usage_Frequency: Number(form.Usage_Frequency),
        Support_Calls: Number(form.Support_Calls),
        Total_Spend: Number(form.Total_Spend),
        Subscription_Type: form.Subscription_Type,
        Contract_Length: form.Contract_Length
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Prediction failed. Check backend logs.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Customer Churn – Time to Exit (Survival Analysis)
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <h2 className="text-xl font-semibold mb-4">
              Customer Details
            </h2>

            <input
              name="Age"
              placeholder="Age"
              onChange={handleChange}
              className="w-full border p-2 mb-2"
            />

            <input
              name="Usage_Frequency"
              placeholder="Usage Frequency"
              onChange={handleChange}
              className="w-full border p-2 mb-2"
            />

            <input
              name="Support_Calls"
              placeholder="Support Calls"
              onChange={handleChange}
              className="w-full border p-2 mb-2"
            />

            <input
              name="Total_Spend"
              placeholder="Total Spend"
              onChange={handleChange}
              className="w-full border p-2 mb-2"
            />

            <select
              name="Gender"
              onChange={handleChange}
              className="w-full border p-2 mb-2"
            >
              <option>Male</option>
              <option>Female</option>
            </select>

            <select
              name="Subscription_Type"
              onChange={handleChange}
              className="w-full border p-2 mb-2"
            >
              <option>Basic</option>
              <option>Standard</option>
              <option>Premium</option>
            </select>

            <select
              name="Contract_Length"
              onChange={handleChange}
              className="w-full border p-2 mb-4"
            >
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Annual</option>
            </select>

            <button
              onClick={predict}
              className="bg-blue-600 text-white w-full py-2 rounded"
            >
              Predict Time to Exit
            </button>

            {error && (
              <p className="text-red-600 mt-3">{error}</p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              Prediction Insights
            </h2>

            {!result && (
              <p className="text-gray-500">
                Enter customer details and click <b>Predict</b> to view results.
              </p>
            )}

            {result && (
              <>
                <p>
                  <b>Median Survival Time:</b>{" "}
                  {result.median_survival_time}
                </p>

                <p>
                  <b>Risk Score:</b>{" "}
                  {result.risk_score}
                </p>

                <h3 className="mt-3 font-semibold">
                  Survival Probabilities
                </h3>

                {Object.entries(result.survival_at_horizons).map(([t, p]) => (
                  <p key={t}>
                    After {t} days: {(p * 100).toFixed(2)}%
                  </p>
                ))}

                <h3 className="mt-4 font-semibold">
                  Survival Curve
                </h3>

                <LineChart
                  width={420}
                  height={260}
                  data={result.survival_curve}
                  className="mt-2"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="probability"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
