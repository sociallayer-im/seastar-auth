import {Connector, useConnect} from 'wagmi'
import {useMemo} from 'react'
import WalletOptionItem from '@/components/client/SignInOptions/WalletOptionItem'
import useSiwe from '@/hooks/useSiwe'
import {useToast} from '@/components/client/shadcn/Toast/use-toast'
import useModals from '@/components/client/Modal/useModal'
import {clientRedirect, setAuth} from '@/utils'

export default function WalletOptions() {
    const {connectors} = useConnect()
    const {siwe} = useSiwe()
    const {toast} = useToast()
    const {showLoading, closeModal} = useModals()

    const sortedConnectors = useMemo(() => {
        const _connectors: Connector[] = []
        connectors.forEach((connector: Connector) => {
            if (connector.name === 'WalletConnect') {
                _connectors.push(connector)
            } else {
                _connectors.unshift(connector)
            }
        })
        return _connectors
    }, [connectors])

    const handleConnect = async (connector: Connector) => {
        const modalId = showLoading()

        try {
            const res = await siwe(connector)
            setAuth(res.auth_token)
            clientRedirect()
        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : 'Unknown siwe error'

            if (!message.includes('reject')) {
                toast({
                    title: "Sign in error",
                    description: message,
                    variant: 'destructive'
                })
            }
        } finally {
            closeModal(modalId)
        }
    }

    return <div className="flex flex-col">
        {
            sortedConnectors.map((connector: Connector, index: number) => {
                return <WalletOptionItem key={index}
                    onClick={() => handleConnect(connector)}
                    connector={connector}/>
            })
        }
    </div>
}

