import WalletOptions from '@/components/client/SignInOptions/WalletOptions'
import ZupassOptionItem from '@/components/client/SignInOptions/ZupassOptionItem'

export default function Options() {

    return <div className="flex flex-col">
        <ZupassOptionItem />
        <WalletOptions />
    </div>
}
