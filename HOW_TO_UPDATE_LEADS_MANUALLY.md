# How to Manually Update Hot Leads with Google Search Data

## Problem Fixed ✅

Previously, when you tried to add details from Google searches (articles, annual reports) to existing hot leads, the data wasn't being saved properly. This has now been fixed!

## What Was Wrong

1. **StructuredLeadBuilder** only stored data in browser memory, not the database
2. **Enrichment API** only updated empty fields, ignoring updates to existing fields
3. **HotLeadForm** couldn't properly update existing leads (only create new ones)

## What's Fixed

✅ StructuredLeadBuilder now saves to database via API
✅ Enrichment API supports `forceUpdate` parameter to overwrite existing data
✅ HotLeadForm now properly supports both CREATE and UPDATE operations

---

## Method 1: Using HotLeadForm (Recommended)

### Step 1: Navigate to Hot Leads
```
http://localhost:3000/hot-leads
```

### Step 2: Click on a Lead to Edit
- Click on any lead from the list
- The form will open with existing data pre-filled

### Step 3: Update Fields with Google Search Data
- Manually enter data you found from:
  - Articles
  - Annual reports
  - Company websites
  - LinkedIn profiles
  - Any other sources

### Step 4: Save Changes
- Click "Enregistrer le lead" (Save Lead)
- The form now properly detects it's an UPDATE operation
- Data will be saved to the database via PUT request

---

## Method 2: Using the Enrichment API with Force Update

If you want to **programmatically** update leads with data from enrichment:

### JavaScript Example:

```javascript
// Force update existing lead with new enrichment data
const response = await fetch('/api/enrich-lead', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    leadId: 'your-lead-id-here',
    forceUpdate: true,  // ✨ NEW: This will overwrite existing fields
    forceRefresh: true  // Re-run enrichment even if already enriched
  })
});

const result = await response.json();
console.log(result.lead); // Updated lead with new data
```

### Without forceUpdate (Default Behavior):
```javascript
// Only fills empty fields, preserves existing data
{
  leadId: 'abc123',
  forceUpdate: false  // or omit this parameter
}
// Result: existing fields kept, only empty fields filled
```

### With forceUpdate:
```javascript
// Overwrites existing fields with new enrichment data
{
  leadId: 'abc123',
  forceUpdate: true  // ✨ Overwrites existing data
}
// Result: enrichment data takes priority
```

---

## Method 3: Using StructuredLeadBuilder (Now Database-Connected)

### Step 1: Navigate to StructuredLeadBuilder
```
http://localhost:3000/structured-lead-builder
```
(You may need to add a route if it doesn't exist yet)

### Step 2: Fill in Lead Details
- Enter data from your Google searches
- Fill in as many fields as possible

### Step 3: Save to Database
- Click "Ajouter" or "Enregistrer"
- The lead will now be **saved to the database** automatically
- You'll see a success message: "✅ Lead sauvegardé dans la base de données!"

---

## Method 4: Direct API Call with Custom Data

For complete control, you can make a direct API call:

```javascript
// Update existing lead
const response = await fetch('/api/hot-leads', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'clx123abc456',  // Lead ID (required for UPDATE)

    // Company Info (from Google search)
    companyName: 'Acme Corporation',
    description: 'Leading provider of innovative solutions...',
    address: '123 Innovation Street, Paris 75001',
    phone: '+33 1 23 45 67 89',
    email: 'contact@acme.com',
    website: 'https://www.acme.com',
    employeeCount: 250,

    // Legal & Financial (from annual reports)
    legalForm: 'SAS',
    siret: '12345678900012',
    nafCode: '6201Z',
    turnover: '15M €',
    capitalSocial: '500,000 €',

    // Managers (from LinkedIn)
    managers: [
      {
        name: 'Jean Dupont',
        role: 'CEO',
        email: 'j.dupont@acme.com',
        phone: '+33 6 12 34 56 78'
      }
    ],

    // Priority & Status
    priority: 'HAUTE',
    status: 'active',
    isOpportunity: true
  })
});

const result = await response.json();
if (result.success) {
  console.log('✅ Lead updated:', result.lead);
} else {
  console.error('❌ Error:', result.error);
}
```

---

## Common Use Cases

### Use Case 1: Adding Data from Company Website
1. Google search: "Acme Corporation site officiel"
2. Visit company website
3. Copy: address, phone, email, services
4. Open lead in HotLeadForm
5. Paste data into appropriate fields
6. Click Save → **Data is now in database** ✅

### Use Case 2: Adding Data from Annual Reports
1. Download company annual report PDF
2. Extract: turnover, employee count, legal form
3. Open lead in HotLeadForm
4. Enter financial data in "Légal & Financier" tab
5. Click Save → **Data is now in database** ✅

### Use Case 3: Adding LinkedIn Managers
1. Search LinkedIn for company executives
2. Copy names, roles, emails
3. Open lead in HotLeadForm
4. Go to "Équipe" tab
5. Click "Ajouter" to add managers
6. Fill in details
7. Click Save → **Managers saved to database** ✅

---

## Verification

To verify your data was saved:

### Option 1: Check in Hot Leads List
```
http://localhost:3000/hot-leads
```
- Refresh the page
- Find your updated lead
- Click to view details
- Verify all fields are populated

### Option 2: Check via API
```javascript
const response = await fetch('/api/hot-leads?id=YOUR_LEAD_ID');
const data = await response.json();
console.log(data.lead); // Should show all your updates
```

### Option 3: Check Database Directly
```bash
# If using SQLite
cd /home/user/microsoft-sales-app
sqlite3 prisma/dev.db
SELECT * FROM HotLead WHERE id = 'YOUR_LEAD_ID';
```

---

## Troubleshooting

### Issue: "Data not saving"
**Solution**: Make sure you're clicking the SAVE button. The form requires explicit save action.

### Issue: "Lead not found" error
**Solution**: You might be trying to update a lead that doesn't exist. Create it first using POST (without `id` field).

### Issue: "Enrichment not updating fields"
**Solution**: Add `forceUpdate: true` to your enrichment API call to overwrite existing data.

### Issue: "Changes disappear after refresh"
**Solution**: This was the old bug with StructuredLeadBuilder. Make sure you're using the UPDATED version (after these fixes).

---

## Best Practices

1. **Always verify**: After updating, refresh the page to confirm data was saved
2. **Use correct priority**: Set priority based on lead quality (HAUTE, MOYENNE, BASSE)
3. **Fill managers**: Always add at least one contact person with email
4. **Add source notes**: Use description field to note where you found the data
5. **Regular enrichment**: Run enrichment API periodically to update with latest government data

---

## Summary

✅ **Problem**: Manual updates weren't saving to database
✅ **Root Cause**: Forms only updating local state, not calling API
✅ **Fix**: All forms now properly save to database via API calls
✅ **New Feature**: `forceUpdate` parameter to overwrite existing enrichment data
✅ **Result**: You can now manually add Google search data and it will persist! 🎉

---

## Need Help?

If you're still experiencing issues:
1. Check browser console for errors (F12)
2. Verify API is running (`npm run dev`)
3. Check network tab to see if API calls are succeeding
4. Review server logs for detailed error messages

**Your data will now be saved properly!** 🚀
