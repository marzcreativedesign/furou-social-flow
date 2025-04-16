
export interface GalleryImage {
  id: string;
  src: string;
  user_id: string;
  event_id: string;
  filename: string;
  created_at: string;
  user?: {
    fullName: string | null;
    avatarUrl: string | null;
  };
}
