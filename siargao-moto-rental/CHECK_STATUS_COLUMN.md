# ⚠️ IMPORTANT: Did You Run the SQL Migration?

## The payroll status won't work until you run this SQL in Supabase:

```sql
ALTER TABLE payroll 
ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled'));

CREATE INDEX idx_payroll_status ON payroll(status);

UPDATE payroll SET status = 'paid' WHERE status IS NULL;
```

**Have you run this yet?**

If NO → Go to Supabase and run it now:
1. https://supabase.com/dashboard
2. Project: ihllxghuehfeqkpqlvpm
3. SQL Editor → New Query
4. Paste SQL → Run

If YES → Let me know and I'll check for other issues.
