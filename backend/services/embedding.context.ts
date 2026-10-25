export function getPostEmbeddingText(post: {
  title: string;
  desc: string;
  content: string;
  categories: string[];
}) {
  return [
    `Title: ${post.title}`,
    `Description: ${post.desc}`,
    `Categories: ${post.categories.join(", ")}`,
    `Content: ${post.content}`,
  ].join("\n");
}
