import WalletOptions from '@/components/client/SignInOptions/WalletOptions'
import ZupassOptionItem from '@/components/client/SignInOptions/ZupassOptionItem'
import dynamic from 'next/dynamic'

const DynamicSolanaOptionItem = dynamic(
    () => import('@/components/client/SignInOptions/SolanaSignIn/SolanaOptionItem'),
    {ssr: false}
)

const DynamicFarcasterOptionItem = dynamic(
    () => import('@/components/client/SignInOptions/FarcasterOptionItem'),
    {ssr: false}
)

export default function Options() {

    return <div className="flex flex-col">
        <ZupassOptionItem />
        <WalletOptions />
        <DynamicSolanaOptionItem />
        <DynamicFarcasterOptionItem />
    </div>
}
