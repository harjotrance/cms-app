import { PrismaClient, Post as PostModel } from '@prisma/client';
import Link from 'next/link';
import { GetStaticProps, NextPage } from 'next';

const prisma = new PrismaClient();

// Create an interface for the serialized post
interface SerializedPost extends Omit<PostModel, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

interface PostsListPageProps {
  posts: SerializedPost[];
}

const PostsListPage: NextPage<PostsListPageProps> = ({ posts }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>
        <div className="grid gap-4">
          {posts.map((post) => (
            <article key={post.id} className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Link 
                href={`/posts/${post.slug}`}
                className="block hover:text-primary transition-colors"
              >
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <div className="text-sm text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<PostsListPageProps> = async () => {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Serialize the dates to strings
  const serializedPosts = posts.map(post => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }));

  return {
    props: {
      posts: serializedPosts,
    },
    revalidate: 60,
  };
};

export default PostsListPage;