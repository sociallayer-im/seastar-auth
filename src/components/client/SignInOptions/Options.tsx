import WalletOptions from '@/components/client/SignInOptions/WalletOptions'
import dynamic from 'next/dynamic'
import GoogleOauthOptionItem from '@/components/client/SignInOptions/GoogleOauthOptionItem'

const DynamicSolanaOptionItem = dynamic(
    () => import('@/components/client/SignInOptions/SolanaSignIn/SolanaOptionItem'),
    {ssr: false}
)

export default function Options() {
    return <div className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-2">
        <GoogleOauthOptionItem />
        <WalletOptions />
        <DynamicSolanaOptionItem />
    </div>
}
