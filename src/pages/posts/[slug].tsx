import { PrismaClient, Post as PostModel } from '@prisma/client';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import PluginRenderer from '../../../components/PluginRenderer'; // Import PluginRenderer
import Link from 'next/link';

const prisma = new PrismaClient();

interface SerializedPost extends Omit<PostModel, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

interface PostProps {
  post: SerializedPost | null;
}

const PostPage: NextPage<PostProps> = ({ post }) => {
  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Hero Section */}
      <header className="w-full bg-gradient-to-b from-primary/10 to-background py-12 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <time dateTime={post.createdAt}>
              Published: {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            {post.updatedAt !== post.createdAt && (
              <time dateTime={post.updatedAt}>
                • Updated: {new Date(post.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 max-w-4xl py-8">
        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <div className="post-content rounded-lg bg-card p-6 shadow-sm">
            <PluginRenderer content={post.content} />
          </div>
        </article>
      </main>

      {/* Optional: Add a footer with navigation or related posts */}
      <footer className="container mx-auto px-4 max-w-4xl py-8 border-t border-border mt-8">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <Link 
            href="/posts" 
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            ← Back to all posts
          </Link>
          {/* Optional: Add share buttons or other actions here */}
        </div>
      </footer>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await prisma.post.findMany();
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<PostProps, { slug: string }> = async ({ params }) => {
  if (!params) {
    return { notFound: true };
  }
  const { slug } = params;

  const post = await prisma.post.findUnique({
    where: { slug: slug },
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  // Serialize Date objects to ISO strings before passing as props
  const serializedPost = {
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };

  return {
    props: {
      post: serializedPost as SerializedPost,
      revalidate: 10,
    },
  };
};

export default PostPage;