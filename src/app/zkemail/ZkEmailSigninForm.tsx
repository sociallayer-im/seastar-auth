'use client'

import {Dictionary} from '@/lang'
import {useState} from 'react'
import {OauthClient} from "@zk-email/oauth-sdk"
import {Address, createPublicClient, http} from 'viem'
import {baseSepolia} from 'viem/chains'
import {useToast} from '@/components/client/shadcn/Toast/use-toast'
import {clientCheckUserLoggedInAndRedirect, setAuth} from '@/utils'

export default function ZkEmailSigninForm(props: { lang: Dictionary }) {
    const {toast} = useToast()

    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [waiting, setWaiting] = useState(false)

    const handleCheckEmail = (email: string) => {
        if (!email) {
            setError('Please input email')
            return
        }

        if (!email.includes('@') || !email.includes('.')) {
            setError('Invalid email')
            return
        }

        setError('')
    }


    const handleZkEmailSign = async () => {
        if (error) return

        setWaiting(true)

        try {
            const publicClient: any = createPublicClient({
                chain: baseSepolia, // Chain ID
                transport: http("https://sepolia.base.org"), // Transport URL
            })

            // Your core contract address. This prefilled default is already deployed on Base Sepolia
            const coreAddress: Address = '0x3C0bE6409F828c8e5810923381506e1A1e796c2F'
            // Your OAuth core contract address, deployed on Base Sepolia
            const oauthAddress: Address = '0x8bFcBe6662e0410489d210416E35E9d6B62AF659'
            // Your relayer host; this one is public and deployed on Base Sepolia
            const relayerHost: string = "https://oauth-api.emailwallet.org"
            const oauthClient = new OauthClient(publicClient, coreAddress, oauthAddress, relayerHost)
            const requestId = await oauthClient.setup(email, null, null, null)
            const isActivated = await oauthClient.waitEpheAddrActivated(requestId)
            if (!isActivated) {
                setError('Email not activated')
                return
            }
            // console.log('oauthClient', oauthClient)
            const epheSignature = await oauthClient.epheClient.signMessage({message: 'zkemail sign in'})
            const verifyRequest = await fetch('/api/zkemail-signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    epheSignature,
                    epheAddress: oauthClient.epheClient.address
                }),
            })

            if (!verifyRequest.ok) {
                throw new Error('Failed to sign in with ZK Email: ' + verifyRequest.statusText)
            }

            const data = await verifyRequest.json()
            if (data.result !== 'ok') {
                throw new Error(data.message)
            }
            setAuth(data.auth_token)
            clientCheckUserLoggedInAndRedirect(data.auth_token)
        } catch (e: unknown) {
            console.error(e)
            setWaiting(false)
            toast({
                title: 'Sign in error',
                description: e instanceof Error ? e.message : 'An error occurred',
                variant: 'destructive',
            })
        }
    }

    return !waiting ?
        <>
            <label
                className={`${error ? 'input-error ' : ''}input flex flew-row w-full bg-gray-100 focus-within:outline-none focus-within:border-primary`}>
                <input
                    data-testid="username-input"
                    type={'email'}
                    className="flex-1"
                    name="email"
                    autoFocus={true}
                    maxLength={100}
                    value={email}
                    placeholder={props.lang['Your email']}
                    onBlur={() => {
                        handleCheckEmail(email.trim())
                    }}
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }}/>
            </label>
            <button className="btn btn-primary w-full my-4"
                onClick={handleZkEmailSign}
            >{props.lang['Next']}</button>
            <div className="text-red-400 text-sm h-10">{error}</div>
        </>
        :
        <div className="flex flex-row items-center">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="32px" height="32px" viewBox="0 0 128 128">
                <rect x="0" y="0" width="100%" height="100%" fill="none"/>
                <g>
                    <linearGradient id="linear-gradient">
                        <stop offset="0%" stopColor="#ffffff"/>
                        <stop offset="100%" stopColor="#6cd7b2"/>
                    </linearGradient>
                    <path
                        d="M63.85 0A63.85 63.85 0 1 1 0 63.85 63.85 63.85 0 0 1 63.85 0zm.65 19.5a44 44 0 1 1-44 44 44 44 0 0 1 44-44z"
                        fill="url(#linear-gradient)" fillRule="evenodd"/>
                    <animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="1080ms"
                        repeatCount="indefinite"></animateTransform>
                </g>
            </svg>

            <div className="ml-2 text-sm">
                <div>Loading until your sign-in is completed...</div>
            </div>
        </div>
}
