# Payroll Date Calculation Fix - Bugfix Design

## Overview

The payroll generation modal in the Siargao Moto Rental application fails to automatically recalculate salary totals when the Period Start or Period End dates change. The bug occurs because the calculation logic is only triggered by manual changes to the hours field, not by date changes. This fix will add date-based auto-calculation that triggers on modal open and whenever either date field changes, using the formula: (days between dates) × (hours per day) × (₱200/hr).

The fix approach is to:
1. Add a `useEffect` hook that watches `periodStart` and `periodEnd` state changes
2. Calculate the number of days between dates when either date changes
3. Auto-update hours_worked for each employee based on days × hours_per_day (default 8)
4. Leverage existing `updatePayrollItem` logic to recalculate base_amount and total_amount
5. Preserve monthly_salary employees by checking if they have a monthly_salary set

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when Period Start or Period End dates change in the payroll generation modal
- **Property (P)**: The desired behavior when dates change - salary totals should automatically recalculate based on the new date range
- **Preservation**: Existing manual field change behavior (hours, rate, bonuses, deductions) that must remain unchanged by the fix
- **updatePayrollItem**: The function in `app/payroll/page.tsx` that recalculates salary values when fields change
- **payrollData**: State array containing salary calculation data for each employee in the modal
- **periodStart/periodEnd**: State variables holding the pay period date range
- **hours_worked**: The total hours an employee worked, calculated as (days × hours_per_day)
- **base_amount**: The base salary calculated as (hourly_rate × hours_worked) or monthly_salary
- **monthly_salary**: Fixed monthly salary for employees who are not paid hourly

## Bug Details

### Bug Condition

The bug manifests when a user changes the Period Start or Period End date in the "Generate Payroll" modal. The `updatePayrollItem` function correctly recalculates salary values when the hours_worked or hourly_rate fields are manually changed, but there is no mechanism to trigger recalculation when the date range changes. Additionally, when the modal first opens, the default date range is set but no initial calculation is performed.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type { action: string, periodStart: string, periodEnd: string }
  OUTPUT: boolean
  
  RETURN (input.action == 'modalOpen' AND input.periodStart != '' AND input.periodEnd != '')
         OR (input.action == 'dateChange' AND (input.periodStart != previousPeriodStart OR input.periodEnd != previousPeriodEnd))
         AND salaryTotalsNotRecalculated()
END FUNCTION
```

### Examples

- **Modal Open**: User clicks "Generate Payroll" button → modal opens with default dates (e.g., Jan 1 - Jan 31) → salary fields show ₱0 or monthly_salary instead of calculated values based on 31 days
- **Period End Change**: User changes Period End from Jan 31 to Jan 15 → salary totals remain at ₱18,000 instead of recalculating to ₱9,600 (15 days × 8 hrs × ₱200)
- **Period Start Change**: User changes Period Start from Jan 1 to Jan 10 → salary totals remain unchanged instead of recalculating to ₱17,600 (22 days × 8 hrs × ₱200)
- **Edge Case - Same Day**: User sets Period Start and Period End to the same date (Jan 15 - Jan 15) → should calculate 1 day of work (8 hrs × ₱200 = ₱1,600)

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Manual changes to the hours_worked field must continue to recalculate base_amount and total_amount
- Manual changes to the hourly_rate field must continue to recalculate base_amount and total_amount
- Manual changes to the bonuses field must continue to recalculate total_amount
- Manual changes to the deductions field must continue to recalculate total_amount
- Employees with monthly_salary set must continue to use monthly_salary as the initial base_amount
- The "Generate Payroll" button must continue to create payroll records with the calculated values

**Scope:**
All inputs that do NOT involve changing the Period Start or Period End dates should be completely unaffected by this fix. This includes:
- Manual input field changes (hours, rate, bonuses, deductions)
- The payroll generation submission process
- The display and formatting of salary values
- The CSV export functionality
- The filter and search functionality

## Hypothesized Root Cause

Based on the bug description and code analysis, the most likely issues are:

1. **Missing Date Change Handler**: The component has no `useEffect` hook or event handler that watches for changes to `periodStart` or `periodEnd` state variables. When these dates change, no recalculation is triggered.

2. **No Initial Calculation on Modal Open**: When `handleOpenGenerateModal` is called, it sets the default dates and calls `fetchEmployees`, which initializes `payrollData` with `hours_worked: 0`. There is no subsequent calculation to set hours_worked based on the default date range.

3. **Calculation Logic Only in updatePayrollItem**: The salary recalculation logic exists only in `updatePayrollItem`, which is called when input fields change. There is no mechanism to call this function or perform similar calculations when dates change.

4. **No Date-to-Hours Conversion**: The codebase lacks a utility function to calculate the number of days between two dates and convert that to hours_worked (days × hours_per_day).

## Correctness Properties

Property 1: Bug Condition - Auto-Calculate on Date Change

_For any_ date change where either periodStart or periodEnd is modified (or when the modal opens with default dates), the fixed component SHALL calculate the number of days between the dates, update hours_worked as (days × 8 hours_per_day), recalculate base_amount as (hourly_rate × hours_worked), and update total_amount as (base_amount + bonuses - deductions) for all hourly employees.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

Property 2: Preservation - Manual Field Changes

_For any_ manual input field change (hours_worked, hourly_rate, bonuses, deductions) that is NOT triggered by a date change, the fixed component SHALL produce exactly the same recalculation behavior as the original component, preserving the existing updatePayrollItem logic and calculation formulas.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `siargao-moto-rental/app/payroll/page.tsx`

**Function**: Add new `useEffect` hook and helper function

**Specific Changes**:

1. **Add Date Calculation Helper Function**: Create a function `calculateDaysBetween(startDate: string, endDate: string): number` that:
   - Parses the two date strings
   - Calculates the difference in milliseconds
   - Converts to days (inclusive, so Jan 1 - Jan 1 = 1 day)
   - Returns the number of days

2. **Add useEffect Hook for Date Changes**: Add a `useEffect` hook that:
   - Depends on `[periodStart, periodEnd, employees]`
   - Triggers when any of these values change
   - Calculates days between periodStart and periodEnd
   - For each employee in payrollData:
     - If employee has monthly_salary, skip auto-calculation (preserve monthly_salary behavior)
     - Otherwise, calculate hours_worked as (days × 8)
     - Call `updatePayrollItem(employeeId, 'hours_worked', calculatedHours)` to trigger recalculation

3. **Modify fetchEmployees**: Update the `fetchEmployees` function to:
   - Keep the existing initialization logic
   - Remove the manual setting of hours_worked to 0 (let the useEffect handle it)
   - Or set hours_worked to 0 initially and let useEffect immediately recalculate

4. **Handle Edge Cases**:
   - If periodStart or periodEnd is empty, skip calculation
   - If periodEnd is before periodStart, treat as 0 days or show validation error
   - If dates are the same, calculate as 1 day (inclusive)

5. **Preserve Monthly Salary Logic**: Ensure employees with monthly_salary set are not affected by the auto-calculation:
   - Check if employee has monthly_salary before updating hours_worked
   - Skip the auto-calculation for monthly_salary employees

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that simulate opening the modal and changing dates, then assert that salary calculations are updated. Run these tests on the UNFIXED code to observe failures and understand the root cause.

**Test Cases**:
1. **Modal Open Test**: Open modal with default dates (Jan 1 - Jan 31) → assert hours_worked is 0 and base_amount is 0 or monthly_salary (will fail - should be 248 hours and ₱49,600 for hourly employees)
2. **Period End Change Test**: Change Period End from Jan 31 to Jan 15 → assert salary totals remain unchanged (will fail - should recalculate to 15 days)
3. **Period Start Change Test**: Change Period Start from Jan 1 to Jan 10 → assert salary totals remain unchanged (will fail - should recalculate to 22 days)
4. **Same Day Test**: Set both dates to Jan 15 → assert salary calculates for 1 day (may fail - should be 8 hours × ₱200 = ₱1,600)

**Expected Counterexamples**:
- Salary totals do not update when dates change
- Modal opens with hours_worked = 0 instead of calculated hours based on default date range
- Possible causes: missing useEffect hook, no date-to-hours conversion, calculation only triggered by manual field changes

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := handleDateChange_fixed(input.periodStart, input.periodEnd)
  ASSERT expectedBehavior(result)
  // Expected: hours_worked updated, base_amount recalculated, total_amount updated
END FOR
```

