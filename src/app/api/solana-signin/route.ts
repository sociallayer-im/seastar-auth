import { NextResponse } from 'next/server'
import { ed25519 } from '@noble/curves/ed25519'
import {signinWithSolana} from '@/service/solar'

export async function POST(req: Request) {
    const {signature, publicKey, address, message} = await req.json()
    const verified = ed25519.verify(Uint8Array.from(signature), Uint8Array.from(message), Uint8Array.from(publicKey))
    if (!verified) {
        return NextResponse.json({
            result: 'failed',
            message: 'Message signature invalid!'
        })
    } else {
        const auth_token = await signinWithSolana({
            sol_address: address,
            next_token: process.env.NEXT_TOKEN || ''
        })

        return NextResponse.json({
            result: 'ok',
            auth_token: auth_token
        })
    }
}
