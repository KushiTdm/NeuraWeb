// backend/src/utils/validation.ts
import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

export class ValidationUtils {
  // Sanitisation des entrées HTML
  static sanitizeHtml(input: string): string {
    return DOMPurify.sanitize(input, { 
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [] 
    });
  }

  // Validation et sanitisation d'email
  static validateAndSanitizeEmail(email: string): string {
    if (!validator.isEmail(email)) {
      throw new Error('Invalid email format');
    }
    return validator.normalizeEmail(email) || email;
  }

  // Validation du nom (lettres, espaces, traits d'union uniquement)
  static validateName(name: string): boolean {
    return /^[a-zA-ZÀ-ÿ\s\-']{2,50}$/.test(name);
  }

  // Validation du téléphone
  static validatePhone(phone: string): boolean {
    return validator.isMobilePhone(phone, 'any', { strictMode: false });
  }

  // Sanitisation des données JSON
  static sanitizeJsonData(data: any): any {
    if (typeof data === 'string') {
      return this.sanitizeHtml(data);
    }
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeJsonData(item));
    }
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeJsonData(value);
      }
      return sanitized;
    }
    return data;
  }

  // Limitation de taille des chaînes
  static limitStringLength(str: string, maxLength: number): string {
    return str.substring(0, maxLength);
  }
}