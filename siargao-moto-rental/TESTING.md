# 🧪 Testing Guide

## Manual Testing Procedures

This guide provides comprehensive testing procedures for the Siargao Moto Rental Management System.

## Pre-Testing Setup

1. Ensure the application is running locally
2. Have admin credentials ready
3. Clear browser cache and cookies
4. Open browser developer tools (F12)

---

## 1. Authentication Testing

### Test Case 1.1: Login with Valid Credentials

**Steps:**
1. Navigate to `http://localhost:3000`
2. Should redirect to `/login`
3. Enter valid admin email and password
4. Click "Login"

**Expected Result:**
- ✅ Redirects to `/dashboard`
- ✅ Navbar appears with navigation items
- ✅ No console errors

### Test Case 1.2: Login with Invalid Credentials

**Steps:**
1. Navigate to `/login`
2. Enter invalid email/password
3. Click "Login"

**Expected Result:**
- ✅ Error message displayed
- ✅ Remains on login page
- ✅ Form fields retain values

### Test Case 1.3: Logout

**Steps:**
1. While logged in, click "Logout" button in navbar
2. Observe behavior

**Expected Result:**
- ✅ Redirects to `/login`
- ✅ Session cleared
- ✅ Cannot access protected routes

### Test Case 1.4: Protected Route Access

**Steps:**
1. Logout if logged in
2. Try to access `/dashboard` directly

**Expected Result:**
- ✅ Redirects to `/login`
- ✅ Cannot access without authentication

---

## 2. Dashboard Testing

### Test Case 2.1: Dashboard Statistics

**Steps:**
1. Login and navigate to `/dashboard`
2. Observe statistics cards

**Expected Result:**
- ✅ Total Motorbikes count displayed
- ✅ Available count displayed
- ✅ Active Rentals count displayed
- ✅ Active Employees count displayed
- ✅ Numbers match database records

### Test Case 2.2: Recent Rentals Table

**Steps:**
1. On dashboard, scroll to "Recent Rentals" section
2. Verify table data

**Expected Result:**
- ✅ Shows up to 5 recent rentals
- ✅ Customer names displayed
- ✅ Motorbike details shown
- ✅ Dates formatted correctly
- ✅ Status badges colored appropriately

---

## 3. Motorbike Management Testing

### Test Case 3.1: View Motorbikes List

**Steps:**
1. Click "Motorbikes" in navbar
2. Observe the table

**Expected Result:**
- ✅ All motorbikes listed
- ✅ Columns: Brand, Model, Year, Plate Number, Color, Daily Rate, Status
- ✅ Status badges colored (green=available, orange=rented, red=maintenance)
- ✅ Edit and Delete buttons visible

### Test Case 3.2: Add New Motorbike

**Steps:**
1. Click "+ Add Motorbike" button
2. Fill in all required fields:
   - Brand: "Honda"
   - Model: "PCX 160"
   - Year: 2024
   - Plate Number: "TEST-001"
   - Color: "White"
   - Daily Rate: 700
   - Status: Available
   - Latitude: 9.86
   - Longitude: 126.05
3. Click "Create"

**Expected Result:**
- ✅ Modal closes
- ✅ New motorbike appears in table
- ✅ Success feedback (table refreshes)
- ✅ No console errors

### Test Case 3.3: Edit Motorbike

**Steps:**
1. Click "Edit" on any motorbike
2. Change daily rate to 800
3. Click "Update"

**Expected Result:**
- ✅ Modal closes
- ✅ Changes reflected in table
- ✅ Updated timestamp changed

### Test Case 3.4: Delete Motorbike

**Steps:**
1. Click "Delete" on a motorbike (not currently rented)
2. Confirm deletion

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ Motorbike removed from table
- ✅ Count updated

### Test Case 3.5: Form Validation

**Steps:**
1. Click "+ Add Motorbike"
2. Try to submit with empty required fields
3. Try to submit with invalid year (e.g., 1800)

**Expected Result:**
- ✅ Form validation prevents submission
- ✅ Error messages displayed
- ✅ Invalid fields highlighted

---

## 4. Rental Management Testing

### Test Case 4.1: View Rentals List

**Steps:**
1. Click "Rentals" in navbar
2. Observe the table

**Expected Result:**
- ✅ All rentals listed
- ✅ Customer and motorbike details shown
- ✅ Dates formatted correctly
- ✅ Total cost displayed with currency
- ✅ Status badges visible

### Test Case 4.2: Create New Rental

**Steps:**
1. Click "+ Add Rental"
2. Select an available motorbike
3. Select a customer (or create new)
4. Set start date: Today
5. Set end date: 3 days from today
6. Observe daily rate auto-filled
7. Observe total cost calculated
8. Set deposit: 1000
9. Click "Create"

