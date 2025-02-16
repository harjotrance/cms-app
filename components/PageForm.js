"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Import Shadcn UI form components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Dynamic import for TinyMCE Editor
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false }
);

// Zod schema for form validation
const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  slug: z.string().min(1, {
    message: "Slug is required.",
  }),
  content: z.string().optional(),
});

const PageForm = ({ pageId }) => {
  const [content, setContent] = useState("");
  const [availablePlugins, setAvailablePlugins] = useState([]);
  const [isPluginsLoaded, setIsPluginsLoaded] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
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
        setIsPluginsLoaded(true); // Still set to true so editor loads
      }
    };
    fetchPlugins();
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
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      style={{
                        marginLeft: "4px",
                      }}
                    >
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        style={{
                          marginBottom: "12px",
                      }}
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
                    <FormLabel
                      style={{
                        marginLeft: "4px",
                      }}
                    >
                      Slug
                    </FormLabel>
                    <FormControl>
                      <Input
                        style={{
                          marginBottom: "12px",
                      }}
                        placeholder="Enter page slug"
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
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      style={{
                        marginLeft: "4px",
                      }}
                    >
                      Content
                    </FormLabel>
                    <FormControl>
                      <div className="rounded-md shadow-sm overflow-hidden">
                        {isPluginsLoaded ? (
                          <Editor
                            apiKey="i2mxzn8jvvrpdusumcbspx8kalj3aqe5uyjvwp9ygyqg6kwt"
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
