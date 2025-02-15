"use client"; // Mark as client component for interactivity

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button"; // Import Shadcn Button
import { Plus, FileText, Pencil, Trash2 } from "lucide-react";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null);     // Add error state

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // Set loading to true before fetching
      setError(null);    // Clear any previous errors
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (e) {
        console.error("Fetch error:", e);
        setError(e); // Set error state if fetch fails
      } finally {
        setLoading(false); // Set loading to false after fetch completes (success or error)
      }
    };
    fetchPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setPosts(posts.filter(post => post.id !== postId)); // Optimistic update
        } else {
          console.error('Failed to delete post');
          setError(new Error('Failed to delete post')); // Set error on delete failure
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        setError(error); // Set error on exception during delete
      }
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading posts...</div>; // Loading state UI
  }

  if (error) {
    return <div className="text-red-500 p-4">Error loading posts: {error.message}</div>; // Error state UI
  }


  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Posts</h2>
          <p className="text-muted-foreground mt-1 py-2">Manage your blog posts</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" asChild>
          <Link href="/admin/posts/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Post
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-xl font-medium text-muted-foreground">No posts created yet</p>
          <p className="text-sm text-muted-foreground mt-1">Get started by creating your first blog post</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border shadow-sm">
          {posts.map((post, index) => (
            <div 
              key={post.id} 
              className={`p-4 flex items-center justify-between ${
                index !== posts.length - 1 ? 'border-b' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 px-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="px-4 py-2">
                  <Link 
                    href={`/admin/posts/${post.id}`}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Last edited {new Date(post.updatedAt || post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link href={`/admin/posts/${post.id}`}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeletePost(post.id)}
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

export default PostList;