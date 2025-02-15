import PageList from '../../../../components/PageList';

const AdminPagesIndex = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl text-center">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground text-center">
            Manage and organize your pages
          </p>
        </div>
        <PageList />
      </div>
    </div>
  );
};

export default AdminPagesIndex;