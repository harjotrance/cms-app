import { PrismaClient, Page as PageModel } from '@prisma/client';
import Link from 'next/link';
import { GetStaticProps, NextPage } from 'next';

const prisma = new PrismaClient();

// Create an interface for the serialized Page
interface SerializedPage extends Omit<PageModel, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

interface PagesListPageProps {
  pages: SerializedPage[];
}

const PagesListPage: NextPage<PagesListPageProps> = ({ pages }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Pages</h1>
        <div className="grid gap-4">
          {pages.map((page) => (
            <article key={page.id} className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <Link
                href={`/pages/${page.slug}`}
                className="block hover:text-primary transition-colors"
              >
                <h2 className="text-xl font-semibold mb-2">{page.title}</h2>
                <div className="text-sm text-muted-foreground">
                  {new Date(page.createdAt).toLocaleDateString('en-US', {
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

export const getStaticProps: GetStaticProps<PagesListPageProps> = async () => {
  const pages = await prisma.page.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Serialize the dates to strings
  const serializedPages = pages.map(page => ({
    ...page,
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
  }));

  return {
    props: {
      pages: serializedPages,
    },
    revalidate: 60,
  };
};

export default PagesListPage; 