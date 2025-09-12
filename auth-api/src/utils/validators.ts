export function isValidEmail(email: string): boolean {
  return /.+@.+\..+/.test(email);
}

export function isStrongPassword(password: string): boolean {
  return password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
}
