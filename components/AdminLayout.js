import React from 'react';
import Link from 'next/link';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            CMS Admin Panel
          </h1>
        </div>
      </header>
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <nav className="mb-4">
            <ul className="flex space-x-4">
              <li>
                <Link href="/admin" className="text-blue-500 hover:underline">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/posts" className="text-blue-500 hover:underline">
                  Posts
                </Link>
              </li>
              <li>
                <Link href="/admin/pages" className="text-blue-500 hover:underline">
                  Pages
                </Link>
              </li>
              {/* Add more navigation links here as needed */}
            </ul>
          </nav>
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;