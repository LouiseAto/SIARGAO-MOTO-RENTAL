# Bugfix Requirements Document

## Introduction

The payroll generation modal in the Siargao Moto Rental application has a bug where changing the Period End date does not automatically recalculate the salary totals for employees. Currently, the salary calculation only updates when the hours field is manually changed, but it should automatically recalculate based on the date range (Period Start to Period End) to determine the number of days worked, which then determines total hours and base salary amount.

This bug affects the payroll generation workflow, requiring manual intervention to update salary calculations when adjusting the pay period dates, leading to potential errors and inefficiency in payroll processing.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the user opens the "Generate Payroll" modal THEN the system displays default salary values (e.g., ₱18,000, ₱20,000) without calculating based on the default date range

1.2 WHEN the user changes the Period End date in the payroll generation modal THEN the system does not recalculate the salary totals (base amount and total amount remain unchanged)

1.3 WHEN the user changes the Period Start date in the payroll generation modal THEN the system does not recalculate the salary totals (base amount and total amount remain unchanged)

1.4 WHEN the date range changes but the hours field is not manually modified THEN the system continues to display outdated salary calculations that do not reflect the new pay period duration

### Expected Behavior (Correct)

2.1 WHEN the user opens the "Generate Payroll" modal THEN the system SHALL automatically calculate salary totals based on the default Period Start and Period End dates using the formula: (number of days between dates) × (hours per day) × (hourly rate ₱200)

2.2 WHEN the user changes the Period End date in the payroll generation modal THEN the system SHALL automatically recalculate the number of days in the pay period, update total hours as (number of days) × (hours per day), recalculate base amount as (hourly rate ₱200) × (total hours), and update the Total column as (base amount) + (bonuses) - (deductions)

2.3 WHEN the user changes the Period Start date in the payroll generation modal THEN the system SHALL automatically recalculate the number of days in the pay period, update total hours as (number of days) × (hours per day), recalculate base amount as (hourly rate ₱200) × (total hours), and update the Total column as (base amount) + (bonuses) - (deductions)

2.4 WHEN the date range changes (either Period Start or Period End) THEN the system SHALL immediately reflect the updated salary calculations without requiring manual modification of the hours field

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the user manually changes the hours field in the payroll generation modal THEN the system SHALL CONTINUE TO recalculate the base amount as (hourly rate) × (hours worked) and update the total amount

3.2 WHEN the user changes the hourly rate field in the payroll generation modal THEN the system SHALL CONTINUE TO recalculate the base amount as (hourly rate) × (hours worked) and update the total amount

3.3 WHEN the user changes the bonuses field in the payroll generation modal THEN the system SHALL CONTINUE TO recalculate the total amount as (base amount) + (bonuses) - (deductions)

3.4 WHEN the user changes the deductions field in the payroll generation modal THEN the system SHALL CONTINUE TO recalculate the total amount as (base amount) + (bonuses) - (deductions)

3.5 WHEN the payroll generation modal is opened and employees have a monthly_salary set THEN the system SHALL CONTINUE TO use the monthly_salary as the initial base_amount instead of calculating from hourly rate

3.6 WHEN generating payroll records via the "Generate Payroll" button THEN the system SHALL CONTINUE TO create payroll records for all active employees with the calculated values and save them to the database
