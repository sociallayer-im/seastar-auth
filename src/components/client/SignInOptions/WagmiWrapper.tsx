import config from '@/components/client/SignInOptions/wagmi.config'
import {WagmiProvider} from 'wagmi'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function WagmiWrapper(props: {children: React.ReactNode}) {
    return <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
            {props.children}
        </QueryClientProvider>
    </WagmiProvider>
}
