// Admin authentication guard
// Only allows access to specific admin email

const ADMIN_EMAIL = 'Wulo@gmail.com';

export const isAdmin = (userEmail: string | null | undefined): boolean => {
  if (!userEmail) return false;
  return userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();
};

export const ADMIN_CREDENTIALS = {
  email: 'Wulo@gmail.com',
  // Note: Password is handled by Firebase Authentication
  // This is just for reference
};
