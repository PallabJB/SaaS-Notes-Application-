import { useState } from 'react';
import { useRouter } from 'next/router';

export default function InvitePage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MEMBER');
  const router = useRouter();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  async function submit(e) {
    e.preventDefault();
    if (!token) return alert('Login required');

    const payload = JSON.parse(atob(token.split('.')[1]));
    const slug = payload.tenantSlug;

    const res = await fetch(`/api/tenants/${slug}/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ email, role }),
    });

    const data = await res.json();
    if (res.ok) {
      alert(`User ${email} invited as ${role}`);
      setEmail('');
      setRole('MEMBER');
      router.push('/notes'); // Redirect back
    } else {
      alert(data.error || 'Invite failed');
    }
  }

  return (
    <div className="container">
      <h2>Invite User</h2>
      <form onSubmit={submit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <select value={role} onChange={e => setRole(e.target.value)} style={{ margin: '10px 0', width: '100%', padding: 8 }}>
          <option value="MEMBER">MEMBER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button type="submit">Invite</button>
      </form>
    </div>
  );
}
