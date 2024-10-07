import {createConfig, http, WagmiProvider} from 'wagmi'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {arbitrum, base, mainnet, optimism, polygon} from 'wagmi/chains'
import {injected, walletConnect} from 'wagmi/connectors'

const queryClient = new QueryClient()

export const config = createConfig({
    ssr: true,
    chains: [polygon, mainnet, optimism, base, arbitrum],
    connectors: [
        injected(),
        walletConnect({
            projectId: '291f8dbc68b408d4552ec4e7193c1b47',
        })
    ],
    transports: {
        [mainnet.id]: http(),
        [polygon.id]: http(),
        [optimism.id]: http(),
        [base.id]: http(),
        [arbitrum.id]: http(),
    },
})

export default function WagmiWrapper(props: {children: React.ReactNode}) {
    return <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            {props.children}
        </QueryClientProvider>
    </WagmiProvider>
}
