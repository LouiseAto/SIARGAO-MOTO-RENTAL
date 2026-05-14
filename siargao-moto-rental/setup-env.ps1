$env:NODE_TLS_REJECT_UNAUTHORIZED='0'

Write-Host "Adding NEXT_PUBLIC_SUPABASE_ANON_KEY..." -ForegroundColor Green
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlobGx4Z2h1ZWhmZXFrcHFsdnBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NzYwMjMsImV4cCI6MjA5MzU1MjAyM30.pi92iDnJJqLUeh7cPP7LPNyu8uQ4zv1KRofFJOuj7AM"
echo $anonKey | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

Write-Host ""
Write-Host "Adding SUPABASE_SERVICE_ROLE_KEY..." -ForegroundColor Green
$serviceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlobGx4Z2h1ZWhmZXFrcHFsdnBtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzk3NjAyMywiZXhwIjoyMDkzNTUyMDIzfQ.BIeLF5upkTHgabv-oiw21mbGjtZZj_Xar4FEFWVrRtg"
echo $serviceKey | vercel env add SUPABASE_SERVICE_ROLE_KEY production

Write-Host ""
Write-Host "Done! Now deploying to production..." -ForegroundColor Green
vercel --prod

Write-Host ""
Write-Host "Deployment complete!" -ForegroundColor Green
