# Employee Status Update - Testing Guide

## 🧪 How to Test the Fix

### Step 1: Open Browser Console
1. Press `F12` to open Developer Tools
2. Go to the "Console" tab
3. Clear the console (click the 🚫 icon)

### Step 2: Edit an Employee
1. Click "Edit" on any employee
2. Change the status dropdown to "Inactive"
3. Click "Update Employee"

### Step 3: Check Console Logs

You should see this sequence:

```
=== EMPLOYEE MODAL SUBMIT ===
Is Edit: true
Employee ID: [some-uuid]
Submitting data: { status: "inactive", ... }

=== EMPLOYEE API PUT ===
Request body: { status: "inactive", ... }
Validated data: { status: "inactive", ... }
Mapped status to is_active: false
Data to update in DB (final): { is_active: false, ... }
Raw data from database: { is_active: false, ... }
Updated status: inactive
Updated is_active: false

Employee saved successfully. Updated status: inactive
Triggering employee list refresh after save...

=== FETCHING EMPLOYEES ===
GET /api/employees - Raw data from DB: [{ is_active: false }]
GET /api/employees - Mapped data: [{ status: "inactive" }]
Fetched employees count: 5
Employee statuses: [{ name: "...", status: "inactive", is_active: false }]

Rendering status for [Employee Name]: inactive
getStatusBadge called with: inactive type: string
Using config: { variant: "secondary", label: "Inactive" }
```

### Step 4: Verify UI
- The employee's status badge should change to **gray "Inactive"**
- The "Active" counter at the bottom should decrease by 1

### Step 5: Test "On Leave"
1. Edit the same employee again
2. Change status to "On Leave"
3. Badge should turn **red "On Leave"**

### Step 6: Test "Active"
1. Edit the employee again
2. Change status back to "Active"
3. Badge should turn **blue "Active"**
4. Active counter should increase by 1

## ❌ If It Still Doesn't Work

### Check These Console Logs:

#### Problem 1: Status is undefined
```
Rendering status for [Name]: undefined
getStatusBadge called with: undefined
```
**Solution**: The GET endpoint isn't mapping `is_active` to `status` correctly

#### Problem 2: is_active not updating
```
Raw data from database: { is_active: true }  // Should be false!
```
**Solution**: The PUT endpoint isn't setting `is_active` correctly

#### Problem 3: Status not in fetched data
```
Employee statuses: [{ name: "...", status: undefined }]
```
**Solution**: The mapping in GET endpoint failed

#### Problem 4: Old data being fetched
```
Fetched employees: [{ status: "active" }]  // Should be "inactive"!
```
**Solution**: Cache issue or database not committed yet

## 🔧 Quick Fixes

### If status is always "active":
1. Check if `is_active` column exists in database
2. Run: `SELECT id, full_name, is_active FROM employees;` in Supabase SQL Editor
3. Verify the `is_active` value changed

### If UI doesn't update:
1. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
2. Check if the 300ms delay is enough (increase to 500ms if needed)
3. Verify `setEmployees([...data])` is creating a new array reference

### If console shows errors:
1. Check the error message
2. Verify Supabase connection
3. Check if employee ID is valid

## 📊 Expected Behavior

| Action | Database | API Response | UI Display |
|--------|----------|--------------|------------|
| Set to "Inactive" | `is_active: false` | `status: "inactive"` | Gray badge "Inactive" |
| Set to "On Leave" | `is_active: false` | `status: "inactive"` | Red badge "On Leave" |
| Set to "Active" | `is_active: true` | `status: "active"` | Blue badge "Active" |

**Note**: "On Leave" and "Inactive" both map to `is_active: false` in the database. The distinction is only maintained in the frontend during the edit session.

## 🎯 Success Criteria

✅ Status badge changes immediately after clicking "Update"
✅ Status persists after page refresh
✅ Active counter updates correctly
✅ Console logs show correct status values
✅ No errors in console
