export interface Service {
  id: string
  title: string
  description: string
  price?: string
  image_url?: string
  created_at: string
}

export interface Event {
  id: string
  title: string
  date: string
  location: string
  description: string
  image_url?: string
  created_at: string
}

export interface Blog {
  id: string
  title: string
  slug: string
  content: string
  tags?: string[]
  author: string
  published_at: string
  created_at: string
}

export interface Resource {
  id: string
  title: string
  type: string
  link: string
  description?: string
  created_at: string
}

export interface About {
  id: string
  bio: string
  image_url?: string
  contact_info?: {
    email?: string
    phone?: string
    linkedin?: string
  }
  created_at: string
}
