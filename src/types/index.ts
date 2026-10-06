export type Locale = 'sk' | 'en' | 'de'

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_price: number | null
  category: ProductCategory
  badge: 'sale' | 'new' | 'bio' | null
  stock: number
  images: string[]
  is_active: boolean
  created_at: string
}

export type ProductCategory = 'food' | 'supplements' | 'care' | 'accessories'

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  status: OrderStatus
  payment_method: 'card' | 'invoice'
  payment_status: 'pending' | 'paid' | 'failed'
  subtotal: number
  shipping: number
  total: number
  customer_email: string
  customer_first_name: string
  customer_last_name: string
  customer_phone: string | null
  shipping_street: string
  shipping_city: string
  shipping_zip: string
  shipping_country: string
  company_name: string | null
  ico: string | null
  dic: string | null
  stripe_session_id: string | null
  created_at: string
  items?: OrderItem[]
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_price: number
  quantity: number
  subtotal: number
  product?: Product
}

export interface Profile {
  id: string
  email: string
  role: 'admin' | 'customer'
  created_at: string
}
