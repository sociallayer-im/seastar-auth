import {useEffect, useState} from 'react'
import {useToast} from '@/components/client/shadcn/Toast/use-toast'
import useModal from '@/components/client/Modal/useModal'
import {clientCheckUserLoggedInAndRedirect, setAuth} from '@/utils'

export default function MinaOptionItem() {
    const [ready, setReady] = useState(false)
    const {toast} = useToast()
    const {showLoading, closeModal} = useModal()

    useEffect(() => {
        let timeout: number = 0
        if (typeof window !== 'undefined') {
            timeout = window.setInterval(() => {
                if (!!window.mina) {
                    setReady(true)
                }
            }, 500)
        }

        return () => {
            if (timeout) {
                clearInterval(timeout)
            }
        }
    }, [])

    const handleSignIn = async () => {
        const loading = showLoading()
        try {
            const address = await window.mina!.requestAccounts()
            if (!address.length) {
                toast({
                    title: 'mina connect error',
                    variant: 'destructive'
                })
                return
            }

            const signed = await sign(address[0])
            console.log('signed', signed)
            const res = await fetch('/api/mina/authenticate',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(signed)
                })

            if (!res.ok) {
                console.error(res.statusText)
                toast({
                    title: 'sign in with mina error',
                    variant: 'destructive'
                })
                return
            }

            const data = await res.json()

            if (data.result !== 'ok') {
                console.error(data.message)
                toast({
                    title: data.message,
                    variant: 'destructive'
                })
                return
            }

            setAuth(data.auth_token)
            clientCheckUserLoggedInAndRedirect(data.auth_token)
        } catch (e: any) {
            console.error(e)
            toast({
                title: e.message,
                variant: 'destructive'
            })
        } finally {
            closeModal(loading)
        }
    }

    return <div
        onClick={handleSignIn}
        id="telegram_passport_auth"
        data-testid="telegram-option-item"
        className={`${!ready ? 'opacity-30 pointer-events-none ' : 'cursor-pointer '}w-full shadow btn btn-md bg-[var(--background)] mb-3 sm:mb-0 justify-start`}
    >
        <img src="https://ik.imagekit.io/soladata/frniiuc9_5-PAFvV1h" className="w-6 h-6 mr-2 rounded" width={24}
            height={24} alt="farcaster"/>
        Auro Wallet
    </div>
}

async function sign(address: string) {
    const domain = window.location.host
    return await window.mina!.signMessage({
        message: `${domain} wants you to sign in with Mina account: ${address}.`
    })
}
