# Design Document: Payroll Edit and Delete Feature

## Overview

This design document specifies the technical implementation for adding Edit and Delete functionality to the payroll management system. The feature enables inline status editing via dropdown, full record editing through a modal dialog, and safe deletion with confirmation prompts. All operations maintain real-time synchronization with dashboard statistics and ensure data integrity.

### Goals

- Enable quick status updates through inline dropdown editing
- Provide comprehensive record editing through a modal interface
- Implement safe deletion with user confirmation
- Maintain real-time statistics updates across all dashboard cards
- Ensure data integrity and proper error handling

### Non-Goals

- Bulk editing or deletion of multiple payroll records
- Payroll record versioning or audit trail (future enhancement)
- Undo/redo functionality for edits and deletions
- Advanced filtering or sorting in the edit modal

## Architecture

### Component Structure

```
app/payroll/page.tsx (Enhanced)
├── PayrollTable
│   ├── StatusDropdown (New)
│   ├── ActionsColumn (New)
│   │   ├── EditButton
│   │   └── DeleteButton
│   └── TableRow
├── EditPayrollModal (New)
│   ├── Form Fields
│   ├── Auto-calculation Logic
│   └── Save/Cancel Actions
├── DeleteConfirmationDialog (New)
│   └── Confirm/Cancel Actions
└── StatsCards (Enhanced)
    ├── TotalPayrollCard
    ├── PendingPaymentsCard
    └── EmployeesCard
```

### API Endpoints

#### Update Payroll Record
```typescript
PATCH /api/payroll/[id]
Request Body: {
  period_start?: string
  period_end?: string
  hours_worked?: number
  hourly_rate?: number
  base_amount?: number
  bonuses?: number
  deductions?: number
  total_amount?: number
  status?: "paid" | "pending"
  payment_date?: string
}
Response: PayrollRecord
```

#### Delete Payroll Record
```typescript
DELETE /api/payroll/[id]
Response: { success: boolean, message: string }
```

### State Management

The payroll page maintains the following state:

```typescript
interface PayrollPageState {
  payroll: PayrollRecord[]           // All payroll records
  loading: boolean                   // Initial load state
  searchQuery: string                // Search filter
  statusFilter: string               // Status filter
  dateFilter: string                 // Date filter
  
  // Edit Modal State
  showEditModal: boolean
  editingRecord: PayrollRecord | null
  editLoading: boolean
  
  // Delete State
  showDeleteDialog: boolean
  deletingRecord: PayrollRecord | null
  deleteLoading: boolean
  
  // Status Update State
  statusUpdateLoading: Record<string, boolean>
}
```

## Components and Interfaces

### 1. StatusDropdown Component

**Purpose:** Inline status editing directly from the table

**Interface:**
```typescript
interface StatusDropdownProps {
  recordId: string
  currentStatus: "paid" | "pending"
  onStatusChange: (newStatus: "paid" | "pending") => Promise<void>
  disabled?: boolean
}
```

**Implementation Details:**
- Uses Radix UI DropdownMenu component
- Displays current status as a Badge with pointer cursor
- Shows "paid" and "pending" options in dropdown
- Triggers immediate API call on selection
- Shows loading spinner during update
- Reverts to previous status on error

**Visual Design:**
- Badge appearance matches existing status badges
- Dropdown appears below badge on click
- Check mark indicates current status
- Hover states for dropdown items

### 2. EditPayrollModal Component

**Purpose:** Comprehensive editing of payroll record details

**Interface:**
```typescript
interface EditPayrollModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: PayrollRecord | null
  onSuccess: () => void
}

interface EditFormData {
  period_start: string
  period_end: string
  hourly_rate: number
  hours_worked: number
  base_amount: number
  bonuses: number
  deductions: number
  total_amount: number
  status: "paid" | "pending"
  payment_date: string
}
```

**Form Fields:**
- Period Start (date input)
- Period End (date input)
- Employee Name (read-only, display only)
- Hourly Rate (number input, ₱)
- Hours Worked (number input)
- Base Amount (calculated, display with edit override)
- Bonuses (number input, ₱)
- Deductions (number input, ₱)
- Total Amount (calculated, display only)
- Status (select: paid/pending)
- Payment Date (date input)

