"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3001/patients")
      .then((res) => setPatients(res.data))
      .catch(() => alert("Failed to fetch patients"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Patients List</h1>
        <Link href="./add-patients">
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            ➕ Add New Patient
          </button>
        </Link>
      </div>
      <div className="mb-4 text-gray-600 font-bold text-xl">
       
          This add patient feature is not required for the assignment as patients are added via front-desk into the database, but it is
          implemented to demonstrate the functionality.
      
      </div>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Age</th>
            <th className="p-2 text-left">Gender</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id} className="border-t">
              <td className="p-2">{patient.name}</td>
              <td className="p-2">{patient.age}</td>
              <td className="p-2">{patient.gender}</td>
              <td className="p-2 text-center">
                <Link
                  href={`/patients/${patient.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View Prescription
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
