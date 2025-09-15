const jwt = require('jsonwebtoken');
const prisma = require('./prisma');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

async function signToken(user) {
  // Fetch tenant info
  const tenant = await prisma.tenant.findUnique({ where: { id: user.tenantId } });

  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,                 // ADMIN or MEMBER
    tenantId: user.tenantId,
    tenantSlug: tenant?.slug || null,
    tenantPlan: tenant?.plan || 'FREE', // important for frontend upgrade logic
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function verifyTokenHeader(req) {
  const header = req.headers.authorization || '';
  const m = header.match(/^Bearer (.+)$/);
  if (!m) return null;

  try {
    const data = jwt.verify(m[1], JWT_SECRET);
    return data;
  } catch (e) {
    return null;
  }
}

module.exports = { signToken, verifyTokenHeader, bcrypt };
