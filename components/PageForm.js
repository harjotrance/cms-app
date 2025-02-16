"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react"; // Import useRef
import { useRouter } from "next/router";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Import Shadcn UI form components (keeping Button, Input, Form, etc.)
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../src/components/ui/form";
import { Input } from "../src/components/ui/input";
import { Button } from "../src/components/ui/button";

// Dynamic import for TinyMCE Editor
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false }
);

// Zod schema for form validation (no changes needed)
const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  slug: z.string().min(1, {
    message: "Slug is required.",
  }),
  content: z.string().optional(),
  postIds: z.array(z.string()).optional(),
});

const PageForm = ({ pageId }) => {
  const [content, setContent] = useState("");
  const [availablePlugins, setAvailablePlugins] = useState([]);
  const [isPluginsLoaded, setIsPluginsLoaded] = useState(false);
  const [availablePosts, setAvailablePosts] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
  const router = useRouter();
  const dropdownRef = useRef(null); // Ref for dropdown container
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      postIds: [],
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    const fetchPlugins = async () => {
      try {
        const response = await fetch("/api/plugins");
        if (!response.ok) {
          throw new Error("Failed to fetch plugins");
        }
        const plugins = await response.json();
        setAvailablePlugins(plugins);
        setIsPluginsLoaded(true);
      } catch (error) {
        console.error("Error fetching plugins:", error);
        setIsPluginsLoaded(true);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (response.ok) {
          const postsData = await response.json();
          setAvailablePosts(postsData);
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPlugins();
    fetchPosts();
  }, []);

  useEffect(() => {
    if (pageId) {
      const fetchPage = async () => {
        const response = await fetch(`/api/pages/${pageId}`);
        const data = await response.json();
        form.reset({
          title: data.title || "",
          slug: data.slug || "",
          content: data.content || "",
          postIds: data.postIds || [],
        });
        setContent(data.content || "");
      };
      fetchPage();
    }
  }, [pageId, form]);

  const handleSubmit = async (values) => {
    const method = pageId ? "PUT" : "POST";
    const url = pageId ? `/api/pages/${pageId}` : "/api/pages";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, content: content }),
      });

      if (response.ok) {
        router.push("/admin/pages");
      } else {
        console.error("Failed to submit page");
      }
    } catch (error) {
      console.error("Error submitting page:", error);
    }
  };

  // Function to handle checkbox change
  const handlePostSelectionChange = (postId, isChecked) => {
    const currentPostIds = form.getValues("postIds") || []; // Get current postIds from form
    let updatedPostIds;

    if (isChecked) {
      updatedPostIds = [...currentPostIds, postId]; // Add postId if checked
    } else {
      updatedPostIds = currentPostIds.filter((id) => id !== postId); // Remove postId if unchecked
    }

    form.setValue("postIds", updatedPostIds); // Update form state with new postIds
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-3xl">
        <div className="bg-card p-8 rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold text-center mb-6">
            {pageId ? "Edit Page" : "Create New Page"}
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Title and Slug FormFields - No Changes Needed */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ marginLeft: "4px" }}>Title</FormLabel>
                    <FormControl>
                      <Input
                        style={{ marginBottom: "12px" }}
                        placeholder="Enter page title"
                        {...field}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ marginLeft: "4px" }}>Slug</FormLabel>
                    <FormControl>
                      <Input
                        style={{ marginBottom: "12px" }}
                        placeholder="Enter page slug"
                        {...field}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
{/* 
             <FormField
                control={form.control}
                name="postIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ marginLeft: "4px", marginTop: "12px" }}>
                      Associated Posts
                    </FormLabel>
                    <FormControl>
                      <div ref={dropdownRef} className="relative">
                        
                        <Button
                          variant="outline"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full justify-start text-left bg-background" // Match input style
                          type="button"
                        >
                          {field.value && field.value.length > 0
                            ? `${field.value.length} posts selected` // Display count of selected posts
                            : "Select posts to associate"}
                        </Button>

                        Dropdown Content (Checkbox List)
                        {isDropdownOpen && (
                          <div style={{ zIndex: "99" }} className="absolute z-10 mt-1 w-full rounded-lg bg-popover shadow-md border border-border overflow-hidden">
                            {" "}
                            
                            <div className="max-h-60 overflow-y-auto p-3">
                              {" "}
                              
                              {availablePosts.map((post) => (
                                <div
                                  key={post.id}
                                  className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-accent transition-colors duration-200 ${
                                    // Added py-2 for vertical padding, transition for smoother hover
                                    field.value?.includes(post.id)
                                      ? "bg-muted"
                                      : "" // Highlight selected items with bg-muted
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    id={`post-${post.id}`}
                                    value={post.id}
                                    checked={field.value?.includes(post.id)}
                                    onChange={(e) =>
                                      handlePostSelectionChange(
                                        post.id,
                                        e.target.checked
                                      )
                                    }
                                    className="ring-offset-background focus-visible:ring-ring h-4 w-4 border-border focus-visible:ring-2 focus-visible:ring-offset-2 rounded focus:outline-none disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                  />
                                  <label
                                    style={{ marginLeft: "8px" }}
                                    htmlFor={`post-${post.id}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {post.title}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Choose one or more posts to display on this page.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* Content FormField - No Changes Needed */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ marginLeft: "4px" }}>Content</FormLabel>
                    <FormControl>
                      <div className="rounded-md shadow-sm overflow-hidden">
                        {isPluginsLoaded ? (
                          <Editor
                            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                            value={content}
                            onEditorChange={(newContent) => {
                              setContent(newContent);
                              field.onChange(newContent);
                            }}
                            init={{
                              height: 500,
                              menubar: false,
                              skin: "oxide-dark",
                              color_scheme: "dark",
                              content_css: "dark",
                              plugins: [
                                "advlist",
                                "autolink",
                                "lists",
                                "link",
                                "image",
                                "charmap",
                                "preview",
                                "anchor",
                                "searchreplace",
                                "visualblocks",
                                "code",
                                "fullscreen",
                                "insertdatetime",
                                "media",
                                "table",
                                "code",
                                "help",
                                "wordcount",
                              ],
                              toolbar:
                                "undo redo | blocks | " +
                                "bold italic forecolor | alignleft aligncenter " +
                                "alignright alignjustify | bullist numlist outdent indent | " +
                                "removeformat | help | pluginbuttons",
                              content_style:
                                "body { font-family:Helvetica,Arial,sans-serif; }",
                              setup: (editor) => {
                                if (availablePlugins.length > 0) {
                                  availablePlugins.forEach((plugin) => {
                                    editor.ui.registry.addButton(
                                      `plugin-${plugin.contentBlockType}`,
                                      {
                                        text: plugin.name,
                                        tooltip: plugin.description,
                                        onAction: () => {
                                          const placeholder = `[plugin:${plugin.contentBlockType} data='{}']`;
                                          editor.insertContent(placeholder);
                                        },
                                      }
                                    );
                                  });

                                  editor.ui.registry.addGroupToolbarButton(
                                    "pluginbuttons",
                                    {
                                      icon: "plugins",
                                      tooltip: "Insert Plugin",
                                      items: availablePlugins
                                        .map(
                                          (plugin) =>
                                            `plugin-${plugin.contentBlockType}`
                                        )
                                        .join(" "),
                                    }
                                  );
                                }
                              },
                            }}
                          />
                        ) : (
                          <div className="h-[500px] flex items-center justify-center bg-background">
                            Loading editor...
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Buttons - No Changes Needed */}
              <div className="flex justify-center gap-4 pt-4 mt-8">
                <Link href="/admin/pages">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit">
                  {pageId ? "Update Page" : "Create Page"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default PageForm;
