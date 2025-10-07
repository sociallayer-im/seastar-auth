import {useState} from 'react'
import {Dictionary} from '@/lang'
import {sendPinCode} from '@/service/solar'
import {useToast} from '@/components/client/shadcn/Toast/use-toast'
import useModal from '@/components/client/Modal/useModal'

export default function EmailInput(props: { lang: Dictionary }) {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const {toast} = useToast()
    const {showLoading, closeModal} = useModal()

    const checkEmail = async (email: string, confirm = false) => {
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
            const modalId = showLoading()
            try {
                await sendPinCode({email})
                location.href = `/verify-email?email=${email}`
            } catch (e:unknown) {
                console.error(e)
                toast({
                    variant: 'destructive',
                    description: (e as Error).message || 'Send pin code failed',
                    title: 'Email sign in'
                })
            } finally {
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
            <i role="button" title="login"
                onClick={() => checkEmail(email, true)}
                className="uil-arrow-right mr-2 text-2xl p-2 cursor-pointer"/>
        </label>
        <div className="text-red-400 text-sm my-2">{error}</div>
    </div>
}
