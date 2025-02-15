import PageForm from '../../../../components/PageForm';

const AdminEditPage = ({ query }) => {
  const { id } = query;
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-center">
            Edit Page
          </h1>
          <p className="mt-2 text-muted-foreground text-center">
            Make changes to your page content
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <PageForm pageId={id} />
        </div>
      </div>
    </div>
  );
};

AdminEditPage.getInitialProps = ({ query }) => {
  return { query };
};

export default AdminEditPage;