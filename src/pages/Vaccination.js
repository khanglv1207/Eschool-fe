import React from "react";
import vaccineImg from "../assets/vaccine.jpg";

function Vaccination() {
  const data = [
    {
      id: 1,
      name: "Vắc xin Viêm gan B",
      date: "2024-03-15",
      status: "Đã tiêm",
      next: "2025-03-15",
      description: "Bảo vệ gan khỏi virus viêm gan B, tiêm mũi nhắc mỗi năm.",
    },
    {
      id: 2,
      name: "MMR (Sởi - Quai bị - Rubella)",
      date: null,
      status: "Chưa tiêm",
      next: "Dự kiến: 2024-06-30",
      description: "Ngừa 3 bệnh truyền nhiễm phổ biến ở trẻ.",
    },
    {
      id: 3,
      name: "Uốn ván",
      date: "2023-11-20",
      status: "Đã tiêm",
      next: "2028-11-20",
      description: "Phòng ngừa uốn ván, tiêm nhắc lại 5 năm/lần.",
    },
  ];

  return (
    <div className="p-6 font-sans bg-gray-50 min-h-screen">
      {/* Tiêu đề và ảnh */}
      <div className="flex items-center gap-4 mb-8">
        <img
          src={vaccineImg}
          alt="Vaccine"
          className="w-16 h-16 rounded-md shadow-md object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold text-blue-700">
            Thông tin Tiêm chủng
          </h1>
          <p className="text-gray-600 text-sm">
            Theo dõi lịch sử và mũi tiêm quan trọng của học sinh.
          </p>
        </div>
      </div>

      {/* Danh sách vắc xin */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold text-blue-800">{item.name}</h2>
            <p className="text-gray-600 text-sm mb-3">{item.description}</p>
            <div className="space-y-1 text-sm text-gray-700">
              <p>
                <strong>Ngày tiêm: </strong>
                {item.date ? (
                  item.date
                ) : (
                  <span className="text-red-600">Chưa tiêm</span>
                )}
              </p>
              <p>
                <strong>Lịch tiêm tiếp theo: </strong>
                {item.next}
              </p>
              <p>
                <strong>Trạng thái: </strong>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-white text-xs font-semibold ${
                    item.status === "Đã tiêm" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                >
                  {item.status}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Vaccination;
