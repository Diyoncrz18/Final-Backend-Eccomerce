const API_BASE_URL = 'http://localhost:8081/api/v1';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  tier?: string;
  points?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: User;
  };
}

export interface ResponseData {
  status: boolean;
  message?: string | string[];
  payload?: any;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data: ResponseData = await response.json();
  
  if (!response.ok) {
    const message = Array.isArray(data.message) 
      ? data.message[0] 
      : data.message || 'Operation failed';
    throw new Error(message);
  }
  
  return data as T;
}

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });

    const data: ResponseData = await response.json();

    if (!data.status) {
      return {
        success: false,
        message: Array.isArray(data.message) ? data.message[0] : (data.message || 'Email atau password salah'),
      };
    }

    const token = data.payload?.accessToken;
    
    // Get user info from the stored user data or by parsing email from token
    let user: User = { id: 0, name: '', email: credentials.email, role: 'ROLE_USER' };
    
    // Try to get user fromme endpoint
    try {
      const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        user = {
          id: userData.id || 0,
          name: userData.name || credentials.email.split('@')[0],
          email: userData.email || credentials.email,
          role: userData.roles?.[0] || 'ROLE_USER',
          tier: userData.tier || 'Bronze',
          points: userData.points || 0,
        };
      }
    } catch (e) {
      // Use default user
    }

    return {
      success: true,
      data: {
        token,
        user,
      },
    };
  } catch (error: any) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error.message || 'Unable to connect to server. Please try again.',
    };
  }
}

export async function register(userData: RegisterRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        confirmPassword: userData.password,
      }),
    });

    const data: ResponseData = await response.json();

    if (!data.status) {
      return {
        success: false,
        message: Array.isArray(data.message) ? data.message[0] : (data.message || 'Registration failed'),
      };
    }

    return {
      success: true,
      message: Array.isArray(data.message) ? data.message[0] : 'Registration successful',
    };
  } catch (error: any) {
    console.error('Register error:', error);
    return {
      success: false,
      message: error.message || 'Unable to connect to server. Please try again.',
    };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return {
      id: data.id || 0,
      name: data.name || '',
      email: data.email || '',
      phone: data.phone,
      role: data.roles?.[0] || 'ROLE_USER',
      tier: data.tier || 'Bronze',
      points: data.points || 0,
    };
  } catch {
    return null;
  }
}

export async function fetchProducts(page = 0, size = 20) {
  try {
    const response = await fetch(`${API_BASE_URL}/products?page=${page}&size=${size}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data.content || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function fetchProductById(id: number) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function fetchCollections() {
  try {
    const response = await fetch(`${API_BASE_URL}/collections`);
    if (!response.ok) {
      throw new Error('Failed to fetch collections');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('authToken', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
}

// Cart functions
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  variant: string;
  price: number;
  quantity: number;
  stock: number;
}

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
  notes?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;
}

export async function getMyOrders(page = 0, size = 20): Promise<Order[]> {
  const token = getAuthToken();
  if (!token) return [];

  try {
    const response = await fetch(`${API_BASE_URL}/orders/my-orders?page=${page}&size=${size}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.content || [];
  } catch {
    return [];
  }
}

export async function createOrder(request: CreateOrderRequest): Promise<{ success: boolean; message?: string; order?: Order }> {
  const token = getAuthToken();
  if (!token) {
    return { success: false, message: 'Please login first' };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(request),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Failed to create order' };
    }

    return { success: true, order: data };
  } catch (error: any) {
    return { success: false, message: error.message || 'Connection error' };
  }
}

export async function getOrderById(id: number): Promise<Order | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

// Local cart storage functions
export function getLocalCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

export function setLocalCart(items: CartItem[]): void {
  localStorage.setItem('cart', JSON.stringify(items));
}

export function addToLocalCart(item: Omit<CartItem, 'id'>): CartItem[] {
  const cart = getLocalCart();
  const existing = cart.find(c => c.productId === item.productId && c.variant === item.variant);
  
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push({ ...item, id: Date.now() });
  }
  
  setLocalCart(cart);
  return cart;
}

export function removeFromLocalCart(id: number): CartItem[] {
  const cart = getLocalCart().filter(c => c.id !== id);
  setLocalCart(cart);
  return cart;
}

export function updateLocalCartQuantity(id: number, quantity: number): CartItem[] {
  const cart = getLocalCart().map(c => 
    c.id === id ? { ...c, quantity: Math.max(1, Math.min(c.stock, quantity)) } : c
  );
  setLocalCart(cart);
  return cart;
}

export function clearLocalCart(): void {
  localStorage.removeItem('cart');
}

// ============ WISHLIST API ============

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category?: string;
}

export async function getWishlist(): Promise<WishlistItem[]> {
  const token = getAuthToken();
  if (!token) return [];
  
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include',
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.items || [];
  } catch {
    return [];
  }
}

export async function addToWishlist(productId: number): Promise<{ success: boolean; message?: string }> {
  const token = getAuthToken();
  if (!token) return { success: false, message: 'Please login first' };
  
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    return await response.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function removeFromWishlist(productId: number): Promise<{ success: boolean; message?: string }> {
  const token = getAuthToken();
  if (!token) return { success: false, message: 'Please login first' };
  
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include',
    });
    return await response.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function checkWishlist(productId: number): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    const response = await fetch(`${API_BASE_URL}/wishlist/check/${productId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include',
    });
    if (!response.ok) return false;
    const data = await response.json();
    return data.inWishlist || false;
  } catch {
    return false;
  }
}

// ============ VOUCHERS API ============

export interface Voucher {
  id: number;
  code: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  validUntil: string;
  isActive: boolean;
}

export async function getVouchers(): Promise<Voucher[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/vouchers`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.vouchers || [];
  } catch {
    return [];
  }
}

export async function validateVoucher(code: string, orderValue: number): Promise<{
  valid: boolean;
  discountType?: string;
  discountValue?: number;
  message?: string;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/vouchers/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, orderValue }),
    });
    return await response.json();
  } catch (error: any) {
    return { valid: false, message: error.message };
  }
}

export async function redeemVoucher(code: string): Promise<{ success: boolean; message?: string }> {
  const token = getAuthToken();
  if (!token) return { success: false, message: 'Please login first' };
  
  try {
    const response = await fetch(`${API_BASE_URL}/vouchers/redeem`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    return await response.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ============ REVIEWS API ============

export interface Review {
  id: number;
  userId: number;
  userName: string;
  productId: number;
  rating: number;
  comment: string;
  createdAt: string;
  isApproved: boolean;
}

export async function getProductReviews(productId: number): Promise<{
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}`);
    if (!response.ok) return { reviews: [], averageRating: 0, totalReviews: 0 };
    return await response.json();
  } catch {
    return { reviews: [], averageRating: 0, totalReviews: 0 };
  }
}

export async function submitReview(
  productId: number, 
  rating: number, 
  comment: string
): Promise<{ success: boolean; message?: string }> {
  const token = getAuthToken();
  if (!token) return { success: false, message: 'Please login first' };
  
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating, comment }),
    });
    return await response.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ============ USER PROFILE API ============

export async function updateUserProfile(data: {
  name?: string;
  phone?: string;
}): Promise<{ success: boolean; message?: string }> {
  const token = getAuthToken();
  if (!token) return { success: false, message: 'Please login first' };
  
  try {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}