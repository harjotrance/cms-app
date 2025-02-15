import { PrismaClient } from '@prisma/client';
import { slugify } from '../../../../utils/slugify';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const posts = await prisma.post.findMany();
      res.status(200).json(posts);
    } catch (error) {
      // More detailed error logging
      console.error("Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      res.status(500).json({ 
        error: 'Failed to fetch posts',
        details: error.message 
      });
    }
  } else if (req.method === 'POST') {
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    try {
      const slug = slugify(title); // Generate slug from title
      const post = await prisma.post.create({
        data: {
          title,
          slug,
          content,
        },
      });
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: 'Failed to create post', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}