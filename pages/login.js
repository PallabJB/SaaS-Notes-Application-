// // pages/login.js
// import { useState } from 'react';
// import { useRouter } from 'next/router';

// export default function Login() {
//   const [email, setEmail] = useState('admin@acme.test');
//   const [password, setPassword] = useState('password');
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   async function submit(e) {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password }),
//       });
//       const data = await res.json();

//       if (res.ok && data.token) {
//         localStorage.setItem('token', data.token);
//         router.push('/notes');
//       } else {
//         alert(data.error || 'Login failed');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('An error occurred.');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div style={{ maxWidth: 400, margin: '50px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
//       <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Login</h2>
//       <form onSubmit={submit}>
//         <div style={{ marginBottom: 15 }}>
//           <label>Email:</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             style={{ width: '100%', padding: 8, marginTop: 4 }}
//           />
//         </div>
//         <div style={{ marginBottom: 15 }}>
//           <label>Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             style={{ width: '100%', padding: 8, marginTop: 4 }}
//           />
//         </div>
//         <button
//           type="submit"
//           style={{
//             width: '100%',
//             padding: 10,
//             backgroundColor: '#0070f3',
//             color: 'white',
//             border: 'none',
//             borderRadius: 4,
//             cursor: 'pointer',
//           }}
//           disabled={loading}
//         >
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//       <div style={{ marginTop: 15, textAlign: 'center' }}>
//         <small>Use one of the test accounts (password: `password`)</small>
//       </div>
//     </div>
//   );
// }


import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('admin@acme.test');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        router.push('/notes');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      alert('An error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div style={{ marginBottom: 15 }}>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <div style={{ marginTop: 15, textAlign: 'center' }}>
        <small>Use one of the test accounts (password: `password`)</small>
      </div>
    </div>
  );
}
