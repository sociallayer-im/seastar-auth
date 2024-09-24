'use client'

import InputPinCode from '@/components/client/InputPinCode'
import {useEffect, useState} from 'react'
import {verifyEmail} from '@/service/solar'
import {useToast} from '@/components/client/shadcn/Toast/use-toast'
import useModal from '@/components/client/Modal/useModal'
import {clientRedirect, setAuth} from '@/utils'

export default function FormVerifyEmail(props: {email: string}) {
    const [code, setCode] = useState('')
    const {toast} = useToast()
    const {showLoading, closeModal} = useModal()

    useEffect(() => {
        ;(async () => {
            if (code.length === 5) {
                const modalId = showLoading()
                try {
                    const res = await verifyEmail({email: props.email, code})
                    setAuth(res.auth_token)
                    clientRedirect()
                } catch (error: unknown) {
                    toast({
                        title: 'Email sign in',
                        description: (error as Error).message ||  'Verify email failed',
                        variant: "destructive",
                    })
                } finally {
                    closeModal(modalId)
                }
            }
        })()
    }, [code])

    return <InputPinCode onChange={code => {setCode(code)}} />
}
