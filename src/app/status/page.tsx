'use client'

import {useDisconnect} from 'wagmi'
import WagmiWrapper from '@/components/client/SignInOptions/WagmiWrapper'
import Cookies from 'js-cookie'
import {useEffect, useState} from 'react'

const authFiled = process.env.NEXT_PUBLIC_AUTH_FIELD!

const Content = () => {
    const {disconnect} = useDisconnect()

    const [authToken, setAuthToken] = useState<string>('')

    useEffect(() => {
        setAuthToken(Cookies.get(authFiled) || '')
    }, [])

    return <div>
        <h1>Auth token</h1>
        <div className="font-semibold">{authToken}</div>
        <div className="btn"
            onClick={() => {
                Cookies.remove(authFiled)
                disconnect()
                location.href = '/'
            }}>Logout
        </div>
    </div>
}
export default function TextPage() {
    return <WagmiWrapper>
        <Content/>
    </WagmiWrapper>
}

