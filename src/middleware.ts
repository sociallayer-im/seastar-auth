import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {AUTH_FIELD} from '@/utils'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const url = new URL(request.url)
    const returnTo = url.searchParams.get('return')

    if (returnTo) {
        const response = NextResponse.next()
        response.cookies.set('return', returnTo)
        return response
    }

    const authToken = request.cookies.get(AUTH_FIELD)
    if (!authToken && request.nextUrl.pathname !== '/') {
        console.log('middleware-redirect-to-root')
        return NextResponse.redirect(request.nextUrl.origin)
    }
}

export const config = {
    matcher: [ '/', '/register', '/bind-email', '/verify-bind-email'],
}
