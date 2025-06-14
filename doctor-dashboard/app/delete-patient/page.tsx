"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";



export default function DeletePatientPage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !age || !gender) {
      setError("Please fill all fields");
      setSuccess("");
      return;
    }

    try {
      const res = await axios.delete("http://localhost:3001/patients", {
        data: {
          name,
          age: Number(age),
          gender,
        },
      });

      setError("");
      setSuccess(res.data.message);
      setName("");
      setAge("");
      setGender("");

      setTimeout(() => {
        router.replace("/patients");

      }, 1500);
    } catch (error) {

      if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data as { error?: string };
        setError(data.error || "An unknown error occurred");
      } else {
        setError("Failed to delete patient");
      }
    }
  };    

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-red-400 to-red-800 p-8">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-red-900 to-red-950 p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">Delete Patient</h1>
        </div>

        <div className="p-8">
          <form onSubmit={handleDelete} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-lg">
                Patient Name
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                className="w-full p-3 border border-gray-300 rounded-lg text-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-lg">
                Age
              </label>
              <input
                type="number"
                placeholder="Enter age"
                className="w-full p-3 border border-gray-300 rounded-lg text-lg"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-lg">
                Gender
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg text-lg"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <p className="text-green-700 font-medium">{success}</p>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg text-lg"
              >
                Delete Patient
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
