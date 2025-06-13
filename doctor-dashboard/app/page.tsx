// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Doctor Dashboard</h1>
      <Link href="/patients" className="text-blue-600 underline">
        View Patients
      </Link>
    </main>
  );
}