**Expected Result:**
- ✅ Daily rate auto-populated from motorbike
- ✅ Total cost calculated automatically (3 days × daily rate)
- ✅ Rental created successfully
- ✅ Motorbike status changed to "rented"
- ✅ Rental appears in table

### Test Case 4.3: Create New Customer During Rental

**Steps:**
1. Click "+ Add Rental"
2. Click "+ New Customer" link
3. Fill customer details:
   - Full Name: "Test Customer"
   - Phone: "+63-999-999-9999"
   - Email: "test@example.com"
4. Click "Create Customer"
5. Verify customer auto-selected in rental form

**Expected Result:**
- ✅ Customer modal opens
- ✅ Customer created successfully
- ✅ Customer auto-selected in dropdown
- ✅ Can proceed with rental creation

### Test Case 4.4: Update Rental Status

**Steps:**
1. Click "Edit" on an active rental
2. Change status to "completed"
3. Click "Update"

**Expected Result:**
- ✅ Rental status updated
- ✅ Motorbike status changed back to "available"
- ✅ Changes reflected immediately

### Test Case 4.5: Rental Cost Calculation

**Steps:**
1. Create rental with:
   - Start: 2024-01-01
   - End: 2024-01-05
   - Daily Rate: 500
2. Verify total cost

**Expected Result:**
- ✅ Total cost = 2,500 (5 days × 500)
- ✅ Calculation includes both start and end dates

---

## 5. Employee Management Testing

### Test Case 5.1: View Employees List

**Steps:**
1. Click "Employees" in navbar
2. Observe the table

**Expected Result:**
- ✅ All employees listed
- ✅ Columns: Name, Email, Phone, Role, Hire Date, Salary, Status
- ✅ Role badges displayed
- ✅ Active/Inactive status shown

### Test Case 5.2: Add New Employee

**Steps:**
1. Click "+ Add Employee"
2. Fill in details:
   - Full Name: "Test Employee"
   - Email: "employee@test.com"
   - Phone: "+63-999-888-7777"
   - Role: Staff
   - Hire Date: Today
   - Monthly Salary: 20000
   - Active: Checked
3. Click "Create"

**Expected Result:**
- ✅ Employee created successfully
- ✅ Appears in table
- ✅ All fields displayed correctly

### Test Case 5.3: Edit Employee

**Steps:**
1. Click "Edit" on an employee
2. Change monthly salary to 22000
3. Click "Update"

**Expected Result:**
- ✅ Changes saved
- ✅ New salary displayed in table

### Test Case 5.4: Deactivate Employee

**Steps:**
1. Click "Edit" on an employee
2. Uncheck "Active Employee"
3. Click "Update"

**Expected Result:**
- ✅ Status changes to "Inactive"
- ✅ Status badge changes color
- ✅ Employee no longer appears in payroll dropdown

---

## 6. Payroll Management Testing

### Test Case 6.1: View Payroll Records

**Steps:**
1. Click "Payroll" in navbar
2. Observe the table

**Expected Result:**
- ✅ All payroll records listed
- ✅ Employee names shown
- ✅ Period dates displayed
- ✅ Amounts formatted as currency
- ✅ Total amount calculated correctly

### Test Case 6.2: Create Payroll Record

**Steps:**
1. Click "+ Add Payroll"
2. Select an active employee
3. Observe base amount auto-filled
4. Set period:
   - Start: First day of current month
   - End: Last day of current month
5. Add bonuses: 2000
6. Add deductions: 500
7. Observe total amount calculation
8. Set payment date: Today
9. Click "Create"

**Expected Result:**
- ✅ Base amount auto-filled from employee salary
- ✅ Total = Base + Bonuses - Deductions
- ✅ Payroll record created
- ✅ Appears in table

### Test Case 6.3: Payroll Calculation

**Steps:**
1. Create payroll with:
   - Base: 20000
   - Bonuses: 3000
   - Deductions: 1500
2. Verify total

**Expected Result:**
- ✅ Total = 21,500 (20000 + 3000 - 1500)
- ✅ Calculation updates in real-time

---

## 7. Map Testing

### Test Case 7.1: View Map

**Steps:**
1. Click "Map" in navbar
2. Wait for map to load

**Expected Result:**
- ✅ Map loads successfully
- ✅ Centered on Siargao (9.86, 126.05)
- ✅ Markers displayed for all motorbikes with coordinates
- ✅ Marker colors match status (green/orange/red)

### Test Case 7.2: Marker Interaction

**Steps:**
1. Click on a marker
2. Observe popup

**Expected Result:**
- ✅ Popup opens
- ✅ Shows motorbike details (brand, model, plate)
- ✅ Shows daily rate
- ✅ Shows status with colored badge
- ✅ Shows coordinates

### Test Case 7.3: Map Statistics

