import {Connector} from 'wagmi'
import {useEffect, useMemo, useState} from 'react'

export default function WalletOptionItem({
    connector,
    onClick,
}: {
    connector: Connector
    onClick: () => void
}) {
    const [ready, setReady] = useState(false)

    useEffect(() => {
        ;(async () => {
            const provider = await connector.getProvider()
            setReady(!!provider)
        })()
    }, [connector])

    const icon = useMemo(()=>{
        if (!!connector.icon) {
            return connector.icon
        }

        if (connector.name === 'WalletConnect') {
            return '/images/wallet_connect.webp'
        } else {
            return '/images/ethereum.svg'
        }
    }, [connector])

    const name = connector.name === 'Injected' ? 'Ethereum Wallet' : connector.name

    return (
        <div
            className={`${!ready ? 'opacity-30 pointer-events-none ' : 'cursor-pointer '}w-full shadow btn btn-md bg-[var(--background)] mb-3 sm:mb-0 justify-start`}
            onClick={onClick}>
            <img src={icon} className="w-6 h-6 mr-2 rounded" width={24} height={24} alt={name}/>
            {name}
        </div>
    )
}
