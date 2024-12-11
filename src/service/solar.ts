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

export const sendPinCode = async (props: { email: string}) => {
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

    return data as { result: "ok", auth_token: string }
}

export const getProfileByToken = async (auth_token?: string) => {
    if (!auth_token) return null
    const response = await fetch(`${api}/profile/me?auth_token=${auth_token}`)

    if (!response.ok) {
        return null
    }

    const data = await response.json()
    return data.profile as Solar.Profile
}

export const getProfileByHandle = async (handle: string) => {
    const response = await fetch(`${api}/profile/get_by_handle?handle=${handle}`)

    if (!response.ok) {
        return null
    }

    const data = await response.json()
    return data.profile as Solar.Profile
}

export const signInWithZupass = async (props: {
    zupass_list: {
        zupass_event_id: string,
        zupass_product_id: string,
    }[],
    email: string,
    next_token: string
}) => {
    const response = await fetch(`${api}/profile/signin_with_multi_zupass`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({...props, address_source: 'zupass'})
    })

    if (!response.ok) {
        throw new Error('Fail to login by zupass: ' + response.statusText)
    }

    const data = await response.json()
    if (data.result !== 'ok') {
        throw new Error(data.message)
    }

    return data.auth_token as string
}

export const createProfile = async (props: {auth_token: string, handle: string}) => {
    const response = await fetch(`${api}/profile/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(props)
    })

    if (!response.ok) {
        throw new Error('Fail to create profile: ' + response.statusText)
    }

    const data = await response.json()
    if (data.result !== 'ok') {
        throw new Error(data.message)
    }

    return data as { result: "ok" }
}

export const getProfileByEmail = async (email: string) => {
    const response = await fetch(`${api}/profile/get_by_email?email=${email}`)

    if (!response.ok) {
        return null
    }

    const data = await response.json()
    return data.profile as Solar.Profile
}

export const setVerifiedEmail = async (props: {auth_token: string, email: string, code: string}) => {
    const response = await fetch(`${api}/profile/set_verified_email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(props)
    })

    if (!response.ok) {
        throw new Error('Fail to set verified email: ' + response.statusText)
    }

    const data = await response.json()
    if (data.result !== 'ok') {
        throw new Error(data.message)
    }

    return data as { result: "ok" }
}

export const signinWithSolana = async (props: {sol_address: string, next_token: string}) => {
    const response = await fetch(`${api}/profile/signin_with_solana`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...props,
            address_source: 'solana'
        })
    })

    if (!response.ok) {
        throw new Error('Fail to sign in with solana: ' + response.statusText)
    }

    const data = await response.json()
    if (data.result !== 'ok') {
        throw new Error(data.message)
    }

    return data.auth_token as string
}

export const signinWithFarcaster = async (props: {next_token: string, far_fid: number, far_address: string, host: string}) => {
    const response = await fetch(`${api}/profile/signin_with_farcaster`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...props,
            address_source: 'farcaster'
        })
    })

    if (!response.ok) {
        throw new Error('Fail to sign in with farcaster: ' + response.statusText)
    }

    const data = await response.json()
    if (data.result !== 'ok') {
        throw new Error(data.message)
    }

    return data.auth_token as string
}

export const signinWithWorldId = async (props: {next_token: string, address: string}) => {
    const response = await fetch(`${api}/profile/signin_with_world_id`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...props,
            address_source: 'world_id'
        })
    })

    if (!response.ok) {
        throw new Error('Fail to sign in with world id: ' + response.statusText)
    }

    const data = await response.json()
    if (data.result !== 'ok') {
        throw new Error(data.message)
    }

    return data.auth_token as string
}

export const signinWithZkEmail = async (props: {email: string, next_token: string}) => {
    const response = await fetch(`${api}/profile/signin_with_zkemail`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...props,
            address_source: 'zkemail'
        })
    })

    if (!response.ok) {
        throw new Error('Fail to sign in with zkemail: ' + response.statusText)
    }

    const data = await response.json()
    if (data.result !== 'ok') {
        throw new Error(data.message)
    }

    return data.auth_token as string
}

export const signinWithTelegram = async (props: {telegram_id: string, next_token: string}) => {
    const response = await fetch(`${api}/profile/signin_with_telegram`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...props,
            address_source: 'telegram'
        })
    })

    if (!response.ok) {
        throw new Error('Fail to sign in with zkemail: ' + response.statusText)
    }

    const data = await response.json()
    if (data.result !== 'ok') {
        throw new Error(data.message)
    }

    return data.auth_token as string
}
