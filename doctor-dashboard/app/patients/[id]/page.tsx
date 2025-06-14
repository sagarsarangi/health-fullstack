"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { jsPDF } from "jspdf";

export default function PatientDetailsPage() {
  const id = useParams().id as string;
  const [name, setName] = useState("");
  const [prescription, setPrescription] = useState("");
  const [generating, setGenerating] = useState(false);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/prescription/${id}`);
        setPrescription(res.data.prescription || "");
        setName(res.data.name || "nil");
        setAge(res.data.age || "nil");
        setGender(res.data.gender || "nil");
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
    const symptoms = prompt("😷 Enter symptoms:");
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
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const currentDate = new Date();

    // Document metadata
    doc.setProperties({
      title: `Prescription for ${name}`,
      subject: "Medical Prescription",
      author: "Healthcare System",
      creator: "Your Clinic Name",
    });

    // Header with clinic info
    doc.setFontSize(16);
    doc.setTextColor(45, 55, 72); // Dark slate
    doc.setFont("helvetica", "bold");
    doc.text("Smith Clinic", pageWidth / 2, 25, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("123 Medical Drive, Healthcare City", pageWidth / 2, 32, {
      align: "center",
    });
    doc.text("Phone: (123) 456-7890 | License: MED12345", pageWidth / 2, 39, {
      align: "center",
    });

    // Title with underline
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(59, 130, 246); // Blue-600
    doc.text("PRESCRIPTION", pageWidth / 2, 55, { align: "center" });
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.line(60, 57, pageWidth - 60, 57);

    // Patient information box
    doc.setFillColor(243, 244, 246); // Gray-50
    doc.rect(20, 65, pageWidth - 40, 40, "F");
    doc.setFontSize(12);
    doc.setTextColor(31, 41, 55); // Gray-800

    doc.text(`Patient: ${name}`, 25, 75);
    doc.text(`Age / Sex: ${age} / ${gender}`, 25, 85);
    doc.text(
      `Date: ${currentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      25,
      95
    );
    doc.text(
      `Time: ${currentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      75,
      95
    );

    // Prescription content - improved spacing
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("PRESCRIPTION DETAILS", pageWidth / 2, 120, { align: "center" });

    // Add subtle divider line
    doc.setDrawColor(220, 220, 220); // Light gray line
    doc.setLineWidth(0.3);
    doc.line(40, 125, pageWidth - 40, 125); // Centered line

    // Prescription text with better spacing
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const prescriptionText = prescription || "No prescription details provided";
    const splitText = doc.splitTextToSize(prescriptionText, 160); // Slightly narrower for better readability

    // Add line spacing between paragraphs
    let yPosition = 140; // Start lower than before
    const lineHeight = 8; // Increased from default 6

    splitText.forEach((line: string, index: number): void => {
      doc.text(line, 25, yPosition + index * lineHeight);

      // Add extra space after paragraphs (detected by period)
      if (line.endsWith(".")) {
        yPosition += 3; // Additional space
      }
    });

    // Doctor signature area
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128); // Gray-500
    doc.text("_________________________", 140, 250);
    doc.text("Dr. Smith", 140, 260);
    doc.text("MD, Specialty", 140, 267);
    doc.text("License #: MED12345", 140, 274);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(156, 163, 175); // Gray-400
    doc.text(
      "This prescription is electronically generated and valid without signature",
      pageWidth / 2,
      285,
      { align: "center" }
    );
    doc.text(`Document ID: ${currentDate.getTime()}`, pageWidth / 2, 290, {
      align: "center",
    });

    // Save PDF
    const fileName = `Prescription_${name?.replace(/\s+/g, "_")}_${currentDate
      .toISOString()
      .slice(0, 10)}.pdf`;
    doc.save(fileName);
    alert("📁 Prescription PDF downloaded successfully!");

  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-800">
        <div className="text-white text-xl">Loading patient data...</div>
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-800">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <p className="text-red-600 text-lg font-medium">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-blue-400 to-blue-800">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section matching previous UI */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-950 p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">
            Prescription for <span className="text-blue-300">{name}</span>
          </h1>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {generating && (
            <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-blue-700 font-medium">
                Generating AI prescription...
              </span>
            </div>
          )}

          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-3 text-lg">
              Prescription Details
            </label>
            <div className="relative">
              <textarea
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                className="w-full min-h-[300px] p-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400 text-lg transition-all duration-200"
                placeholder={`Generate prescription using AI then edit as needed...${String.fromCharCode(
                  10
                )}Then save to store in database.`}
              />
              <div className="absolute bottom-4 right-4 text-sm text-gray-500 bg-white px-2 py-1 rounded">
                {prescription.length}/2000 characters
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className={`flex items-center gap-3 px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-md ${
                generating
                  ? "bg-emerald-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              } text-white text-lg`}
            >
              {generating ? (
                <>
                  <svg
                    className="animate-spin h-6 w-6 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Generate via AI
                </>
              )}
            </button>

            <button
              onClick={handleSave}
              disabled={saving || generating}
              className={`flex items-center gap-3 px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-md ${
                saving || generating
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white text-lg`}
            >
              {saving ? (
                <>
                  <svg
                    className="animate-spin h-6 w-6 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Prescription
                </>
              )}
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={!prescription || generating || saving} // Added generating/saving conditions
              className={`flex items-center gap-3 px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-md ${
                !prescription || generating || saving
                  ? "bg-purple-300 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              } text-white text-lg`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
