import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faCalendarAlt, faUser, faComments } from '@fortawesome/free-solid-svg-icons';
import SpinnerWithIcon from './SpinnerWithIcon';
import { mockArticles } from '../data/mockData';

const BlogDetail = () => {
  const [expandedBlogId, setExpandedBlogId] = useState(null);
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch blog data from API on component mount
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${baseUrl}/api/articles`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBlogs(Array.isArray(data) && data.length > 0 ? data : mockArticles);
      } catch (err) {
        console.warn('Error fetching blogs, showing mock articles:', err);
        setError(true);
        setBlogs(mockArticles);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  const toggleBlogContent = (id) => {
    setExpandedBlogId((prevId) => (prevId === id ? null : id));
  };

  const handleCommentSubmit = (blogId) => {
    const text = (commentInputs[blogId] || '').trim();
    if (text) {
      setComments((prev) => ({
        ...prev,
        [blogId]: [...(prev[blogId] || []), text],
      }));
      setCommentInputs((prev) => ({ ...prev, [blogId]: '' }));
    }
  };

  return (
    <div className="bg-[#FAF6F0] min-h-screen py-14">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#1B4332]/10 text-[#1B4332] border border-[#D4A373]/30 text-xs uppercase tracking-widest font-semibold mb-3">
            🌾 जय जोहार • DANDAKARANYA TRAVEL STORIES
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold font-serif text-[#1B4332] mb-4">
            Expedition Stories & Guides
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Insider trail guides, Baiga folklore, and seasonal packing tips from native explorers traversing the 36 Forts of Central India.
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <SpinnerWithIcon />
          </div>
        ) : (
          <div className="space-y-8">
            {blogs.map((blog) => {
              const isExpanded = expandedBlogId === blog.id;
              const blogComments = comments[blog.id] || [];

              return (
                <article
                  key={blog.id}
                  className="bg-white rounded-3xl border border-[#EADBCE] p-8 sm:p-10 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 flex-wrap">
                    <span className="flex items-center gap-1.5 text-[#C84B31] font-semibold">
                      <FontAwesomeIcon icon={faUser} />
                      {blog.author}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-[#D4A373]" />
                      {blog.date}
                    </span>
                  </div>

                  <h2
                    onClick={() => toggleBlogContent(blog.id)}
                    className="text-2xl sm:text-3xl font-bold font-serif text-[#1B4332] hover:text-[#C84B31] cursor-pointer transition mb-4 leading-snug"
                  >
                    {blog.title}
                  </h2>

                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed italic mb-6">
                    "{blog.shortDescription}"
                  </p>

                  <button
                    onClick={() => toggleBlogContent(blog.id)}
                    className="px-6 py-2.5 bg-[#C84B31] hover:bg-[#9E321C] text-white text-xs sm:text-sm font-bold rounded-xl shadow transition duration-200"
                  >
                    {isExpanded ? "Show Less ↑" : "Read Full Story →"}
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="mt-8 pt-6 border-t border-[#F0E5D3] animate-in fade-in duration-300">
                      <div
                        className="prose prose-sm sm:prose max-w-none text-gray-700 leading-relaxed space-y-4"
                        dangerouslySetInnerHTML={{ __html: blog.fullContent }}
                      />

                      {/* Social Media Share */}
                      <div className="mt-8 pt-5 border-t border-[#F0E5D3] flex flex-wrap items-center justify-between gap-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                          Share this Story:
                        </span>
                        <div className="flex items-center gap-3">
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(blog.title + ' - Read more: https://36-montane.vercel.app/blogs')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center text-sm shadow hover:scale-110 transition"
                            title="Share on WhatsApp"
                          >
                            <FontAwesomeIcon icon={faWhatsapp} />
                          </a>
                          <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=https://36-montane.vercel.app/blogs`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-sm shadow hover:scale-110 transition"
                            title="Share on Facebook"
                          >
                            <FontAwesomeIcon icon={faFacebook} />
                          </a>
                          <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=https://36-montane.vercel.app/blogs`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center text-sm shadow hover:scale-110 transition"
                            title="Share on Twitter"
                          >
                            <FontAwesomeIcon icon={faTwitter} />
                          </a>
                          <a
                            href={`https://www.linkedin.com/shareArticle?mini=true&url=https://36-montane.vercel.app/blogs&title=${encodeURIComponent(blog.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center text-sm shadow hover:scale-110 transition"
                            title="Share on LinkedIn"
                          >
                            <FontAwesomeIcon icon={faLinkedin} />
                          </a>
                        </div>
                      </div>

                      {/* Comments Section */}
                      <div className="mt-8 pt-6 border-t border-[#F0E5D3]">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-[#1B4332] flex items-center gap-2 mb-4">
                          <FontAwesomeIcon icon={faComments} className="text-[#C84B31]" />
                          Discussion ({blogComments.length})
                        </h4>

                        <div className="flex flex-col sm:flex-row gap-2 mb-4">
                          <input
                            type="text"
                            value={commentInputs[blog.id] || ''}
                            onChange={(e) => setCommentInputs({ ...commentInputs, [blog.id]: e.target.value })}
                            placeholder="Add your travel insight or question..."
                            className="flex-grow p-3 bg-[#FAF6F0] border border-[#EADBCE] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#C84B31] focus:ring-1 focus:ring-[#C84B31]"
                          />
                          <button
                            onClick={() => handleCommentSubmit(blog.id)}
                            className="px-5 py-2.5 bg-[#1B4332] hover:bg-[#11261D] text-white text-xs font-bold rounded-xl transition"
                          >
                            Post Comment
                          </button>
                        </div>

                        {blogComments.length > 0 && (
                          <div className="space-y-2 mt-4">
                            {blogComments.map((comment, index) => (
                              <div
                                key={index}
                                className="bg-[#FAF6F0] p-3.5 rounded-xl border border-[#EADBCE] text-xs text-gray-700"
                              >
                                <span className="font-bold text-[#1B4332] block mb-1">Explorer</span>
                                {comment}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;

