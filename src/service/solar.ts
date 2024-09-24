const api = process.env.NEXT_PUBLIC_API_URL

export const getNonce = async () => {
    const response = await fetch(`${api}/siwe/nonce`)
    const {nonce} = await response.json()
    return nonce
}

export const signInWithWallet = async (props: { signature: string, message: string }) => {
    const response = await fetch(`${api}/siwe/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(props)
    })

    if (!response.ok) {
        throw new Error('Failed to sign in with wallet: ' + response.statusText)
    }

    const data = await response.json()
    if (data.result !== 'ok') {
        throw new Error(data.message)
    }

    return data as { result: 'ok', auth_token: string, id: string }
}

export const sendPinCode = async (props: { email: string }) => {
    const response = await fetch(`${api}/service/send_email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({...props, context: 'email-signin'})
    })

    if (!response.ok) {
        throw new Error('Fail to send pin code: ' + response.statusText)
    }

    const data = await response.json()
    if (data.result !== 'ok') {
        throw new Error(data.message)
    }

    return data as { result: "ok", email: string }
}

export const verifyEmail = async (props: { email: string, code: string }) => {
    const response = await fetch(`${api}/profile/signin_with_email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(props)
    })

    if (!response.ok) {
        throw new Error('Fail to verify email: ' + response.statusText)
    }

    const data = await response.json()
    if (data.result !== 'ok') {
        throw new Error(data.message)
    }

    return data as  { result: "ok", auth_token: string }
}

export const getProfile = async (auth_token?: string) => {
    if (!auth_token) return null
    const response = await fetch(`${api}/profile/me?auth_token=${auth_token}`)

    if (!response.ok) {
        return null
    }

    const data = await response.json()
    return data.profile as Solar.Profile
}
