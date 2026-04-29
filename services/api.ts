 const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081/api/v1';


export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  roles: string[];
  tier: string;
  points: number;
  avatarUrl?: string;
  gender?: string;
  birthdate?: string;
  joinDate?: string;
}

export interface DashboardUser extends User {
  tier: string;
  points: number;
  pointsNext: number;
  totalSpent: number;
  joinDate?: string;
}

export interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  wishlistCount: number;
  rewardPoints: number;
}

export interface DashboardOrder {
  id: number;
  orderNumber: string;
  productName: string;
  productImage?: string | null;
  status: string;
  statusCode: string;
  total: number;
  createdAt: string;
  eta?: string | null;
}

export interface DashboardProduct {
  id: number;
  name: string;
  price: number;
  salePrice?: number | null;
  imageUrl?: string | null;
  tag?: string | null;
  rating: number;
  category?: string | null;
  inWishlist: boolean;
}

export interface DashboardData {
  user: DashboardUser;
  stats: DashboardStats;
  recentOrders: DashboardOrder[];
  wishlist: DashboardProduct[];
  recommendations: DashboardProduct[];
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
  payload?: {
    accessToken?: string;
    [key: string]: unknown;
  };
}

const DEFAULT_USER: User = {
  id: 0,
  name: 'Guest',
  email: '',
  phone: '',
  role: 'ROLE_USER',
  roles: ['ROLE_USER'],
  tier: 'REGULAR',
  points: 0,
};

function getErrorMessage(message?: string | string[], fallback = 'Operation failed'): string {
  if (Array.isArray(message)) {
    return message[0] || fallback;
  }
  return message || fallback;
}

function normalizeUser(data: unknown): User {
  const source = typeof data === 'object' && data !== null ? data as Record<string, unknown> : {};
  const roles = Array.isArray(source.roles)
    ? source.roles.filter((role): role is string => typeof role === 'string' && role.length > 0)
    : typeof source.role === 'string' && source.role.length > 0
      ? [source.role]
      : ['ROLE_USER'];

  return {
    id: Number(source.id) || 0,
    name: typeof source.name === 'string'
      ? source.name
      : typeof source.fullName === 'string'
        ? source.fullName
        : DEFAULT_USER.name,
    email: typeof source.email === 'string' ? source.email : DEFAULT_USER.email,
    phone: typeof source.phone === 'string' ? source.phone : '',
    role: roles[0] || 'ROLE_USER',
    roles,
    tier: typeof source.tier === 'string' ? source.tier : DEFAULT_USER.tier,
    points: Number(source.points ?? source.rewardPoints ?? 0),
    avatarUrl: typeof source.avatarUrl === 'string' ? source.avatarUrl : '',
    gender: typeof source.gender === 'string' ? source.gender : '',
    birthdate: typeof source.birthdate === 'string' ? source.birthdate : '',
    joinDate: typeof source.joinDate === 'string' ? source.joinDate : '',
  };
}

function readStoredUser(): User | null {
  if (typeof window === 'undefined') return null;

  const saved = localStorage.getItem('user');
  if (!saved) return null;

  try {
    return normalizeUser(JSON.parse(saved));
  } catch {
    return null;
  }
}

function setStoredUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
}

async function fetchUserProfile(token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Gagal mengambil profil pengguna');
  }

  return normalizeUser(await response.json());
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

    if (!response.ok || !data.status) {
      return {
        success: false,
        message: getErrorMessage(data.message, 'Email atau password salah'),
      };
    }

    const token = data.payload?.accessToken;
    if (!token) {
      return {
        success: false,
        message: 'Token login tidak tersedia',
      };
    }

    const user = await fetchUserProfile(token);
    setAuthToken(token);
    setStoredUser(user);

    return {
      success: true,
      data: {
        token,
        user,
      },
    };
  } catch (error: unknown) {
    clearAuthStorage();
    console.error('Login error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unable to connect to server. Please try again.',
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
        message: getErrorMessage(data.message, 'Registration failed'),
      };
    }

    return {
      success: true,
      message: getErrorMessage(data.message, 'Registration successful'),
    };
  } catch (error: unknown) {
    console.error('Register error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unable to connect to server. Please try again.',
    };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const user = await fetchUserProfile(token);
    setStoredUser(user);
    return user;
  } catch {
    clearAuthStorage();
    return null;
  }
}

