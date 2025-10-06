# 🧪 Business Creation Test Script

**Quick diagnostic script to test business creation functionality**

---

## 📋 Instructions

1. Open your Get Review app in browser: http://localhost:8081/
2. **Sign in** with your account
3. Go to **Dashboard** (`/dashboard`)
4. Open **Browser DevTools** (Press F12)
5. Go to **Console** tab
6. Copy and paste the script below
7. Press Enter to run

---

## 🔬 Diagnostic Script

```javascript
// ============================================
// Get Review - Business Creation Diagnostic
// ============================================

console.log('🔍 Starting Business Creation Diagnostic...\n');

// Import Supabase client (adjust if your import path is different)
const supabase = window.supabase || (() => {
  console.error('❌ Supabase client not found!');
  console.log('💡 Make sure you are on the Get Review app page');
  return null;
})();

if (!supabase) {
  console.log('⚠️  Cannot proceed without Supabase client');
} else {
  
  // Test 1: Check Authentication
  console.log('📝 Test 1: Checking Authentication...');
  
  supabase.auth.getUser().then(({ data, error }) => {
    if (error) {
      console.error('❌ Auth Error:', error);
      return;
    }
    
    if (!data.user) {
      console.error('❌ Not authenticated!');
      console.log('💡 Please sign in first');
      return;
    }
    
    console.log('✅ Authenticated as:', data.user.email);
    console.log('   User ID:', data.user.id);
    console.log('');
    
    const userId = data.user.id;
    
    // Test 2: Check if businesses table exists
    console.log('📝 Test 2: Checking businesses table...');
    
    supabase
      .from('businesses')
      .select('count', { count: 'exact', head: true })
      .then(({ count, error }) => {
        if (error) {
          if (error.code === '42P01') {
            console.error('❌ Table "businesses" does not exist!');
            console.log('💡 You need to run the migration:');
            console.log('   1. Go to Supabase Dashboard → SQL Editor');
            console.log('   2. Open: supabase/migrations/20251006000001_add_businesses_and_features.sql');
            console.log('   3. Copy and paste entire file');
            console.log('   4. Click Run');
            return;
          }
          console.error('❌ Table check error:', error);
          return;
        }
        
        console.log('✅ Table exists');
        console.log(`   Total businesses: ${count}`);
        console.log('');
        
        // Test 3: Check RLS policies
        console.log('📝 Test 3: Testing INSERT permission...');
        
        // Attempt to insert a test record
        supabase
          .from('businesses')
          .insert({
            owner_id: userId,
            name: 'TEST - Delete Me',
            category: 'Test',
            description: 'This is a diagnostic test. Safe to delete.',
            is_active: false // Set inactive so it doesn't pollute search
          })
          .select()
          .single()
          .then(({ data, error }) => {
            if (error) {
              if (error.code === '42501') {
                console.error('❌ Permission denied (RLS policy blocked)');
                console.log('💡 Possible causes:');
                console.log('   - Migration not run properly');
                console.log('   - RLS policy misconfigured');
                console.log('   - User ID mismatch');
                console.log('');
                console.log('🔧 Try this SQL in Supabase Dashboard:');
                console.log(`   SELECT * FROM businesses WHERE owner_id = '${userId}';`);
                return;
              }
              
              if (error.code === '23502') {
                console.error('❌ Missing required field:', error.message);
                return;
              }
              
              console.error('❌ Insert failed:', error);
              console.log('   Error code:', error.code);
              console.log('   Message:', error.message);
              return;
            }
            
            console.log('✅ INSERT works! Test record created:');
            console.log('   ID:', data.id);
            console.log('   Name:', data.name);
            console.log('   Owner ID:', data.owner_id);
            console.log('');
            
            // Clean up test record
            supabase
              .from('businesses')
              .delete()
              .eq('id', data.id)
              .then(() => {
                console.log('🗑️  Test record deleted');
                console.log('');
                
                // Final summary
                console.log('═══════════════════════════════════');
                console.log('📊 DIAGNOSTIC SUMMARY');
                console.log('═══════════════════════════════════');
                console.log('✅ Authentication: WORKING');
                console.log('✅ Table exists: YES');
                console.log('✅ INSERT permission: WORKING');
                console.log('');
                console.log('🎉 All checks passed!');
                console.log('💡 You should be able to create businesses now.');
                console.log('');
                console.log('📝 Next steps:');
                console.log('   1. Click the "Convert to Business" button');
                console.log('   2. Fill in business name and category');
                console.log('   3. Submit the form');
                console.log('   4. Check for any errors in console');
              });
          });
      });
  });
}

// ============================================
// Additional Helper Functions
// ============================================

// Function to list your businesses
window.listMyBusinesses = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('❌ Not authenticated');
    return;
  }
  
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.table(data);
  return data;
};

// Function to test business creation with sample data
window.testCreateBusiness = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('❌ Not authenticated');
    return;
  }
  
  console.log('🧪 Creating test business...');
  
  const { data, error } = await supabase
    .from('businesses')
    .insert({
      owner_id: user.id,
      name: 'Test Business ' + Date.now(),
      category: 'Test Category',
      description: 'This is a test business',
      website: 'https://example.com',
      is_active: true
    })
    .select()
    .single();
  
  if (error) {
    console.error('❌ Creation failed:', error);
    console.log('Error code:', error.code);
    console.log('Error message:', error.message);
    return;
  }
  
  console.log('✅ Business created successfully!');
  console.log('ID:', data.id);
  console.log('Name:', data.name);
  console.log('Owner ID:', data.owner_id);
  console.log('');
  console.log('🔗 View at: /business/' + data.id);
  
  return data;
};

console.log('');
console.log('📌 Helper functions available:');
console.log('   listMyBusinesses()     - List all your businesses');
console.log('   testCreateBusiness()   - Create a test business');
console.log('');
```

