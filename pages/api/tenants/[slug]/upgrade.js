import prisma from '../../../../lib/prisma';
import { verifyTokenHeader } from '../../../../lib/auth';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method !== 'POST') return res.status(405).end();

  const { slug } = req.query;
  const token = verifyTokenHeader(req);
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  if (token.tenantSlug !== slug) return res.status(403).json({ error: 'Cross-tenant access forbidden' });
  if (token.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });

  const tenant = await prisma.tenant.update({ where: { slug }, data: { plan: 'PRO' } });
  res.json({ ok: true, tenant });
}
