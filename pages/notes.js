import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function NotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [tenantPlan, setTenantPlan] = useState('FREE');
  const [role, setRole] = useState('MEMBER');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    setRole(payload.role);           // ADMIN or MEMBER
    setTenantPlan(payload.tenantPlan || 'FREE');
  } catch (err) {
    console.error('Invalid token');
    router.push('/login');
  }
    fetchNotes();
    fetchTenant();
  }, []);

  async function fetchNotes() {
    const res = await fetch('/api/notes', { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setNotes(data);
  }

  async function fetchTenant() {
    if (!token) return;
    const payload = JSON.parse(atob(token.split('.')[1]));
    setTenantPlan(payload.tenantPlan || 'FREE');
  }

  async function addNote(e) {
    e.preventDefault();
    if (!title) return;
    setLoading(true);

    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, content }),
    });

    const data = await res.json();
    if (res.ok) {
      setNotes([data, ...notes]);
      setTitle('');
      setContent('');
    } else {
      alert(data.error || 'Failed to add note');
    }
    setLoading(false);
  }

  async function deleteNote(id) {
    if (!confirm('Delete this note?')) return;
    const res = await fetch(`/api/notes/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setNotes(notes.filter(n => n.id !== id));
    else alert('Failed to delete');
  }

  function startEditing(note) {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditTitle('');
    setEditContent('');
  }

  async function saveEdit(id) {
    const res = await fetch(`/api/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: editTitle, content: editContent }),
    });
    const data = await res.json();
    if (res.ok) {
      setNotes(notes.map(n => (n.id === id ? data : n)));
      cancelEditing();
    } else {
      alert(data.error || 'Failed to update');
    }
  }
  

  async function upgradeTenant() {
    if (!token) return;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const slug = payload.tenantSlug;

    const res = await fetch(`/api/tenants/${slug}/upgrade`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      alert('Upgraded to PRO!');
      setTenantPlan('PRO');
    } else alert('Upgrade failed');
  }

  return (
    <div className="container">
      <h2>Notes</h2>

      {role === 'ADMIN' && (
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => router.push('/invite')}>Invite Users</button>
        </div>
      )}

      {tenantPlan === 'FREE' && notes.length >= 3 && (
        <div className="upgrade">
          Free plan note limit reached.{' '}
          <button onClick={upgradeTenant}>Upgrade to Pro</button>
        </div>
      )}

      <form onSubmit={addNote} style={{ marginBottom: 20 }}>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Note'}</button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notes.map(note => (
          <li key={note.id} className="note">
            {editingId === note.id ? (
              <>
                <input value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{ width: '100%', marginBottom: 5 }} />
                <textarea value={editContent} onChange={e => setEditContent(e.target.value)} style={{ width: '100%', marginBottom: 5 }} />
                <button onClick={() => saveEdit(note.id)}>Save</button>{' '}
                <button onClick={cancelEditing} style={{ backgroundColor: '#999' }}>Cancel</button>
              </>
            ) : (
              <>
                <h4>{note.title}</h4>
                <p>{note.content}</p>
                <button onClick={() => startEditing(note)} style={{ marginRight: 5 }}>Edit</button>
                <button onClick={() => deleteNote(note.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
