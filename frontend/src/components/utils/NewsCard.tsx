import { Link } from "react-router-dom";
import { getOptimizedImageUrl } from "@/lib/optimizedImageUrl";
import type { NewsCardProps } from "@/types/posts";

export function NewsCard({ post, onClick }: NewsCardProps) {
  return (
    <article
      onClick={onClick}
      className="group cursor-pointer flex flex-col justify-between border-b border-border/40 pb-6 mb-6 md:border-none md:pb-0 md:mb-0"
    >
      <Link to={`/blog/${post?.id ?? post?._id}`}>
        {/* Image Container with subtle zoom */}
        <div className="overflow-hidden rounded-sm bg-muted aspect-[16/10] mb-4">
          <img
            src={getOptimizedImageUrl(post.image || "/placeholder.svg", 800)}
            alt={post.title}
            className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Content wrapper */}
        <div className="flex flex-col flex-grow">
          {/* Overline Kicker */}
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-red-600 mb-2">
            {post.postType || post.categories?.[0] || "Culture"}
          </div>

          {/* Headline */}
          <h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-muted-foreground line-clamp-2 font-sans mb-4">
            {post.desc}
          </p>

          {/* Byline / Metadata */}
          <div className="mt-auto pt-4 border-t border-border/20 flex items-center justify-between text-xs text-muted-foreground font-sans">
            <span>By {post.username?.name || "Staff Writer"}</span>
            <span>
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString()
                : "Recent"}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
