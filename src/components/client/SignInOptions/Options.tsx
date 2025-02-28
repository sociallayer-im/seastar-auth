import WalletOptions from '@/components/client/SignInOptions/WalletOptions'
import dynamic from 'next/dynamic'
// import ZkEmailOptionItem from '@/components/client/SignInOptions/ZkEmailOptionItem'
import GoogleOauthOptionItem from '@/components/client/SignInOptions/GoogleOauthOptionItem'

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

// const DynamicWorldIdOptionItem = dynamic(
//     () => import('@/components/client/SignInOptions/WorldIdOptionItem'),
//     {ssr: false}
// )

// const TelegramOptionItem = dynamic(
//     () => import('@/components/client/SignInOptions/TelegramOptionItem'),
//     {ssr: false}
// )

export default function Options() {
    return <div className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-2">
        <GoogleOauthOptionItem />
        <WalletOptions />
        <DynamicZupassOptionItem />
        <DynamicSolanaOptionItem />
        <DynamicFarcasterOptionItem />
        {/*<ZkEmailOptionItem />*/}
        {/*<DynamicWorldIdOptionItem />*/}
        {/*<TelegramOptionItem />*/}
    </div>
}
