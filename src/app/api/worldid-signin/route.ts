import { NextResponse } from 'next/server'
import {signinWithWorldId} from '@/service/solar'
import {verifySiweMessage} from "@/libs/minikit"

export async function POST(req: Request) {
    const {payload, nonce} = await req.json()

    try {
        await verifySiweMessage(payload, nonce)
        const auth_token = await signinWithWorldId({
            address: payload.address,
            next_token: process.env.NEXT_TOKEN || ''
        })

        return NextResponse.json({
            result: 'ok',
            auth_token: auth_token
        })
    } catch (e: unknown) {
        console.error(e)
        return NextResponse.json({
            result: 'failed',
            message: e instanceof Error ? e.message : 'An error occurred'
        })
    }
}
