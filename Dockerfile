# -------- Giai đoạn 1: Cài dependencies đầy đủ --------
FROM node:20 AS deps

WORKDIR /app

# Copy file package trước để cache hiệu quả
COPY package*.json ./
RUN npm install

# -------- Giai đoạn 2: Copy code và chỉ dùng production deps --------
FROM node:20-slim

WORKDIR /app

# Copy lại package.json
COPY package*.json ./

# Cài chỉ production dependencies (bỏ dev)
RUN npm install --omit=dev

# Copy code từ máy host
COPY . .

# Nếu bạn có thư mục như tests, docs, bạn có thể loại bỏ tại đây nếu cần

EXPOSE 5000
CMD ["node", "index.js"]
