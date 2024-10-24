import {useEffect, useRef} from 'react'
import {useToast} from '@/components/client/shadcn/Toast/use-toast'
import {clientCheckUserLoggedInAndRedirect, setAuth} from '@/utils'
import useModal from '@/components/client/Modal/useModal'
import { MiniKit, ResponseEvent } from '@/libs/minikit'
import {getNonce} from '@/service/solar'

function WorldIdOptionItem() {
    const {showLoading, closeModal} = useModal()
    const {toast} = useToast()
    const nonceRef = useRef<string | null>(null)

    const handleSignin = () => {
        ;(async ()=> {
            if (!MiniKit.isInstalled()) {
                toast({
                    title: 'Error',
                    description: 'World ID is not installed',
                    variant: 'destructive',
                })
                return
            }

            const modalId = showLoading()
            try {
                const nonce = await getNonce()
                nonceRef.current = nonce
                const domain = window.location.host
                MiniKit.commands.walletAuth({
                    nonce: nonce,
                    expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
                    notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
                    statement:
                        `${domain} wants you to sign in with your World ID account:`,
                })
            } catch (e: unknown) {
                console.error(e)
                toast({
                    title: 'Error',
                    description: e instanceof Error ? e.message : 'An error occurred',
                    variant: 'destructive',
                })
                closeModal(modalId)
            }
        })()

    }

    useEffect(() => {
        if (!MiniKit.isInstalled()) {
            return
        }

        MiniKit.subscribe(ResponseEvent.MiniAppWalletAuth, async (payload: { status: string }) => {
            if (payload.status === "error") {
                toast({
                    title: 'Error',
                    description: 'Fail to sign in with World ID',
                    variant: 'destructive',
                })
            } else {
                const modalId = showLoading()
                try {
                    const response = await fetch('/api/worldid-signin', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            payload,
                            nonce: nonceRef.current,
                        }),
                    })

                    if (!response.ok) {
                        throw new Error('Fail to sign in with World ID: ' + response.statusText)
                    }

                    const data = await response.json()

                    if (data.result !== 'ok') {
                        throw new Error(data.message)
                    }

                    setAuth(data.auth_token)
                    clientCheckUserLoggedInAndRedirect(data.auth_token)
                } catch (e:unknown) {
                    console.error(e)
                    closeModal(modalId)
                    toast({
                        title: 'Error',
                        description: e instanceof Error ? e.message : 'An error occurred',
                        variant: 'destructive',
                    })
                }
            }
        })
    }, [])

    return <div
        data-testid="worldid-option-item"
        className={`${MiniKit.isInstalled() ?'cursor-pointer ': 'opacity-30 pointer-events-none '}w-full shadow btn btn-md bg-[var(--background)] mb-3 sm:mb-0 justify-start`}
        onClick={handleSignin}>
        <img src="https://ik.imagekit.io/soladata/th7yl4e7_DnPjjT8n1" className="w-6 h-6 mr-2 rounded" width={24} height={24} alt="farcaster"/>
        World ID
    </div>
}


export default WorldIdOptionItem
