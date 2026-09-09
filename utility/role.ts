import type { UserRole } from 'src/domain/models/UserModel';

const EMAIL_ROLE_RULES: Array<{ role: UserRole; pattern: RegExp }> = [
  { role: 'staff', pattern: /staff\.pens\.ac\.id$/i },
  { role: 'mahasiswa', pattern: /student\.pens\.ac\.id$/i },
  { role: 'dosen', pattern: /pens\.ac\.id$/i },
];

export const deriveRoleFromEmail = (email?: string | null): UserRole | null => {
  const address = String(email || '').trim().toLowerCase();
  if (!address) return null;

  for (const rule of EMAIL_ROLE_RULES) {
    if (rule.pattern.test(address)) return rule.role;
  }

  return null;
};

const KNOWN_ROLES: ReadonlyArray<UserRole> = ['admin', 'staff', 'dosen', 'mahasiswa'];

// Role dari backend dipakai bila valid. Role legacy ("user") atau role yang
// belum dikenal diturunkan ulang dari email. Email di luar domain PENS
// dianggap mahasiswa (fallback aman).
export const resolveRole = (rawRole?: string | null, email?: string | null): UserRole => {
  const normalized = rawRole?.toLowerCase();
  if (normalized && KNOWN_ROLES.includes(normalized as UserRole)) {
    return normalized as UserRole;
  }
  return deriveRoleFromEmail(email) ?? 'mahasiswa';
};