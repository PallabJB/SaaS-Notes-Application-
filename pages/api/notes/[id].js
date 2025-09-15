import prisma from '../../../lib/prisma';
import { verifyTokenHeader } from '../../../lib/auth';

export default async function handler(req, res) {
  const token = verifyTokenHeader(req);
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const noteId = req.query.id; // keep as string
  if (!noteId) return res.status(400).json({ error: 'Invalid note ID' });

  // Retrieve note
  const note = await prisma.note.findUnique({ where: { id: noteId } });
  if (!note) return res.status(404).json({ error: 'Note not found' });

  // Tenant isolation
  if (note.tenantId !== token.tenantId) return res.status(403).json({ error: 'Access denied' });

  if (req.method === 'GET') {
    return res.json(note);
  } else if (req.method === 'PUT') {
    const { title, content } = req.body;
    if (token.role !== 'ADMIN' && token.role !== 'MEMBER')
      return res.status(403).json({ error: 'Forbidden' });

    const updated = await prisma.note.update({
      where: { id: noteId },
      data: { title, content },
    });
    return res.json(updated);
  } else if (req.method === 'DELETE') {
    if (token.role !== 'ADMIN' && token.role !== 'MEMBER')
      return res.status(403).json({ error: 'Forbidden' });

    await prisma.note.delete({ where: { id: noteId } });
    return res.json({ ok: true });
  } else {
    return res.status(405).end();
  }
}
