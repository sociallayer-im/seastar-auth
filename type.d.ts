declare namespace Solar {
    // GET /api/v1/users/me (soon `:self` view). `name` is the unique username
    // (the old "handle") and is null until the user registers one; `email` is
    // null for wallet-first accounts until they bind one.
    interface Profile {
        id: string
        name: string | null
        email: string | null
        nickname: string | null
        image_url: string | null
        bio?: string | null
        eth?: string | null
        social_links?: Record<string, string>
        permissions?: string[]
        created_at?: string
    }
}

interface Window { Telegram?: any; mina?: any }