export async function fetchDashboard(): Promise<DashboardData | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Gagal mengambil data dashboard');
    }

    const data = await response.json();
    const user = normalizeUser(data.user);
    const dashboardUser: DashboardUser = {
      ...user,
      tier: user.tier || 'REGULAR',
      points: user.points || 0,
      pointsNext: Number(data.user?.pointsNext ?? 1000),
      totalSpent: Number(data.user?.totalSpent ?? 0),
      joinDate: typeof data.user?.joinDate === 'string' ? data.user.joinDate : undefined,
    };

    setStoredUser(user);

    return {
      user: dashboardUser,
      stats: {
        totalOrders: Number(data.stats?.totalOrders ?? 0),
        activeOrders: Number(data.stats?.activeOrders ?? 0),
        wishlistCount: Number(data.stats?.wishlistCount ?? 0),
        rewardPoints: Number(data.stats?.rewardPoints ?? dashboardUser.points ?? 0),
      },
      recentOrders: Array.isArray(data.recentOrders) ? data.recentOrders : [],
      wishlist: Array.isArray(data.wishlist) ? data.wishlist : [],
      recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
    };
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    return null;
  }
}

export async function fetchProducts(page = 0, size = 20, categoryId?: number) {
  try {
    let url = `${API_BASE_URL}/products?page=${page}&size=${size}`;
    if (categoryId) {
      url += `&categoryId=${categoryId}`;
    }
    const response = await fetch(url);
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

function getAuthHeaders(includeJson = false): HeadersInit | null {
  const token = getAuthToken();
  if (!token) return null;

  return includeJson
    ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Authorization': `Bearer ${token}` };
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('authToken', token);
}

export function clearAuthStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('maison_admin_auth');
  localStorage.removeItem('maison_admin_name');
}

export function removeAuthToken(): void {
  clearAuthStorage();
}

export async function logout(): Promise<void> {
  const token = getAuthToken();

  try {
    if (token) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearAuthStorage();
  }
}

// Helper functions for safe data handling
export function getImageUrl(img?: string): string {
  if (img && img.length > 0 && !img.includes('undefined') && !img.includes('null')) {
    return img;
  }
  return "/product-chair.png";
}

export function getSafePoints(points?: number): number {
  return points || 0;
}

export function getSafeTier(tier?: string): string {
  return tier || "REGULAR";
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
  subtotal?: number;
}

export interface CartResponse {
  items: CartItem[];
  subtotal: number;
  count: number;
  isGuest: boolean;
}

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  orderItems: OrderItem[];
  shippingAddress: string;
  billingAddress?: string;
  customerNote?: string;
  tax?: number;
  shippingFee?: number;
  discount?: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: string;
  items?: CartItem[];
  orderItems?: unknown[];
  subtotal: number;
  shipping?: number;
  shippingFee?: number;
  discount?: number;
  total: number;
  shippingAddress?: string;
  customerNote?: string;
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

export async function getCart(): Promise<CartResponse> {
  const token = getAuthToken();
  if (!token) return { items: [], subtotal: 0, count: 0, isGuest: true };

  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include',
    });
    if (!response.ok) return { items: [], subtotal: 0, count: 0, isGuest: false };
    const data = await response.json();
    return {
      items: Array.isArray(data.items) ? data.items : [],
      subtotal: Number(data.subtotal ?? 0),
      count: Number(data.count ?? 0),
      isGuest: Boolean(data.isGuest),
    };
  } catch {
    return { items: [], subtotal: 0, count: 0, isGuest: false };
  }
}

