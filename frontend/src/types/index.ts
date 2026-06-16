// ============================================================
// USER & AUTH TYPES
// ============================================================

export type UserRole = "customer" | "vendor" | "service_provider" | "freelancer" | "admin";
export type UserStatus = "active" | "suspended" | "pending_verification";

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  type: "home" | "work" | "other";
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
  addresses?: Address[];
  walletBalance?: number;
  referralCode?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// ============================================================
// PRODUCT TYPES
// ============================================================

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  position: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  value: string;
  price?: number;
  stock: number;
  sku: string;
  image?: string;
}

export interface ProductSpecification {
  key: string;
  value: string;
  group?: string;
}

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  primaryImage: string;
  rating: number;
  reviewCount: number;
  vendorName: string;
  category: string;
  inStock: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  tags?: string[];
}

export interface Product extends ProductSummary {
  description: string;
  richDescription?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  specifications: ProductSpecification[];
  brand?: string;
  sku: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  vendor: Vendor;
  category: string;
  subcategory?: string;
  hsn?: string;
  gstRate?: number;
  deliveryDays?: number;
  isReturnable?: boolean;
  returnDays?: number;
  warranty?: string;
  soldCount: number;
  viewCount: number;
  createdAt: string;
}

// ============================================================
// CATEGORY TYPES
// ============================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  color?: string;
  parentId?: string;
  children?: Category[];
  productCount?: number;
  isActive: boolean;
}

// ============================================================
// CART TYPES
// ============================================================

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product: ProductSummary;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  originalPrice?: number;
  addedAt: string;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  gst: number;
  total: number;
  savings: number;
  couponDiscount?: number;
  couponCode?: string;
  itemCount: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  summary: CartSummary;
  updatedAt: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: "percent" | "flat";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  expiresAt?: string;
  isValid?: boolean;
  message?: string;
}

// ============================================================
// ORDER TYPES
// ============================================================

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "return_requested"
  | "returned"
  | "refunded";

export interface OrderItem {
  id: string;
  productId: string;
  product: ProductSummary;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  originalPrice?: number;
  totalPrice: number;
}

export interface OrderTracking {
  status: OrderStatus;
  timestamp: string;
  description: string;
  location?: string;
  agent?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  address: Address;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  gst: number;
  total: number;
  couponCode?: string;
  couponDiscount?: number;
  tracking?: OrderTracking[];
  expectedDelivery?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  invoiceUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// SERVICE & BOOKING TYPES
// ============================================================

export interface ServiceProvider {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  jobsDone: number;
  isVerified: boolean;
  isAvailable: boolean;
  bio?: string;
  skills?: string[];
  city: string;
  state: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
  isSelected?: boolean;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory?: string;
  provider: ServiceProvider;
  images: string[];
  price: number;
  priceUnit: "fixed" | "hourly" | "per_visit";
  duration?: number;
  rating: number;
  reviewCount: number;
  bookingCount: number;
  isAvailable: boolean;
  isHomeVisit: boolean;
  cities: string[];
  tags?: string[];
  inclusions?: string[];
  exclusions?: string[];
  createdAt: string;
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export interface Booking {
  id: string;
  bookingNumber: string;
  userId: string;
  serviceId: string;
  service: Service;
  providerId: string;
  provider: ServiceProvider;
  date: string;
  timeSlot: string;
  address: Address;
  status: BookingStatus;
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "refunded";
  notes?: string;
  rating?: number;
  review?: string;
  createdAt: string;
}

// ============================================================
// FREELANCER TYPES
// ============================================================

export interface Freelancer {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  title: string;
  bio: string;
  skills: string[];
  hourlyRate: number;
  currency: string;
  rating: number;
  reviewCount: number;
  completedProjects: number;
  responseRate: number;
  responseTime: string;
  isOnline: boolean;
  isVerified: boolean;
  memberSince: string;
  location: string;
  languages: string[];
  portfolio?: PortfolioItem[];
  categories: string[];
  level: "beginner" | "intermediate" | "expert" | "top_rated";
}

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  image: string;
  url?: string;
  tags?: string[];
}

export type ProjectStatus = "open" | "in_progress" | "completed" | "cancelled" | "disputed";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  budget: {
    min: number;
    max: number;
    type: "fixed" | "hourly";
  };
  deadline?: string;
  clientId: string;
  client: {
    id: string;
    name: string;
    avatar?: string;
    country: string;
  };
  status: ProjectStatus;
  proposals?: Proposal[];
  proposalCount: number;
  freelancerId?: string;
  freelancer?: Freelancer;
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  amount: number;
  dueDate?: string;
  status: "pending" | "in_progress" | "submitted" | "approved" | "rejected";
}

