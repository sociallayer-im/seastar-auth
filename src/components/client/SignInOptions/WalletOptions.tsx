import {Connector, useConnect} from 'wagmi'
import {useMemo} from 'react'
import WalletOptionItem from '@/components/client/SignInOptions/WalletOptionItem'
import useSiwe from '@/hooks/useSiwe'
import {useToast} from '@/components/client/shadcn/Toast/use-toast'
import useModals from '@/components/client/Modal/useModal'
import {clientCheckUserLoggedInAndRedirect, setAuth} from '@/utils'
import WagmiWrapper from './WagmiWrapper'

function OptionsItems() {
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
        setTimeout(() => {
            closeModal(modalId)
        }, 30000)

        try {
            const res = await siwe(connector)
            setAuth(res.auth_token)
            clientCheckUserLoggedInAndRedirect(res.auth_token)
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

    return <>
        {
            sortedConnectors.map((connector: Connector, index: number) => {
                return <WalletOptionItem key={index}
                    onClick={() => handleConnect(connector)}
                    connector={connector}/>
            })
        }
    </>
}

export default function WalletOptions() {
    return <WagmiWrapper>
        <OptionsItems />
    </WagmiWrapper>
}

