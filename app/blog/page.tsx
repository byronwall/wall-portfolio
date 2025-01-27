import { BlogPosts } from "app/components/posts";

export const metadata = {
  title: "Blog",
  description: "Read my blog.",
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
