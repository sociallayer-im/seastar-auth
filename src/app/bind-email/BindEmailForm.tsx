'use client'

import {Dictionary} from '@/lang'
import {useState} from 'react'
import useModal from '@/components/client/Modal/useModal'
import {getProfileByEmail, sendPinCode} from '@/service/solar'
import {getAuth} from '@/utils'
import {useToast} from '@/components/client/shadcn/Toast/use-toast'

export default function BindEmailForm(props: { lang: Dictionary }) {
    const [error, setError] = useState('')
    const [email, setEmail] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const {showLoading, closeModal} = useModal()
    const {toast} = useToast()

    const handleSendPinCode = async () => {
        if (!email) {
            setError('Please input email')
            return
        } else if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
            setError('Invalid email format')
            return
        } else {
            setError('')
        }

        setSubmitting(true)
        const modalId = showLoading()
        try {
            const emailTrim = email.trim()
            const checkExist = await getProfileByEmail(emailTrim)

            if (!!checkExist) {
                setError('Email is already in use')
                closeModal(modalId)
                return
            }

            await sendPinCode({email})
            location.href = '/verify-bind-email?email=' + encodeURIComponent(emailTrim)
        } catch (e: unknown) {
            toast({
                title: 'Register failed',
                description: (e as Error).message,
                variant: 'destructive'
            })
            closeModal(modalId)
        } finally {
            setSubmitting(false)
        }
    }

    return <>
        <label
            className={`${error ? 'input-error ' : ''}input flex flew-row w-full bg-gray-100 focus-within:outline-none focus-within:border-primary`}>
            <input
                className="flex-1" type="email" name="email"
                autoFocus={true}
                value={email}
                placeholder={props.lang['Your email']}
                onChange={(e) => {
                    setEmail(e.target.value)
                }}/>
        </label>
        <button className="btn btn-primary w-full my-4"
            disabled={submitting}
            onClick={handleSendPinCode}
        >{props.lang['Continue']}</button>
        <div className="text-red-400 text-sm h-10">{error}</div>
    </>
}
