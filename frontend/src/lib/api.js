import axios from 'axios';
console.log("BACKEND URL 👉", process.env.REACT_APP_BACKEND_URL);

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Methods
export const apiClient = {
  // Admin Auth
  adminLogin: (username, password) => 
    api.post('/admin/login', { username, password }),
  
  adminVerify: () => 
    api.get('/admin/verify'),
  
  // OTP
  sendOtp: (email, formType = 'enquiry') => 
    api.post('/otp/send', { email, form_type: formType }),
  
  verifyOtp: (email, otpCode) => 
    api.post('/otp/verify', { email, otp_code: otpCode }),
  
  // Enquiries & Repairs
  submitEnquiry: (data) => 
    api.post('/enquiry/submit', data),
  
  submitRepair: (data) => 
    api.post('/repair/submit', data),
  
  getEnquiries: () => 
    api.get('/enquiries'),
  
  getRepairs: () => 
    api.get('/repairs'),
  
  // Page Content
  getPageContent: (page = null) => 
    api.get('/page-content', { params: { page } }),
  
  updatePageContent: (contentId, updates) => 
    api.put(`/page-content/${contentId}`, updates),
  
  createPageContent: (data) => 
    api.post('/page-content', data),

  deletePageContent: (contentId) => 
    api.delete(`/page-content/${contentId}`),
  // Products
  getProducts: (categoryId = null, published = null) => 
    api.get('/products', { params: { category_id: categoryId, published } }),
  
  getProduct: (productId) => 
    api.get(`/products/${productId}`),
  
  createProduct: (data) => 
    api.post('/products', data),
  
  updateProduct: (productId, updates) => 
    api.put(`/products/${productId}`, updates),
  
  deleteProduct: (productId) => 
    api.delete(`/products/${productId}`),
  
  // Product Categories
  getProductCategories: () => 
    api.get('/product-categories'),
  
  createProductCategory: (data) => 
    api.post('/product-categories', data),
  
  updateProductCategory: (categoryId, updates) => 
    api.put(`/product-categories/${categoryId}`, updates),
  
  deleteProductCategory: (categoryId) => 
    api.delete(`/product-categories/${categoryId}`),
  
  // Services
  getServices: (published = null) => 
    api.get('/services', { params: { published } }),
  
  createService: (data) => 
    api.post('/services', data),
  
  updateService: (serviceId, updates) => 
    api.put(`/services/${serviceId}`, updates),
  
  deleteService: (serviceId) => 
    api.delete(`/services/${serviceId}`),
  
  // Clients
  getClients: (published = null) => 
    api.get('/clients', { params: { published } }),
  
  createClient: (data) => 
    api.post('/clients', data),
  
  updateClient: (clientId, updates) => 
    api.put(`/clients/${clientId}`, updates),
  
  deleteClient: (clientId) => 
    api.delete(`/clients/${clientId}`),
  
  // News
  getNews: (published = null) => 
    api.get('/news', { params: { published } }),
  
  createNews: (data) => 
    api.post('/news', data),
  
  updateNews: (newsId, updates) => 
    api.put(`/news/${newsId}`, updates),
  
  deleteNews: (newsId) => 
    api.delete(`/news/${newsId}`),
  
  // Employees
  getEmployees: (status = null) => 
    api.get('/employees', { params: { status } }),
  
  createEmployee: (data) => 
    api.post('/employees', data),
  
  updateEmployee: (employeeId, updates) => 
    api.put(`/employees/${employeeId}`, updates),
  
  deleteEmployee: (employeeId) => 
    api.delete(`/employees/${employeeId}`),
  
  // About Category
  // About
getAboutSections: () =>
  api.get('/about-sections'),

createAboutSection: (data) =>
  api.post('/about-sections', data),

updateAboutSection: (sectionId, updates) =>
  api.put(`/about-sections/${sectionId}`, updates),

deleteAboutSection: (sectionId) =>
  api.delete(`/about-sections/${sectionId}`),

getAboutCategories: () =>
  api.get('/about-categories'),

createAboutCategory: (data) =>
  api.post('/about-categories', data),

updateAboutCategory: (categoryId, updates) =>
  api.put(`/about-categories/${categoryId}`, updates),

deleteAboutCategory: (categoryId) =>
  api.delete(`/about-categories/${categoryId}`),

// Contact page
getContactPage: () =>
  api.get('/contact'),

updateContactPage: (data) =>
  api.put('/contact', data),

// Enquiry 
deleteEnquiry: (enquiryId) => api.delete(`/enquiries/${enquiryId}`),
  
//Repair 
deleteRepair: (repairId) => api.delete(`/repairs/${repairId}`),
// File Upload
  uploadFile: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;