**Auto-calculation Logic:**
```typescript
// When Hours or Hourly Rate changes
base_amount = hourly_rate × hours_worked

// When Base Amount, Bonuses, or Deductions change
total_amount = base_amount + bonuses - deductions
```

**Validation Rules:**
- All numeric fields must be non-negative
- Period end must be >= period start
- Payment date should not be in the future (warning only)
- Hours worked must be >= 0
- Hourly rate must be > 0

**Implementation Details:**
- Uses react-hook-form for form management
- Pre-fills all fields with existing record data
- Employee name is displayed but not editable
- Real-time calculation updates as user types
- Displays calculation breakdown (e.g., "₱200 × 40h = ₱8,000")
- Save button disabled during submission
- Shows loading spinner on save button during API call

### 3. DeleteConfirmationDialog Component

**Purpose:** Safe deletion with user confirmation

**Interface:**
```typescript
interface DeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: PayrollRecord | null
  onConfirm: () => Promise<void>
  loading: boolean
}
```

**Content:**
- Title: "Delete Payroll Record"
- Message: "Are you sure you want to delete this payroll record for [Employee Name]?"
- Warning: "This action cannot be undone."
- Record details summary:
  - Employee: [Name]
  - Period: [Start] - [End]
  - Amount: ₱[Total]
  - Status: [Badge]

**Actions:**
- Cancel button (outline variant)
- Delete button (destructive variant, red)
- Loading spinner on Delete button during operation

### 4. ActionsColumn Component

**Purpose:** Edit and Delete action buttons for each table row

**Interface:**
```typescript
interface ActionsColumnProps {
  record: PayrollRecord
  onEdit: (record: PayrollRecord) => void
  onDelete: (record: PayrollRecord) => void
}
```

**Implementation:**
- Two icon buttons side by side
- Edit button: Pencil icon (lucide-react)
- Delete button: Trash2 icon (lucide-react)
- Buttons use ghost variant for subtle appearance
- Hover states show background highlight
- Tooltips on hover: "Edit record" / "Delete record"

### 5. Enhanced StatsCards

**Purpose:** Real-time statistics that update after any data operation

**Calculations:**
```typescript
// Total Payroll Card
totalPayroll = sum(all payroll records total_amount)
paidTotal = sum(paid records total_amount)
pendingTotal = sum(pending records total_amount)

// Pending Payments Card
pendingCount = count(records where status = "pending")
pendingAmount = sum(pending records total_amount)

// Employees Card
totalEmployees = count(unique employee_ids in payroll)
paidEmployees = count(unique employee_ids where all records are paid)
pendingEmployees = count(unique employee_ids with at least one pending record)
```

**Update Triggers:**
- After successful status change
- After successful edit save
- After successful deletion
- After initial data fetch

## Data Models

### PayrollRecord (Enhanced)

```typescript
interface PayrollRecord {
  id: string                    // UUID
  employee_id: string           // UUID, foreign key to employees
  employee_name?: string        // Joined from employees table
  period_start: string          // ISO date string
  period_end: string            // ISO date string
  hours_worked: number | null   // Decimal, nullable
  base_amount: number           // Decimal
  bonuses: number               // Decimal, default 0
  deductions: number            // Decimal, default 0
  total_amount: number          // Decimal
  payment_date: string          // ISO date string
  status: "paid" | "pending"    // Payment status
  notes?: string                // Optional notes
  created_at: string            // Timestamp
  updated_at: string            // Timestamp
  employees?: {                 // Joined employee data
    id: string
    full_name: string
    hourly_rate?: number
    monthly_salary?: number
  }
}
```

### API Request/Response Models

#### Update Payroll Request
```typescript
interface UpdatePayrollRequest {
  period_start?: string
  period_end?: string
  hours_worked?: number
  base_amount?: number
  bonuses?: number
  deductions?: number
  total_amount?: number
  status?: "paid" | "pending"
  payment_date?: string
  notes?: string
}
```

#### Update Payroll Response
```typescript
interface UpdatePayrollResponse {
  id: string
  employee_id: string
  period_start: string
  period_end: string
  hours_worked: number | null
  base_amount: number
  bonuses: number
  deductions: number
  total_amount: number
  payment_date: string
  status: "paid" | "pending"
  notes: string | null
  updated_at: string
}
```

