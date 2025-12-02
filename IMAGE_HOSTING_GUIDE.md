# Using Google Drive for Images

If you want to use Google Drive to host images for free instead of Firebase Storage, follow these steps:

## Step 1: Upload Image to Google Drive

1. Go to [Google Drive](https://drive.google.com/)
2. Upload your image
3. Right-click the image → **Get link**
4. Set sharing to **"Anyone with the link"**
5. Copy the link

## Step 2: Convert to Direct Image URL

The link you copied looks like this:
```
https://drive.google.com/file/d/1ABC123XYZ456/view?usp=sharing
```

You need to convert it to a direct image URL. Extract the **FILE_ID** (the part between `/d/` and `/view`) and use this format:

```
https://drive.google.com/uc?export=view&id=FILE_ID
```

### Example:
- **Original Link**: `https://drive.google.com/file/d/1ABC123XYZ456/view?usp=sharing`
- **FILE_ID**: `1ABC123XYZ456`
- **Direct URL**: `https://drive.google.com/uc?export=view&id=1ABC123XYZ456`

## Step 3: Use in Admin Panel

1. Go to your Admin Dashboard
2. When adding/editing a menu item
3. Paste the **Direct URL** in the "Image" field
4. The preview will show automatically

---

## Alternative Free Image Hosting Services

### ImgBB
- Website: https://imgbb.com/
- Upload image → Copy "Direct link"
- No conversion needed

### Imgur
- Website: https://imgur.com/
- Upload image → Right-click → "Copy image address"
- No conversion needed

### Postimages
- Website: https://postimages.org/
- Upload → Copy "Direct link"
- No conversion needed

---

## Tips

✅ **Google Drive** - Best for permanent storage, needs URL conversion  
✅ **ImgBB** - Easiest, direct links, unlimited uploads  
✅ **Imgur** - Popular, reliable, direct links  
✅ **Firebase Storage** - Automatic, integrated, no manual upload needed

You can use any of these services by pasting the image URL in the admin panel!
