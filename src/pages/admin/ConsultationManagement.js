import React, { useState } from "react";
import AdminLayout from "./AdminLayout";

// Dữ liệu mẫu danh sách cuộc trò chuyện
const initialConversations = [
    {
        id: 1,
        parentName: "Nguyễn Văn A",
        parentPhone: "0912345678",
        consultant: "Tư vấn viên 1",
        messages: [
            { sender: "parent", content: "Chào thầy/cô, tôi muốn hỏi về lịch tiêm chủng cho con.", time: "2024-06-10 09:00" },
            { sender: "consultant", content: "Chào anh/chị, lịch tiêm chủng sẽ được cập nhật vào tuần sau.", time: "2024-06-10 09:01" },
            { sender: "parent", content: "Cảm ơn thầy/cô!", time: "2024-06-10 09:02" },
        ]
    },
    {
        id: 2,
        parentName: "Trần Thị B",
        parentPhone: "0987654321",
        consultant: "Tư vấn viên 2",
        messages: [
            { sender: "parent", content: "Con tôi bị dị ứng thuốc, cần làm gì?", time: "2024-06-11 10:00" },
            { sender: "consultant", content: "Anh/chị vui lòng đưa bé đến phòng y tế để kiểm tra thêm.", time: "2024-06-11 10:01" },
        ]
    }
];

function ConsultationManagement() {
    const [conversations, setConversations] = useState(initialConversations);
    const [selectedId, setSelectedId] = useState(conversations[0]?.id || null);
    const [newMessage, setNewMessage] = useState("");
    const selectedConversation = conversations.find(c => c.id === selectedId);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        setConversations(prev => prev.map(conv => {
            if (conv.id === selectedId) {
                return {
                    ...conv,
                    messages: [
                        ...conv.messages,
                        {
                            sender: "consultant",
                            content: newMessage,
                            time: new Date().toLocaleString("vi-VN", { hour12: false })
                        }
                    ]
                };
            }
            return conv;
        }));
        setNewMessage("");
    };

    return (
        <AdminLayout>
            <div className="row" style={{ minHeight: 600 }}>
                {/* Danh sách phụ huynh */}
                <div className="col-md-4 border-end">
                    <h5 className="fw-bold mb-3 mt-2">Danh sách phụ huynh</h5>
                    <ul className="list-group">
                        {conversations.map((conv) => (
                            <li
                                key={conv.id}
                                className={`list-group-item list-group-item-action ${selectedId === conv.id ? "active" : ""}`}
                                style={{ cursor: "pointer" }}
                                onClick={() => setSelectedId(conv.id)}
                            >
                                <div className="fw-bold">{conv.parentName}</div>
                                <div className="small text-muted">{conv.parentPhone}</div>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Nội dung chat */}
                <div className="col-md-8">
                    <h5 className="fw-bold mb-3 mt-2">Nội dung trò chuyện</h5>
                    {selectedConversation ? (
                        <div className="card shadow-sm border-0 mb-3" style={{ minHeight: 400 }}>
                            <div className="card-header bg-white">
                                <span className="fw-bold">Phụ huynh:</span> {selectedConversation.parentName} &nbsp;|&nbsp;
                                <span className="fw-bold">Tư vấn viên:</span> {selectedConversation.consultant}
                            </div>
                            <div className="card-body" style={{ maxHeight: 350, overflowY: "auto" }}>
                                {selectedConversation.messages.map((msg, idx) => (
                                    <div key={idx} className={`mb-3 d-flex ${msg.sender === "parent" ? "justify-content-start" : "justify-content-end"}`}>
                                        <div style={{ maxWidth: "70%" }}>
                                            <div className={`p-2 rounded-3 ${msg.sender === "parent" ? "bg-light" : "bg-primary text-white"}`}>
                                                {msg.content}
                                            </div>
                                            <div className="small text-muted mt-1" style={{ fontSize: 12 }}>{msg.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="card-footer bg-white border-0">
                                <div className="d-flex">
                                    <input
                                        type="text"
                                        className="form-control me-2"
                                        placeholder="Nhập tin nhắn..."
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        onKeyDown={e => { if (e.key === "Enter") handleSendMessage(); }}
                                    />
                                    <button className="btn btn-primary" onClick={handleSendMessage}>Gửi</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="alert alert-info">Chọn một phụ huynh để xem nội dung trò chuyện.</div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

export default ConsultationManagement;
