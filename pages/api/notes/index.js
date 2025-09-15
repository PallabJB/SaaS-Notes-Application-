import prisma from '../../../lib/prisma';
import { verifyTokenHeader } from '../../../lib/auth';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const token = verifyTokenHeader(req);
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const tenantId = token.tenantId;

  if (req.method === 'GET') {
    const notes = await prisma.note.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });
    return res.json(notes);
  }

  if (req.method === 'POST') {
    if (!['MEMBER', 'ADMIN'].includes(token.role)) return res.status(403).json({ error: 'Forbidden' });

    const { title, content } = req.body;
    if (!title) return res.status(400).json({ error: 'title required' });

    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (tenant.plan === 'FREE') {
      const count = await prisma.note.count({ where: { tenantId } });
      if (count >= 3) return res.status(403).json({ error: 'Free plan note limit reached' });
    }

    const note = await prisma.note.create({ data: { title, content: content || '', tenantId } });
    return res.status(201).json(note);
  }

  res.status(405).end();
}
