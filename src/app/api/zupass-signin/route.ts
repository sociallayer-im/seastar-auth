import { NextResponse } from 'next/server'
import {signInWithZupass} from '@/service/solar'

export async function POST(req: Request) {
    try {
        const {pcdStr} = await req.json()

        const pcdStrJson = JSON.parse(pcdStr)

        const ticketInfo: {zupass_product_id: string, zupass_event_id: string}[] = []
        let email = ''

        pcdStrJson.forEach((pcdStr: {pcd:string, [index: string]: string | string[]}) => {
            const pcd = JSON.parse(pcdStr.pcd)
            ticketInfo.push({
                zupass_product_id: pcd.claim.partialTicket.productId || '',
                zupass_event_id: pcd.claim.partialTicket.eventId || ''
            })
            email = pcd.claim.partialTicket.attendeeEmail
        })

        const authToken = await signInWithZupass({
            email: email,
            zupass_list: ticketInfo,
            next_token: process.env.NEXT_TOKEN || '',
        })

        return NextResponse.json({
            result: 'ok',
            email: email,
            auth_token: authToken
        })
    } catch (e: unknown) {
        console.error(`[ERROR] ${e}`)
        return NextResponse.json({
            result: 'failed',
            message: (e as Error).message
        })
    }
}
