// import api from "./api";
// import { handleError } from "./api";

// // ==================== BLOG API ====================

// // Lấy danh sách tất cả blogs
// export const getAllBlogs = async (page = 1, size = 10, search = "") => {
//     try {
//         const response = await api.get("/api/blogs/get_all_blog", {
//             params: { page, size, search }
//         });
//         return response.data;
//     } catch (error) {
//         const errorMsg = error.response?.data?.message;
//         throw new Error(errorMsg || "Không thể lấy danh sách blogs");
//     }
// };

// // Lấy blog theo ID
// export const getBlogById = async (blogId) => {
//     try {
//         const response = await api.get(`/api/blogs/get/${blogId}`);
//         return response.data;
//     } catch (error) {
//         const errorMsg = error.response?.data?.message;
//         throw new Error(errorMsg || "Không thể lấy thông tin blog");
//     }
// };

// // Tạo blog mới
// export const createBlog = async (blogData) => {
//     try {
//         // Nếu blogData là FormData (có file upload), không cần set Content-Type
//         const config = blogData instanceof FormData ? {} : {
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         };

//         const response = await api.post("/api/blogs", blogData, config);
//         return response.data;
//     } catch (error) {
//         const errorMsg = error.response?.data?.message;
//         throw new Error(errorMsg || "Không thể tạo blog mới");
//     }
// };

// // Cập nhật blog
// export const updateBlog = async (blogId, blogData) => {
//     try {
//         const config = blogData instanceof FormData ? {} : {
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         };

//         const response = await api.put(`/api/blogs/update_document/${blogId}`, blogData, config);
//         return response.data;
//     } catch (error) {
//         const errorMsg = error.response?.data?.message;
//         throw new Error(errorMsg || "Không thể cập nhật blog");
//     }
// };

// // Xóa blog
// export const deleteBlog = async (blogId) => {
//     try {
//         const response = await api.delete(`/api/blogs/delete_document/${blogId}`);
//         return response.data;
//     } catch (error) {
//         const errorMsg = error.response?.data?.message;
//         throw new Error(errorMsg || "Không thể xóa blog");
//     }
// };

// // Thay đổi trạng thái blog (publish/unpublish)
// export const changeBlogStatus = async (blogId, status) => {
//     try {
//         const response = await api.patch(`/api/blogs/${blogId}/status`, { status });
//         return response.data;
//     } catch (error) {
//         const errorMsg = error.response?.data?.message;
//         throw new Error(errorMsg || "Không thể thay đổi trạng thái blog");
//     }
// };

// // Upload ảnh cho blog
// export const uploadBlogImage = async (imageFile) => {
//     try {
//         const formData = new FormData();
//         formData.append('image', imageFile);

//         const response = await api.post("/api/blogs/upload-image", formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });
//         return response.data;
//     } catch (error) {
//         const errorMsg = error.response?.data?.message;
//         throw new Error(errorMsg || "Không thể upload ảnh");
//     }
// };

// // Upload nhiều ảnh cho blog
// export const uploadBlogImages = async (imageFiles) => {
//     try {
//         const formData = new FormData();
//         imageFiles.forEach((file, index) => {
//             formData.append('images', file);
//         });

//         const response = await api.post("/api/blogs/upload-images", formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });
//         return response.data;
//     } catch (error) {
//         const errorMsg = error.response?.data?.message;
//         throw new Error(errorMsg || "Không thể upload ảnh");
//     }
// };

// // Lấy blogs theo category
// export const getBlogsByCategory = async (category, page = 1, size = 10) => {
//     try {
//         const response = await api.get(`/api/blogs/category/${category}`, {
//             params: { page, size }
//         });
//         return response.data;
//     } catch (error) {
//         const errorMsg = error.response?.data?.message;
//         throw new Error(errorMsg || "Không thể lấy blogs theo category");
//     }
// };

// // Tìm kiếm blogs
// export const searchBlogs = async (query, page = 1, size = 10) => {
//     try {
//         const response = await api.get("/api/blogs/search", {
//             params: { q: query, page, size }
//         });
//         return response.data;
//     } catch (error) {
//         const errorMsg = error.response?.data?.message;
//         throw new Error(errorMsg || "Không thể tìm kiếm blogs");
//     }
// };

