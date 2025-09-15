import prisma from '../../../../lib/prisma';
import { verifyTokenHeader, bcrypt } from '../../../../lib/auth';

export default async function handler(req, res) {
  const token = verifyTokenHeader(req);
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  if (token.tenantSlug !== req.query.slug) return res.status(403).json({ error: 'Cross-tenant forbidden' });
  if (token.role !== 'ADMIN') return res.status(403).json({ error: 'Admin only' });

  if (req.method !== 'POST') return res.status(405).end();

  const { email, role } = req.body;
  if (!email || !role) return res.status(400).json({ error: 'Email and role required' });

  const hashedPassword = await bcrypt.hash('password', 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        role,
        tenantId: token.tenantId,
        password: hashedPassword,
      },
    });
    res.json({ ok: true, user });
  } catch (err) {
    res.status(400).json({ error: 'User already exists or invalid data' });
  }
}
