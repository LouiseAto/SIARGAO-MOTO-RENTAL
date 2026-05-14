const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials in .env.local');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
  process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration(migrationFile) {
  console.log(`\n📄 Running migration: ${migrationFile}`);
  
  const migrationPath = path.join(__dirname, '../supabase/migrations', migrationFile);
  const sql = fs.readFileSync(migrationPath, 'utf8');
  
  try {
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      // If exec_sql doesn't exist, try direct query
      console.log('⚠️  exec_sql function not found, trying direct execution...');
      
      // Split SQL into individual statements and execute them
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      for (const statement of statements) {
        const { error: stmtError } = await supabase.rpc('exec', { sql: statement + ';' });
        if (stmtError) {
          console.error(`❌ Error executing statement:`, stmtError.message);
          throw stmtError;
        }
      }
    }
    
    console.log(`✅ Successfully executed: ${migrationFile}`);
    return true;
  } catch (error) {
    console.error(`❌ Error running migration ${migrationFile}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting database migrations...');
  console.log(`📍 Supabase URL: ${supabaseUrl}`);
  
  const migrations = [
    '001_initial_schema.sql',
    '002_seed_data.sql'
  ];
  
  let successCount = 0;
  
  for (const migration of migrations) {
    const success = await runMigration(migration);
    if (success) successCount++;
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`✨ Migration complete: ${successCount}/${migrations.length} successful`);
  console.log('='.repeat(50));
  
  if (successCount === migrations.length) {
    console.log('\n✅ All migrations completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Go to Supabase Dashboard > Authentication > Users');
    console.log('2. Create a new user with email and password');
    console.log('3. Copy the user ID');
    console.log('4. Run the following SQL in SQL Editor:');
    console.log('\n   INSERT INTO admins (id, email, full_name, role)');
    console.log('   VALUES (\'YOUR_USER_ID\', \'admin@siargao-moto.com\', \'Admin User\', \'admin\');\n');
  } else {
    console.log('\n⚠️  Some migrations failed. Please check the errors above.');
    console.log('You may need to run the migrations manually in Supabase SQL Editor.');
  }
}

main().catch(console.error);
