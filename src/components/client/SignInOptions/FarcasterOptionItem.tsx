import {AuthKitProvider, SignInButton, useProfile, useSignInMessage} from '@farcaster/auth-kit'
import {useEffect} from 'react'
import {useToast} from '@/components/client/shadcn/Toast/use-toast'
import {clientCheckUserLoggedInAndRedirect, setAuth} from '@/utils'
import useModal from '@/components/client/Modal/useModal'

function FarcasterOptionItem() {
    const {isAuthenticated, profile} = useProfile()
    const {signature, message} = useSignInMessage()
    const {showLoading, closeModal} = useModal()
    const {toast} = useToast()

    const handleSignin = () => {
        const btn = document.querySelector('.fc-authkit-signin-button button')
        if (btn) {
            (btn as HTMLButtonElement).click()
        }
    }

    useEffect(() => {
        ;(async () => {
            if (isAuthenticated) {
                const modalId = showLoading()
                try {
                    const res = await fetch('/api/farcaster-signin', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            message,
                            signature,
                            custody: profile.custody
                        }),
                    })

                    if (!res.ok) {
                        throw new Error('Failed to sign in')
                    }

                    const data = await res.json()

                    if (data.result === 'ok') {
                        closeModal(modalId)
                        setAuth(data.auth_token)
                        await clientCheckUserLoggedInAndRedirect(data.auth_token)
                    } else {
                        closeModal(modalId)
                        throw new Error(data.message)
                    }
                } catch (e) {
                    toast({
                        title: 'Error',
                        description: e instanceof Error ? e.message : 'An error occurred',
                        variant: 'destructive',
                    })
                }
            }
        })()
    }, [isAuthenticated])

    return <div
        data-testid="farcaster-option-item"
        className="cursor-pointer w-full shadow btn btn-md bg-[var(--background)] mb-3 sm:mb-0 justify-start"
        onClick={handleSignin}>

        <div className="hidden">
            <SignInButton/>
        </div>

        <img src="/images/farcaster.svg" className="w-6 h-6 mr-2 rounded" width={24} height={24} alt="farcaster"/>
        Farcaster
    </div>
}

const Wrapper = () => {

    const farcasterConfig = {
        rpcUrl: 'https://optimism-mainnet.infura.io/v3/df69a66a46e94a1bb0e0f2914af8b403',
        domain: 'www.sola.day',
        siweUri: 'https://www.sola.day',
    }

    return <AuthKitProvider config={farcasterConfig}>
        <FarcasterOptionItem/>
    </AuthKitProvider>
}

export default Wrapper
