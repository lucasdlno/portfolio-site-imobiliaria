// frontend/lib/api.js

const apiUrl = String(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');

export default apiUrl;