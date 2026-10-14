export class ValidationError extends Error {
  constructor(msg) { super(msg); this.name = 'ValidationError'; }
}

export function validate(body, rules) {
  const errors = {};
  for (const [field, rule] of Object.entries(rules)) {
    const value = body?.[field];
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors[field] = `${field} is required`;
      continue;
    }
    if (value === undefined || value === null || value === '') continue;
    if (rule.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[field] = `${field} must be a valid email`;
    }
    if (rule.type === 'number' && isNaN(Number(value))) {
      errors[field] = `${field} must be a number`;
    }
    if (rule.min !== undefined && Number(value) < rule.min) {
      errors[field] = `${field} must be at least ${rule.min}`;
    }
    if (rule.maxLength && String(value).length > rule.maxLength) {
      errors[field] = `${field} must be at most ${rule.maxLength} characters`;
    }
  }
  if (Object.keys(errors).length > 0) {
    throw new ValidationError(Object.values(errors)[0]);
  }
  return true;
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}