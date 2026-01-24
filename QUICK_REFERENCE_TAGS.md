# Quick Reference: Tags Feature

## For Admins

### Adding Tags
1. **Notifications**: Admin → Notifications → Edit/Add → Settings Tab → Tags Field
2. **Products**: Admin → Products → Edit/Add → Settings Tab → Tags Field

### How to Add Tags
- Type tag name
- Press **Enter** or **Comma** or click **"Add Tag"**
- Click **X** on tag to remove
- Submit form to save

### Example Tags
- Notifications: `ctet`, `admit-card`, `result`, `january`, `bihar`
- Products: `books`, `upsc`, `ssc`, `notes`, `laptop`

---

## For Users/Searchers

### Searching by Tags
1. Use navbar search box
2. Type tag name (e.g., "ctet", "books")
3. See matching notifications/products
4. Click result to view

### What Search Finds
- Title containing search term
- Any tag matching search term  
- Description containing search term

---

## API Reference

### Search Notification by Tag
```
GET /api/notification?type=search&search=ctet
```

### Search Product by Tag
```
GET /api/product?type=search&search=books
```

### Create with Tags
```
POST /api/notification
{
  "data": {
    "title": "...",
    "tags": ["tag1", "tag2"],
    ...
  }
}
```

---

## Files Created/Updated

| File | Change | Purpose |
|------|--------|---------|
| `tag-input.jsx` | ✨ NEW | Tag input component |
| `notificationForm.jsx` | ✏️ UPDATED | Added tags to Settings tab |
| `productForm.jsx` | ✏️ UPDATED | Added tags to Settings tab |
| `notification.js` (model) | ✏️ UPDATED | Added tags field |
| `product.js` (model) | ✏️ UPDATED | Added tags field |
| `/api/notification/route.js` | ✏️ UPDATED | Added search by tags |
| `/api/product/route.js` | ✏️ UPDATED | Added search by tags |

---

## Database Fields

Both models now have:
```javascript
tags: {
  type: [String],        // Array of tag strings
  default: [],           // Empty by default
  index: true            // Indexed for search speed
}
```

---

## Features Enabled

✅ Add tags in admin forms  
✅ Edit tags on existing content  
✅ Remove tags easily  
✅ Search by tags  
✅ See tags in search results  
✅ Automatic tag inclusion in API  
✅ Tag persistence in database  

---

## Common Tasks

### Add tags to a notification
1. Go to Admin → Notifications
2. Click notification or "Add Notification"
3. Fill details, go to Settings tab
4. Enter tags (e.g., "ctet", "admit-card")
5. Click Submit

### Search for content by tag
1. Click search in navbar
2. Type tag name (e.g., "exam")
3. See matching results
4. Click to view

### Edit tags on existing content
1. Go to Admin → select item
2. Go to Settings tab
3. Add/remove tags
4. Click Update

### Remove all tags
1. Click X on each tag badge
2. Continue submitting with empty tags array

---

## Tips

💡 Use lowercase, hyphenated tags  
💡 Keep tags 1-3 words  
💡 Use descriptive, searchable terms  
💡 Be consistent with tag naming  
💡 Add 3-5 tags per item for best search results  

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Tags not saving | Check form submission, check console |
| Tags not in search | Verify content is visible, check spelling |
| Can't add tag | Min 2 chars, no duplicates allowed |
| Tags disappeared | Refresh page, check submission result |

---

## Getting Help

- Check browser console for errors
- Verify all required fields are filled
- Try different browser if UI unresponsive
- Contact development team with details

---

## Next Steps

✅ Implementation complete  
✅ Ready for production use  
✅ Start adding tags to your content  
✅ Users can now search by tags  
