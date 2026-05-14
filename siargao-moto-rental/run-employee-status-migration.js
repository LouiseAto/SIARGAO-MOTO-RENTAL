/**
 * Script to run the employee status migration
 * 
 * Usage:
 *   node run-employee-status-migration.js
 * 
 * Make sure you have your .env.local file configured with:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

async function runMigration() {
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Missing Supabase credentials in .env.local')
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }

  console.log('🔄 Connecting to Supabase...')
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Read migration file
  const migrationPath = path.join(__dirname, 'supabase', 'migrations', '002_add_employee_status.sql')
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

  console.log('📝 Running migration: 002_add_employee_status.sql')
  console.log('---')

  try {
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL })

    if (error) {
      // If exec_sql doesn't exist, try direct execution (this might not work with all SQL)
      console.log('⚠️  exec_sql function not found, trying alternative method...')
      
      // Split by semicolon and execute each statement
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))

      for (const statement of statements) {
        console.log(`Executing: ${statement.substring(0, 50)}...`)
        const { error: stmtError } = await supabase.rpc('exec_sql', { sql: statement })
        if (stmtError) {
          throw stmtError
        }
      }
    }

    console.log('---')
    console.log('✅ Migration completed successfully!')
    console.log('')
    console.log('Next steps:')
    console.log('1. Refresh your application')
    console.log('2. Try editing an employee status')
    console.log('3. Verify the status persists after saving')

  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    console.error('')
    console.error('Alternative: Run the migration manually in Supabase Dashboard')
    console.error('1. Go to https://app.supabase.com')
    console.error('2. Select your project')
    console.error('3. Go to SQL Editor')
    console.error('4. Copy and paste the contents of:')
    console.error('   supabase/migrations/002_add_employee_status.sql')
    console.error('5. Click "Run"')
    process.exit(1)
  }
}

runMigration()
