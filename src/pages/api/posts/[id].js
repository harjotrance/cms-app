import { PrismaClient } from '@prisma/client';
import { slugify } from '../../../../utils/slugify';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const postId = req.query.id;

  if (!postId) {
    return res.status(400).json({ error: 'Invalid post ID' });
  }

  if (req.method === 'GET') {
    try {
      const post = await prisma.post.findUnique({
        where: { id: postId },
      });
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.status(200).json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ error: 'Failed to fetch post' });
    }
  } else if (req.method === 'PUT') {
    const { title, content } = req.body;
    try {
      const slug = title ? slugify(title) : undefined; // Only slugify if title is provided for update
      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          title,
          slug,
          content,
        },
      });
      res.status(200).json(updatedPost);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ error: 'Failed to update post', details: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.post.delete({
        where: { id: postId },
      });
      res.status(204).end(); // No content for successful deletion
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ error: 'Failed to delete post' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}