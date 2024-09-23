const api = process.env.NEXT_PUBLIC_API_URL

export const getNonce = async () => {
    const response = await fetch(`${api}/profile/nonce`)
    const {nonce} = await response.json()
    return nonce
}

export const signInWithWallet = async (props: {signature: string, message: string}) => {
    const response = await fetch(`${api}/profile/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(props)
    })
    const data = await response.json()
    if (data.result !== 'ok') {
        throw new Error(data.message)
    }

    return data as {result: 'ok', auth_token: string, id: string}
}
