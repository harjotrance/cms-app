import { PrismaClient, Page as PageModel } from '@prisma/client';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import PluginRenderer from '../../../components/PluginRenderer';

const prisma = new PrismaClient();

// Create an interface that matches the serialized structure
interface SerializedPage extends Omit<PageModel, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

// Update the props interface
interface PageProps {
  page: SerializedPage | null;
}

const PageViewPage: NextPage<PageProps> = ({ page }) => {
  if (!page) {
    return <div>Page not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Hero Section */}
      <header className="w-full bg-gradient-to-b from-primary/10 to-background py-12 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {page.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <time dateTime={page.createdAt}>
              Published: {new Date(page.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            {page.updatedAt !== page.createdAt && (
              <time dateTime={page.updatedAt}>
                • Updated: {new Date(page.updatedAt).toLocaleDateString('en-US', {
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
            <PluginRenderer content={page.content} />
          </div>
        </article>
      </main>

      {/* Optional: Add a footer with navigation or related posts */}
      <footer className="container mx-auto px-4 max-w-4xl py-8 border-t border-border mt-8">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <Link
            href="/pages"
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            ← Back to all pages
          </Link>
          {/* Optional: Add share buttons or other actions here */}
        </div>
      </footer>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = await prisma.page.findMany();
  const paths = pages.map((page) => ({
    params: { slug: page.slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<PageProps, { slug: string }> = async ({ params }) => {
  if (!params) {
    return { notFound: true };
  }
  const { slug } = params;

  const page = await prisma.page.findUnique({
    where: { slug: slug },
  });

  if (!page) {
    return {
      notFound: true,
    };
  }

  // Serialize Date objects to ISO strings
  const serializedPage = {
    ...page,
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
  };

  return {
    props: {
      page: serializedPage as SerializedPage, // Use the correct type
      revalidate: 10,
    },
  };
};

export default PageViewPage;