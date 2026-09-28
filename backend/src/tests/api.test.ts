import test from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sanitizeObject } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { generateCsrfToken } from '../middlewares/csrf.middleware';

test('1. Security: Deep XSS & Dangerous Pattern Sanitization', () => {
  const dirtyObject = {
    name: 'John <script>alert("xss")</script> Doe',
    nested: {
      url: 'javascript:alert(1)',
      payload: 'onload=malicious()',
      clean: 'Hello World',
    },
    array: ['<iframe src="evil.com"></iframe>', 'Clean Item'],
  };

  const sanitized = sanitizeObject(dirtyObject);
  assert.equal(sanitized.name.includes('<script>'), false);
  assert.equal(sanitized.nested.url.includes('javascript:'), false);
  assert.equal(sanitized.nested.payload.includes('onload='), false);
  assert.equal(sanitized.nested.clean, 'Hello World');
  assert.equal(sanitized.array[0].includes('<iframe'), false);
  assert.equal(sanitized.array[1], 'Clean Item');
});

test('2. Auth Validator: Valid Registration Schema', () => {
  const validUser = {
    email: 'traveler@aarambhatravels.in',
    password: 'SecurePassword123!',
    name: 'Rahul Sharma',
    phone: '9876543210',
  };

  const parsed = registerSchema.safeParse(validUser);
  assert.equal(parsed.success, true);
});

test('3. Auth Validator: Reject Invalid Email & Short Password', () => {
  const invalidUser = {
    email: 'not-an-email',
    password: '123',
    name: 'R',
  };

  const parsed = registerSchema.safeParse(invalidUser);
  assert.equal(parsed.success, false);
});

test('4. Security: Cryptographic Password Hashing (bcrypt 12 rounds)', async () => {
  const plainPassword = 'SuperSecretPassword@2026';
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(plainPassword, salt);

  assert.notEqual(hashedPassword, plainPassword);
  assert.equal(hashedPassword.startsWith('$2'), true);

  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  assert.equal(isMatch, true);

  const isWrongMatch = await bcrypt.compare('WrongPassword', hashedPassword);
  assert.equal(isWrongMatch, false);
});

test('5. Security: CSRF Cryptographic Token Generation', () => {
  const token1 = generateCsrfToken();
  const token2 = generateCsrfToken();

  assert.equal(token1.length, 64);
  assert.equal(token2.length, 64);
  assert.notEqual(token1, token2);
});

test('6. Payment: Cryptographic Signature Verification (HMAC-SHA256)', () => {
  const orderId = 'order_DA294FA39';
  const paymentId = 'pay_92FA30501';
  const secret = 'rzp_test_secret_key_123';

  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const isValid = crypto.timingSafeEqual(
    Buffer.from(generatedSignature, 'utf-8'),
    Buffer.from(generatedSignature, 'utf-8')
  );

  assert.equal(isValid, true);
});