export interface CartMutationResponse {
  success: boolean;
  message?: string;
  item?: CartItem;
}

function normalizeCartItem(item: unknown): CartItem | undefined {
  if (!item || typeof item !== 'object') return undefined;
  const source = item as Record<string, unknown>;
  return {
    id: Number(source.id ?? 0),
    productId: Number(source.productId ?? 0),
    productName: String(source.productName ?? 'Produk'),
    productImage: String(source.productImage ?? ''),
    variant: String(source.variant ?? 'Default'),
    price: Number(source.price ?? 0),
    quantity: Number(source.quantity ?? 1),
    stock: Number(source.stock ?? 0),
    subtotal: Number(source.subtotal ?? 0),
  };
}

async function parseCartMutationResponse(response: Response): Promise<CartMutationResponse> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return {
      success: false,
      message: typeof data.message === 'string' ? data.message : 'Cart operation failed',
    };
  }

  return {
    success: Boolean(data.success ?? true),
    message: typeof data.message === 'string' ? data.message : undefined,
    item: normalizeCartItem(data.item),
  };
}

export async function addCartItem(
  productId: number,
  quantity = 1,
  variant = 'Default'
): Promise<CartMutationResponse> {
  const token = getAuthToken();
  if (!token) return { success: false, message: 'Please login first' };

  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity, variant }),
      credentials: 'include',
    });

    return await parseCartMutationResponse(response);
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : 'Connection error' };
  }
}

export async function updateCartItemQuantity(itemId: number, quantity: number): Promise<CartMutationResponse> {
  const token = getAuthToken();
  if (!token) return { success: false, message: 'Please login first' };

  try {
    const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
      credentials: 'include',
    });

    return await parseCartMutationResponse(response);
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : 'Connection error' };
  }
}

export async function removeCartItem(itemId: number): Promise<CartMutationResponse> {
  const token = getAuthToken();
  if (!token) return { success: false, message: 'Please login first' };

  try {
    const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include',
    });

    return await parseCartMutationResponse(response);
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : 'Connection error' };
  }
}

export async function clearServerCart(): Promise<CartMutationResponse> {
  const token = getAuthToken();
  if (!token) return { success: false, message: 'Please login first' };

  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include',
    });

    return await parseCartMutationResponse(response);
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : 'Connection error' };
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
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : 'Connection error' };
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

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/orders/number/${encodeURIComponent(orderNumber)}`, {
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

export async function cancelOrder(id: number): Promise<{ success: boolean; message?: string }> {
  const token = getAuthToken();
  if (!token) return { success: false, message: 'Please login first' };

  try {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include',
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return { success: false, message: data.message || 'Gagal membatalkan pesanan' };
    }
    return { success: true };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : 'Connection error' };
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
  salePrice?: number | null;
  imageUrl: string;
  category?: string;
  rating?: number;
  stock?: number;
  isNew?: boolean;
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
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : 'Operation failed' };
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
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : 'Operation failed' };
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
  pointsCost: number;
  minOrderValue: number;
  validUntil: string;
  isActive: boolean;
  usedCount: number;
  usageLimit: number;
  createdAt?: string;
  updatedAt?: string;
}

export async function getVouchers(): Promise<Voucher[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/vouchers`);
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data.vouchers) ? data.vouchers.map(normalizeVoucher) : [];
  } catch {
    return [];
  }
}