export interface Proposal {
  id: string;
  projectId: string;
  freelancerId: string;
  freelancer: Freelancer;
  coverLetter: string;
  proposedAmount: number;
  estimatedDays: number;
  milestones?: Milestone[];
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  createdAt: string;
}

// ============================================================
// PAYMENT TYPES
// ============================================================

export type PaymentMethod = "razorpay_card" | "razorpay_upi" | "razorpay_netbanking" | "wallet" | "cod";

export interface Payment {
  id: string;
  orderId?: string;
  bookingId?: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: "pending" | "success" | "failed" | "refunded";
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  balance: number;
  description: string;
  referenceId?: string;
  referenceType?: "order" | "booking" | "refund" | "reward" | "referral";
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  transactions: Transaction[];
}

// ============================================================
// REVIEW TYPES
// ============================================================

export interface Review {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  productId?: string;
  serviceId?: string;
  freelancerId?: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  isHelpful?: boolean;
  createdAt: string;
}

export interface Rating {
  average: number;
  count: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

// ============================================================
// NOTIFICATION TYPES
// ============================================================

export type NotificationType =
  | "order_update"
  | "booking_update"
  | "payment"
  | "promotion"
  | "message"
  | "review"
  | "system";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  imageUrl?: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

// ============================================================
// CHAT TYPES
// ============================================================

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: "text" | "image" | "file" | "system";
  fileUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ChatRoom {
  id: string;
  participants: User[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  type: "direct" | "support" | "group";
  name?: string;
  orderId?: string;
  bookingId?: string;
  projectId?: string;
  createdAt: string;
}

// ============================================================
// VENDOR TYPES
// ============================================================

export interface Store {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  orderCount: number;
  revenue?: number;
  isVerified: boolean;
  kycStatus: "pending" | "verified" | "rejected";
  city: string;
  state: string;
  categories: string[];
  gstin?: string;
  pan?: string;
  bankAccount?: {
    accountHolder: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  commissionRate: number;
  joinedAt: string;
}

export interface Vendor extends User {
  store?: Store;
}

// ============================================================
// DASHBOARD TYPES
// ============================================================

export interface DashboardStats {
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  orderGrowth: number;
  totalUsers: number;
  userGrowth: number;
  totalVendors: number;
  vendorGrowth: number;
  totalProducts: number;
  pendingOrders: number;
  activeBookings: number;
  commissionEarned: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
  commission?: number;
}

// ============================================================
// SEARCH TYPES
// ============================================================

export interface SearchResult {
  products: ProductSummary[];
  services: Service[];
  freelancers: Freelancer[];
  categories: Category[];
  totalResults: number;
  query: string;
}

export interface SearchSuggestion {
  text: string;
  type: "product" | "category" | "service" | "freelancer" | "recent";
  image?: string;
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PageResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ============================================================
// FILTER TYPES
// ============================================================

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  brand?: string[];
  inStock?: boolean;
  sortBy?: "relevance" | "price_asc" | "price_desc" | "rating" | "newest" | "popularity";
  page?: number;
  limit?: number;
  search?: string;
}

export interface ServiceFilters {
  category?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  isHomeVisit?: boolean;
  availability?: string;
  sortBy?: "relevance" | "price_asc" | "price_desc" | "rating" | "bookings";
  page?: number;
  limit?: number;
  search?: string;
}

export interface FreelancerFilters {
  category?: string;
  skills?: string[];
  minRate?: number;
  maxRate?: number;
  rating?: number;
  level?: string;
  availability?: boolean;
  sortBy?: "relevance" | "rating" | "rate_asc" | "rate_desc" | "jobs";
  page?: number;
  limit?: number;
  search?: string;
}
