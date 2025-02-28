import {googleLogin} from '@/service/solar'
import {NextResponse} from 'next/server'

export async function POST(req: Request) {
    try {
        const {access_token} = await req.json()
        if (!access_token) {
            return NextResponse.json({
                result: 'failed',
                message: 'invalid parameters'
            })
        }

        const res = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`, {
            headers: {
                host: 'auth-beta.sola.day',
                Authorization: `Bearer ${access_token}`,
                Accept: 'application/json'
            }
        })
        const data = await res.json()

        if (!data.email) {
            return NextResponse.json({
                result: 'failed',
                message: 'Invalid google access_token'
            })
        }

        const auth_token = await googleLogin({
            email: data.email,
            next_token: process.env.NEXT_TOKEN || ''
        })

        return NextResponse.json({
            result: 'ok',
            auth_token
        })
    } catch (error: any) {
        console.error(error)
        return NextResponse.json({
            result: 'failed',
            message: `Unknown error: ${error.message}`
        })
    }
}

