// blog-automation-service.ts - 100% FREE VERSION
import cron from 'node-cron';
import axios from 'axios';

// Types
interface BlogTopic {
  id: string;
  topic: string;
  keywords?: string[];
  processed: boolean;
}

interface GeneratedBlog {
  id: string;
  blogNumber: number;
  heading: string;
  shortDescription: string;
  content: string;
  imageUrl?: string;
  topicId: string;
  scheduledFor: Date;
  published: boolean;
  createdAt: Date;
}

interface BlogContent {
  heading: string;
  shortDescription: string;
  content: string;
}

// Configuration - All FREE options
const CONFIG = {
  // FREE AI APIs (choose one or use fallback chain)
  AI_APIS: [
    {
      name: 'Hugging Face',
      url: 'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      requiresKey: true, // Free tier available
    },
    {
      name: 'Together AI',
      url: 'https://api.together.xyz/v1/chat/completions',
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      requiresKey: true, // $25 free credits
    },
    {
      name: 'Groq',
      url: 'https://api.groq.com/openai/v1/chat/completions',
      model: 'llama-3.1-70b-versatile',
      requiresKey: true, // Free tier with high limits
    },
  ],
  
  // FREE Image APIs
  IMAGE_APIS: [
    'https://api.unsplash.com/search/photos', // Free: 50/hr
    'https://api.pexels.com/v1/search', // Free: 200/hr
    'https://pixabay.com/api/', // Free: 5000/hr
  ],
  
  BLOGS_PER_DAY: 2,
  POSTING_TIMES: ['09:00', '15:00'],
};

class BlogAutomationService {
  private topicsQueue: BlogTopic[] = [];
  private blogCounter: number = 1;

  constructor() {
    this.initializeCronJobs();
  }

  private initializeCronJobs() {
    CONFIG.POSTING_TIMES.forEach((time) => {
      const [hour, minute] = time.split(':');
      
      cron.schedule(`${minute} ${hour} * * *`, async () => {
        console.log(`Running blog generation at ${time}`);
        await this.generateAndPublishBlog();
      });
    });

    console.log(`Cron jobs initialized for: ${CONFIG.POSTING_TIMES.join(', ')}`);
  }

  async loadTopics(topics: string[]): Promise<void> {
    this.topicsQueue = topics.map((topic, index) => ({
      id: `topic_${Date.now()}_${index}`,
      topic,
      processed: false,
    }));
    console.log(`Loaded ${this.topicsQueue.length} topics`);
  }

  // FREE AI Content Generation with fallback chain
  private async generateBlogContent(topic: string): Promise<BlogContent> {
    const prompt = `Write a blog post about: "${topic}"

Create:
1. A catchy, SEO-friendly heading
2. A short description (2-3 sentences, max 160 characters)
3. Main content of exactly 600 words

Format as JSON:
{"heading": "your heading", "shortDescription": "your description", "content": "your 600-word content"}

Make it engaging and informative.`;

    // Try Groq API first (best free option)
    try {
      return await this.generateWithGroq(prompt);
    } catch (error) {
      console.log('Groq failed, trying Together AI...');
    }

    // Fallback to Together AI
    try {
      return await this.generateWithTogetherAI(prompt);
    } catch (error) {
      console.log('Together AI failed, trying Hugging Face...');
    }

    // Final fallback to Hugging Face
    try {
      return await this.generateWithHuggingFace(prompt);
    } catch (error) {
      console.error('All AI APIs failed');
      
      // Ultimate fallback: generate basic template
      return this.generateBasicTemplate(topic);
    }
  }

  // Groq API (FREE - Best option, high rate limits)
  private async generateWithGroq(prompt: string): Promise<BlogContent> {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a professional blog writer. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content;
    return this.parseAIResponse(content);
  }

  // Together AI (FREE $25 credits)
  private async generateWithTogetherAI(prompt: string): Promise<BlogContent> {
    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [
          {
            role: 'system',
            content: 'You are a professional blog writer. Respond with JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2000,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content;
    return this.parseAIResponse(content);
  }

  // Hugging Face (FREE)
  private async generateWithHuggingFace(prompt: string): Promise<BlogContent> {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 2000,
          temperature: 0.7,
          return_full_text: false,
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data[0].generated_text;
    return this.parseAIResponse(content);
  }

  // Parse AI response to extract JSON
  private parseAIResponse(content: string): BlogContent {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        heading: parsed.heading,
        shortDescription: parsed.shortDescription,
        content: parsed.content,
      };
    }
    throw new Error('Failed to parse AI response');
  }

