import React, { useState, useRef } from "react";
import AdminLayout from "./AdminLayout";
import { createAdminBlog } from "../../services/blogApi";

function UploadBlog() {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        author: "",
        status: "draft", // draft, published
        tags: "",
        description: "",
        featuredImage: null,
        images: []
    });

    const [preview, setPreview] = useState({
        featuredImage: null,
        images: []
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const fileInputRef = useRef(null);
    const imagesInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFeaturedImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                featuredImage: file
            }));
            setPreview(prev => ({
                ...prev,
                featuredImage: URL.createObjectURL(file)
            }));
        }
    };

    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreview(prev => ({
            ...prev,
            images: [...prev.images, ...newPreviews]
        }));
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
        setPreview(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: "", text: "" });

        try {
            const submitData = new FormData();
            submitData.append("title", formData.title);
            submitData.append("content", formData.content);
            submitData.append("author", formData.author);
            submitData.append("status", formData.status);
            submitData.append("tags", formData.tags);
            submitData.append("description", formData.description);

            if (formData.featuredImage) {
                submitData.append("featuredImage", formData.featuredImage);
            }

            formData.images.forEach((image, index) => {
                submitData.append(`images`, image);
            });

            const response = await createAdminBlog(submitData);
            setMessage({ type: "success", text: "Blog đã được tạo thành công!" });

            // Reset form
            setFormData({
                title: "",
                content: "",
                author: "",
                status: "draft",
                tags: "",
                description: "",
                featuredImage: null,
                images: []
            });
            setPreview({
                featuredImage: null,
                images: []
            });
        } catch (error) {
            setMessage({ type: "error", text: error.message || "Có lỗi xảy ra khi tạo blog" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleContentChange = (e) => {
        setFormData(prev => ({
            ...prev,
            content: e.target.value
        }));
    };

    return (
        <AdminLayout>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="fw-bold mb-0">
                                <i className="fas fa-upload me-2"></i> Upload Blog
                            </h2>
                            <button
                                className="btn btn-outline-secondary"
                                onClick={() => window.history.back()}
                            >
                                <i className="fas fa-arrow-left me-2"></i> Quay lại
                            </button>
                        </div>

                        {message.text && (
                            <div className={`alert alert-${message.type === "success" ? "success" : "danger"} alert-dismissible fade show`}>
                                {message.text}
                                <button type="button" className="btn-close" onClick={() => setMessage({ type: "", text: "" })}></button>
                            </div>
                        )}

                        <div className="row">
                            <div className="col-lg-8">
                                <div className="card shadow border-0">
                                    <div className="card-header bg-primary text-white">
                                        <h5 className="mb-0">
                                            <i className="fas fa-edit me-2"></i> Thông tin bài viết
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <div className="mb-3">
                                                        <label className="form-label fw-bold">
                                                            <i className="fas fa-heading me-2"></i>Tiêu đề bài viết *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-lg"
                                                            name="title"
                                                            value={formData.title}
                                                            onChange={handleInputChange}
                                                            placeholder="Nhập tiêu đề bài viết..."
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="mb-3">
                                                        <label className="form-label fw-bold">
                                                            <i className="fas fa-user me-2"></i>Tác giả *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="author"
                                                            value={formData.author}
                                                            onChange={handleInputChange}
                                                            placeholder="Tên tác giả..."
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label fw-bold">
                                                    <i className="fas fa-align-left me-2"></i>Mô tả ngắn
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    rows="3"
                                                    placeholder="Mô tả ngắn về bài viết..."
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label fw-bold">
                                                    <i className="fas fa-tags me-2"></i>Tags
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="tags"
                                                    value={formData.tags}
                                                    onChange={handleInputChange}
                                                    placeholder="Nhập tags, phân cách bằng dấu phẩy..."
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label fw-bold">
                                                    <i className="fas fa-edit me-2"></i>Nội dung bài viết *
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    name="content"
                                                    value={formData.content}
                                                    onChange={handleContentChange}
                                                    rows="15"
                                                    placeholder="Viết nội dung bài viết ở đây..."
                                                    required
                                                    style={{ fontSize: '16px', lineHeight: '1.6' }}
                                                />
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label fw-bold">
                                                            <i className="fas fa-image me-2"></i>Ảnh đại diện
                                                        </label>
                                                        <input
                                                            type="file"
                                                            className="form-control"
                                                            accept="image/*"
                                                            onChange={handleFeaturedImageChange}
                                                            ref={fileInputRef}
                                                        />
                                                        {preview.featuredImage && (
                                                            <div className="mt-2">
                                                                <img
                                                                    src={preview.featuredImage}
                                                                    alt="Featured"
                                                                    className="img-thumbnail"
                                                                    style={{ maxWidth: 200, maxHeight: 150 }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label fw-bold">
                                                            <i className="fas fa-images me-2"></i>Ảnh bổ sung
                                                        </label>
                                                        <input
                                                            type="file"
                                                            className="form-control"
                                                            accept="image/*"
                                                            multiple
                                                            onChange={handleImagesChange}
                                                            ref={imagesInputRef}
                                                        />
                                                        <small className="text-muted">Có thể chọn nhiều ảnh</small>
                                                    </div>
                                                </div>
                                            </div>

                                            {preview.images.length > 0 && (
                                                <div className="mb-3">
                                                    <label className="form-label fw-bold">Ảnh đã chọn:</label>
                                                    <div className="row">
                                                        {preview.images.map((image, index) => (
                                                            <div key={index} className="col-md-3 mb-2 position-relative">
                                                                <img
                                                                    src={image}
                                                                    alt={`Image ${index + 1}`}
                                                                    className="img-thumbnail"
                                                                    style={{ width: '100%', height: 120, objectFit: 'cover' }}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                                                    onClick={() => removeImage(index)}
                                                                    style={{ margin: '2px' }}
                                                                >
                                                                    <i className="fas fa-times"></i>
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mb-3">
                                                <label className="form-label fw-bold">
                                                    <i className="fas fa-toggle-on me-2"></i>Trạng thái
                                                </label>
                                                <select
                                                    className="form-select"
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="draft">Nháp</option>
                                                    <option value="published">Đăng ngay</option>
                                                </select>
                                            </div>

                                            <div className="d-flex gap-2">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary btn-lg"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                                            Đang tải lên...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fas fa-upload me-2"></i>
                                                            Đăng bài viết
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary btn-lg"
                                                    onClick={() => {
                                                        setFormData({
                                                            title: "",
                                                            content: "",
                                                            author: "",
                                                            status: "draft",
                                                            tags: "",
                                                            description: "",
                                                            featuredImage: null,
                                                            images: []
                                                        });
                                                        setPreview({
                                                            featuredImage: null,
                                                            images: []
                                                        });
                                                    }}
                                                >
                                                    <i className="fas fa-undo me-2"></i>
                                                    Làm mới
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="card shadow border-0">
                                    <div className="card-header bg-info text-white">
                                        <h5 className="mb-0">
                                            <i className="fas fa-eye me-2"></i> Xem trước
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                        {formData.title ? (
                                            <div className="preview-content">
                                                <h4 className="fw-bold mb-3">{formData.title}</h4>
                                                {preview.featuredImage && (
                                                    <img
                                                        src={preview.featuredImage}
                                                        alt="Featured"
                                                        className="img-fluid rounded mb-3"
                                                        style={{ maxHeight: 200, width: '100%', objectFit: 'cover' }}
                                                    />
                                                )}
                                                {formData.description && (
                                                    <p className="text-muted mb-3">{formData.description}</p>
                                                )}
                                                {formData.content && (
                                                    <div
                                                        className="content-preview"
                                                        style={{
                                                            maxHeight: 300,
                                                            overflow: 'auto',
                                                            fontSize: '14px',
                                                            lineHeight: '1.5'
                                                        }}
                                                    >
                                                        {formData.content}
                                                    </div>
                                                )}
                                                <div className="mt-3 pt-3 border-top">
                                                    <small className="text-muted">
                                                        <i className="fas fa-user me-1"></i>
                                                        Tác giả: {formData.author || "Chưa có"}
                                                    </small>
                                                    <br />
                                                    <small className="text-muted">
                                                        <i className="fas fa-calendar me-1"></i>
                                                        Ngày tạo: {new Date().toLocaleDateString('vi-VN')}
                                                    </small>
                                                    {formData.tags && (
                                                        <>
                                                            <br />
                                                            <small className="text-muted">
                                                                <i className="fas fa-tags me-1"></i>
                                                                Tags: {formData.tags}
                                                            </small>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center text-muted py-4">
                                                <i className="fas fa-edit fa-3x mb-3"></i>
                                                <p>Nhập thông tin để xem trước</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="card shadow border-0 mt-3">
                                    <div className="card-header bg-warning text-dark">
                                        <h6 className="mb-0">
                                            <i className="fas fa-lightbulb me-2"></i> Gợi ý
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                        <ul className="list-unstyled mb-0">
                                            <li className="mb-2">
                                                <i className="fas fa-check-circle text-success me-2"></i>
                                                Viết tiêu đề hấp dẫn
                                            </li>
                                            <li className="mb-2">
                                                <i className="fas fa-check-circle text-success me-2"></i>
                                                Thêm mô tả ngắn gọn
                                            </li>
                                            <li className="mb-2">
                                                <i className="fas fa-check-circle text-success me-2"></i>
                                                Sử dụng hình ảnh chất lượng
                                            </li>
                                            <li className="mb-2">
                                                <i className="fas fa-check-circle text-success me-2"></i>
                                                Thêm tags phù hợp
                                            </li>
                                            <li className="mb-0">
                                                <i className="fas fa-check-circle text-success me-2"></i>
                                                Kiểm tra nội dung trước khi đăng
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default UploadBlog; 