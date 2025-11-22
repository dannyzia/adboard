API Endpoint Design

POST /api/v1/ads/import
Authorization: Bearer {LISTYNEST_API_KEY}
Content-Type: application/json

Request Body Format

{
  "ads": [
    {
      "title": "iPhone 13 Pro Max",
      "description": "Excellent condition iPhone 13 Pro Max...",
      "category": "Electronics",
      "price": 899,
      "currency": "USD",
      "priceType": "Fixed",
      "brandModel": "Apple iPhone 13 Pro Max",
      "condition": "Used",
      "location": {
        "city": "New York",
        "state": "NY",
        "country": "USA"
      },
      "contact_info": {
        "phone": "+1234567890",
        "email": "seller@example.com"
      },
      "images": [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg"
      ],
      "source": "Craigslist",
      "source_url": "https://craigslist.org/...",
      "posted_date": "2024-01-15T10:30:00Z"
    }
  ],
  "import_options": {
    "auto_approve": false,
    "notify_admin": true,
    "duplicate_check": true
  }
}


Response Format

{
  "success": true,
  "imported_count": 25,
  "duplicates": 3,
  "errors": [],
  "import_id": "imp_123456789",
  "message": "Successfully imported 25 ads"
}