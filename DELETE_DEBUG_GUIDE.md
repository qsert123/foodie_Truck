# Testing Delete Functionality

## How to Test if Delete is Working:

### 1. **Check Browser Console (F12)**
When you delete an item in the admin panel, you should see:
```
[DELETE] Attempting to delete menu item: [ID]
[DELETE] Successfully deleted menu item: [ID]
```

### 2. **Check Server Console**
In your terminal where `npm run dev` is running, you should see the same logs.

### 3. **Verify in Firebase Console**
- Go to [Firebase Console](https://console.firebase.google.com/)
- Navigate to Firestore Database
- Check the `menu` collection
- The deleted item should be **gone**

### 4. **Check User Pages**
After deleting:
- **Hard refresh** the menu/home page (Ctrl+Shift+R or Cmd+Shift+R)
- The item should NOT appear

## If Delete Still Doesn't Work:

### Possible Issues:

1. **Firebase Rules** - Check if write permission is enabled
2. **Authentication** - Make sure you're logged in as admin
3. **Browser Cache** - Clear browser cache completely
4. **Firebase Not Initialized** - Check `.env.local` has all Firebase keys

### Debug Steps:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Delete an item
4. Look for the DELETE request to `/api/admin/menu?id=XXX`
5. Check the response:
   - ✅ Status 200 = Success
   - ❌ Status 401 = Not authenticated
   - ❌ Status 500 = Server error

### Manual Firebase Check:

You can manually verify by:
1. Going to Firebase Console
2. Opening Firestore Database
3. Finding the `menu` collection
4. Manually deleting a document
5. Refreshing your app - it should disappear

## Current Flow:

```
Admin Panel (Delete Button)
    ↓
DELETE /api/admin/menu?id=XXX
    ↓
deleteMenuItem(id) in db.ts
    ↓
Firebase deleteDoc()
    ↓
Document removed from Firestore
    ↓
User pages fetch from /api/menu
    ↓
getMenu() reads from Firestore
    ↓
Deleted item NOT in results
```

This should work! If it doesn't, check the console logs for errors.
