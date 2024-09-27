import {ReactNode, useMemo} from 'react'
import {WalletAdapterNetwork} from '@solana/wallet-adapter-base'
import {clusterApiUrl} from '@solana/web3.js'
import {ConnectionProvider, WalletProvider} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'

export function Provider(props: {children: ReactNode}) {
    const network = WalletAdapterNetwork.Mainnet
    const endpoint = useMemo(() => clusterApiUrl(network), [network])

    return <ConnectionProvider endpoint={endpoint} >
        <WalletProvider wallets={[]} autoConnect={false}>
            <WalletModalProvider>
                {props.children}
            </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>
}
