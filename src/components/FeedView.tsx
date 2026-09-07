import { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Home,
  Compass,
  PlusSquare,
  LogOut,
  Search,
  MoreHorizontal,
  ChevronDown,
  User as UserIcon,
  Settings,
  Languages,
} from 'lucide-react';
import { User, Post, Story, Language } from '../types';
import { sampleStories, samplePosts } from '../data/mockData';

interface FeedViewProps {
  user: User;
  lang: Language;
  onLanguageToggle: () => void;
  onRequestLogout: () => void;
}

export default function FeedView({
  user,
  lang,
  onLanguageToggle,
  onRequestLogout,
}: FeedViewProps) {
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [stories] = useState<Story[]>(sampleStories);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [newComment, setNewComment] = useState<{ [postId: string]: string }>({});

  const isArabic = lang === 'ar';

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  const toggleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return { ...post, isSaved: !post.isSaved };
        }
        return post;
      })
    );
  };

  const handleAddComment = (postId: string) => {
    const text = newComment[postId];
    if (!text || !text.trim()) return;
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return { ...post, commentsCount: post.commentsCount + 1 };
        }
        return post;
      })
    );
    setNewComment((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div
      className="min-h-screen bg-[#fafafa] text-[#262626] font-sans pb-12"
      dir={isArabic ? 'rtl' : 'ltr'}
      id="feed-view-root"
    >
      {/* Top Instagram Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#dbdbdb] px-4 md:px-8 py-2.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Logo with vintage Instagram script font */}
          <div className="flex items-center gap-2">
            <h1
              className="font-vintage-insta text-3xl md:text-4xl text-[#262626] select-none tracking-normal cursor-pointer"
              style={{ lineHeight: 1 }}
            >
              clasty zoom
            </h1>
            <ChevronDown size={14} className="text-neutral-500 hidden sm:block" />
          </div>

          {/* Search bar */}
          <div className="hidden md:flex items-center bg-[#efefef] rounded-lg px-3 py-1.5 w-64 text-neutral-500">
            <Search size={16} className="shrink-0" />
            <input
              type="text"
              placeholder={isArabic ? 'بحث' : 'Search'}
              className="bg-transparent text-xs text-neutral-800 focus:outline-none px-2 w-full"
            />
          </div>

          {/* Navigation Icons & Profile */}
          <div className="flex items-center gap-3 md:gap-5">
            <button
              onClick={onLanguageToggle}
              className="flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900 border border-neutral-200 rounded-full px-2.5 py-1 transition"
              title={isArabic ? 'تبديل اللغة إلى الإنجليزية' : 'Switch to Arabic'}
              id="btn-nav-lang-toggle"
            >
              <Languages size={14} />
              <span>{isArabic ? 'English' : 'العربية'}</span>
            </button>

            <button className="text-neutral-800 hover:opacity-70 transition p-1" title="Home">
              <Home size={22} className="stroke-[2.2]" />
            </button>

            <button className="text-neutral-800 hover:opacity-70 transition p-1" title="Explore">
              <Compass size={22} />
            </button>

            <button className="text-neutral-800 hover:opacity-70 transition p-1" title="New Post">
              <PlusSquare size={22} />
            </button>

            <button className="text-neutral-800 hover:opacity-70 transition p-1" title="Notifications">
              <Heart size={22} />
            </button>

            {/* Direct Logout shortcut button on navbar */}
            <button
              onClick={onRequestLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-md text-xs font-semibold transition active:scale-95 shadow-xs"
              title={isArabic ? 'تسجيل الخروج' : 'Log Out'}
              id="btn-header-logout"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">{isArabic ? 'تسجيل خروج' : 'Log out'}</span>
            </button>

            {/* Profile Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-8 h-8 rounded-full ring-2 ring-transparent hover:ring-neutral-400 p-[1px] transition focus:outline-none"
                id="btn-user-avatar-menu"
              >
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div
                  className="absolute top-10 left-0 rtl:left-auto rtl:right-0 w-48 bg-white border border-neutral-200 rounded-xl shadow-xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
                  id="user-dropdown-menu"
                >
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <p className="font-semibold text-neutral-900 truncate">@{user.username}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{user.name}</p>
                  </div>

                  <button
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full px-4 py-2 flex items-center gap-2.5 text-neutral-700 hover:bg-neutral-50 transition"
                  >
                    <UserIcon size={16} />
                    <span>{isArabic ? 'الملف الشخصي' : 'Profile'}</span>
                  </button>

                  <button
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full px-4 py-2 flex items-center gap-2.5 text-neutral-700 hover:bg-neutral-50 transition"
                  >
                    <Bookmark size={16} />
                    <span>{isArabic ? 'المحفوظات' : 'Saved'}</span>
                  </button>

                  <button
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="w-full px-4 py-2 flex items-center gap-2.5 text-neutral-700 hover:bg-neutral-50 transition"
                  >
                    <Settings size={16} />
                    <span>{isArabic ? 'الإعدادات' : 'Settings'}</span>
                  </button>

                  <div className="border-t border-neutral-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onRequestLogout();
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-2.5 text-rose-600 hover:bg-rose-50 font-semibold transition"
                      id="btn-dropdown-logout"
                    >
                      <LogOut size={16} />
                      <span>{isArabic ? 'تسجيل الخروج' : 'Log out'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Feed Content Layout */}
      <main className="max-w-5xl mx-auto px-2 sm:px-4 pt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Stories + Posts */}
        <div className="lg:col-span-2 space-y-4">
          {/* Stories Bar */}
          <div className="bg-white border border-[#dbdbdb] rounded-lg p-4 flex items-center gap-4 overflow-x-auto scrollbar-none shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            {/* Current user story */}
            <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer">
              <div className="relative">
                <div className="w-16 h-16 rounded-full p-[2px] border-2 border-dashed border-neutral-300">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#0095f6] text-white rounded-full flex items-center justify-center text-xs font-bold border border-white">
                  +
                </div>
              </div>
              <span className="text-[11px] text-neutral-600 max-w-[64px] truncate">
                {isArabic ? 'قصتك' : 'Your story'}
              </span>
            </div>

            {/* Other stories */}
            {stories.map((story) => (
              <div
                key={story.id}
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] via-[#d62976] via-[#962fbf] to-[#4f5bd5] group-hover:scale-105 transition">
                  <div className="w-full h-full rounded-full bg-white p-[2px]">
                    <img
                      src={story.avatar}
                      alt={story.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-[11px] text-neutral-700 max-w-[68px] truncate">
                  {story.username}
                </span>
              </div>
            ))}
          </div>

          {/* Posts Feed */}
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-[#dbdbdb] rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full p-[1.5px] bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#962fbf]">
                    <div className="w-full h-full rounded-full bg-white p-[1.5px]">
                      <img
                        src={post.userAvatar}
                        alt={post.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-900 cursor-pointer hover:underline">
                        {post.username}
                      </span>
                      <span className="text-[11px] text-neutral-400">• {post.timeAgo}</span>
                    </div>
                    {post.location && (
                      <p className="text-[11px] text-neutral-500">{post.location}</p>
                    )}
                  </div>
                </div>
                <button className="text-neutral-600 hover:text-neutral-900 p-1">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* Post Image */}
              <div className="relative bg-neutral-100 aspect-square">
                <img
                  src={post.image}
                  alt={post.caption}
                  className="w-full h-full object-cover select-none"
                  onDoubleClick={() => toggleLike(post.id)}
                />
              </div>

              {/* Post Action Buttons */}
              <div className="p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className="hover:scale-110 active:scale-90 transition p-0.5"
                    >
                      <Heart
                        size={24}
                        className={
                          post.isLiked
                            ? 'text-[#ed4956] fill-[#ed4956] stroke-[#ed4956]'
                            : 'text-neutral-800 hover:text-neutral-500'
                        }
                      />
                    </button>
                    <button className="hover:scale-110 active:scale-90 transition p-0.5 text-neutral-800 hover:text-neutral-500">
                      <MessageCircle size={24} />
                    </button>
                    <button className="hover:scale-110 active:scale-90 transition p-0.5 text-neutral-800 hover:text-neutral-500">
                      <Send size={24} />
                    </button>
                  </div>
                  <button
                    onClick={() => toggleSave(post.id)}
                    className="hover:scale-110 active:scale-90 transition p-0.5 text-neutral-800"
                  >
                    <Bookmark
                      size={24}
                      className={post.isSaved ? 'fill-neutral-900 text-neutral-900' : ''}
                    />
                  </button>
                </div>

                {/* Likes count */}
                <p className="text-xs font-bold text-neutral-900">
                  {post.likes.toLocaleString()}{' '}
                  {isArabic ? 'إعجاباً' : 'likes'}
                </p>

                {/* Caption */}
                <div className="text-xs leading-relaxed text-neutral-800">
                  <span className="font-bold cursor-pointer hover:underline mr-2 rtl:mr-0 rtl:ml-2">
                    {post.username}
                  </span>
                  <span>{post.caption}</span>
                </div>

                {/* Comments Link */}
                <button className="text-[12px] text-neutral-400 hover:text-neutral-600 transition block">
                  {isArabic
                    ? `عرض كل التعليقات (${post.commentsCount})`
                    : `View all ${post.commentsCount} comments`}
                </button>

                {/* Quick Add Comment Box */}
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <input
                    type="text"
                    value={newComment[post.id] || ''}
                    onChange={(e) =>
                      setNewComment({ ...newComment, [post.id]: e.target.value })
                    }
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                    placeholder={isArabic ? 'إضافة تعليق...' : 'Add a comment...'}
                    className="w-full text-xs text-neutral-800 placeholder-neutral-400 bg-transparent focus:outline-none"
                  />
                  {newComment[post.id] && newComment[post.id].trim().length > 0 && (
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="text-xs font-semibold text-[#0095f6] hover:text-[#00376b] shrink-0"
                    >
                      {isArabic ? 'نشر' : 'Post'}
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Right Sidebar (Desktop only) */}
        <aside className="hidden lg:block space-y-6">
          {/* User Profile Mini Card with Prominent Logout */}
          <div className="bg-white border border-[#dbdbdb] rounded-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-neutral-200">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-neutral-900 leading-tight">
                    {user.username}
                  </h2>
                  <p className="text-xs text-neutral-500 leading-tight">{user.name}</p>
                </div>
              </div>
            </div>

            {/* Prominent Log Out Action inside sidebar */}
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
              <button
                onClick={onRequestLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-neutral-50 hover:bg-rose-50 text-rose-600 border border-neutral-200 hover:border-rose-200 rounded-lg text-xs font-semibold transition"
                id="btn-sidebar-logout"
              >
                <LogOut size={15} />
                <span>{isArabic ? 'تسجيل الخروج من الحساب' : 'Log out of account'}</span>
              </button>
            </div>
          </div>

          {/* Suggested Users */}
          <div className="bg-white border border-[#dbdbdb] rounded-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-semibold text-neutral-500">
                {isArabic ? 'اقتراحات لك' : 'Suggestions for you'}
              </span>
              <button className="font-semibold text-neutral-900 hover:text-neutral-500 text-[11px]">
                {isArabic ? 'عرض الكل' : 'See All'}
              </button>
            </div>

            <div className="space-y-3">
              {[
                {
                  username: 'nostalgia_art',
                  avatar:
                    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
                  relation: isArabic ? 'يتابعه sara_art' : 'Followed by sara_art',
                },
                {
                  username: 'vintage_camera_co',
                  avatar:
                    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
                  relation: isArabic ? 'جديد على Clasty Zoom' : 'New to Clasty Zoom',
                },
                {
                  username: 'classic_photoworks',
                  avatar:
                    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
                  relation: isArabic ? 'اقتراح مميز' : 'Suggested for you',
                },
              ].map((sug) => (
                <div key={sug.username} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={sug.avatar}
                      alt={sug.username}
                      className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                    />
                    <div>
                      <p className="font-semibold text-neutral-900 hover:underline cursor-pointer">
                        {sug.username}
                      </p>
                      <p className="text-[10px] text-neutral-400">{sug.relation}</p>
                    </div>
                  </div>
                  <button className="text-[11px] font-semibold text-[#0095f6] hover:text-[#00376b]">
                    {isArabic ? 'متابعة' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Info & Vintage Brand Note */}
          <div className="px-2 text-[11px] text-neutral-400 space-y-1">
            <p className="font-medium">
              <span className="font-vintage-insta text-base text-neutral-600 mr-1 rtl:mr-0 rtl:ml-1">
                clasty zoom
              </span>{' '}
              {isArabic ? '• الواجهة الكلاسيكية' : '• Classic Vintage Experience'}
            </p>
            <p>© 2026 CLASTY ZOOM FROM META</p>
          </div>
        </aside>
      </main>
    </div>
  );
}
