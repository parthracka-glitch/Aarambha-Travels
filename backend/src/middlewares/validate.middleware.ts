import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// HTML & Script Injection Sanitizer
// Strips dangerous HTML tags, script injections, and event handler attributes
// from all string values in a request body object (deep traversal).
// This runs BEFORE Zod validation as a first line of defense.
// ─────────────────────────────────────────────────────────────────────────────

// Patterns to strip from all string inputs
const DANGEROUS_PATTERNS: [RegExp, string][] = [
  // Script tags (with or without attributes)
  [/<script\b[^>]*>[\s\S]*?<\/script>/gi, ''],
  // Inline event handlers (onclick=, onerror=, onload=, etc.)
  [/\bon\w+\s*=\s*["']?[^"'>]*/gi, ''],
  // iframe / object / embed / form injection
  [/<(iframe|object|embed|form|input|base|meta|link|applet)\b[^>]*\/?>/gi, ''],
  [/<\/(iframe|object|embed|form|applet)>/gi, ''],
  // javascript: and data: URI schemes
  [/javascript\s*:/gi, ''],
  [/data\s*:\s*text\/html/gi, ''],
  [/vbscript\s*:/gi, ''],
  // HTML comment injection
  [/<!--[\s\S]*?-->/g, ''],
  // Null bytes (common in injection payloads)
  [/\x00/g, ''],
];

function sanitizeString(value: string): string {
  let sanitized = value;
  for (const [pattern, replacement] of DANGEROUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, replacement);
  }
  return sanitized;
}

function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  if (obj !== null && typeof obj === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  return obj;
}

// ─────────────────────────────────────────────────────────────────────────────
// Validate Request Middleware
// 1. Sanitizes all string inputs to strip HTML/script injection
// 2. Runs Zod schema validation
// 3. Returns structured 400 errors on failure
// ─────────────────────────────────────────────────────────────────────────────

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Step 1: Deep-sanitize body to strip injection payloads before schema validation
      const sanitizedBody = sanitizeObject(req.body);

      // Step 2: Zod schema parse — coerces, trims, transforms, and validates
      req.body = schema.parse(sanitizedBody);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          detail: 'Validation error: One or more fields contain invalid data.',
          errors: err.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
        return;
      }
      next(err);
    }
  };
};
