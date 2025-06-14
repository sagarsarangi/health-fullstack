"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

interface Patient {
  id: number;
  name: string;
  gender: string;
  age: number;
  visit_count: number;
  created_at: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://health-fullstack.onrender.com/patients")
      .then((res) => setPatients(res.data))
      .catch(() => alert("Failed to fetch patients"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl text-blue-600">
          Loading patient data...
        </div>
      </div>
    );

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-800 p-8">
      <div
        className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
        style={{ height: "calc(90vh - 2rem)" }}
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-950 p-8 text-white">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold">
              Patient Management
            </h1>
            <div className="flex gap-4">
              <Link href="./add-patients">
                <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-lg">
                  <span>+</span>
                  <span>Add New Patient</span>
                </button>
              </Link>

              <Link href="./delete-patient">
                <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-lg">
                  <span>🗑️</span>
                  <span>Delete Patient</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-5 mx-8 mt-8">
          <p className="text-blue-800 font-medium text-lg">
            Note: The add and delete patient feature is not required for the assignment as
            patients are added and deleted via front-desk into the database, but it is
            implemented to demonstrate the functionality.
          </p>
        </div>
        {/* Highlight Note */}
        <div className="mx-8 mt-4 mb-6">
          <p className="text-[1.04rem] text-gray-600">
            <span className="inline-block w-6 h-6 mr-2 align-middle bg-green-100 border border-green-300 rounded-big"></span>
            Newly added patient is highlighted in green. This changes when a new
            patient is added. This also retains when logging in just for
            clarity.
          </p>
        </div>

        {/* Patients Table */}
        <div className="pb-4 overflow-x-auto overflow-y-auto px-8 ">
          <table className="w-full ">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b border-gray-200">
                <th className="pb-5 text-left text-gray-600 font-semibold pl-8 text-lg w-1/4">
                  Patient Name
                </th>
                <th className="pb-5 text-left text-gray-600 font-semibold text-lg w-1/6">
                  Age
                </th>
                <th className="pb-5 text-left text-gray-600 font-semibold text-lg w-1/6">
                  Gender
                </th>
                <th className="pb-5 text-left text-gray-600 font-semibold text-lg w-1/6">
                  Visit Count
                </th>
                <th className="pb-5 text-left text-gray-600 font-semibold pr-4 text-lg w-1/4">
                  Prescription
                </th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, index) => (
                <tr
                  key={patient.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index === 0 ? "bg-green-100" : ""
                  }`}
                >
                  <td className="py-5 pl-8 text-gray-600 text-lg text-left w-1/4">
                    {patient.name}
                  </td>
                  <td className="py-5 text-gray-600 text-lg text-left w-1/6">
                    {patient.age}
                  </td>
                  <td className="py-5 text-gray-600 text-lg text-left w-1/6">
                    {patient.gender}
                  </td>
                  <td className="py-5 text-gray-600 text-lg text-left w-1/6">
                    {patient.visit_count}
                  </td>
                  <td className="py-5 pr-4 text-left w-1/4">
                    <Link
                      href={`/patients/${patient.id}`}
                      className="inline-block bg-blue-50 hover:bg-blue-100 text-blue-600 px-5 py-3 rounded-lg transition-colors duration-200 text-lg"
                    >
                      View/Create Prescription
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
