# Dockerfile
FROM node:20

# Tạo thư mục làm việc
WORKDIR /app

# Copy package info và cài đặt dependencies trước
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Expose cổng (tuỳ theo app, ví dụ 3000)
EXPOSE 5000

# Khởi chạy ứng dụng
CMD ["node", "index.js"]
