import Image from 'next/image'
import useSolana from '@/hooks/useSolana'
import {Provider} from '@/components/client/SignInOptions/SolanaSignIn/SolanaProvider'

function SolanaOptionBtn() {
    const {buttonState, handleOpenModal} = useSolana()
    return <>
        <div
            onClick={handleOpenModal}
            className={`cursor-pointer w-full shadow btn btn-md bg-[var(--background)] mb-3 justify-start`}
        >
            <Image alt="Zupass" src={'/images/solana.png'} width={24} height={24} className="w-6 h-6 mr-2 rounded"/>
            Solana {buttonState}
        </div>
    </>
}

export default function SolanaOptionItem () {
    return <Provider>
        <SolanaOptionBtn />
    </Provider>
}
