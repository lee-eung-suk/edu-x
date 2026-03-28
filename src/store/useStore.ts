import { create } from 'zustand';

export interface User {
  uid: string;
  name: string;
  handle: string;
  photoURL: string;
  bio?: string;
  followers: number;
  following: number;
  createdAt: number;
}

export interface Post {
  id: string;
  text: string;
  imageUrl?: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  authorPhoto: string;
  createdAt: number;
  likes: number;
  comments: number;
  retweets: number;
  views: number;
  isLiked?: boolean;
}

export interface Notification {
  id: string;
  type: 'like' | 'retweet' | 'follow';
  sourceUser: { name: string; handle: string; photoURL: string };
  targetPostId?: string;
  createdAt: number;
  read: boolean;
}

interface AppState {
  currentUser: User | null;
  posts: Post[];
  notifications: Notification[];
  bookmarks: string[]; // Array of post IDs
  isDarkMode: boolean;
  
  setCurrentUser: (user: User | null) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  toggleLike: (postId: string) => void;
  toggleBookmark: (postId: string) => void;
  setNotifications: (notifications: Notification[]) => void;
  markNotificationRead: (id: string) => void;
  toggleDarkMode: () => void;
}

export const useStore = create<AppState>((set) => ({
  currentUser: null,
  posts: [],
  notifications: [
    {
      id: 'n1',
      type: 'like',
      sourceUser: { name: '김선생', handle: '@kim_t', photoURL: 'https://picsum.photos/seed/kim/40/40' },
      createdAt: Date.now() - 1000 * 60 * 5,
      read: false,
    },
    {
      id: 'n2',
      type: 'follow',
      sourceUser: { name: '박교사', handle: '@park_edu', photoURL: 'https://picsum.photos/seed/park/40/40' },
      createdAt: Date.now() - 1000 * 60 * 60,
      read: true,
    }
  ],
  bookmarks: [],
  isDarkMode: false,

  setCurrentUser: (user) => set({ currentUser: user }),
  updateCurrentUser: (updates) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null
  })),
  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  toggleLike: (postId) => set((state) => ({
    posts: state.posts.map(p => p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p)
  })),
  toggleBookmark: (postId) => set((state) => ({
    bookmarks: state.bookmarks.includes(postId) 
      ? state.bookmarks.filter(id => id !== postId)
      : [...state.bookmarks, postId]
  })),
  setNotifications: (notifications) => set({ notifications }),
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  toggleDarkMode: () => set((state) => {
    const newMode = !state.isDarkMode;
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { isDarkMode: newMode };
  }),
}));
