# Implementation Plan: Payroll Edit and Delete Feature

## Overview

This implementation plan breaks down the payroll edit and delete feature into discrete coding tasks. The feature adds inline status editing via dropdown, comprehensive record editing through a modal, and safe deletion with confirmation. All operations maintain real-time synchronization with dashboard statistics.

## Tasks

- [x] 1. Create API endpoint for updating payroll records
  - Create `/api/payroll/[id]/route.ts` file
  - Implement PATCH handler to update existing payroll records
  - Implement DELETE handler to remove payroll records
  - Add input validation for PATCH requests (non-negative values, date ranges)
  - Add error handling with appropriate HTTP status codes
  - Return updated record on successful PATCH
  - Return success message on successful DELETE
  - _Requirements: 2.8, 3.6, 5.1, 5.2, 5.3, 5.7, 5.8_

- [ ] 2. Implement inline status editing with dropdown
  - [x] 2.1 Create StatusDropdown component
    - Create new component file for StatusDropdown
    - Accept recordId, currentStatus, onStatusChange, and disabled props
    - Use Radix UI DropdownMenu component
    - Display current status as clickable Badge with pointer cursor
    - Show "paid" and "pending" options in dropdown menu
    - Add check mark to indicate current status
    - Add hover states for dropdown items
    - _Requirements: 1.1, 1.7, 4.5_
  
  - [x] 2.2 Integrate StatusDropdown into payroll table
    - Replace static Badge in Status column with StatusDropdown component
    - Implement handleStatusChange function to call PATCH API
    - Add optimistic UI update (change badge immediately)
    - Add error handling to revert badge on failure
    - Display success toast on successful status change
    - Display error toast on failure
    - _Requirements: 1.2, 1.8, 1.9_
  
  - [x] 2.3 Update stats cards after status changes
    - Refactor stats calculation logic into reusable functions
    - Call fetchPayroll to refresh data after status change
    - Update Total Payroll card calculations
    - Update Pending Payments card count and amount
    - Update Employees card paid/pending breakdown
    - _Requirements: 1.3, 1.4, 1.5, 1.6, 5.5_

- [ ] 3. Implement edit payroll modal
  - [x] 3.1 Create EditPayrollModal component structure
    - Create new component file for EditPayrollModal
    - Accept open, onOpenChange, record, and onSuccess props
    - Use Dialog component from UI library
    - Set up react-hook-form for form management
    - Define EditFormData interface
    - _Requirements: 2.2_
  
  - [x] 3.2 Add form fields to EditPayrollModal
    - Add Period Start date input field
    - Add Period End date input field
    - Add Employee Name as read-only display field
    - Add Hourly Rate number input field
    - Add Hours Worked number input field
    - Add Base Amount display field (calculated)
    - Add Bonuses number input field
    - Add Deductions number input field
    - Add Total Amount display field (calculated)
    - Add Status select field (paid/pending)
    - Add Payment Date date input field
    - Pre-fill all fields with existing record data
    - _Requirements: 2.3, 2.4_
  
  - [x] 3.3 Implement auto-calculation logic in EditPayrollModal
    - Add onChange handler for Hours Worked field
    - Add onChange handler for Hourly Rate field
    - Calculate base_amount as (hourly_rate × hours_worked)
    - Add onChange handlers for Base Amount, Bonuses, and Deductions
    - Calculate total_amount as (base_amount + bonuses - deductions)
    - Display calculation breakdown (e.g., "₱200 × 40h = ₱8,000")
    - Update calculations in real-time as user types
    - _Requirements: 2.5, 2.6, 2.7_
  
  - [x] 3.4 Add validation to EditPayrollModal
    - Validate all numeric fields are non-negative
    - Validate period end is >= period start
    - Validate hourly rate is > 0
    - Display inline validation errors below fields
    - Highlight invalid fields with red border
    - Disable save button when validation errors exist
    - _Requirements: 5.8_
  
  - [x] 3.5 Connect EditPayrollModal to API and handle save
    - Implement handleSave function to call PATCH API endpoint
    - Send updated record data in request body
    - Show loading spinner on save button during API call
    - Disable save button during submission
    - Close modal on successful save
    - Display success toast notification
    - Call onSuccess callback to refresh payroll data
    - Display error toast on failure with user-friendly message
    - Keep modal open on error to allow retry
    - _Requirements: 2.8, 2.9, 2.10, 2.11_
  
  - [x] 3.6 Add cancel functionality to EditPayrollModal
    - Implement handleCancel function
    - Close modal without saving changes
    - Reset form to initial state
    - _Requirements: 2.12_

