"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { SVGProps } from "react";

// Icon Components with TypeScript types
const MedicalIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 7h-3V6a4 4 0 00-8 0v1H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2zm-9-1a2 2 0 014 0v1h-4V6zm9 13H5V9h3v1a1 1 0 002 0V9h4v1a1 1 0 002 0V9h3v10z" />
  </svg>
);

const ShieldCheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1.06 13.54L7.4 12l1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41-5.64 5.66z" />
  </svg>
);


const UserGroupIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 5.5c1.33 0 4 .67 4 2v5c0 .23-.04.45-.12.66-.53 1.24-1.62 1.34-3.88 1.34-2.26 0-3.35-.1-3.88-1.34-.08-.21-.12-.43-.12-.66v-5c0-1.33 2.67-2 4-2zm0-2c-1.84 0-5 1.08-5 3v5c0 1.12.36 2.01 1 2.66V17h8v-2.34c.64-.65 1-1.54 1-2.66v-5c0-1.92-3.16-3-5-3zm6 5v3h2v3h2v-6h-4zM6 11.5v3H4v3H2v-6h4z" />
  </svg>
);

const CheckCircleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

const ChartLineIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" />
  </svg>
);

const DatabaseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3C7.58 3 4 4.79 4 7s3.58 4 8 4 8-1.79 8-4-3.58-4-8-4zm0 6c-3.87 0-7-1.79-7-4s3.13-4 7-4 7 1.79 7 4-3.13 4-7 4zm0 1c3.87 0 7 1.79 7 4v3c0 2.21-3.13 4-7 4s-7-1.79-7-4v-3c0-2.21 3.13-4 7-4z" />
  </svg>
);

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [lastLoginTime, setLastLoginTime] = useState("");

  useEffect(() => {
    setLastLoginTime(
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  }, []);

  const handleLogin = () => {
    if (name === "doctor" && password === "pass") {
      setLoggedIn(true);
      setError("");
    } else {
      setError("❌ Invalid credentials. Try again.");
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-400 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20 flex flex-col">
        {/* Header with Medical Icon */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-900 px-8 py-8 text-white text-center flex-shrink-0 relative">
          <div className="absolute top-4 left-6">
            <MedicalIcon className="h-10 w-10 text-blue-300" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-medium">
            MEDICAL PORTAL
          </h1>
          <p className="text-blue-200 text-2xl md:text-3xl font-light">
            {loggedIn ? (
              <span className="font-medium">Welcome Back, Dr. Smith</span>
            ) : (
              "Secure Doctor Access"
            )}
          </p>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow p-8 bg-white/95 flex flex-col">
          {!loggedIn ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
              {/* Login Form Column */}
              <div className="flex flex-col justify-center">
                <div className="space-y-6 max-w-md mx-auto w-full">
                  <h2 className="text-3xl font-bold text-blue-900 text-center">
                    Doctor Login
                  </h2>
                  <input
                    type="text"
                    placeholder="Medical ID"
                    className="p-4 border border-gray-300 rounded-lg text-lg w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    type="password"
                    placeholder="Secure Password"
                    className="p-4 border border-gray-300 rounded-lg text-lg w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {error && (
                    <div className="text-red-600 font-medium">{error}</div>
                  )}
                  <button
                    onClick={handleLogin}
                    className="bg-blue-700 hover:bg-blue-800 text-white py-4 px-8 rounded-lg text-xl transition-all w-full"
                  >
                    Authenticate
                  </button>
                </div>
              </div>

              {/* Information Column */}
              <div className="hidden md:flex flex-col justify-center border-l border-blue-100 pl-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <ShieldCheckIcon className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold">WHO Certified</h3>
                      <p className="text-gray-600">
                        All data encrypted end-to-end
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <ChartLineIcon className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold">
                        Real-time Analytics
                      </h3>
                      <p className="text-gray-600">
                        Track patient statistics and trends
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <DatabaseIcon className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold">
                        Centralized Records
                      </h3>
                      <p className="text-gray-600">
                        All patient data in one secure location
                      </p>
                    </div>
                  </div>

                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-blue-800 mb-2">
                      Demo Credentials
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">ID:</span> doctor
                      </p>
                      <p>
                        <span className="font-medium">Password:</span> pass
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-full space-y-8">
              <div className="text-center space-y-4">
                <MedicalIcon className="h-16 w-16 mx-auto text-blue-600" />
                <h2 className="text-3xl font-bold text-blue-900">
                  Patient Management System
                </h2>
                <p className="text-gray-600 max-w-lg">
                  Access comprehensive patient records, treatment histories, and
                  prescription tools
                </p>
              </div>

              <Link
                href="/patients"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-5 px-10 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 text-xl text-center inline-flex items-center gap-3"
              >
                <UserGroupIcon className="h-6 w-6" />
                VIEW PATIENT RECORDS
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-blue-100 bg-blue-50/70 p-4 text-center text-blue-900 text-m font-medium flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-2 md:mb-0">
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
            <span>Secure Connection</span>
          </div>
          <div className="mb-2 md:mb-0">
            Last access: {lastLoginTime || "Today"}
          </div>
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
            <span>All systems normal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
