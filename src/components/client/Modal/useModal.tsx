import {ReactElement, useEffect, useState} from 'react'
import ModalWrapper from '@/components/client/Modal/ModalWrapper'
import LoadingGlobal from '@/components/client/Modal/LoadingGlobal'

interface ModalProps {
    content: (close?: () => void) => ReactElement
    clickOutsideToClose?: boolean
}

let count = 0

function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER
    return count.toString()
}

export interface ModalState {
    id: string,
    content: ReactElement
}

const memoryState: ModalState[] = []
const listeners: Array<(state: ModalState[]) => void> = []

export default function useModal() {
    const [state, setState] = useState(memoryState)

    useEffect(() => {
        listeners.push(setState)
        return () => {
            const index = listeners.indexOf(setState)
            if (index > -1) {
                listeners.splice(index, 1)
            }
        }
    }, [state])

    const openModal = (props: ModalProps) => {
        const id = genId()
        const content = <ModalWrapper
            clickOutsideToClose={props.clickOutsideToClose}
            content={props.content}
            close={() => closeModal(id)} />
        setState([...state, {content, id}])
        listeners.forEach((listener) => {
            listener([...state, {content, id}])
        })
        return id
    }

    const showLoading = () => {
        const id = genId()
        const content = <LoadingGlobal />
        setState([...state, {content, id}])
        listeners.forEach((listener) => {
            listener([...state, {content, id}])
        })
        return id
    }

    const closeModal = (id?: string) => {
        if (!id) {
            setState([])
            listeners.forEach((listener) => {
                listener([])
            })
        } else {
            const newState = state.filter((modal) => modal.id !== id)
            setState(newState)
            listeners.forEach((listener) => {
                listener(newState)
            })
        }
    }

    return {
        state,
        showLoading,
        openModal,
        closeModal
    }
}
