import Link from 'next/link';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <nav>
        <ul>
          <li>
            <Link href="/admin/posts">Manage Posts</Link>
          </li>
          <li>
            <Link href="/admin/pages">Manage Pages</Link>
          </li>
          {/* You can add more admin links here later */}
        </ul>
      </nav>
    </div>
  );
};

export default AdminDashboard;