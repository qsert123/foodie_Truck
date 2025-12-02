# Security Quick Reference

## 🔐 Admin Access
- **URL**: http://localhost:3000/admin
- **Default Password**: `admin`
- **Change Password**: See SECURITY.md

## 🛡️ Security Features Active

### ✅ Authentication
- Secure password hashing (SHA-256)
- HttpOnly session cookies
- Auto-logout on browser close
- 5 login attempts per 15 minutes

### ✅ Rate Limiting
- Login: 5 attempts / 15 min
- Orders: 10 / 15 min per IP
- API calls: 100 / 15 min per IP
- Uploads: Protected

### ✅ Input Protection
- XSS prevention (all inputs sanitized)
- SQL injection prevention
- File upload validation (5MB max, images only)
- Length limits on all text fields

### ✅ Security Headers
All responses include:
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security (production)
- Referrer-Policy: strict-origin-when-cross-origin

## 🚨 Important Notes

### Before Production:
1. **Change admin password** (see SECURITY.md)
2. **Enable HTTPS** (required for secure cookies)
3. **Use environment variables** for secrets
4. **Migrate to real database** (currently using file storage)
5. **Set up Redis** for distributed rate limiting
6. **Enable monitoring** and logging

### Protected Routes:
- `/admin/dashboard` - Requires authentication
- `/api/admin/*` - All admin APIs require auth token
- `/api/upload` - Requires admin authentication

### Public Routes (Rate Limited):
- `/api/menu` - View menu
- `/api/orders` - Place/view orders
- `/api/location` - View location
- `/api/offer` - View offers

## 🔧 Testing

### Test Admin Login:
1. Go to http://localhost:3000/admin
2. Enter password: `admin`
3. Should redirect to dashboard

### Test Rate Limiting:
Try placing 11 orders quickly - the 11th should be blocked

### Test File Upload:
- Only images allowed (JPEG, PNG, WebP, GIF)
- Max 5MB per file
- Requires admin login

## 📝 Logs
Security events are logged to console:
- Failed login attempts
- Rate limit violations
- Invalid input attempts
- Upload errors

## 🆘 Emergency

If locked out:
1. Stop the server
2. Delete cookies in browser
3. Restart server
4. Try logging in again

## 📚 Full Documentation
See `SECURITY.md` for complete security documentation and best practices.
