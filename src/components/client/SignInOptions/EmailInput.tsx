import {useState, useRef} from 'react'
import {Dictionary} from '@/lang'
import {sendPinCode} from '@/service/solar'
import {useToast} from '@/components/client/shadcn/Toast/use-toast'
import useModal from '@/components/client/Modal/useModal'

export default function EmailInput(props: { lang: Dictionary }) {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const submitting = useRef(false)
    const {toast} = useToast()
    const {showLoading, closeModal} = useModal()

    const checkEmail = async (email: string, confirm = false) => {
        email = email.toLowerCase().trim()
        if (!email) {
            setError('')
            return
        }
        if (!email.match(/^[\w.-]+@([\w-]+\.)+[\w-]{2,63}$/)) {
            setError('Invalid email')
            return
        }
        setError('')

        if (confirm) {
            if (submitting.current) return
            submitting.current = true
            const modalId = showLoading()
            try {
                await sendPinCode({email})
                location.href = `/verify-email?email=${encodeURIComponent(email)}`
            } catch (e:unknown) {
                console.error(e)
                toast({
                    variant: 'destructive',
                    description: (e as Error).message || 'Send pin code failed',
                    title: 'Email sign in'
                })
            } finally {
                submitting.current = false
                closeModal(modalId)
            }
        }
    }

    return <div className="mb-3">
        <label
            className={`${!!error ? 'input-error ' : ''}input shadow flex flew-row items-center w-full bg-gray-100 focus-within:outline-none focus-within:border-primary pr-0`}>
            <i className="uil-envelope mr-2 text-2xl"/>
            <input className="flex-1 w-full" type="url" name="email"
                placeholder={props.lang['Email']}
                value={email}
                onBlur={(e) => {
                    checkEmail(e.target.value)
                }}
                onChange={e => {
                    setEmail(e.target.value)
                }}

                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        checkEmail(email, true)
                    }
                }}/>
            <button type="button" title="login"
                onClick={() => checkEmail(email, true)}
                className="flex flex-row items-center gap-1 mr-2 px-2 cursor-pointer text-sm font-medium">
                {props.lang['Go']}
                <i className="uil-arrow-right text-2xl"/>
            </button>
        </label>
        <div className="text-red-400 text-sm my-2">{error}</div>
    </div>
}
