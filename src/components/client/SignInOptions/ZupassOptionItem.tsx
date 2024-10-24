import useZuauth from '@/hooks/useZuauth'
import useModal from '@/components/client/Modal/useModal'
import {useToast} from '@/components/client/shadcn/Toast/use-toast'
import {clientCheckUserLoggedInAndRedirect, setAuth} from '@/utils'
import Image from 'next/image'

export default function ZupassOptionItem() {
    const {login} = useZuauth()
    const {showLoading, closeModal} = useModal()
    const {toast} = useToast()

    const handleZupassLogin = async () => {
        const modalId = showLoading()
        try {
            const authToken = await login()
            setAuth(authToken)
            await clientCheckUserLoggedInAndRedirect(authToken)
        } catch (error: unknown) {
            if (!(error as Error).message.includes('popupClosed')) {
                toast({
                    title: 'Sign in with zupass',
                    description: (error as Error).message,
                    variant: 'destructive'
                })
            }
        } finally {
            closeModal(modalId)
        }
    }

    return <div
        onClick={handleZupassLogin}
        className={`cursor-pointer w-full shadow btn btn-md bg-[var(--background)] mb-3 sm:mb-0 justify-start`}
    >
        <Image alt="Zupass" src={'/images/zupass.png'} width={24} height={24} className="w-6 h-6 mr-2 rounded"/>
        Zupass
    </div>
}
