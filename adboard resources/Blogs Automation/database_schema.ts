// prisma/schema.prisma
// Database schema for blog automation

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // or "mysql", "sqlite", etc.
  url      = env("DATABASE_URL")
}

model Topic {
  id          String   @id @default(cuid())
  topic       String
  keywords    String[]
  processed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  blogs       Blog[]
}

model Blog {
  id               String   @id @default(cuid())
  blogNumber       Int      @unique
  heading          String
  shortDescription String
  content          String   @db.Text
  imageUrl         String?
  topicId          String
  topic            Topic    @relation(fields: [topicId], references: [id])
  scheduledFor     DateTime
  published        Boolean  @default(false)
  publishedAt      DateTime?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@index([published])
  @@index([scheduledFor])
}

model AutomationConfig {
  id              String   @id @default(cuid())
  blogsPerDay     Int      @default(2)
  postingTimes    String[] // ["09:00", "15:00"]
  isActive        Boolean  @default(true)
  lastRunAt       DateTime?
  updatedAt       DateTime @updatedAt
}

// ============================================
// api/routes/blog-automation.routes.ts
// API Routes for blog automation
// ============================================

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { blogAutomation } from '../services/blog-automation-service';

const router = Router();
const prisma = new PrismaClient();

// Load topics into automation queue
router.post('/automation/topics/load', async (req, res) => {
  try {
    const { topics } = req.body; // Array of strings

    if (!Array.isArray(topics) || topics.length === 0) {
      return res.status(400).json({ error: 'Topics array is required' });
    }

    // Save topics to database
    const createdTopics = await prisma.topic.createMany({
      data: topics.map(topic => ({
        topic,
        processed: false,
      })),
    });

    // Load into automation service
    await blogAutomation.loadTopics(topics);

    res.json({
      success: true,
      message: `Loaded ${createdTopics.count} topics`,
      count: createdTopics.count,
    });
  } catch (error) {
    console.error('Error loading topics:', error);
    res.status(500).json({ error: 'Failed to load topics' });
  }
});

// Get all topics with status
router.get('/automation/topics', async (req, res) => {
  try {
    const topics = await prisma.topic.findMany({
      include: {
        blogs: {
          select: {
            id: true,
            blogNumber: true,
            published: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({ topics });
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

// Manual trigger to generate blog immediately
router.post('/automation/generate-now', async (req, res) => {
  try {
    const blog = await blogAutomation.generateBlogNow();

    if (!blog) {
      return res.status(404).json({ 
        error: 'No topics available in queue' 
      });
    }

    res.json({
      success: true,
      message: 'Blog generated successfully',
      blog,
    });
  } catch (error) {
    console.error('Error generating blog:', error);
    res.status(500).json({ error: 'Failed to generate blog' });
  }
});

// Get automation status
router.get('/automation/status', async (req, res) => {
  try {
    const queueStatus = blogAutomation.getQueueStatus();
    
    const dbStats = await prisma.$transaction([
      prisma.blog.count({ where: { published: true } }),
      prisma.blog.count({ where: { published: false } }),
      prisma.topic.count({ where: { processed: false } }),
    ]);

    const config = await prisma.automationConfig.findFirst();

    res.json({
      queue: queueStatus,
      database: {
        publishedBlogs: dbStats[0],
        draftBlogs: dbStats[1],
        remainingTopics: dbStats[2],
      },
      config: config || { blogsPerDay: 2, postingTimes: ['09:00', '15:00'] },
    });
  } catch (error) {
    console.error('Error fetching status:', error);
    res.status(500).json({ error: 'Failed to fetch status' });
  }
});

// Get all blogs (published and drafts)
router.get('/blogs', async (req, res) => {
  try {
    const { published, limit = 50, offset = 0 } = req.query;

    const where = published !== undefined 
      ? { published: published === 'true' }
      : {};

    const blogs = await prisma.blog.findMany({
      where,
      include: {
        topic: {
          select: {
            topic: true,
          },
        },
      },
      orderBy: {
        blogNumber: 'desc',
      },
      take: Number(limit),
      skip: Number(offset),
    });

    const total = await prisma.blog.count({ where });

    res.json({
      blogs,
      pagination: {
        total,
        limit: Number(limit),
        offset: Number(offset),
      },
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Get single blog
router.get('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        topic: true,
      },
    });

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

// Publish a draft blog
router.post('/blogs/:id/publish', async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        published: true,
        publishedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: 'Blog published successfully',
      blog,
    });
  } catch (error) {
    console.error('Error publishing blog:', error);
    res.status(500).json({ error: 'Failed to publish blog' });
  }
});

// Update blog
router.patch('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { heading, shortDescription, content, imageUrl } = req.body;

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        heading,
        shortDescription,
        content,
        imageUrl,
      },
    });

    res.json({
      success: true,
      message: 'Blog updated successfully',
      blog,
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

// Delete blog
router.delete('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.blog.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

// Update automation config
router.patch('/automation/config', async (req, res) => {
  try {
    const { blogsPerDay, postingTimes, isActive } = req.body;

    let config = await prisma.automationConfig.findFirst();

    if (!config) {
      config = await prisma.automationConfig.create({
        data: {
          blogsPerDay,
          postingTimes,
          isActive,
        },
      });
    } else {
      config = await prisma.automationConfig.update({
        where: { id: config.id },
        data: {
          blogsPerDay,
          postingTimes,
          isActive,
        },
      });
    }

    res.json({
      success: true,
      message: 'Configuration updated',
      config,
    });
  } catch (error) {
    console.error('Error updating config:', error);
    res.status(500).json({ error: 'Failed to update configuration' });
  }
});

export default router;