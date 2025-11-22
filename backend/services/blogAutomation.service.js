const cron = require('node-cron');
const axios = require('axios');
const Topic = require('../models/Topic.model');
const Blog = require('../models/Blog.model');

class BlogAutomationService {
  constructor() {
    this.blogCounter = 1;
    this.isInitialized = false;
  }

  /**
   * Initialize cron jobs for automated blog posting
   * Schedules: 9:00 AM and 3:00 PM daily
   */
  initializeCronJobs() {
    if (this.isInitialized) {
      console.log('⚠️  Blog automation already initialized');
      return;
    }

    // 9:00 AM daily
    cron.schedule('0 9 * * *', async () => {
      console.log('🕘 Running scheduled blog generation at 9:00 AM');
      await this.generateAndPublishBlog();
    });

    // 3:00 PM daily
    cron.schedule('0 15 * * *', async () => {
      console.log('🕒 Running scheduled blog generation at 3:00 PM');
      await this.generateAndPublishBlog();
    });

    this.isInitialized = true;
    console.log('✅ Blog automation cron jobs initialized');
    console.log('📅 Scheduled: 9:00 AM and 3:00 PM daily');
  }

  /**
   * Load topics into the database queue
   */
  async loadTopics(topics, category = 'Tips') {
    try {
      const topicDocs = topics.map(topic => ({
        topic: typeof topic === 'string' ? topic : topic.topic,
        keywords: typeof topic === 'object' ? topic.keywords : [],
        category: typeof topic === 'object' ? topic.category : category,
        processed: false
      }));

      const created = await Topic.insertMany(topicDocs);
      console.log(`✅ Loaded ${created.length} topics into automation queue`);
      return created;
    } catch (error) {
      console.error('❌ Error loading topics:', error);
      throw error;
    }
  }

  /**
   * Generate blog content using Groq AI (FREE)
   */
  async generateBlogContent(topic) {
    const prompt = `Write a professional blog post about: "${topic}"

Requirements:
1. A catchy, SEO-friendly heading (max 100 characters)
2. A compelling short description/excerpt (2-3 sentences, max 200 characters)
3. Main content of exactly 600 words in HTML format

IMPORTANT: Format the content as proper HTML with:
- Use <h2> for main sections
- Use <h3> for subsections
- Use <p> tags for all paragraphs
- Use <ul> and <li> for bullet lists
- Use <ol> and <li> for numbered lists
- Use <strong> for emphasis
- Use <em> for italics
- Add line breaks between sections

Make it engaging, informative, and SEO-optimized. The HTML should be ready to display directly on a webpage.

Respond ONLY with valid JSON in this exact format:
{"heading": "your heading here", "excerpt": "your description here", "content": "your 600-word HTML content here"}`;

    try {
      console.log('🤖 Generating content with Groq AI...');
      
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'You are a professional blog writer. Always respond with valid JSON only, no additional text or explanation.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2500
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      console.log('✅ AI content generated');
      
      return this.parseAIResponse(content);
    } catch (error) {
      console.error('❌ Groq API error:', error.response?.data || error.message);
      // Fallback to basic template
      return this.generateBasicTemplate(topic);
    }
  }