// // Lấy blogs phổ biến
// export const getPopularBlogs = async (limit = 5) => {
//     try {
//         const response = await api.get("/api/blogs/popular", {
//             params: { limit }
//         });
//         return response.data;
//     } catch (error) {
//         const errorMsg = error.response?.data?.message;
//         throw new Error(errorMsg || "Không thể lấy blogs phổ biến");
//     }
// };

// // Lấy blogs gần đây
// export const getRecentBlogs = async (limit = 5) => {
//     try {
//         const response = await api.get("/api/blogs/recent", {
//             params: { limit }
//         });
//         return response.data;
//     } catch (error) {
//         const errorMsg = error.response?.data?.message;
//         throw new Error(errorMsg || "Không thể lấy blogs gần đây");
//     }
// };

// // Like/Unlike blog
// export const toggleBlogLike = async (blogId) => {
//     try {
//         const response = await api.post(`/api/blogs/${blogId}/like`);
//         return response.data;
//     } catch (error) {
//         const errorMsg = error.response?.data?.message;
//         throw new Error(errorMsg || "Không thể thực hiện thao tác like");
//     }
// };

// // Thêm comment cho blog
// export const addBlogComment = async (blogId, commentData) => {
//     try {
//         const response = await api.post(`/api/blogs/${blogId}/comments`, commentData);
//         return response.data;
//     } catch (error) {
//         const errorMsg = error.response?.data?.message;
//         throw new Error(errorMsg || "Không thể thêm comment");
//     }
// };

// // Lấy comments của blog
// export const getBlogComments = async (blogId, page = 1, size = 10) => {
//     try {
//         const response = await api.get(`/api/blogs/${blogId}/comments`, {
//             params: { page, size }
//         });
//         return response.data;
//     } catch (error) {
//         const errorMsg = error.response?.data?.message;
//         throw new Error(errorMsg || "Không thể lấy comments");
//     }
// };

// // ==================== ADMIN BLOG API ====================

// // Lấy danh sách blogs cho admin
// export const getAdminBlogs = async (page = 1, size = 10, search = "") => {
//     try {
//         const response = await api.get("/api/admin/blogs", {
//             params: { page, size, search }
//         });
//         return response.data;
//     } catch (error) {
//         const errorMsg = error.response?.data?.message;
//         throw new Error(errorMsg || "Không thể lấy danh sách blogs");
//     }
// };

// // Tạo blog mới cho admin
// export const createAdminBlog = async (blogData) => {
//     try {
//         const config = blogData instanceof FormData ? {} : {
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         };

//         const response = await api.post("/api/admin/blogs", blogData, config);
//         return response.data;
//     } catch (error) {
//         const errorMsg = error.response?.data?.message;
//         throw new Error(errorMsg || "Không thể tạo blog mới");
//     }
// };

// // Cập nhật blog cho admin
// export const updateAdminBlog = async (blogId, blogData) => {
//     try {
//         const config = blogData instanceof FormData ? {} : {
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         };

//         const response = await api.put(`/api/admin/blogs/${blogId}`, blogData, config);
//         return response.data;
//     } catch (error) {
//         const errorMsg = error.response?.data?.message;
//         throw new Error(errorMsg || "Không thể cập nhật blog");
//     }
// };

// // Xóa blog cho admin
// export const deleteAdminBlog = async (blogId) => {
//     try {
//         const response = await api.delete(`/api/admin/blogs/${blogId}`);
//         return response.data;
//     } catch (error) {
//         const errorMsg = error.response?.data?.message;
//         throw new Error(errorMsg || "Không thể xóa blog");
//     }
// };

// // Thay đổi trạng thái blog cho admin
// export const changeAdminBlogStatus = async (blogId, status) => {
//     try {
//         const response = await api.patch(`/api/admin/blogs/${blogId}/status`, { status });
//         return response.data;
//     } catch (error) {
//         const errorMsg = error.response?.data?.message;
//         throw new Error(errorMsg || "Không thể thay đổi trạng thái blog");
//     }
// }; 
