import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">SaaS Notes App</h1>
      
      <p className="mb-2">
        <Link href="/login" className="text-blue-500 underline">
          Login
        </Link>
      </p>

      <p>
        Health: 
        <Link href="/api/health" className="text-green-600 underline ml-1">
          /api/health
        </Link>
      </p>
    </div>
  );
}
