import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const url = new URL(request.url)
    const returnTo = url.searchParams.get('return')

    if (returnTo) {
        const response = NextResponse.next()
        response.cookies.set('return', returnTo)
        return response
    }
}
