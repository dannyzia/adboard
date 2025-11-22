# Quick Test Script for Blog Automation
# Run this to test your automation setup

Write-Host "Blog Automation Test Script" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Step 1: Test API health
Write-Host "1. Testing API connection..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health"
    Write-Host "   SUCCESS: API is running: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: API not responding. Make sure backend is running!" -ForegroundColor Red
    exit
}

# Step 2: Login as admin
Write-Host "`n2. Logging in as admin..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "admin@adboard.com"
        password = "admin1122"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
        -Method Post `
        -Body $loginBody `
        -ContentType "application/json"
    
    $token = $loginResponse.token
    Write-Host "   SUCCESS: Logged in as $($loginResponse.user.name)" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# Step 3: Check automation status
Write-Host "`n3. Checking automation status..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }

    $status = Invoke-RestMethod -Uri "http://localhost:5000/api/automation/status" `
        -Headers $headers
    
    Write-Host "   SUCCESS: Automation is active" -ForegroundColor Green
    Write-Host "   Topics: $($status.status.topics.total) total, $($status.status.topics.remaining) remaining" -ForegroundColor Gray
    Write-Host "   Blogs: $($status.status.blogs.total) total, $($status.status.blogs.published) published" -ForegroundColor Gray
    Write-Host "   Schedule: $($status.status.automation.schedule -join ', ')" -ForegroundColor Gray
} catch {
    Write-Host "   ERROR: Failed to get status: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 4: Load sample topics
Write-Host "`n4. Loading sample topics..." -ForegroundColor Yellow
$loadTopics = Read-Host "   Load 20 sample topics? (y/n)"
if ($loadTopics -eq 'y') {
    try {
        $topicsBody = Get-Content "sample-topics.json" -Raw
        
        $loadResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/automation/topics/load" `
            -Method Post `
            -Headers @{
                "Authorization" = "Bearer $token"
                "Content-Type" = "application/json"
            } `
            -Body $topicsBody
        
        Write-Host "   SUCCESS: Loaded $($loadResponse.count) topics!" -ForegroundColor Green
    } catch {
        Write-Host "   ERROR: Failed to load topics: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Step 5: Test manual generation
Write-Host "`n5. Testing manual blog generation..." -ForegroundColor Yellow
$generateNow = Read-Host "   Generate a blog now? (y/n)"
if ($generateNow -eq 'y') {
    try {
        Write-Host "   Generating blog... (this may take 10-30 seconds)" -ForegroundColor Gray
        
        $blogResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/automation/generate-now" `
            -Method Post `
            -Headers @{
                "Authorization" = "Bearer $token"
            }
        
        Write-Host "   SUCCESS: Blog generated!" -ForegroundColor Green
        Write-Host "   Title: $($blogResponse.blog.title)" -ForegroundColor Cyan
        Write-Host "   Slug: $($blogResponse.blog.slug)" -ForegroundColor Gray
        Write-Host "   Category: $($blogResponse.blog.category)" -ForegroundColor Gray
        Write-Host "   Permalink: $($blogResponse.blog.permalink)" -ForegroundColor Blue
        Write-Host "`n   Visit your frontend to see the new blog post!" -ForegroundColor Green
    } catch {
        $errorMsg = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "   ERROR: $($errorMsg.message)" -ForegroundColor Red
    }
}

# Summary
Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "Test Complete!" -ForegroundColor Green
Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "   1. Check your frontend blog section" -ForegroundColor White
Write-Host "   2. Automation will run at 9 AM & 3 PM daily" -ForegroundColor White
Write-Host "   3. See BLOG_AUTOMATION_GUIDE.md for more info" -ForegroundColor White
Write-Host "================================`n" -ForegroundColor Cyan
