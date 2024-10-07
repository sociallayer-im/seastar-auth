import WalletOptions from '@/components/client/SignInOptions/WalletOptions'
import dynamic from 'next/dynamic'

const DynamicSolanaOptionItem = dynamic(
    () => import('@/components/client/SignInOptions/SolanaSignIn/SolanaOptionItem'),
    {ssr: false}
)

const DynamicFarcasterOptionItem = dynamic(
    () => import('@/components/client/SignInOptions/FarcasterOptionItem'),
    {ssr: false}
)

const DynamicZupassOptionItem = dynamic(
    () => import('@/components/client/SignInOptions/ZupassOptionItem'),
    {ssr: false}
)

const DynamicWorldIdOptionItem = dynamic(
    () => import('@/components/client/SignInOptions/WorldIdOptionItem'),
    {ssr: false}
)

export default function Options() {
    return <div className="flex flex-col">
        <DynamicZupassOptionItem />
        <WalletOptions />
        <DynamicSolanaOptionItem />
        <DynamicFarcasterOptionItem />
        <DynamicWorldIdOptionItem />
    </div>
}
