export interface StoredUser {
  id: string;
  accountCode: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  academicYear: string;
  wilaya: string;
  commune: string;
  avatar?: string;
  registeredAt: string;
  deviceId?: string;
}

const STORAGE_KEY = 'clasty_zoom_registered_users';
const DEVICE_ID_KEY = 'clasty_zoom_device_id';
const BOUND_ACCOUNT_KEY = 'clasty_zoom_bound_device_account';

// Pre-seeded accounts for testing login immediately
const DEFAULT_USERS: StoredUser[] = [
  {
    id: 'u_seed_1',
    accountCode: 'CZ-111111',
    password: 'password123',
    firstName: 'أحمد',
    lastName: 'بن علي',
    email: 'ahmed@clasty.dz',
    phone: '0555112233',
    academicYear: '3 ثانوي (بكالوريا) - شعبة علوم تجريبية',
    wilaya: '16 - الجزائر العاصمة',
    commune: 'القبة',
    registeredAt: '2026-09-01',
    deviceId: 'SEED_DEVICE_1',
  },
  {
    id: 'u_seed_2',
    accountCode: 'CZ-222222',
    password: 'password123',
    firstName: 'سارة',
    lastName: 'بلقاسم',
    email: 'sara@clasty.dz',
    phone: '0666223344',
    academicYear: '4 متوسط (BEM)',
    wilaya: '31 - وهران',
    commune: 'السانية',
    registeredAt: '2026-09-02',
    deviceId: 'SEED_DEVICE_2',
  },
];

/**
 * Retrieves or generates a unique persistent Device ID for the phone/browser
 */
export function getOrCreateDeviceId(): string {
  try {
    let devId = localStorage.getItem(DEVICE_ID_KEY);
    if (!devId) {
      // Generate a distinct pseudo-hardware device fingerprint
      const randPart = Math.random().toString(36).substring(2, 10).toUpperCase();
      const timePart = Date.now().toString(36).toUpperCase();
      devId = `DZ-MOB-${timePart}-${randPart}`;
      localStorage.setItem(DEVICE_ID_KEY, devId);
    }
    return devId;
  } catch {
    return 'DZ-DEVICE-FALLBACK-001';
  }
}

/**
 * Returns whether this phone/device has already registered an account
 */
export function hasDeviceAlreadyRegistered(): boolean {
  const currentDevId = getOrCreateDeviceId();

  // Check bound account key first
  try {
    const boundAccount = localStorage.getItem(BOUND_ACCOUNT_KEY);
    if (boundAccount) return true;
  } catch {
    // continue
  }

  // Check registered users list
  const users = getRegisteredUsers();
  return users.some((u) => u.deviceId && u.deviceId === currentDevId);
}

/**
 * Returns the registered account details associated with this device, if any
 */
export function getDeviceRegisteredAccount(): StoredUser | null {
  const currentDevId = getOrCreateDeviceId();
  const users = getRegisteredUsers();

  const found = users.find((u) => u.deviceId && u.deviceId === currentDevId);
  if (found) return found;

  try {
    const boundCode = localStorage.getItem(BOUND_ACCOUNT_KEY);
    if (boundCode) {
      const byCode = users.find((u) => u.accountCode === boundCode);
      if (byCode) return byCode;
    }
  } catch {
    // continue
  }

  return null;
}

/**
 * Binds this device to an account code
 */
export function bindDeviceToAccount(accountCode: string): void {
  try {
    localStorage.setItem(BOUND_ACCOUNT_KEY, accountCode);
  } catch (err) {
    console.error('Failed to bind device account', err);
  }
}

export function getRegisteredUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

export function isEmailAlreadyUsed(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  const users = getRegisteredUsers();
  return users.some((u) => u.email.trim().toLowerCase() === normalized);
}

export function isPhoneAlreadyUsed(phone: string): boolean {
  const normalized = phone.replace(/[\s\-\.\(\)]/g, '');
  const users = getRegisteredUsers();
  return users.some((u) => u.phone.replace(/[\s\-\.\(\)]/g, '') === normalized);
}

export function generateSixDigitAccountCode(): string {
  const users = getRegisteredUsers();
  let code = '';
  let exists = true;
  let attempts = 0;

  // Generate CZ- followed by exactly 6 digits (e.g. CZ-111111)
  while (exists && attempts < 100) {
    const digits = Math.floor(100000 + Math.random() * 900000).toString();
    code = `CZ-${digits}`;
    exists = users.some((u) => u.accountCode.toUpperCase() === code.toUpperCase());
    attempts++;
  }

  return code;
}

export function saveNewUser(user: StoredUser): void {
  const deviceId = getOrCreateDeviceId();
  user.deviceId = deviceId;

  const users = getRegisteredUsers();
  users.push(user);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    bindDeviceToAccount(user.accountCode);
  } catch (err) {
    console.error('Failed to persist user in localStorage', err);
  }
}

export function findUserByAccountCode(code: string): StoredUser | undefined {
  const normalized = code.trim().toUpperCase();
  const users = getRegisteredUsers();
  return users.find((u) => u.accountCode.toUpperCase() === normalized);
}

export function findUserByEmail(email: string): StoredUser | undefined {
  const normalized = email.trim().toLowerCase();
  const users = getRegisteredUsers();
  return users.find((u) => u.email.trim().toLowerCase() === normalized);
}

export function findUserByIdentifier(identifier: string): StoredUser | undefined {
  const norm = identifier.trim().toLowerCase();
  const users = getRegisteredUsers();
  return users.find(
    (u) =>
      u.email.trim().toLowerCase() === norm ||
      u.accountCode.trim().toLowerCase() === norm
  );
}
