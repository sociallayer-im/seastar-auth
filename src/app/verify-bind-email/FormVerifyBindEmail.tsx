'use client'

import InputPinCode from '@/components/client/InputPinCode'
import {useEffect, useState} from 'react'
import {bindEmail} from '@/service/solar'
import {useToast} from '@/components/client/shadcn/Toast/use-toast'
import useModal from '@/components/client/Modal/useModal'
import {clientCheckUserLoggedInAndRedirect, getAuth} from '@/utils'
import {Dictionary} from '@/lang'

export default function FormVerifyBindEmail(props: {email: string, lang: Dictionary}) {
    const [code, setCode] = useState('')
    const {toast} = useToast()
    const {showLoading, closeModal} = useModal()

    useEffect(() => {
        ;(async () => {
            if (code.length === 6) {
                const modalId = showLoading()
                try {
                    const authToken = getAuth()
                    await bindEmail({email: props.email, code, authToken: authToken!})
                    toast({
                        title: 'Bind Email',
                        description: 'Bind email successfully',
                    })
                    setTimeout(() => {
                        clientCheckUserLoggedInAndRedirect(authToken!)
                    }, 3000)
                } catch (error: unknown) {
                    toast({
                        title: 'Bind Email',
                        description: (error as Error).message ||  'Binding email failed',
                        variant: "destructive",
                    })
                    closeModal(modalId)
                }
            }
        })()
    }, [code])

    return <InputPinCode onChange={code => {setCode(code)}} lang={props.lang} />
}
