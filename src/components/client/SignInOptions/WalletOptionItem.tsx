import {Connector} from 'wagmi'
import {useEffect, useMemo, useState} from 'react'
import Image from 'next/image'

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
            return '/images/signin_injected.png'
        }
    }, [connector])

    return (
        <div
            className={`${!ready ? 'opacity-30 pointer-events-none ' : 'cursor-pointer '}w-full shadow btn btn-md bg-[var(--background)] mb-3 justify-start`}
            onClick={onClick}>
            <img src={icon} className="w-6 h-6 mr-2 rounded" width={24} height={24} alt={connector.name}/>
            {connector.name}
        </div>
    )
}
