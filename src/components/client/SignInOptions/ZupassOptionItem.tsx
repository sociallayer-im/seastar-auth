import useZuauth from '@/hooks/useZuauth'
import useModal from '@/components/client/Modal/useModal'
import {useToast} from '@/components/client/shadcn/Toast/use-toast'
import {clientCheckUserLoggedInAndRedirect} from '@/utils'

export default function ZupassOptionItem() {
    const {login} = useZuauth()
    const {showLoading, closeModal} = useModal()
    const {toast} = useToast()

    const handleZupassLogin = async () => {
        const modalId = showLoading()
        try {
            const authToken = await login()
            await clientCheckUserLoggedInAndRedirect(authToken)
        } catch (e: unknown) {
            toast({
                title: 'Sign in with zupass',
                description: (e as Error).message,
                variant: 'destructive'
            })
        } finally {
            closeModal(modalId)
        }
    }

    return <div
        onClick={handleZupassLogin}
        className={`cursor-pointer w-full shadow btn btn-md bg-[var(--background)] mb-3 justify-start`}
    >
        <img src={'/images/zupass.png'} className="w-6 h-6 mr-2 rounded"/>
        Zupass
    </div>
}
