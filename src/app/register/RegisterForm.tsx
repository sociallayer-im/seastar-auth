'use client'

import {Dictionary} from '@/lang'
import {useState} from 'react'
import useModal from '@/components/client/Modal/useModal'
import {createProfile, getProfileByHandle} from '@/service/solar'
import {clientRedirectToReturn, getAuth} from '@/utils'
import {useToast} from '@/components/client/shadcn/Toast/use-toast'

export default function RegisterForm(props: { lang: Dictionary }) {
    const [error, setError] = useState('')
    const [username, setUsername] = useState('')
    const {showLoading, closeModal} = useModal()
    const {toast} = useToast()

    const handleCheckUsername = (username: string) => {
        if (!username) {
            setError('Please input username')
            return
        }

        const errorMessages = []
        if (!/^[A-Za-z0-9-]+$/.test(username)) {
            errorMessages.push(props.lang['Contain the English-language letters and the digits 0-9'])
        }
        if (/^-|-$/.test(username)) {
            errorMessages.push(props.lang['Hyphens can also be used but it can not be used at the beginning and at the end'])
        }
        if (/--/.test(username)) {
            errorMessages.push(props.lang['Hyphens cannot appear consecutively'])
        }
        if (username.length < 6) {
            errorMessages.push(props.lang['Should be equal or longer than 6 characters'])
        }
        setError(errorMessages.join('; '))
    }

    const handleRegister = async () => {
        if (error) return

        const modalId = showLoading()
        try {
            const usernameTrim = username.trim()
            const checkUserExist = await getProfileByHandle(usernameTrim)
            if (!!checkUserExist) {
                setError('User already exists')
                closeModal(modalId)
                return
            }

            const authToken = getAuth()
            await createProfile({auth_token: authToken!, handle: usernameTrim})

            const currProfile = await getProfileByHandle(usernameTrim)

            toast({
                title: 'Register successfully',
            })

            setTimeout(() => {
                closeModal(modalId)
                if (currProfile?.email) {
                    clientRedirectToReturn()
                } else {
                    location.href = '/bind-email'
                }
            }, 3000)
        } catch (e: unknown) {
            toast({
                title: 'Register failed',
                description: (e as Error).message,
                variant: 'destructive'
            })
            closeModal(modalId)
        }
    }

    return <>
        <label
            className={`${error ? 'input-error ' : ''}input flex flew-row w-full bg-gray-100 focus-within:outline-none focus-within:border-primary`}>
            <input
                data-testid="username-input"
                className="flex-1" type="text" name="username"
                autoFocus={true}
                maxLength={100}
                autoComplete={'off'}
                value={username}
                placeholder={props.lang['Your username']}
                onBlur={() => {
                    handleCheckUsername(username.trim())
                }}
                onChange={(e) => {
                    setUsername(e.target.value)
                }}/>
        </label>
        <button className="btn btn-primary w-full my-4"
            onClick={handleRegister}
        >{props.lang['Confirm']}</button>
        <div className="text-red-400 text-sm h-10">{error}</div>
    </>
}