- [ ] 4. Implement delete confirmation dialog
  - [x] 4.1 Create DeleteConfirmationDialog component
    - Create new component file for DeleteConfirmationDialog
    - Accept open, onOpenChange, record, onConfirm, and loading props
    - Use Dialog component from UI library
    - Display title "Delete Payroll Record"
    - Display confirmation message with employee name
    - Display warning "This action cannot be undone"
    - Display record details summary (employee, period, amount, status)
    - _Requirements: 3.2, 3.3_
  
  - [x] 4.2 Add action buttons to DeleteConfirmationDialog
    - Add Cancel button (outline variant)
    - Add Delete button (destructive variant, red)
    - Implement handleCancel to close dialog without deleting
    - Show loading spinner on Delete button during operation
    - Disable buttons during deletion
    - _Requirements: 3.4, 3.5_
  
  - [x] 4.3 Connect DeleteConfirmationDialog to API
    - Implement handleDelete function to call DELETE API endpoint
    - Close dialog on successful deletion
    - Display success toast "Payroll record deleted successfully"
    - Call callback to refresh payroll data and remove row from table
    - Display error toast on failure
    - Keep dialog open on error to allow retry
    - _Requirements: 3.6, 3.10, 3.11, 3.12_
  
  - [x] 4.4 Update stats cards after deletion
    - Refresh payroll data after successful deletion
    - Update Total Payroll card to decrease by deleted amount
    - Update Pending Payments card if deleted record was pending
    - Update Employees card count and breakdown
    - _Requirements: 3.7, 3.8, 3.9, 5.5, 5.6_

- [ ] 5. Add Actions column to payroll table
  - [x] 5.1 Create ActionsColumn component
    - Create new component file for ActionsColumn
    - Accept record, onEdit, and onDelete props
    - Add Edit button with Pencil icon from lucide-react
    - Add Delete button with Trash2 icon from lucide-react
    - Use ghost variant for subtle appearance
    - Add hover states with background highlight
    - Add tooltips "Edit record" and "Delete record"
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.6, 4.7_
  
  - [x] 5.2 Integrate ActionsColumn into payroll table
    - Add Actions column as last column in table header
    - Add ActionsColumn component to each table row
    - Implement handleEdit function to open EditPayrollModal
    - Implement handleDelete function to open DeleteConfirmationDialog
    - Pass current record to modal/dialog handlers
    - _Requirements: 4.1_

- [x] 6. Add state management for modals and dialogs
  - Add showEditModal state variable
  - Add editingRecord state variable
  - Add editLoading state variable
  - Add showDeleteDialog state variable
  - Add deletingRecord state variable
  - Add deleteLoading state variable
  - Add statusUpdateLoading state object for tracking status updates
  - Implement state setters for opening/closing modals
  - _Requirements: 2.2, 3.2_

- [x] 7. Implement loading states and user feedback
  - Add loading spinner to status dropdown during update
  - Add loading spinner to save button in edit modal
  - Add loading spinner to delete button in confirmation dialog
  - Disable action buttons during operations to prevent duplicate submissions
  - Display all error messages in user-friendly language
  - Ensure no technical details are exposed in error messages
  - _Requirements: 4.8, 4.9, 4.10_

- [x] 8. Checkpoint - Test all functionality
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Add accessibility features
  - Ensure all interactive elements are keyboard accessible
  - Add aria-labels to all buttons
  - Associate labels with form fields
  - Add aria-busy attribute to loading spinners
  - Ensure focus indicators are visible on all interactive elements
  - Test tab order follows logical flow
  - Ensure Enter key submits forms and Escape key closes modals
  - _Requirements: 4.5, 4.6, 4.7_

- [x] 10. Final integration and polish
  - Test inline status editing end-to-end
  - Test edit modal with various data scenarios
  - Test delete confirmation with different record types
  - Verify stats cards update correctly after all operations
  - Test error handling for network failures
  - Test validation in edit modal
  - Verify optimistic UI updates and error reversion
  - Test with keyboard navigation only
  - Verify all toast notifications display correctly
  - _Requirements: 1.1-1.9, 2.1-2.12, 3.1-3.12, 4.1-4.10, 5.1-5.8_

- [x] 11. Final checkpoint - Verify all requirements
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- This feature uses TypeScript and React (Next.js framework)
- All components use existing UI library components (Radix UI, shadcn/ui)
- API endpoints follow Next.js App Router conventions
- Real-time stats updates are achieved by refetching data after operations
- Optimistic UI updates improve perceived performance
- Error handling maintains data consistency and provides clear user feedback
- No property-based tests are included as this feature involves specific UI interactions and CRUD operations
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and allow for user feedback
