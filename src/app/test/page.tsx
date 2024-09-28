'use client'
import useModal from '@/components/client/Modal/useModal'

export default function TextPage() {
    const {showLoading, openModal, closeModal} = useModal()

    const handleOpenModal = () => {
        const id = showLoading()
        openModal({
            content: () => {
                return <div className="bg-amber-100 w-[50px] h-[20px]">123123123</div>
            }
        })

        closeModal(id)
    }

    return <div>
        <div>test page</div>
        <div onClick={handleOpenModal}>modal</div>
    </div>
}
