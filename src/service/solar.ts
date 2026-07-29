const api = process.env.NEXT_PUBLIC_API_URL

export interface AuthResult {
    token: string
    user: { id: string, email: string | null, name: string | null }
}

// Thin fetch wrapper for the soon API: Bearer auth, JSON body, and real HTTP
// error codes (the body's {error} message is surfaced on failure).
const request = async <T>(path: string, opts: {
    method?: string,
    body?: Record<string, unknown>,
    authToken?: string
} = {}): Promise<T> => {
    // Only set Content-Type when we actually send a body. A bodyless GET with
    // this header is a non-simple cross-origin request and would force a CORS
    // preflight; without it, `/auth/nonce` and unauthenticated profile lookups
    // stay simple requests. (Authenticated GETs still preflight because of the
    // Authorization header — that's inherent and handled by the API's CORS config.)
    const headers: Record<string, string> = {}
    if (opts.body) {
        headers['Content-Type'] = 'application/json'
    }
    if (opts.authToken) {
        headers['Authorization'] = `Bearer ${opts.authToken}`
    }

    const response = await fetch(`${api}/api/v1${path}`, {
        method: opts.method || 'GET',
        headers,
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        cache: 'no-store'
    })

    if (!response.ok) {
        let message = response.statusText
        try {
            const data = await response.json()
            if (data.error) message = data.error
        } catch { /* non-JSON error body */ }
        throw new Error(message)
    }

    return await response.json() as T
}

export const getNonce = async () => {
    const {nonce} = await request<{ nonce: string }>('/auth/nonce')
    return nonce
}

export const signInWithWallet = async (props: { signature: string, message: string }) => {
    return await request<AuthResult>('/auth/verify_wallet', {method: 'POST', body: props})
}

export const sendPinCode = async (props: { email: string, context?: 'bind_email' }) => {
    return await request<{ message: string }>('/auth/request_code', {method: 'POST', body: props})
}

export const verifyEmail = async (props: { email: string, code: string }) => {
    return await request<AuthResult>('/auth/verify_code', {method: 'POST', body: props})
}

export const getProfileByToken = async (authToken?: string) => {
    if (!authToken) return null
    try {
        return await request<Solar.Profile>('/users/me', {authToken})
    } catch {
        return null
    }
}

export const getProfileByName = async (name: string) => {
    try {
        return await request<Solar.Profile>(`/users/${encodeURIComponent(name)}`)
    } catch {
        return null
    }
}

// Sets the username picked on the register screen.
export const setName = async (props: { authToken: string, name: string }) => {
    return await request<Solar.Profile>('/users/me', {
        method: 'PATCH',
        authToken: props.authToken,
        body: {user: {name: props.name}}
    })
}

// Attaches a code-verified email to a wallet-first account.
export const bindEmail = async (props: { authToken: string, email: string, code: string }) => {
    return await request<Solar.Profile>('/auth/bind_email', {
        method: 'POST',
        authToken: props.authToken,
        body: {email: props.email, code: props.code}
    })
}

// Server-side only: Google OAuth, which the auth service verifies itself and
// exchanges for a session via the NEXT_TOKEN shared secret. The backend's
// /auth/trusted_signin still accepts a sol_address branch for the retired
// Solana flow; nothing here calls it any more.
export const googleLogin = async (props: { email: string, next_token: string }) => {
    const res = await request<AuthResult>('/auth/trusted_signin', {method: 'POST', body: props})
    return res.token
}
