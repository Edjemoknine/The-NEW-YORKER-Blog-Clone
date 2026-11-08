import { Link } from "react-router-dom";
import { getOptimizedImageUrl } from "@/lib/optimizedImageUrl";
import type { NewsCardProps } from "@/types/posts";

export function NewsCard({ post, onClick }: NewsCardProps) {
  return (
    <article
      onClick={onClick}
      className="group flex cursor-pointer flex-col justify-between border-b border-border pb-6 mb-6 md:border-none md:pb-0 md:mb-0"
    >
      <Link to={`/blog/${post?.id ?? post?._id}`}>
        {/* Image Container with subtle zoom */}
        <div className="mb-4 aspect-[16/10] overflow-hidden rounded-sm bg-muted">
          <img
            src={getOptimizedImageUrl(post.image || "/placeholder.svg", 800)}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Content wrapper */}
        <div className="flex flex-col flex-grow">
          {/* Overline Kicker */}
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            {post.postType || post.categories?.[0] || "Culture"}
          </div>

          {/* Headline */}
          <h3 className="mb-2 line-clamp-2 font-editorial text-xl font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="mb-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {post.desc}
          </p>

          {/* Byline / Metadata */}
          <div className="mt-auto flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
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
