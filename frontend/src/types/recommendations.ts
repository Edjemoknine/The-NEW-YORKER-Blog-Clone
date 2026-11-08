export type UserEvent =
  | {
      eventType: "post_view";
      postId: string;
      metadata?: Record<string, unknown>;
    }
  | {
      eventType: "search";
      searchQuery: string;
      postId: string;
    };

export type FetchForYouParams = {
  limit: number;
  page: number;
};
