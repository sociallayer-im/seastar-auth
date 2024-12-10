import {NextResponse} from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
    const {auth_date, first_name, hash, id, photo_url, username} = await req.json()

    const userInfo = {
        auth_date,
        first_name,
        id,
        photo_url,
        username
    }
    const dataCheckString = Object.keys(userInfo)
        .sort()
        .map((key) => `${key}=${userInfo[key as keyof typeof userInfo]}`)
        .join("\n")

    const secretKey = crypto.createHash("sha256").update(process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID!).digest()
    const calculatedHash = crypto
        .createHmac("sha256", secretKey)
        .update(dataCheckString)
        .digest("hex")

    if (calculatedHash !== hash) {
        return NextResponse.json({
            result: 'fail',
            message: 'Invalid info'
        })
    }

    return NextResponse.json({
        result: 'ok',
        auth_token: ''
    })
}