  // Basic template fallback (if all APIs fail)
  private generateBasicTemplate(topic: string): BlogContent {
    return {
      heading: `Understanding ${topic}`,
      shortDescription: `An informative guide exploring ${topic} and its key aspects.`,
      content: `# Introduction to ${topic}

${topic} has become increasingly important in today's world. This comprehensive guide will explore various aspects of ${topic} and provide valuable insights.

## What is ${topic}?

${topic} represents a significant area of interest that impacts many aspects of our daily lives. Understanding its fundamentals is crucial for anyone looking to stay informed.

## Key Aspects

There are several important elements to consider when discussing ${topic}. Each aspect contributes to a broader understanding of the subject.

## Benefits and Importance

The significance of ${topic} cannot be overstated. It plays a vital role in various contexts and continues to evolve.

## Practical Applications

In practical terms, ${topic} offers numerous opportunities and applications. Understanding how to leverage these can be beneficial.

## Future Outlook

Looking ahead, ${topic} shows promising developments. Staying informed about these trends will be increasingly important.

## Conclusion

${topic} remains a fascinating and relevant subject worthy of attention and continued exploration. By understanding its various dimensions, we can better appreciate its impact and potential.`.repeat(1).substring(0, 600),
    };
  }

  // FREE Image fetching with multiple sources
  private async fetchImage(keywords: string): Promise<string | undefined> {
    // Try Pixabay first (highest free limit: 5000/hour)
    try {
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: process.env.PIXABAY_API_KEY,
          q: keywords,
          image_type: 'photo',
          per_page: 3,
        },
      });

      if (response.data.hits && response.data.hits.length > 0) {
        return response.data.hits[0].largeImageURL;
      }
    } catch (error) {
      console.log('Pixabay failed, trying Pexels...');
    }

    // Try Pexels (200/hour free)
    try {
      const response = await axios.get('https://api.pexels.com/v1/search', {
        params: {
          query: keywords,
          per_page: 1,
        },
        headers: {
          Authorization: process.env.PEXELS_API_KEY || '',
        },
      });

      if (response.data.photos && response.data.photos.length > 0) {
        return response.data.photos[0].src.large;
      }
    } catch (error) {
      console.log('Pexels failed, trying Unsplash...');
    }

    // Try Unsplash last (50/hour free)
    try {
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query: keywords,
          per_page: 1,
        },
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
        },
      });

      if (response.data.results && response.data.results.length > 0) {
        return response.data.results[0].urls.regular;
      }
    } catch (error) {
      console.error('All image APIs failed');
    }

    return undefined;
  }

  async generateAndPublishBlog(): Promise<GeneratedBlog | null> {
    const topic = this.topicsQueue.find(t => !t.processed);
    
    if (!topic) {
      console.log('No topics available in queue');
      return null;
    }

    try {
      console.log(`Generating blog for topic: ${topic.topic}`);

      const blogContent = await this.generateBlogContent(topic.topic);
      const imageUrl = await this.fetchImage(topic.topic);

      const blog: GeneratedBlog = {
        id: `blog_${Date.now()}`,
        blogNumber: this.blogCounter++,
        heading: `Blog ${this.blogCounter - 1}: ${blogContent.heading}`,
        shortDescription: blogContent.shortDescription,
        content: blogContent.content,
        imageUrl,
        topicId: topic.id,
        scheduledFor: new Date(),
        published: false,
        createdAt: new Date(),
      };

      await this.saveBlogToDatabase(blog);
      await this.publishBlog(blog);

      topic.processed = true;

      console.log(`Successfully generated blog #${blog.blogNumber}`);
      return blog;

    } catch (error) {
      console.error('Error in blog generation:', error);
      return null;
    }
  }

  private async saveBlogToDatabase(blog: GeneratedBlog): Promise<void> {
    // Your database logic here
    console.log('Blog saved to database:', blog.id);
  }

  private async publishBlog(blog: GeneratedBlog): Promise<void> {
    try {
      await axios.post('http://localhost:3000/api/blogs/publish', {
        heading: blog.heading,
        shortDescription: blog.shortDescription,
        content: blog.content,
        imageUrl: blog.imageUrl,
        publishedAt: new Date(),
      });

      blog.published = true;
      console.log(`Blog #${blog.blogNumber} published successfully`);
    } catch (error) {
      console.error('Error publishing blog:', error);
      throw error;
    }
  }

  async generateBlogNow(): Promise<GeneratedBlog | null> {
    return await this.generateAndPublishBlog();
  }

  getQueueStatus() {
    return {
      total: this.topicsQueue.length,
      processed: this.topicsQueue.filter(t => t.processed).length,
      remaining: this.topicsQueue.filter(t => !t.processed).length,
      nextBlogNumber: this.blogCounter,
    };
  }
}

export const blogAutomation = new BlogAutomationService();