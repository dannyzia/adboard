# Fix Old Blog - Regenerate with HTML Formatting
# This will delete the old poorly formatted blog and generate a new one

Write-Host "Fixing Blog Formatting Issue" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Login
Write-Host "Logging in..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@adboard.com"
    password = "admin1122"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
    -Method Post `
    -Body $loginBody `
    -ContentType "application/json"

$token = $loginResponse.token
$headers = @{
    "Authorization" = "Bearer $token"
}

Write-Host "SUCCESS: Logged in`n" -ForegroundColor Green

# Get all blogs to find the old one
Write-Host "Finding the old blog..." -ForegroundColor Yellow
$blogs = Invoke-RestMethod -Uri "http://localhost:5000/api/blogs/recent?limit=5" -Headers $headers

$oldBlog = $blogs.blogs | Where-Object { $_.slug -like "*how-to-create-effective-online-classified-ads*" }

if ($oldBlog) {
    Write-Host "Found old blog: $($oldBlog.title)" -ForegroundColor Gray
    Write-Host "ID: $($oldBlog._id)" -ForegroundColor Gray
    
    $delete = Read-Host "`nDelete this blog? (y/n)"
    if ($delete -eq 'y') {
        try {
            Invoke-RestMethod -Uri "http://localhost:5000/api/blogs/$($oldBlog._id)" `
                -Method Delete `
                -Headers $headers
            Write-Host "SUCCESS: Old blog deleted`n" -ForegroundColor Green
        } catch {
            Write-Host "ERROR: Failed to delete: $($_.Exception.Message)`n" -ForegroundColor Red
        }
    }
} else {
    Write-Host "Old blog not found (may have been deleted already)`n" -ForegroundColor Yellow
}

# Generate new blog with proper formatting
Write-Host "Generating new blog with proper HTML formatting..." -ForegroundColor Yellow
Write-Host "(This may take 10-30 seconds)..." -ForegroundColor Gray

try {
    $newBlog = Invoke-RestMethod -Uri "http://localhost:5000/api/automation/generate-now" `
        -Method Post `
        -Headers $headers
    
    Write-Host "`nSUCCESS! New blog generated:" -ForegroundColor Green
    Write-Host "Title: $($newBlog.blog.title)" -ForegroundColor Cyan
    Write-Host "Slug: $($newBlog.blog.slug)" -ForegroundColor Gray
    Write-Host "Category: $($newBlog.blog.category)" -ForegroundColor Gray
    Write-Host "`nPermalink: $($newBlog.blog.permalink)" -ForegroundColor Blue
    Write-Host "`nThis blog now has proper HTML formatting with:" -ForegroundColor Yellow
    Write-Host "  - Headings (h2, h3)" -ForegroundColor White
    Write-Host "  - Paragraphs (p tags)" -ForegroundColor White
    Write-Host "  - Lists (ul/ol, li)" -ForegroundColor White
    Write-Host "  - Proper spacing and structure" -ForegroundColor White
} catch {
    $errorMsg = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "ERROR: $($errorMsg.message)" -ForegroundColor Red
}

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "Done! Check your frontend to see the improvement." -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan
