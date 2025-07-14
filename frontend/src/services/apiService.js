import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials) {
    const response = await this.api.post('/login', credentials);
    return response.data;
  }

  async register(userData) {
    const response = await this.api.post('/register', userData);
    return response.data;
  }

  // Assistant endpoints
  async getAssistants() {
    const response = await this.api.get('/assistants');
    return response.data;
  }

  async getAssistant(id) {
    const response = await this.api.get(`/assistants/${id}`);
    return response.data;
  }

  async createAssistant(assistantData) {
    const response = await this.api.post('/assistants', assistantData);
    return response.data;
  }

  async updateAssistant(id, assistantData) {
    const response = await this.api.patch(`/assistants/${id}`, assistantData);
    return response.data;
  }

  async deleteAssistant(id) {
    const response = await this.api.delete(`/assistants/${id}`);
    return response.data;
  }

  // Phone number endpoints
  async getPhoneNumbers() {
    const response = await this.api.get('/phone-numbers');
    return response.data;
  }

  async getPhoneNumber(id) {
    const response = await this.api.get(`/phone-numbers/${id}`);
    return response.data;
  }

  async createPhoneNumber(phoneData) {
    const response = await this.api.post('/phone-numbers', phoneData);
    return response.data;
  }

  async updatePhoneNumber(id, phoneData) {
    const response = await this.api.patch(`/phone-numbers/${id}`, phoneData);
    return response.data;
  }

  async deletePhoneNumber(id) {
    const response = await this.api.delete(`/phone-numbers/${id}`);
    return response.data;
  }

  // Call/Message endpoints
  async getMessages() {
    const response = await this.api.get('/messages');
    return response.data;
  }

  async getCalls() {
    const response = await this.api.get('/calls');
    return response.data;
  }

  async getCall(id) {
    const response = await this.api.get(`/calls/${id}`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