function normalizeVoucher(source: unknown): Voucher {
  const voucher = typeof source === 'object' && source !== null ? source as Record<string, unknown> : {};
  const discountType = String(voucher.discountType ?? voucher.type ?? 'FIXED').toUpperCase();
  return {
    id: Number(voucher.id ?? 0),
    code: String(voucher.code ?? ''),
    discountType: discountType === 'PERCENT' || discountType === 'PERSEN' ? 'PERCENT' : 'FIXED',
    discountValue: Number(voucher.discountValue ?? voucher.value ?? 0),
    pointsCost: Number(voucher.pointsCost ?? 0),
    minOrderValue: Number(voucher.minOrderValue ?? voucher.minOrder ?? 0),
    validUntil: String(voucher.validUntil ?? voucher.expiry ?? ''),
    isActive: voucher.isActive !== false,
    usedCount: Number(voucher.usedCount ?? voucher.used ?? 0),
    usageLimit: Number(voucher.usageLimit ?? voucher.limit ?? 0),
    createdAt: typeof voucher.createdAt === 'string' ? voucher.createdAt : undefined,
    updatedAt: typeof voucher.updatedAt === 'string' ? voucher.updatedAt : undefined,
  };
}

export interface AdminVoucherPayload {
  code: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  pointsCost: number;
  minOrderValue: number;
  usageLimit: number;
  validUntil: string;
  isActive: boolean;
}

