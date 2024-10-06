'use client'
import {useAccount, useDisconnect} from 'wagmi'
import WagmiWrapper from '@/components/client/SignInOptions/WagmiWrapper'
import Cookies from 'js-cookie'

const authFiled = process.env.NEXT_PUBLIC_AUTH_FIELD!

const Content = () => {
    const {disconnect} = useDisconnect()
    const {address} = useAccount()

    return <div>
        <h1>Address</h1>
        <div>{address}</div>
        <div className="btn"
            onClick={() => {
                Cookies.remove(authFiled)
                disconnect()
            }}>Disconnect
        </div>
    </div>
}
export default function TextPage() {
    return <WagmiWrapper>
        <Content/>
    </WagmiWrapper>
}

