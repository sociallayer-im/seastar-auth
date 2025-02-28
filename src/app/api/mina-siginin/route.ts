import Client from 'mina-signer'
import {minaLogin} from '@/service/solar'
import {NextResponse} from 'next/server'

export async function POST(req: Request) {
    try {
        const {signature, publicKey, data} = await req.json()
        if (!signature || !publicKey|| !data) {
            return NextResponse.json({
                result: 'failed',
                message: 'invalid parameters'
            })
        }

        const signerClient = new Client({ network: "mainnet" })

        const verifyResult = signerClient.verifyMessage({
            data,
            publicKey,
            signature
        })

        if (!verifyResult) {
            console.error({data, publicKey, signature})
            return NextResponse.json({
                result: 'failed',
                message: 'Verification failed'
            })
        }

        const auth_token = await minaLogin({
            mina_address: publicKey,
            next_token: process.env.NEXT_TOKEN || ''
        })

        return NextResponse.json({
            result: 'ok',
            auth_token
        })
    } catch (error: any) {
        console.trace(`[ERROR] ${error.message}`)
        return NextResponse.json({
            result: 'failed',
            message: `Unknown error: ${error.message}`
        })
    }
}

