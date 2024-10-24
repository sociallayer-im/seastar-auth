import Image from 'next/image'
import useModal from '@/components/client/Modal/useModal'
import ModalConnect from '@/components/client/SignInOptions/SolanaSignIn/ModalConnect'

export default  function SolanaOptionBtn() {
    const {openModal} = useModal()

    const showModal = () => {
        openModal({
            content: () => <ModalConnect />
        })
    }

    return <>
        <div
            onClick={showModal}
            className={`cursor-pointer w-full shadow btn btn-md bg-[var(--background)]  mb-3 sm:mb-0 justify-start`}
        >
            <Image alt="Zupass" src={'/images/solana.png'} width={24} height={24} className="w-6 h-6 mr-2 rounded"/>
            Solana
        </div>
    </>
}
