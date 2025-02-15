"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Plus, FileText, Pencil, Trash2 } from "lucide-react";

const PageList = () => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const fetchPages = async () => {
      const response = await fetch('/api/pages');
      const data = await response.json();
      setPages(data);
    };
    fetchPages();
  }, []);

  const handleDeletePage = async (pageId) => {
    if (confirm('Are you sure you want to delete this page?')) {
      try {
        const response = await fetch(`/api/pages/${pageId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setPages(pages.filter(page => page.id !== pageId));
        } else {
          console.error('Failed to delete page');
        }
      } catch (error) {
        console.error('Error deleting page:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Pages</h2>
          <p className="text-muted-foreground mt-1 py-2">Manage your website pages</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" asChild>
          <Link href="/admin/pages/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Page
          </Link>
        </Button>
      </div>

      {pages.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-xl font-medium text-muted-foreground">No pages created yet</p>
          <p className="text-sm text-muted-foreground mt-1">Get started by creating your first page</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border shadow-sm">
          {pages.map((page, index) => (
            <div 
              key={page.id} 
              className={`p-4 flex items-center justify-between ${
                index !== pages.length - 1 ? 'border-b' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 px-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="px-4 py-2">
                  <Link 
                    href={`/admin/pages/${page.id}`}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {page.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Last edited {new Date(page.updatedAt || page.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link href={`/admin/pages/${page.id}`}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeletePage(page.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PageList;