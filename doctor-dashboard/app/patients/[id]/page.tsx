"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";


export default function PatientDetailsPage() {
  const id = useParams().id as string;
  const [name, setName] = useState("");
  const [prescription, setPrescription] = useState("");
  const [generating, setGenerating] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
 

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/prescription/${id}`);
        setPrescription(res.data.prescription || "");
        setName(res.data.name || "nil"); // ✅ Add this line
      } catch (err) {
        console.error(err);
        setError("Failed to fetch prescription");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [id]);
  
  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post(`http://localhost:3001/prescription/${id}`, {
        prescription,
      });
      alert("✅ Prescription saved!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save prescription");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    const symptoms = prompt("Enter symptoms:");
    if (!symptoms) return;
    setGenerating(true); 
    try {
      const res = await axios.post(
        "http://localhost:3001/generate-prescription",
        {
          symptoms,
        }
      );
      setPrescription(res.data.prescription);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to generate prescription");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Prescription for Patient Name: {name}
      </h1>
      {generating && (
        <div className="mb-2 text-yellow-700 font-semibold">
          ⏳ Generating prescription, please wait...
        </div>
      )}

      <textarea
        value={prescription}
        onChange={(e) => setPrescription(e.target.value)}
        className="w-full h-60 p-3 border border-gray-900 rounded mb-4"
        placeholder="Generate the presciption here using 🤖 Generate via AI button then edit as needed, then click 💾 Save Prescription"
      />

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={saving || generating}
          className={`px-4 py-2 rounded text-white transition-all duration-200 ${
            saving || generating
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saving
            ? "Saving..."
            : generating
            ? "Please wait..."
            : "💾 Save Prescription"}
        </button>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className={`${
            generating
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          } text-white px-4 py-2 rounded`}
        >
          {generating ? "⏳ Generating..." : "🤖 Generate via AI"}
        </button>
      </div>
    </div>
  );
}