**Steps:**
1. Scroll down to statistics cards below map
2. Verify counts

**Expected Result:**
- ✅ Available count matches green markers
- ✅ Rented count matches orange markers
- ✅ Maintenance count matches red markers

---

## 8. Responsive Design Testing

### Test Case 8.1: Mobile View (375px)

**Steps:**
1. Open browser DevTools
2. Set viewport to iPhone SE (375px)
3. Navigate through all pages

**Expected Result:**
- ✅ Navbar collapses appropriately
- ✅ Tables scroll horizontally
- ✅ Forms stack vertically
- ✅ Buttons remain accessible
- ✅ No horizontal overflow

### Test Case 8.2: Tablet View (768px)

**Steps:**
1. Set viewport to iPad (768px)
2. Navigate through all pages

**Expected Result:**
- ✅ Layout adjusts appropriately
- ✅ Statistics cards in 2 columns
- ✅ Forms use grid layout
- ✅ All features accessible

### Test Case 8.3: Desktop View (1920px)

**Steps:**
1. Set viewport to 1920px
2. Navigate through all pages

**Expected Result:**
- ✅ Full layout displayed
- ✅ Statistics cards in 4 columns
- ✅ Tables fully visible
- ✅ Optimal spacing

---

## 9. Error Handling Testing

### Test Case 9.1: Network Error

**Steps:**
1. Open DevTools > Network tab
2. Set throttling to "Offline"
3. Try to create a motorbike

**Expected Result:**
- ✅ Error message displayed
- ✅ Form data preserved
- ✅ User can retry

### Test Case 9.2: Duplicate Entry

**Steps:**
1. Try to create motorbike with existing plate number

**Expected Result:**
- ✅ Error message displayed
- ✅ Indicates duplicate plate number
- ✅ Form remains open

### Test Case 9.3: Invalid Date Range

**Steps:**
1. Create rental with end date before start date

**Expected Result:**
- ✅ Validation error
- ✅ Cannot submit form
- ✅ Error message clear

---

## 10. Performance Testing

### Test Case 10.1: Page Load Time

**Steps:**
1. Open DevTools > Network tab
2. Hard refresh each page
3. Note load times

**Expected Result:**
- ✅ Dashboard loads < 2 seconds
- ✅ List pages load < 1 second
- ✅ Map loads < 3 seconds

### Test Case 10.2: Large Dataset

**Steps:**
1. Add 50+ motorbikes
2. Navigate to motorbikes page
3. Observe performance

**Expected Result:**
- ✅ Table renders smoothly
- ✅ No lag when scrolling
- ✅ Search/filter responsive

---

## 11. Security Testing

### Test Case 11.1: SQL Injection

**Steps:**
1. Try entering `'; DROP TABLE motorbikes; --` in form fields
2. Submit form

**Expected Result:**
- ✅ Input sanitized
- ✅ No database damage
- ✅ Validation catches malicious input

### Test Case 11.2: XSS Attack

**Steps:**
1. Try entering `<script>alert('XSS')</script>` in text fields
2. Submit and view data

**Expected Result:**
- ✅ Script not executed
- ✅ Text displayed as plain text
- ✅ No alert appears

### Test Case 11.3: Direct API Access

**Steps:**
1. Logout
2. Try to access `/api/motorbikes` directly

**Expected Result:**
- ✅ Unauthorized error
- ✅ No data returned
- ✅ RLS policies enforced

---

## 12. Browser Compatibility Testing

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

All features should work consistently across browsers.

---

## Bug Reporting Template

When you find a bug, report it with:

```markdown
**Bug Title**: Brief description

**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected Behavior**: What should happen

**Actual Behavior**: What actually happens

**Screenshots**: If applicable

**Environment**:
- Browser: Chrome 120
- OS: Windows 11
- Screen Size: 1920x1080

**Console Errors**: Any errors from browser console
```

---

## Automated Testing (Future)

### Recommended Tools

1. **Unit Tests**: Jest, React Testing Library
2. **E2E Tests**: Playwright, Cypress
3. **API Tests**: Supertest
4. **Performance**: Lighthouse CI

### Example Test Structure

```typescript
// __tests__/motorbikes.test.ts
describe('Motorbike Management', () => {
  it('should create a new motorbike', async () => {
    // Test implementation
  })
  
  it('should update motorbike details', async () => {
    // Test implementation
  })
  
  it('should delete a motorbike', async () => {
    // Test implementation
  })
})
```

---

## Testing Checklist

Before deployment, ensure:

- [ ] All authentication flows work
- [ ] All CRUD operations functional
- [ ] Calculations are accurate
- [ ] Map displays correctly
- [ ] Forms validate properly
- [ ] Error handling works
- [ ] Responsive on all devices
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Security measures active

---

**Happy Testing!** 🧪
