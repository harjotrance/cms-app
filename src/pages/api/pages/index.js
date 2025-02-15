import { PrismaClient } from '@prisma/client';
import { slugify } from '../../../../utils/slugify';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const pages = await prisma.page.findMany();
      res.status(200).json(pages);
    } catch (error) {
      console.error("Error fetching pages:", error);
      res.status(500).json({ error: 'Failed to fetch pages' });
    }
  } else if (req.method === 'POST') {
    const { title, content, slug } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    try {
      // Use provided slug or generate from title
      const finalSlug = slug || slugify(title);
      
      const page = await prisma.page.create({
        data: {
          title,
          slug: finalSlug,
          content,
        },
      });
      res.status(201).json(page);
    } catch (error) {
      console.error("Error creating page:", error);
      res.status(500).json({ error: 'Failed to create page', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}