  /**
   * Parse AI response to extract JSON
   */
  parseAIResponse(content) {
    try {
      // Try to find JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          heading: parsed.heading || parsed.title,
          excerpt: parsed.excerpt || parsed.shortDescription || parsed.description,
          content: parsed.content
        };
      }
      throw new Error('No JSON found in response');
    } catch (error) {
      console.error('❌ Failed to parse AI response:', error);
      throw error;
    }
  }

  /**
   * Basic template fallback (if AI fails)
   */
  generateBasicTemplate(topic) {
    console.log('⚠️  Using fallback template for:', topic);
    return {
      heading: `Understanding ${topic}`,
      excerpt: `An informative guide exploring ${topic} and its key aspects in today's digital landscape.`,
      content: `
<h2>Introduction to ${topic}</h2>
<p>${topic} has become increasingly important in today's world. This comprehensive guide will explore various aspects of ${topic} and provide valuable insights.</p>

<h2>What is ${topic}?</h2>
<p>${topic} represents a significant area of interest that impacts many aspects of our daily lives. Understanding its fundamentals is crucial for anyone looking to stay informed and competitive.</p>

<h2>Key Aspects to Consider</h2>
<p>There are several important elements to consider when discussing ${topic}:</p>
<ul>
  <li>Understanding the core concepts</li>
  <li>Recognizing current trends and developments</li>
  <li>Identifying practical applications</li>
  <li>Considering future implications</li>
</ul>

<h2>Benefits and Importance</h2>
<p>The significance of ${topic} cannot be overstated. It plays a vital role in various contexts and continues to evolve with technological advancement.</p>

<h3>Real-World Impact</h3>
<p>${topic} affects individuals and organizations alike, offering numerous opportunities for growth and innovation.</p>

<h2>Practical Applications</h2>
<p>In practical terms, ${topic} offers numerous opportunities and applications. Understanding how to leverage these insights can be beneficial for:</p>
<ol>
  <li>Personal development</li>
  <li>Professional growth</li>
  <li>Strategic planning</li>
  <li>Innovation initiatives</li>
</ol>

<h2>Future Outlook</h2>
<p>Looking ahead, ${topic} shows promising developments. Staying informed about these trends will be increasingly important for success in the modern landscape.</p>

<h2>Conclusion</h2>
<p>${topic} remains a fascinating and relevant subject worthy of attention and continued exploration. By understanding its various dimensions, we can better appreciate its impact and potential for the future.</p>
`
    };
  }

  /**
   * Fetch image from Pixabay (FREE - 5000/hour limit)
   */
  async fetchImage(keywords) {
    try {
      console.log('🖼️  Fetching image from Pixabay...');
      
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: process.env.PIXABAY_API_KEY,
          q: keywords,
          image_type: 'photo',
          per_page: 5,
          safesearch: true
        }
      });

      if (response.data.hits && response.data.hits.length > 0) {
        const imageUrl = response.data.hits[0].largeImageURL;
        console.log('✅ Image found:', imageUrl);
        return imageUrl;
      }
      
      console.log('⚠️  No image found for:', keywords);
      return null;
    } catch (error) {
      console.error('❌ Pixabay API error:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Main function: Generate and publish a blog
   */
  async generateAndPublishBlog() {
    try {
      // Get next unprocessed topic
      const topic = await Topic.findOne({ processed: false }).sort({ createdAt: 1 });
      
      if (!topic) {
        console.log('⚠️  No topics available in queue');
        return null;
      }

      console.log(`\n📝 Generating blog for topic: "${topic.topic}"`);

      // Generate content with AI
      const blogContent = await this.generateBlogContent(topic.topic);

      // Fetch image
      const imageUrl = await this.fetchImage(topic.topic);

      // Get author ID from environment
      const authorId = process.env.BLOG_API_AUTHOR_ID;
      if (!authorId) {
        throw new Error('BLOG_API_AUTHOR_ID not configured in .env');
      }

      // Create blog in database
      const blog = await Blog.create({
        title: blogContent.heading,
        excerpt: blogContent.excerpt,
        content: blogContent.content,
        author: authorId,
        image: imageUrl ? { url: imageUrl } : undefined,
        category: topic.category,
        status: 'published',
        publishDate: new Date()
      });

      // Mark topic as processed
      topic.processed = true;
      topic.processedAt = new Date();
      topic.blogId = blog._id;
      await topic.save();

      console.log(`✅ Blog published successfully!`);
      console.log(`   Title: ${blog.title}`);
      console.log(`   Slug: ${blog.slug}`);
      console.log(`   Category: ${blog.category}`);
      console.log(`   ID: ${blog._id}\n`);

      return blog;
    } catch (error) {
      console.error('❌ Error in blog generation:', error);
      throw error;
    }
  }

  /**
   * Manual trigger for immediate blog generation
   */
  async generateBlogNow() {
    return await this.generateAndPublishBlog();
  }

  /**
   * Get queue status
   */
  async getQueueStatus() {
    try {
      const total = await Topic.countDocuments();
      const processed = await Topic.countDocuments({ processed: true });
      const remaining = total - processed;
      const totalBlogs = await Blog.countDocuments();

      return {
        topics: {
          total,
          processed,
          remaining
        },
        blogs: {
          total: totalBlogs,
          published: await Blog.countDocuments({ status: 'published' }),
          drafts: await Blog.countDocuments({ status: 'draft' })
        },
        automation: {
          isActive: this.isInitialized,
          schedule: ['9:00 AM', '3:00 PM']
        }
      };
    } catch (error) {
      console.error('Error getting queue status:', error);
      throw error;
    }
  }

  /**
   * Get all topics with their status
   */
  async getAllTopics() {
    try {
      return await Topic.find()
        .populate('blogId', 'title slug status publishDate')
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting topics:', error);
      throw error;
    }
  }

  /**
   * Clear all topics (useful for testing)
   */
  async clearAllTopics() {
    try {
      const result = await Topic.deleteMany({});
      console.log(`🗑️  Cleared ${result.deletedCount} topics`);
      return result;
    } catch (error) {
      console.error('Error clearing topics:', error);
      throw error;
    }
  }
}

// Export singleton instance
const blogAutomation = new BlogAutomationService();
module.exports = blogAutomation;
