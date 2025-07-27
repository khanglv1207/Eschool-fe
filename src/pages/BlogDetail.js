import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getBlogById, getRecentBlogs, toggleBlogLike, addBlogComment, getBlogComments } from "../services/blogApi";
import Navbar from "../components/Navbar";

function BlogDetail() {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [recentBlogs, setRecentBlogs] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        fetchBlogDetail();
        fetchRecentBlogs();
        fetchComments();
    }, [id]);

    const fetchBlogDetail = async () => {
        try {
            setLoading(true);
            const response = await getBlogById(id);
            setBlog(response.data);
        } catch (error) {
            console.error("Error fetching blog detail:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentBlogs = async () => {
        try {
            const response = await getRecentBlogs(3);
            setRecentBlogs(response.data || []);
        } catch (error) {
            console.error("Error fetching recent blogs:", error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await getBlogComments(id);
            setComments(response.data || []);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleLike = async () => {
        try {
            await toggleBlogLike(id);
            // Refresh blog data to get updated like count
            fetchBlogDetail();
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            setSubmittingComment(true);
            await addBlogComment(id, { content: commentText });
            setCommentText("");
            fetchComments(); // Refresh comments
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setSubmittingComment(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="container py-5">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 text-muted">Đang tải bài viết...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div>
                <Navbar />
                <div className="container py-5">
                    <div className="text-center">
                        <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                        <h4 className="text-muted">Không tìm thấy bài viết</h4>
                        <p className="text-muted">Bài viết có thể đã bị xóa hoặc không tồn tại.</p>
                        <a href="/blogs" className="btn btn-primary">
                            <i className="fas fa-arrow-left me-2"></i>
                            Quay lại danh sách
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="container-fluid" style={{ background: "#f8f9fa", minHeight: "100vh" }}>
                <div className="container py-5">
                    <div className="row">
                        {/* Main Content */}
                        <div className="col-lg-8">
                            {/* Breadcrumb */}
                            <nav aria-label="breadcrumb" className="mb-4">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <a href="/" className="text-decoration-none">Trang chủ</a>
                                    </li>
                                    <li className="breadcrumb-item">
                                        <a href="/blogs" className="text-decoration-none">Blog</a>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        {blog.title}
                                    </li>
                                </ol>
                            </nav>

                            {/* Blog Content */}
                            <article className="card shadow-sm">
                                {/* Featured Image */}
                                {blog.featuredImage && (
                                    <img
                                        src={blog.featuredImage}
                                        className="card-img-top"
                                        alt={blog.title}
                                        style={{ height: 400, objectFit: 'cover' }}
                                    />
                                )}

                                <div className="card-body p-4">
                                    {/* Header */}
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src="/api/avatar/default.png"
                                                    alt="Author"
                                                    className="rounded-circle me-2"
                                                    style={{ width: 40, height: 40 }}
                                                />
                                                <div>
                                                    <h6 className="mb-0 fw-bold">{blog.author}</h6>
                                                    <small className="text-muted">
                                                        <i className="fas fa-calendar me-1"></i>
                                                        {formatDate(blog.createdAt)}
                                                    </small>
                                                </div>
                                            </div>
                                            <span className={`badge ${blog.status === 'published' ? 'bg-success' : 'bg-secondary'}`}>
                                                {blog.status === 'published' ? 'Đã đăng' : 'Nháp'}
                                            </span>
                                        </div>

                                        <h1 className="display-5 fw-bold mb-3">{blog.title}</h1>
                                        
                                        {blog.description && (
                                            <p className="lead text-muted mb-4">{blog.description}</p>
                                        )}

                                        {/* Tags */}
                                        {blog.tags && (
                                            <div className="mb-4">
                                                {blog.tags.split(',').map((tag, index) => (
                                                    <span key={index} className="badge bg-primary me-2">
                                                        {tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="blog-content mb-4" style={{ fontSize: '18px', lineHeight: '1.8' }}>
                                        {blog.content}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="d-flex justify-content-between align-items-center pt-4 border-top">
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={handleLike}
                                            >
                                                <i className="fas fa-heart me-2"></i>
                                                Thích ({blog.likes || 0})
                                            </button>
                                            <button className="btn btn-outline-secondary">
                                                <i className="fas fa-share me-2"></i>
                                                Chia sẻ
                                            </button>
                                        </div>
                                        <div className="text-muted">
                                            <small>
                                                <i className="fas fa-eye me-1"></i>
                                                {blog.views || 0} lượt xem
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </article>

                            {/* Comments Section */}
                            <div className="card shadow-sm mt-4">
                                <div className="card-header">
                                    <h5 className="mb-0">
                                        <i className="fas fa-comments me-2"></i>
                                        Bình luận ({comments.length})
                                    </h5>
                                </div>
                                <div className="card-body">
                                    {/* Comment Form */}
                                    <form onSubmit={handleCommentSubmit} className="mb-4">
                                        <div className="mb-3">
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                placeholder="Viết bình luận của bạn..."
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={submittingComment}
                                        >
                                            {submittingComment ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Đang gửi...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-paper-plane me-2"></i>
                                                    Gửi bình luận
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    {/* Comments List */}
                                    <div className="comments-list">
                                        {comments.length === 0 ? (
                                            <p className="text-muted text-center py-3">
                                                Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                                            </p>
                                        ) : (
                                            comments.map((comment) => (
                                                <div key={comment.id} className="d-flex mb-3">
                                                    <img
                                                        src="/api/avatar/default.png"
                                                        alt="User"
                                                        className="rounded-circle me-3"
                                                        style={{ width: 40, height: 40 }}
                                                    />
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                                            <h6 className="mb-0 fw-bold">{comment.author}</h6>
                                                            <small className="text-muted">
                                                                {formatDate(comment.createdAt)}
                                                            </small>
                                                        </div>
                                                        <p className="mb-0">{comment.content}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="col-lg-4">
                            {/* Recent Blogs */}
                            <div className="card shadow-sm mb-4">
                                <div className="card-header bg-primary text-white">
                                    <h5 className="mb-0">
                                        <i className="fas fa-clock me-2"></i>
                                        Bài viết gần đây
                                    </h5>
                                </div>
                                <div className="card-body">
                                    {recentBlogs.map((recentBlog) => (
                                        <div key={recentBlog.id} className="d-flex mb-3">
                                            {recentBlog.featuredImage && (
                                                <img
                                                    src={recentBlog.featuredImage}
                                                    alt={recentBlog.title}
                                                    className="rounded me-3"
                                                    style={{ width: 60, height: 60, objectFit: 'cover' }}
                                                />
                                            )}
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">
                                                    <a 
                                                        href={`/blog/${recentBlog.id}`} 
                                                        className="text-decoration-none text-dark"
                                                        style={{ fontSize: '14px' }}
                                                    >
                                                        {recentBlog.title}
                                                    </a>
                                                </h6>
                                                <small className="text-muted">
                                                    {formatDate(recentBlog.createdAt)}
                                                </small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Author Info */}
                            <div className="card shadow-sm mb-4">
                                <div className="card-header bg-info text-white">
                                    <h5 className="mb-0">
                                        <i className="fas fa-user me-2"></i>
                                        Về tác giả
                                    </h5>
                                </div>
                                <div className="card-body text-center">
                                    <img
                                        src="/api/avatar/default.png"
                                        alt="Author"
                                        className="rounded-circle mb-3"
                                        style={{ width: 80, height: 80 }}
                                    />
                                    <h6 className="fw-bold">{blog.author}</h6>
                                    <p className="text-muted small">
                                        Chuyên gia y tế học đường với nhiều năm kinh nghiệm
                                    </p>
                                    <button className="btn btn-outline-primary btn-sm">
                                        <i className="fas fa-user-plus me-2"></i>
                                        Theo dõi
                                    </button>
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="card shadow-sm">
                                <div className="card-header bg-success text-white">
                                    <h5 className="mb-0">
                                        <i className="fas fa-tags me-2"></i>
                                        Danh mục
                                    </h5>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex flex-wrap gap-2">
                                        <span className="badge bg-primary">Sức khỏe học đường</span>
                                        <span className="badge bg-secondary">Dinh dưỡng</span>
                                        <span className="badge bg-success">Vaccine</span>
                                        <span className="badge bg-info">Sơ cứu</span>
                                        <span className="badge bg-warning">Tâm lý</span>
                                        <span className="badge bg-danger">Khẩn cấp</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogDetail; 