---

## 📊 Expected Output

### ✅ Successful Output

```
🔍 Starting Business Creation Diagnostic...

📝 Test 1: Checking Authentication...
✅ Authenticated as: user@example.com
   User ID: abc-123-def-456

📝 Test 2: Checking businesses table...
✅ Table exists
   Total businesses: 5

📝 Test 3: Testing INSERT permission...
✅ INSERT works! Test record created:
   ID: xyz-789
   Name: TEST - Delete Me
   Owner ID: abc-123-def-456

🗑️  Test record deleted

═══════════════════════════════════════
📊 DIAGNOSTIC SUMMARY
═══════════════════════════════════════
✅ Authentication: WORKING
✅ Table exists: YES
✅ INSERT permission: WORKING

🎉 All checks passed!
💡 You should be able to create businesses now.

📝 Next steps:
   1. Click the "Convert to Business" button
   2. Fill in business name and category
   3. Submit the form
   4. Check for any errors in console
```

### ❌ Common Error Outputs

#### Error 1: Not Authenticated
```
❌ Not authenticated!
💡 Please sign in first
```

#### Error 2: Table Doesn't Exist
```
❌ Table "businesses" does not exist!
💡 You need to run the migration:
   1. Go to Supabase Dashboard → SQL Editor
   2. Open: supabase/migrations/20251006000001_add_businesses_and_features.sql
   3. Copy and paste entire file
   4. Click Run
```

#### Error 3: Permission Denied
```
❌ Permission denied (RLS policy blocked)
💡 Possible causes:
   - Migration not run properly
   - RLS policy misconfigured
   - User ID mismatch
```

---

## 🔧 Using Helper Functions

After running the diagnostic, you can use these helper functions:

### List Your Businesses
```javascript
await listMyBusinesses();
// Shows table of all your businesses
```

### Create Test Business
```javascript
const business = await testCreateBusiness();
// Creates a new test business
console.log('Business ID:', business.id);
```

### Manual Test
```javascript
// Get current user
const { data: { user } } = await supabase.auth.getUser();
console.log('User ID:', user.id);

// Try creating business
const { data, error } = await supabase
  .from('businesses')
  .insert({
    owner_id: user.id,
    name: 'My Cool Business',
    category: 'Retail',
    is_active: true
  })
  .select()
  .single();

if (error) {
  console.error('Failed:', error);
} else {
  console.log('Success:', data);
}
```

---

## 🔍 Troubleshooting

### Issue: "supabase is not defined"

**Cause:** Script can't find Supabase client

**Fix:** Check you're on the correct page (Dashboard)

### Issue: "auth.getUser is not a function"

**Cause:** Using wrong version of Supabase client

**Fix:** Update Supabase client to latest version:
```bash
npm install @supabase/supabase-js@latest
```

### Issue: Script runs but shows old data

**Cause:** Browser cache

**Fix:** Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

---

## 📝 What to Share If You Need Help

If diagnostic fails, share this info:

1. **Console Output** - Copy entire output from console
2. **Error Code** - Any error codes shown (e.g., 42P01, 42501)
3. **User ID** - The user ID shown in output
4. **Supabase Project** - Your project name (without sensitive keys)

---

**Created by:** Mr. Anand Pinisetty - Dream Team  
**Date:** 2025-10-07  
**Purpose:** Quick diagnostic for business creation issues
