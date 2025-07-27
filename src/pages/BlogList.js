import React, { useState, useEffect } from "react";
import { getAllBlogs, getPopularBlogs, getRecentBlogs } from "../services/blogApi";
import Navbar from "../components/Navbar";

function BlogList() {
    const [blogs, setBlogs] = useState([]);
    const [popularBlogs, setPopularBlogs] = useState([]);
    const [recentBlogs, setRecentBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchBlogs();
        fetchPopularBlogs();
        fetchRecentBlogs();
    }, [currentPage, searchTerm]);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await getAllBlogs(currentPage, 9, searchTerm);
            setBlogs(response.data || []);
            setTotalPages(response.totalPages || 1);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPopularBlogs = async () => {
        try {
            const response = await getPopularBlogs(3);
            setPopularBlogs(response.data || []);
        } catch (error) {
            console.error("Error fetching popular blogs:", error);
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

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchBlogs();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const truncateText = (text, maxLength = 150) => {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    };

    return (
        <div>
            <Navbar />
            <div className="container-fluid" style={{ background: "#f8f9fa", minHeight: "100vh" }}>
                <div className="container py-5">
                    {/* Header */}
                    <div className="row mb-5">
                        <div className="col-12 text-center">
                            <h1 className="display-4 fw-bold text-primary mb-3">
                                <i className="fas fa-blog me-3"></i>
                                Blog EschoolMED
                            </h1>
                            <p className="lead text-muted">
                                Chia sẻ kiến thức y tế học đường và sức khỏe cộng đồng
                            </p>
                        </div>
                    </div>

                    <div className="row">
                        {/* Main Content */}
                        <div className="col-lg-8">
                            {/* Search Bar */}
                            <div className="card shadow-sm mb-4">
                                <div className="card-body">
                                    <form onSubmit={handleSearch} className="d-flex">
                                        <input
                                            type="text"
                                            className="form-control me-2"
                                            placeholder="Tìm kiếm bài viết..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <button type="submit" className="btn btn-primary">
                                            <i className="fas fa-search"></i>
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Blog List */}
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-3 text-muted">Đang tải bài viết...</p>
                                </div>
                            ) : blogs.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-search fa-3x text-muted mb-3"></i>
                                    <h4 className="text-muted">Không tìm thấy bài viết nào</h4>
                                    <p className="text-muted">Thử tìm kiếm với từ khóa khác</p>
                                </div>
                            ) : (
                                <div className="row">
                                    {blogs.map((blog) => (
                                        <div key={blog.id} className="col-md-6 mb-4">
                                            <div className="card h-100 shadow-sm hover-shadow">
                                                {blog.featuredImage && (
                                                    <img
                                                        src={blog.featuredImage}
                                                        className="card-img-top"
                                                        alt={blog.title}
                                                        style={{ height: 200, objectFit: 'cover' }}
                                                    />
                                                )}
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <small className="text-muted">
                                                            <i className="fas fa-calendar me-1"></i>
                                                            {formatDate(blog.createdAt)}
                                                        </small>
                                                        <span className={`badge ${blog.status === 'published' ? 'bg-success' : 'bg-secondary'}`}>
                                                            {blog.status === 'published' ? 'Đã đăng' : 'Nháp'}
                                                        </span>
                                                    </div>
                                                    <h5 className="card-title fw-bold">
                                                        <a href={`/blog/${blog.id}`} className="text-decoration-none text-dark">
                                                            {blog.title}
                                                        </a>
                                                    </h5>
                                                    <p className="card-text text-muted">
                                                        {truncateText(blog.description || blog.content)}
                                                    </p>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <small className="text-muted">
                                                            <i className="fas fa-user me-1"></i>
                                                            {blog.author}
                                                        </small>
                                                        <a href={`/blog/${blog.id}`} className="btn btn-outline-primary btn-sm">
                                                            Đọc thêm
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <nav className="mt-4">
                                    <ul className="pagination justify-content-center">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setCurrentPage(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            >
                                                Trước
                                            </button>
                                        </li>
                                        {[...Array(totalPages)].map((_, index) => (
                                            <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => setCurrentPage(index + 1)}
                                                >
                                                    {index + 1}
                                                </button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setCurrentPage(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                            >
                                                Sau
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="col-lg-4">
                            {/* Popular Blogs */}
                            <div className="card shadow-sm mb-4">
                                <div className="card-header bg-primary text-white">
                                    <h5 className="mb-0">
                                        <i className="fas fa-fire me-2"></i>
                                        Bài viết phổ biến
                                    </h5>
                                </div>
                                <div className="card-body">
                                    {popularBlogs.map((blog) => (
                                        <div key={blog.id} className="d-flex mb-3">
                                            {blog.featuredImage && (
                                                <img
                                                    src={blog.featuredImage}
                                                    alt={blog.title}
                                                    className="rounded me-3"
                                                    style={{ width: 60, height: 60, objectFit: 'cover' }}
                                                />
                                            )}
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">
                                                    <a href={`/blog/${blog.id}`} className="text-decoration-none text-dark">
                                                        {blog.title}
                                                    </a>
                                                </h6>
                                                <small className="text-muted">
                                                    {formatDate(blog.createdAt)}
                                                </small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Blogs */}
                            <div className="card shadow-sm mb-4">
                                <div className="card-header bg-info text-white">
                                    <h5 className="mb-0">
                                        <i className="fas fa-clock me-2"></i>
                                        Bài viết gần đây
                                    </h5>
                                </div>
                                <div className="card-body">
                                    {recentBlogs.map((blog) => (
                                        <div key={blog.id} className="d-flex mb-3">
                                            {blog.featuredImage && (
                                                <img
                                                    src={blog.featuredImage}
                                                    alt={blog.title}
                                                    className="rounded me-3"
                                                    style={{ width: 60, height: 60, objectFit: 'cover' }}
                                                />
                                            )}
                                            <div className="flex-grow-1">
                                                <h6 className="mb-1">
                                                    <a href={`/blog/${blog.id}`} className="text-decoration-none text-dark">
                                                        {blog.title}
                                                    </a>
                                                </h6>
                                                <small className="text-muted">
                                                    {formatDate(blog.createdAt)}
                                                </small>
                                            </div>
                                        </div>
                                    ))}
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

export default BlogList; 