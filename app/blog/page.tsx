import { BlogPosts } from "app/components/posts";
import { baseUrl } from "app/sitemap";

export const metadata = {
  title: "Blog",
  description:
    "Technical notes from Byron Wall on software development, data analysis, SolidJS, TypeScript, AI tooling, and engineering workflows.",
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
};

export default function BlogPage() {
  return (
    <section>
      <h1 className="font-bold text-3xl mb-8">Blog</h1>
      <p className="prose prose-neutral dark:prose-invert mb-8">
        I write about software development, data analysis, and engineering. Here
        are some of my recent posts:
      </p>
      <BlogPosts />
    </section>
  );
}
