# Gunakan image Node.js sebagai base 
FROM node:16-alpine

# Set direktori kerja 
WORKDIR /app

# Copy file package.json dan install dependencies 
COPY package.json ./
RUN npm install

# Copy seluruh kode aplikasi 
COPY . .

# Build aplikasi React 
RUN npm run build

# Ekspose port aplikasi 
EXPOSE 3000

# Jalankan aplikasi 
CMD ["npm", "start"]
