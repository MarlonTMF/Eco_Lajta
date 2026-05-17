export interface LeaderboardEntryDTO {
  rank: number;
  name: string;
  zone: string;
  points: number;
  growth: string;
  initials?: string;
  avatar?: string;
  isCurrentUser?: boolean;
}

export interface NewsFeedItemDTO {
  id: string;
  author: string;
  authorTitle: string;
  avatar: string;
  isAvatarImage: boolean;
  timeAgo: string;
  category: string;
  categoryClass: string;
  content: string;
  image?: string;
  likes: number;
  commentsCount: number;
  likedByUser?: boolean;
}
