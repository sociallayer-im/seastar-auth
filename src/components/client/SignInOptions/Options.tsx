import WalletOptions from '@/components/client/SignInOptions/WalletOptions'
import GoogleOauthOptionItem from '@/components/client/SignInOptions/GoogleOauthOptionItem'

export default function Options() {
    return <div className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-2">
        <GoogleOauthOptionItem />
        <WalletOptions />
    </div>
}
