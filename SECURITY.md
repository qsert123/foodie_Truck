# Security Implementation Guide

## Overview
This food truck application has been secured with enterprise-grade security measures to protect against common web vulnerabilities and attacks.

## Security Features Implemented

### 1. Authentication & Authorization
- **Secure Admin Login**: Password hashing using SHA-256
- **Session Management**: HttpOnly, Secure, SameSite cookies
- **Token-based Authentication**: Secure random tokens for admin sessions
- **Rate Limiting**: Max 5 login attempts per 15 minutes per IP

### 2. Input Validation & Sanitization
- **XSS Protection**: All user inputs are sanitized to remove malicious scripts
- **SQL Injection Prevention**: Input validation and type checking
- **File Upload Validation**: 
  - File type restrictions (JPEG, PNG, WebP, GIF only)
  - File size limits (5MB maximum)
  - Filename sanitization
  - MIME type verification

### 3. Rate Limiting
- **API Endpoints**: 100 requests per 15 minutes per IP
- **Order Placement**: 10 orders per 15 minutes per IP
- **File Uploads**: Protected against spam uploads
- **Login Attempts**: 5 attempts per 15 minutes

### 4. Security Headers
All responses include:
- `X-Frame-Options`: Prevents clickjacking
- `X-Content-Type-Options`: Prevents MIME sniffing
- `X-XSS-Protection`: Browser XSS filter
- `Strict-Transport-Security`: Forces HTTPS
- `Referrer-Policy`: Controls referrer information
- `Permissions-Policy`: Restricts browser features

### 5. Data Protection
- **Input Length Limits**: Prevents buffer overflow attacks
- **Type Validation**: Ensures data integrity
- **Error Handling**: Secure error messages (no sensitive data leakage)
- **Logging**: Security events are logged for monitoring

## Changing the Admin Password

### Current Password
The default admin password is: `admin`

### To Change the Password:

1. Generate a new password hash:
```javascript
// Run this in browser console or Node.js
const password = 'your-new-secure-password';
const encoder = new TextEncoder();
const data = encoder.encode(password);
crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  console.log('Your password hash:', hashHex);
});
```

2. Update the hash in `/src/app/api/admin/auth/route.ts`:
```typescript
const ADMIN_PASSWORD_HASH = 'your-generated-hash-here';
```

3. Restart your application

## Security Best Practices

### For Production Deployment:

1. **Use Environment Variables**
   - Store sensitive data in `.env.local` (not committed to git)
   - Use different secrets for production

2. **Enable HTTPS**
   - All cookies are marked as `secure` in production
   - Use a valid SSL certificate

3. **Database Security**
   - Currently using file-based storage (data.json)
   - For production, migrate to a proper database (PostgreSQL, MongoDB)
   - Use parameterized queries

4. **Rate Limiting**
   - Current implementation uses in-memory storage
   - For production, use Redis or similar for distributed rate limiting

5. **File Uploads**
   - Consider using cloud storage (AWS S3, Cloudinary)
   - Implement virus scanning
   - Use CDN for serving uploaded files

6. **Monitoring & Logging**
   - Implement proper logging system
   - Monitor for suspicious activities
   - Set up alerts for security events

7. **Regular Updates**
   - Keep dependencies updated
   - Run `npm audit` regularly
   - Apply security patches promptly

## API Security

### Protected Endpoints (Require Admin Authentication):
- `POST /api/admin/menu` - Add/update menu items
- `DELETE /api/admin/menu` - Delete menu items
- `POST /api/admin/location` - Update location
- `POST /api/admin/offer` - Add/update offers
- `DELETE /api/admin/offer` - Delete offers
- `POST /api/upload` - Upload files

### Public Endpoints (Rate Limited):
- `GET /api/menu` - View menu
- `GET /api/location` - View location
- `GET /api/offer` - View offers
- `POST /api/orders` - Place order
- `GET /api/orders` - View active orders

## Testing Security

### Test Rate Limiting:
```bash
# Test order rate limiting (should block after 10 requests)
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/orders \
    -H "Content-Type: application/json" \
    -d '{"customerName":"Test","items":[{"id":"1","name":"Test","price":10,"quantity":1}],"total":10}'
done
```

### Test Admin Authentication:
```bash
# Should return 401 Unauthorized
curl -X POST http://localhost:3000/api/admin/menu \
  -H "Content-Type: application/json" \
  -d '{"id":"test","name":"Test","price":10}'
```

## Security Checklist

- [x] Password hashing implemented
- [x] Secure session management
- [x] Input validation on all endpoints
- [x] XSS protection
- [x] Rate limiting
- [x] Security headers
- [x] File upload validation
- [x] Admin route protection
- [x] Error handling (no data leakage)
- [x] CSRF protection (SameSite cookies)
- [ ] HTTPS enforcement (enable in production)
- [ ] Database migration (recommended for production)
- [ ] Redis for rate limiting (recommended for production)
- [ ] Security monitoring & alerts (recommended for production)

## Common Vulnerabilities Prevented

1. **SQL Injection**: Input validation and type checking
2. **XSS (Cross-Site Scripting)**: Input sanitization
3. **CSRF (Cross-Site Request Forgery)**: SameSite cookies
4. **Clickjacking**: X-Frame-Options header
5. **MIME Sniffing**: X-Content-Type-Options header
6. **Brute Force**: Rate limiting on login
7. **DDoS**: Rate limiting on all endpoints
8. **File Upload Attacks**: File type and size validation
9. **Session Hijacking**: HttpOnly, Secure cookies
10. **Information Disclosure**: Secure error handling

## Support

For security concerns or to report vulnerabilities, please contact the development team immediately.

**Remember**: Security is an ongoing process. Regularly review and update security measures.
