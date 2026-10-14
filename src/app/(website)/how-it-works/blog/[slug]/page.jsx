// src/app/(website)/blog/[slug]/page.jsx
import { BlogDetailClient } from "./BlogDetailClient";
import { posts } from "@/lib/posts";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return { title: "Journal |  " };
  }

  return {
    title: `${post.title} |   Journal`,
    description: post.excerpt || "",
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

export default function BlogDetailPage() {
  return <BlogDetailClient />;
}