#### Delete Payroll Response
```typescript
interface DeletePayrollResponse {
  success: boolean
  message: string
}
```

## Testing Strategy

This feature involves UI interactions, database CRUD operations, and state management. Property-based testing is **not appropriate** for this feature because:

1. **UI Interactions**: Dropdown menus, modal dialogs, and button clicks are specific user interactions, not universal properties
2. **Database CRUD**: Edit and delete operations are specific actions with concrete outcomes
3. **State Management**: Real-time updates to statistics are deterministic based on specific data changes

### Testing Approach

#### Unit Tests

**Component Tests:**
- StatusDropdown renders correctly with current status
- StatusDropdown calls onStatusChange with correct value
- EditPayrollModal pre-fills form with record data
- EditPayrollModal calculates base_amount correctly when hours/rate change
- EditPayrollModal calculates total_amount correctly
- EditPayrollModal validates non-negative values
- DeleteConfirmationDialog displays correct employee name and details
- ActionsColumn renders edit and delete buttons

**Calculation Tests:**
- Base amount calculation: `hourly_rate × hours_worked`
- Total amount calculation: `base_amount + bonuses - deductions`
- Stats calculations: total payroll, pending count, paid count

**Validation Tests:**
- Negative values are rejected
- Period end before period start is rejected
- Zero or negative hourly rate is rejected

#### Integration Tests

**API Endpoint Tests:**
- PATCH /api/payroll/[id] updates record successfully
- PATCH /api/payroll/[id] returns 404 for non-existent record
- PATCH /api/payroll/[id] validates input data
- DELETE /api/payroll/[id] removes record successfully
- DELETE /api/payroll/[id] returns 404 for non-existent record

**End-to-End Tests:**
- User can change status via dropdown and stats update
- User can edit record via modal and changes persist
- User can delete record via confirmation dialog
- Error messages display correctly on API failures
- Loading states display during operations

#### Manual Testing Checklist

- [ ] Status dropdown opens on badge click
- [ ] Status change updates badge immediately
- [ ] Status change updates all stats cards
- [ ] Edit modal opens with pre-filled data
- [ ] Auto-calculations work in edit modal
- [ ] Edit saves successfully and updates table
- [ ] Delete confirmation shows correct details
- [ ] Delete removes record and updates stats
- [ ] Error toasts display on failures
- [ ] Loading spinners show during operations
- [ ] Cancel buttons close modals without saving
- [ ] Validation prevents invalid data submission

## Error Handling

### Error Scenarios and Responses

#### 1. Status Update Failure

**Scenario:** API call to update status fails

**Handling:**
- Revert badge to previous status
- Display error toast: "Failed to update status. Please try again."
- Log error to console for debugging
- Do not update stats cards

#### 2. Edit Save Failure

**Scenario:** API call to save edited record fails

**Handling:**
- Keep modal open with current form data
- Display error toast with specific message if available
- Generic message: "Failed to save changes. Please try again."
- Highlight validation errors if returned from API
- Do not close modal or update table

#### 3. Delete Failure

**Scenario:** API call to delete record fails

**Handling:**
- Keep confirmation dialog open
- Display error toast: "Failed to delete record. Please try again."
- Log error to console
- Do not remove record from table or update stats

#### 4. Network Errors

**Scenario:** Network request fails or times out

**Handling:**
- Display error toast: "Network error. Please check your connection."
- Maintain current UI state
- Allow user to retry operation

#### 5. Validation Errors

**Scenario:** User submits invalid data in edit modal

**Handling:**
- Display inline validation errors below fields
- Disable save button until errors are resolved
- Highlight invalid fields with red border
- Show specific error messages:
  - "Value must be non-negative"
  - "Period end must be after period start"
  - "Hourly rate must be greater than zero"

### Error Response Format

```typescript
interface ErrorResponse {
  error: string              // User-friendly error message
  details?: string           // Technical details (optional)
  field?: string             // Field name for validation errors
  code?: string              // Error code for client handling
}
```

### Error Logging

All errors should be logged to console with context:

```typescript
console.error('Payroll status update failed:', {
  recordId: record.id,
  oldStatus: previousStatus,
  newStatus: attemptedStatus,
  error: error.message
})
```

