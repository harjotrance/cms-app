import { PrismaClient, Page as PageModel } from '@prisma/client';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';

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
    <div>
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content || '' }} />
      {/* Optionally display dates if needed */}
      {/* <p>Created At: {page.createdAt?.toISOString()}</p> */}
      {/* <p>Updated At: {page.updatedAt?.toISOString()}</p> */}
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