export async function fetchAdminVouchers(): Promise<Voucher[]> {
  const token = getAuthToken();
  if (!token) return [];

  try {
    const response = await fetch(`${API_BASE_URL}/admin/vouchers`, {
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch admin vouchers');
    const data = await response.json();
    return Array.isArray(data.vouchers) ? data.vouchers.map(normalizeVoucher) : [];
  } catch (error) {
    console.error('Error fetching admin vouchers:', error);
    return [];
  }
}

export async function createAdminVoucher(payload: AdminVoucherPayload): Promise<{ success: boolean; message?: string; voucher?: Voucher }> {
  const token = getAuthToken();
  if (!token) return { success: false, message: 'Please login first' };

  try {
    const response = await fetch(`${API_BASE_URL}/admin/vouchers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return { success: false, message: data.message || 'Failed to create voucher' };
    return { success: true, voucher: normalizeVoucher(data.voucher) };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : 'Connection error' };
  }
}

export async function updateAdminVoucher(id: number, payload: Partial<AdminVoucherPayload>): Promise<{ success: boolean; message?: string; voucher?: Voucher }> {
  const token = getAuthToken();
  if (!token) return { success: false, message: 'Please login first' };

  try {
    const response = await fetch(`${API_BASE_URL}/admin/vouchers/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return { success: false, message: data.message || 'Failed to update voucher' };
    return { success: true, voucher: normalizeVoucher(data.voucher) };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : 'Connection error' };
  }
}

export async function setAdminVoucherActive(id: number, isActive: boolean): Promise<{ success: boolean; message?: string; voucher?: Voucher }> {
  const token = getAuthToken();
  if (!token) return { success: false, message: 'Please login first' };

  try {
    const response = await fetch(`${API_BASE_URL}/admin/vouchers/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive }),
      credentials: 'include',
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return { success: false, message: data.message || 'Failed to update voucher status' };
    return { success: true, voucher: normalizeVoucher(data.voucher) };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : 'Connection error' };
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
  } catch (error: unknown) {
    return { valid: false, message: error instanceof Error ? error.message : 'Operation failed' };
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
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : 'Operation failed' };
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
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : 'Operation failed' };
  }
}

// ============ USER PROFILE API ============

export async function updateUserProfile(data: {
  name?: string;
  phone?: string;
  avatarUrl?: string;
  gender?: string;
  birthdate?: string;
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
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : 'Operation failed' };
  }
}

export function getStoredUser(): User {
  return readStoredUser() || DEFAULT_USER;
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export function isAdmin(): boolean {
  const user = readStoredUser();
  if (!user) return false;
  return user.role === 'ROLE_ADMIN' || user.roles.includes('ROLE_ADMIN');
}

export function getAdminDisplayName(): string {
  const user = readStoredUser();
  return user?.name || 'Admin Maison';
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  tier: string;
  rewardPoints: number;
  totalOrders: number;
  totalSpent: number;
  isActive: boolean;
  joinDate?: string;
  roles: string[];
}

function normalizeAdminUser(source: unknown): AdminUser {
  const user = typeof source === 'object' && source !== null ? source as Record<string, unknown> : {};
  return {
    id: Number(user.id ?? 0),
    name: String(user.name ?? 'Unknown'),
    email: String(user.email ?? ''),
    phone: String(user.phone ?? ''),
    tier: String(user.tier ?? 'REGULAR').toUpperCase(),
    rewardPoints: Number(user.rewardPoints ?? user.points ?? 0),
    totalOrders: Number(user.totalOrders ?? 0),
    totalSpent: Number(user.totalSpent ?? user.totalSpend ?? 0),
    isActive: user.isActive !== false,
    joinDate: typeof user.joinDate === 'string' ? user.joinDate : undefined,
    roles: Array.isArray(user.roles) ? user.roles.filter((role): role is string => typeof role === 'string') : [],
  };
}

export async function fetchAdminUsers(page = 0, size = 20, search?: string, tier?: string): Promise<AdminUser[]> {
  const headers = getAuthHeaders();
  if (!headers) return [];

  try {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (search) params.append('search', search);
    if (tier) params.append('tier', tier);
    const response = await fetch(`${API_BASE_URL}/admin/users?${params}`, {
      headers,
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    const data = await response.json();
    return Array.isArray(data.content) ? data.content.map(normalizeAdminUser) : [];
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return [];
  }
}

export async function updateAdminUser(
  id: number,
  payload: Partial<Pick<AdminUser, 'name' | 'phone' | 'tier' | 'rewardPoints' | 'isActive'>>
): Promise<{ success: boolean; message?: string; user?: AdminUser }> {
  const headers = getAuthHeaders(true);
  if (!headers) return { success: false, message: 'Please login first' };

  try {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return { success: false, message: data.message || 'Failed to update user' };
    return { success: true, user: normalizeAdminUser(data) };
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : 'Connection error' };
  }
}

export async function fetchAdminOrders(page = 0, size = 20, status?: string) {
  const headers = getAuthHeaders();
  if (!headers) return [];

  try {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (status) params.append('status', status.toUpperCase());
    const response = await fetch(`${API_BASE_URL}/orders?${params}`, {
      headers,
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    const data = await response.json();
    return data.content || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function updateOrderStatus(orderId: number, status: string) {
  const headers = getAuthHeaders();
  if (!headers) return { success: false };

  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status?status=${encodeURIComponent(status.toUpperCase())}`, {
      method: 'PUT',
      headers,
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update order');
    return await response.json();
  } catch (error) {
    console.error('Error updating order:', error);
    return { success: false };
  }
}

export async function fetchAdminReviews(page = 0, size = 20) {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/reviews?page=${page}&size=${size}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch reviews');
    const data = await response.json();
    return data.content || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

/**
 * Count of pending orders (status = MENUNGGU).
 * Uses size=1 + totalElements to minimise payload — no need to fetch the rows themselves.
 * Returns 0 on any failure (silent — used for sidebar badge).
 */
export async function countPendingOrders(): Promise<number> {
  const headers = getAuthHeaders();
  if (!headers) return 0;
  try {
    const response = await fetch(`${API_BASE_URL}/orders?status=MENUNGGU&page=0&size=1`, {
      headers,
      credentials: 'include',
    });
    if (!response.ok) return 0;
    const data = await response.json();
    return typeof data?.totalElements === 'number' ? data.totalElements : 0;
  } catch {
    return 0;
  }
}

/**
 * Count of pending reviews (isApproved=false).
 * Backend /reviews doesn't filter by approval status server-side, so fetch up to 200
 * and count client-side. Sufficient for admin badge — pending reviews are rare.
 * Returns 0 on any failure (silent — used for sidebar badge).
 */
export async function countPendingReviews(): Promise<number> {
  const headers = getAuthHeaders();
  if (!headers) return 0;
  try {
    const response = await fetch(`${API_BASE_URL}/reviews?page=0&size=200`, {
      headers,
      credentials: 'include',
    });
    if (!response.ok) return 0;
    const data = await response.json();
    const list: Array<{ isApproved?: boolean }> = Array.isArray(data?.content) ? data.content : [];
    return list.filter(r => r.isApproved === false).length;
  } catch {
    return 0;
  }
}

export async function updateReviewStatus(reviewId: number, status: string) {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/status`, {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update review');
    return await response.json();
  } catch (error) {
    console.error('Error updating review:', error);
    return { success: false };
  }
}

export async function deleteReview(reviewId: number): Promise<{ success: boolean; message?: string }> {
  const token = getAuthToken();
  if (!token) return { success: false, message: 'Please login first' };

  try {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return { success: false, message: data.message || 'Failed to delete review' };
    }
    return await response.json();
  } catch (error: unknown) {
    return { success: false, message: error instanceof Error ? error.message : 'Operation failed' };
  }
}

export async function fetchRewardsConfig() {
  const headers = getAuthHeaders();
  if (!headers) return {};

  try {
    const response = await fetch(`${API_BASE_URL}/admin/rewards`, {
      headers,
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch rewards config');
    return await response.json();
  } catch (error) {
    console.error('Error fetching rewards config:', error);
    return {};
  }
}

export async function updateRewardsConfig(config: Record<string, unknown>) {
  const headers = getAuthHeaders(true);
  if (!headers) return { success: false };

  try {
    const response = await fetch(`${API_BASE_URL}/admin/rewards`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(config),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update rewards config');
    return await response.json();
  } catch (error) {
    console.error('Error updating rewards config:', error);
    return { success: false };
  }
}

export async function fetchStoreSettings() {
  const headers = getAuthHeaders();
  if (!headers) return {};

  try {
    const response = await fetch(`${API_BASE_URL}/admin/settings`, {
      headers,
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch settings');
    return await response.json();
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {};
  }
}

export async function updateStoreSettings(settings: Record<string, unknown>) {
  const headers = getAuthHeaders(true);
  if (!headers) return { success: false };

  try {
    const response = await fetch(`${API_BASE_URL}/admin/settings`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(settings),
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to update settings');
    return await response.json();
  } catch (error) {
    console.error('Error updating settings:', error);
    return { success: false };
  }
}

// ─── RAG Chatbot ──────────────────────────────────────────────────────────────

export interface ChatMessageDTO {
  role: 'user' | 'ai';
  text: string;
}

export interface ChatProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  salePrice?: number | null;
  imageUrl?: string | null;
  material?: string | null;
  stock?: number;
  isNew?: boolean;
  rating?: number;
  category?: { id: number; name: string } | null;
  collection?: { id: number; name: string } | null;
}

export interface ChatApiResponse {
  text: string;
  productIds: number[];
  products: ChatProduct[];
  intent?: string;
  usage?: {
    promptTokens?: number;
    responseTokens?: number;
    totalTokens?: number;
  };
  success: boolean;
}

/**
 * Send a chat message to the RAG backend.
 * Falls back to a safe local response when the backend is unreachable.
 */
export async function sendChatMessage(
  message: string,
  history: ChatMessageDTO[] = []
): Promise<ChatApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });

    if (!response.ok) {
      throw new Error(`Chat API returned ${response.status}`);
    }
    return (await response.json()) as ChatApiResponse;
  } catch (error) {
    console.error('Error sending chat message:', error);
    return {
      text:
        'Maaf, asisten saya sedang sibuk. Coba beberapa saat lagi, atau jelajahi koleksi kami di halaman Koleksi.',
      productIds: [],
      products: [],
      intent: 'fallback',
      success: false,
    };
  }
}


