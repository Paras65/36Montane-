import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import SpinnerWithIcon from './SpinnerWithIcon';

// Styled components
const BlogContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  background-color: #f4f4f4;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const BlogTitle = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 15px;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #007bff;
  }
`;

const AuthorAndDate = styled.p`
  font-size: 1rem;
  color: #777;
  margin-bottom: 20px;
`;

const ShortDescription = styled.p`
  font-style: italic;
  color: #777;
`;

const ReadMoreButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;

const BlogContent = styled.div`
  font-size: 1.2rem;
  line-height: 1.6;
  color: #333;
  text-align: justify;

  p {
    margin-bottom: 20px;
  }

  ul {
    list-style-type: disc;
    margin-left: 20px;
  }

  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const SocialShare = styled.div`
  margin: 20px 0;
`;

const SocialIcon = styled.a`
  margin-right: 10px;
  font-size: 1.5rem;
  color: #333;
  text-decoration: none;

  &:hover {
    color: #007bff;
  }
`;

const CommentSection = styled.div`
  margin-top: 40px;
  border-top: 2px solid #e0e0e0;
  padding-top: 20px;
`;

const CommentInput = styled.textarea`
  width: 100%;
  height: 100px;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 1rem;
  color: #333;
`;

const SubmitButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const CommentList = styled.div`
  margin-top: 20px;
`;

const Comment = styled.div`
  background-color: #f8f8f8;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const HighlightedText = styled.span`
  font-weight: bold;
  color: #007bff;
`;



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
    <>
      {loading ? (
        <div className="py-20 flex justify-center">
          <SpinnerWithIcon />
        </div>
      ) : (
        blogs.map((blog) => (
          <BlogContainer key={blog.id}>
            <BlogTitle onClick={() => toggleBlogContent(blog.id)}>
              {blog.title}
            </BlogTitle>
            <AuthorAndDate>
              By <strong>{blog.author}</strong> | Published on {blog.date}
            </AuthorAndDate>

            {/* Short Description */}
            <ShortDescription>{blog.shortDescription}</ShortDescription>

            {/* Read More / Show Less Button */}
            <ReadMoreButton onClick={() => toggleBlogContent(blog.id)}>
              {expandedBlogId === blog.id ? "Show Less" : "Read More"}
            </ReadMoreButton>

            {/* Full Content - Show only if the blog is expanded */}
            {expandedBlogId === blog.id && (
              <BlogContent dangerouslySetInnerHTML={{ __html: blog.fullContent }} />
            )}

            {/* Social Media Share Buttons */}
            <SocialShare>
              <h3>Share this blog:</h3>
              <SocialIcon href={`https://www.facebook.com/sharer/sharer.php?u=https://36montane.com/${blog.id}`} target="_blank">
                <FontAwesomeIcon icon={faFacebook} />
              </SocialIcon>
              <SocialIcon href={`https://twitter.com/intent/tweet?url=https://36montane.com/${blog.id}&text=${blog.title}`} target="_blank">
                <FontAwesomeIcon icon={faTwitter} />
              </SocialIcon>
              <SocialIcon href={`https://www.linkedin.com/shareArticle?mini=true&url=https://36montane.com/${blog.id}`} target="_blank">
                <FontAwesomeIcon icon={faLinkedin} />
              </SocialIcon>
            </SocialShare>

            {/* Comment Section for Each Blog */}
            <CommentSection>
              <h3>Comments:</h3>
              <CommentInput
                value={commentInputs[blog.id] || ''}
                onChange={(e) => setCommentInputs({ ...commentInputs, [blog.id]: e.target.value })}
                placeholder="Write a comment..."
              />
              <SubmitButton onClick={() => handleCommentSubmit(blog.id)}>Submit Comment</SubmitButton>

              <CommentList>
                {(comments[blog.id] || []).map((comment, index) => (
                  <Comment key={index}>{comment}</Comment>
                ))}
              </CommentList>
            </CommentSection>
          </BlogContainer>
        ))
      )}
    </>
  );
};

export default BlogDetail;
