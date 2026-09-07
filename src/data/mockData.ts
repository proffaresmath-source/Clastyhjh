import { User, Post, Story } from '../types';

export const currentUser: User = {
  id: 'user_1',
  username: 'vintage_vibes',
  name: 'Vintage Creator',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Capturing memories through the nostalgic lens of Clasty Zoom 📸✨',
  followersCount: 1420,
  followingCount: 389,
  postsCount: 54,
};

export const sampleStories: Story[] = [
  {
    id: 's1',
    username: 'sara_art',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    hasUnseenStory: true,
  },
  {
    id: 's2',
    username: 'omar_lens',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    hasUnseenStory: true,
  },
  {
    id: 's3',
    username: 'retro_cafe',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    hasUnseenStory: true,
  },
  {
    id: 's4',
    username: 'leila_photo',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    hasUnseenStory: false,
  },
  {
    id: 's5',
    username: 'tariq_travel',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    hasUnseenStory: true,
  },
];

export const samplePosts: Post[] = [
  {
    id: 'p1',
    username: 'retro_cafe',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    caption: 'صباح الهدوء والقهوة العتيقة في زاوية دافئة ☕️🤎 Morning rituals and vintage aesthetics.',
    likes: 842,
    commentsCount: 39,
    timeAgo: 'منذ ساعتين',
    isLiked: false,
    isSaved: false,
    location: 'Old Town Café',
  },
  {
    id: 'p2',
    username: 'omar_lens',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    caption: 'أيام التصوير التناظري وسحر العدسات الكلاسيكية 🎞️📷 Analog magic with Clasty Zoom vibes.',
    likes: 1205,
    commentsCount: 64,
    timeAgo: 'منذ ٥ ساعات',
    isLiked: true,
    isSaved: true,
    location: 'Film Studio 77',
  },
];

export const phoneSlides = [
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
];
