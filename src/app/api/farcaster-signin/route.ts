import {createAppClient, viemConnector} from '@farcaster/auth-client'
import { NextResponse } from 'next/server'
import {signinWithFarcaster} from '@/service/solar'



export async function POST(req: Request) {
    const {message, signature, custody} = await req.json()

    try {
        const appClient = createAppClient({
            ethereum: viemConnector({rpcUrl: "https://optimism-mainnet.infura.io/v3/df69a66a46e94a1bb0e0f2914af8b403"}),
        })

        const nonce = message.match(/Nonce: (\w+)/)[1]
        const domain = message.match(/URI: (\S+)/)[1]


        if (!nonce || !domain) {
            return NextResponse.json({
                result: 'failed',
                message: 'Invalid message'
            })
        }

        const {success, fid, error} = await appClient.verifySignInMessage({
            nonce: nonce,
            domain: domain.replace(/^https?:\/\//, ''),
            message: message,
            signature: signature
        })

        if (error) {
            console.error(`[ERROR] ${error.message}`)
            return NextResponse.json({
                result: 'failed',
                message: error.message
            })
        }

        console.log('[Verified farcaster account]:', fid)
        if (success) {
            const authToken = await signinWithFarcaster({
                far_fid: fid,
                far_address: custody,
                next_token: process.env.NEXT_TOKEN || '',
                host: domain
            })

            return NextResponse.json({
                result: 'ok',
                auth_token: authToken
            })
        } else {
            return NextResponse.json({
                result: 'failed',
                message: 'Verification failed'
            })
        }
    } catch (e: unknown) {
        console.error(e)
        return NextResponse.json({
            result: 'failed',
            message: 'Verification failed'
        })
    }
}