## Implementation Plan

### Phase 1: API Endpoints (Backend)

1. Create `/api/payroll/[id]/route.ts`
2. Implement PATCH handler for updates
3. Implement DELETE handler for deletion
4. Add validation middleware
5. Add error handling
6. Test endpoints with Postman/curl

### Phase 2: Status Dropdown (Frontend)

1. Create StatusDropdown component
2. Integrate with existing Badge component
3. Implement status change handler
4. Add optimistic UI updates
5. Add error handling and revert logic
6. Test inline status changes

### Phase 3: Edit Modal (Frontend)

1. Create EditPayrollModal component
2. Implement form with react-hook-form
3. Add auto-calculation logic
4. Implement validation rules
5. Connect to PATCH API endpoint
6. Add loading and error states
7. Test edit functionality

### Phase 4: Delete Confirmation (Frontend)

1. Create DeleteConfirmationDialog component
2. Add record details display
3. Connect to DELETE API endpoint
4. Add loading and error states
5. Test delete functionality

### Phase 5: Actions Column (Frontend)

1. Add Actions column to payroll table
2. Create ActionsColumn component
3. Add Edit and Delete buttons
4. Connect to modal/dialog handlers
5. Add hover states and tooltips

### Phase 6: Stats Updates (Frontend)

1. Refactor stats calculation logic
2. Create updateStats helper function
3. Call updateStats after each operation
4. Test stats accuracy after operations

### Phase 7: Testing & Polish

1. Write unit tests for components
2. Write integration tests for API
3. Perform manual testing
4. Fix bugs and edge cases
5. Add loading states and animations
6. Optimize performance

## Security Considerations

### Authentication & Authorization

- All API endpoints require authenticated user
- Verify user has permission to edit/delete payroll records
- Use Supabase RLS policies to enforce access control

### Input Validation

- Validate all numeric inputs are non-negative
- Sanitize string inputs to prevent XSS
- Validate date formats and ranges
- Enforce business rules (e.g., period end >= period start)

### Data Integrity

- Use database transactions for updates
- Prevent concurrent modifications with optimistic locking
- Validate foreign key constraints (employee_id exists)
- Maintain referential integrity on deletion

### Audit Trail (Future Enhancement)

- Log all edit and delete operations
- Store user ID, timestamp, and changed fields
- Enable audit trail for compliance

## Performance Considerations

### Optimizations

1. **Optimistic UI Updates**: Update UI immediately, revert on error
2. **Debounced Calculations**: Debounce auto-calculations in edit modal
3. **Memoized Stats**: Use React.useMemo for stats calculations
4. **Efficient Re-renders**: Use React.memo for table rows
5. **Batch Updates**: Batch multiple state updates together

### Database Queries

- Use indexed columns for WHERE clauses (id, employee_id, status)
- Fetch only necessary fields in SELECT statements
- Use database-level calculations where possible

### Network Optimization

- Minimize payload size in API requests
- Use HTTP caching headers appropriately
- Implement request cancellation for abandoned operations

## Accessibility

### Keyboard Navigation

- All interactive elements are keyboard accessible
- Tab order follows logical flow
- Enter key submits forms
- Escape key closes modals/dialogs

### Screen Readers

- All buttons have aria-labels
- Form fields have associated labels
- Error messages are announced
- Loading states are announced

### Visual Accessibility

- Sufficient color contrast for all text
- Focus indicators on all interactive elements
- Error states use color + icon + text
- Loading spinners have aria-busy attribute

## Future Enhancements

1. **Bulk Operations**: Edit or delete multiple records at once
2. **Audit Trail**: Track all changes with user and timestamp
3. **Undo/Redo**: Allow users to undo recent changes
4. **Advanced Validation**: Business rule validation (e.g., prevent editing paid records)
5. **Export**: Export edited records to CSV/PDF
6. **Notifications**: Email notifications for status changes
7. **Permissions**: Role-based access control for edit/delete
8. **Version History**: View previous versions of a record

## Conclusion

This design provides a comprehensive solution for editing and deleting payroll records with inline status updates, full record editing, and safe deletion. The implementation maintains data integrity, provides excellent user experience with real-time updates, and includes robust error handling. The modular component structure allows for easy testing and future enhancements.
