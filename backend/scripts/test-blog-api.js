/**
 * Test script for Blog API endpoint
 * Run with: node scripts/test-blog-api.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const http = require('http');
const https = require('https');
const { URL } = require('url');

// Simple fetch replacement using Node.js built-in modules
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = protocol.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          json: async () => JSON.parse(data)
        });
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

const API_URL = process.env.FRONTEND_URL || 'http://localhost:5000';
const BLOG_API_KEY = process.env.BLOG_API_KEY;

if (!BLOG_API_KEY) {
  console.error('❌ BLOG_API_KEY not found in environment variables');
  console.log('Please set BLOG_API_KEY in your .env file');
  process.exit(1);
}

async function testBlogAPI() {
  console.log('🧪 Testing Blog API Endpoint\n');
  console.log('📍 API URL:', `${API_URL}/api/blogs`);
  console.log('🔑 API Key:', BLOG_API_KEY.substring(0, 10) + '...\n');

  // Test 1: Create blog post with all fields
  console.log('Test 1: Create blog post with all fields');
  console.log('─'.repeat(50));
  
  try {
    const response1 = await fetch(`${API_URL}/api/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': BLOG_API_KEY
      },
      body: JSON.stringify({
        title: 'Test Blog Post from API',
        content: '<p>This is a <strong>test blog post</strong> created via the API.</p><p>It includes multiple paragraphs and HTML formatting.</p>',
        excerpt: 'A test blog post to verify the API endpoint is working correctly.',
        status: 'draft',
        category: 'Tips',
        tags: ['test', 'api', 'automation']
      })
    });

    const data1 = await response1.json();
    
    if (response1.status === 201) {
      console.log('✅ Success!');
      console.log('   Message:', data1.message);
      console.log('   ID:', data1.id);
      console.log('   Permalink:', data1.permalink);
      console.log('   Status:', data1.blog.status);
      console.log('   Category:', data1.blog.category);
    } else {
      console.log('❌ Failed');
      console.log('   Status:', response1.status);
      console.log('   Error:', data1.error);
      console.log('   Details:', data1.details);
    }
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }

  console.log('\n');

  // Test 2: Create blog post with minimal fields (auto-generate slug and excerpt)
  console.log('Test 2: Create blog post with minimal fields');
  console.log('─'.repeat(50));
  
  try {
    const response2 = await fetch(`${API_URL}/api/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': BLOG_API_KEY
      },
      body: JSON.stringify({
        title: 'Minimal Test Post',
        content: '<p>This post only has title and content. Slug and excerpt should be auto-generated.</p>',
        status: 'draft'
      })
    });

    const data2 = await response2.json();
    
    if (response2.status === 201) {
      console.log('✅ Success!');
      console.log('   Message:', data2.message);
      console.log('   Slug:', data2.blog.slug, '(auto-generated)');
      console.log('   Permalink:', data2.permalink);
    } else {
      console.log('❌ Failed');
      console.log('   Status:', response2.status);
      console.log('   Error:', data2.error);
    }
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }

  console.log('\n');

  // Test 3: Missing required field (should fail)
  console.log('Test 3: Missing required field (should fail with 400)');
  console.log('─'.repeat(50));
  
  try {
    const response3 = await fetch(`${API_URL}/api/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': BLOG_API_KEY
      },
      body: JSON.stringify({
        content: '<p>This is missing the title field.</p>'
      })
    });

    const data3 = await response3.json();
    
    if (response3.status === 400) {
      console.log('✅ Correctly rejected!');
      console.log('   Status:', response3.status);
      console.log('   Error:', data3.error);
      console.log('   Details:', data3.details);
    } else {
      console.log('❌ Should have failed with 400');
      console.log('   Status:', response3.status);
    }
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }

  console.log('\n');

  // Test 4: Invalid API key (should fail)
  console.log('Test 4: Invalid API key (should fail with 401)');
  console.log('─'.repeat(50));
  
  try {
    const response4 = await fetch(`${API_URL}/api/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'invalid-api-key'
      },
      body: JSON.stringify({
        title: 'Test',
        content: '<p>Test</p>'
      })
    });

    const data4 = await response4.json();
    
    if (response4.status === 401) {
      console.log('✅ Correctly rejected!');
      console.log('   Status:', response4.status);
      console.log('   Error:', data4.error);
      console.log('   Details:', data4.details);
    } else {
      console.log('❌ Should have failed with 401');
      console.log('   Status:', response4.status);
    }
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }

  console.log('\n');

  // Test 5: Bearer token authentication
  console.log('Test 5: Bearer token authentication');
  console.log('─'.repeat(50));
  
  try {
    const response5 = await fetch(`${API_URL}/api/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BLOG_API_KEY}`
      },
      body: JSON.stringify({
        title: 'Test with Bearer Token',
        content: '<p>This uses Authorization: Bearer instead of X-API-Key.</p>',
        status: 'draft'
      })
    });

    const data5 = await response5.json();
    
    if (response5.status === 201) {
      console.log('✅ Success!');
      console.log('   Message:', data5.message);
      console.log('   Permalink:', data5.permalink);
    } else {
      console.log('❌ Failed');
      console.log('   Status:', response5.status);
      console.log('   Error:', data5.error);
    }
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }

  console.log('\n');
  console.log('🎉 All tests completed!\n');
}

// Run tests
testBlogAPI().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