**Test Cases**:
1. **Auto-Calculate on Modal Open**: Open modal → verify hours_worked is calculated based on default date range
2. **Recalculate on Period End Change**: Change Period End → verify salary totals update immediately
3. **Recalculate on Period Start Change**: Change Period Start → verify salary totals update immediately
4. **Handle Same Day Range**: Set dates to same day → verify 1 day calculation
5. **Handle Empty Dates**: Clear a date field → verify no crash, graceful handling
6. **Handle Invalid Range**: Set Period End before Period Start → verify 0 days or validation error

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT handleFieldChange_original(input) = handleFieldChange_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-date-change inputs

**Test Plan**: Observe behavior on UNFIXED code first for manual field changes, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Hours Field Preservation**: Manually change hours_worked field → verify base_amount and total_amount recalculate correctly (same as before fix)
2. **Hourly Rate Preservation**: Manually change hourly_rate field → verify base_amount and total_amount recalculate correctly (same as before fix)
3. **Bonuses Field Preservation**: Manually change bonuses field → verify total_amount recalculates correctly (same as before fix)
4. **Deductions Field Preservation**: Manually change deductions field → verify total_amount recalculates correctly (same as before fix)
5. **Monthly Salary Preservation**: Verify employees with monthly_salary set continue to use monthly_salary as base_amount, not auto-calculated hourly values
6. **Generate Payroll Preservation**: Click "Generate Payroll" button → verify payroll records are created correctly (same as before fix)

### Unit Tests

- Test `calculateDaysBetween` helper function with various date ranges (same day, 1 month, leap year, invalid dates)
- Test date change handler with different date combinations
- Test that monthly_salary employees are skipped in auto-calculation
- Test edge cases (empty dates, invalid ranges, same day)
- Test that manual field changes still trigger recalculation

### Property-Based Tests

- Generate random date ranges and verify hours_worked is calculated correctly as (days × 8)
- Generate random employee configurations (hourly vs monthly_salary) and verify correct calculation logic is applied
- Generate random manual field changes and verify preservation of existing recalculation behavior
- Test that for any valid date range, the calculation produces consistent results

### Integration Tests

- Test full modal workflow: open modal → verify auto-calculation → change dates → verify recalculation → change manual fields → verify preservation → generate payroll → verify records created
- Test switching between employees in the modal and verifying calculations are correct for each
- Test that the CSV export includes correctly calculated values after date changes
- Test that filter and search functionality continues to work after the fix
