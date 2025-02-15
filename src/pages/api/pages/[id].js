import { PrismaClient } from '@prisma/client';
import { slugify } from '../../../../utils/slugify';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const pageId = parseInt(req.query.id, 10);

  if (isNaN(pageId)) {
    return res.status(400).json({ error: 'Invalid page ID' });
  }

  if (req.method === 'GET') {
    try {
      const page = await prisma.page.findUnique({
        where: { id: pageId },
      });
      if (!page) {
        return res.status(404).json({ error: 'Page not found' });
      }
      res.status(200).json(page);
    } catch (error) {
      console.error("Error fetching page:", error);
      res.status(500).json({ error: 'Failed to fetch page' });
    }
  } else if (req.method === 'PUT') {
    const { title, content, slug } = req.body;
    try {
      // Use provided slug or generate from title if title changed
      const finalSlug = slug || (title ? slugify(title) : undefined);
      
      const updatedPage = await prisma.page.update({
        where: { id: pageId },
        data: {
          title,
          slug: finalSlug,
          content,
        },
      });
      res.status(200).json(updatedPage);
    } catch (error) {
      console.error("Error updating page:", error);
      res.status(500).json({ error: 'Failed to update page', details: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.page.delete({
        where: { id: pageId },
      });
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting page:", error);
      res.status(500).json({ error: 'Failed to delete page' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}