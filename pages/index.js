import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <h1>SaaS Notes App</h1>
      <p><Link href="/login">Login</Link></p>
      <p>Health: <a href="/api/health">/api/health</a></p>
    </div>
  );
}
