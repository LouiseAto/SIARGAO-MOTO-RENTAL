# 💰 Payroll Calculation Logic - How It Works

## 🎯 New Automatic Calculation System

### **Formula:**
```
Base Amount = Hourly Rate × Hours Worked
Total = Base + Bonuses - Deductions
```

---

## 📊 Step-by-Step Example:

### **Employee: Maria Santos**

1. **Set Hourly Rate:** ₱200/hour
2. **Enter Hours Worked:** 160 hours
3. **Base Automatically Calculates:** ₱200 × 160 = **₱32,000**
4. **Add Bonuses (optional):** ₱2,000
5. **Add Deductions (optional):** ₱500
6. **Total Automatically Calculates:** ₱32,000 + ₱2,000 - ₱500 = **₱33,500**

---

## 🔄 How the Automatic Calculation Works:

### **When you change Hourly Rate:**
- Base Amount = New Rate × Hours Worked
- Total updates automatically

### **When you change Hours:**
- Base Amount = Hourly Rate × New Hours
- Total updates automatically

### **When you change Bonuses:**
- Total = Base + New Bonuses - Deductions
- Total updates automatically

### **When you change Deductions:**
- Total = Base + Bonuses - New Deductions
- Total updates automatically

---

## 📝 Generate Payroll Table:

| Employee | Rate/Hr | Hours | Base | Bonuses | Deductions | Total |
|----------|---------|-------|------|---------|------------|-------|
| Maria Santos | ₱200 | 160 | ₱32,000 | ₱0 | ₱0 | ₱32,000 |
| Pedro Cruz | ₱250 | 160 | ₱40,000 | ₱1,000 | ₱500 | ₱40,500 |
| Ana Reyes | ₱180 | 120 | ₱21,600 | ₱500 | ₱0 | ₱22,100 |

**Total Payroll:** ₱94,600

---

## 🎮 How to Use:

### **Step 1: Open Generate Payroll**
1. Go to Payroll page
2. Click "Generate Payroll" button
3. Select Period Start and Period End dates

### **Step 2: Set Hourly Rates**
- Each employee has a "Rate/Hr" input field
- Default: ₱200/hour
- Change it to employee's actual rate (e.g., ₱250, ₱180, etc.)

### **Step 3: Enter Hours Worked**
- Type hours in the "Hours" column
- Example: 160 hours (full month)
- Example: 80 hours (part-time)
- **Base amount updates automatically!**

### **Step 4: Add Bonuses (Optional)**
- Performance bonus
- Holiday bonus
- Incentives
- **Total updates automatically!**

### **Step 5: Add Deductions (Optional)**
- Late deductions
- Cash advances
- SSS/PhilHealth contributions
- **Total updates automatically!**

### **Step 6: Review and Generate**
- Check all calculations
- See total payroll at bottom
- Click "Generate Payroll"
- Done! ✅

---

## 💡 Real-World Examples:

### **Example 1: Full-Time Employee**
- **Rate:** ₱200/hour
- **Hours:** 160 hours (8 hours/day × 20 days)
- **Base:** ₱32,000
- **Bonus:** ₱2,000 (performance)
- **Deduction:** ₱1,000 (SSS)
- **Total:** ₱33,000

### **Example 2: Part-Time Employee**
- **Rate:** ₱150/hour
- **Hours:** 80 hours (4 hours/day × 20 days)
- **Base:** ₱12,000
- **Bonus:** ₱0
- **Deduction:** ₱0
- **Total:** ₱12,000

### **Example 3: Overtime Employee**
- **Rate:** ₱250/hour
- **Hours:** 200 hours (includes 40 hours overtime)
- **Base:** ₱50,000
- **Bonus:** ₱5,000 (overtime bonus)
- **Deduction:** ₱2,000 (cash advance)
- **Total:** ₱53,000

---

## 🔢 Calculation Breakdown:

### **What Happens When You Type:**

**Type in Rate/Hr:** `200`
- System stores: hourly_rate = 200

**Type in Hours:** `160`
- System calculates: base_amount = 200 × 160 = 32,000
- Display updates: Base = ₱32,000
- Display shows: "₱200 × 160h" below base

**Type in Bonuses:** `2000`
- System calculates: total = 32,000 + 2,000 - 0 = 34,000
- Display updates: Total = ₱34,000

**Type in Deductions:** `500`
- System calculates: total = 32,000 + 2,000 - 500 = 33,500
- Display updates: Total = ₱33,500

---

## ✅ Benefits of This System:

1. **No Manual Calculation** - Everything automatic
2. **Real-Time Updates** - See changes instantly
3. **Flexible Rates** - Different rate per employee
4. **Accurate** - No calculation errors
5. **Fast** - Generate payroll in seconds
6. **Transparent** - See the formula: ₱200 × 160h

---

## 🎯 Summary:

**Input:**
- Hourly Rate (e.g., ₱200)
- Hours Worked (e.g., 160)
- Bonuses (optional)
- Deductions (optional)

**Output:**
- Base Amount (automatic)
- Total Amount (automatic)

**Formula:**
```
Base = Rate × Hours
Total = Base + Bonuses - Deductions
```

**Result:** Accurate payroll in seconds! 🎉

---

**Production URL:** https://siargao-moto-rental.vercel.app

**Try it now:** Payroll → Generate Payroll → Enter values → Watch it calculate!
