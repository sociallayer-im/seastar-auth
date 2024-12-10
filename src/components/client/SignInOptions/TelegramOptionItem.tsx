import {useEffect, useState} from 'react'
import {useToast} from '@/components/client/shadcn/Toast/use-toast'
import useModal from '@/components/client/Modal/useModal'

export default function TelegramOptionItem() {
    const [ready, setReady] = useState(false)
    const {toast} = useToast()
    const {showLoading, closeModal} = useModal()

    useEffect(() => {
        let timeout: number = 0
        if (typeof window !== 'undefined') {
            timeout = window.setInterval(() => {
                if (!!window.Telegram?.Login) {
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

    const handleSignIn = () => {
        interface TgUserInfo {
            auth_date: number
            first_name: string
            hash: string
            id: number
            photo_url: string
            username: string
        }

        window.Telegram.Login.auth(
            { bot_id: process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID!, request_access: true },
            async (data: TgUserInfo | undefined | null) => {
                if (!data) {
                    toast({title: 'Authorization failed', variant: 'destructive'})
                    return
                }
                const loading = showLoading()
                try {
                    const res = await fetch('/api/telegram-signin', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    })

                    if (!res.ok) {
                        throw new Error('Failed to sign in')
                    }

                    const result = await res.json()
                    alert(result.result)
                } catch (e:unknown) {
                    toast({title: 'Error', description: e instanceof Error ? e.message : 'An error occurred', variant: 'destructive'})
                } finally {
                    closeModal(loading)
                }
            }
        )
    }

    return <div
        onClick={handleSignIn}
        id="telegram_passport_auth"
        data-testid="telegram-option-item"
        className={`${!ready ? 'opacity-30 pointer-events-none ' : 'cursor-pointer '}w-full shadow btn btn-md bg-[var(--background)] mb-3 sm:mb-0 justify-start`}
    >
        <img src="https://ik.imagekit.io/soladata/qquks48t_yd_cLmgZR" className="w-6 h-6 mr-2 rounded" width={24}
            height={24} alt="farcaster"/>
        Telegram
    </div>
}
