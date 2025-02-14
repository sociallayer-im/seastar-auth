'use client'

import {Dictionary} from '@/lang'
import {useEffect, useState} from 'react'
import useModal from '@/components/client/Modal/useModal'
import {createProfile, getProfileByHandle} from '@/service/solar'
import {clientRedirectToReturn, getAuth} from '@/utils'
import {useToast} from '@/components/client/shadcn/Toast/use-toast'

export default function RegisterForm(props: { lang: Dictionary, prefill?: string }) {
    const [error, setError] = useState('')
    const [username, setUsername] = useState(props.prefill || '')
    const {showLoading, closeModal} = useModal()
    const {toast} = useToast()

    const handleCheckUsername = (username: string) => {
        if (!/^[A-Za-z0-9-]+$/.test(username)) {
            return props.lang['Contain the English-language letters and the digits 0-9']
        }
        if (/^-|-$/.test(username)) {
            return props.lang['Hyphens can also be used but it can not be used at the beginning and at the end']
        }
        if (/--/.test(username)) {
            return props.lang['Hyphens cannot appear consecutively']
        }
        if (username.length < 6) {
            return props.lang['Should be equal or longer than 6 characters']
        }
        if (username.length > 16) {
            return props.lang['Should be equal or shorter than 16 characters']
        }
    }

    const checkDomainInput = (domain: string) => {
        if (domain.startsWith('-')) {
            return false
        }

        if (domain.match(/\s/)) {
            return false
        }

        return !domain.match(/[`~!@#$%^&*()_+<>?:"{},./\\|=;'[\]]/im)
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

    useEffect(() => {
        if (!username) {
            setError('')
            return
        }

        setError(handleCheckUsername(username) || '')
    }, [username])

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
                onChange={(e) => {
                    checkDomainInput(e.target.value) && setUsername(e.target.value.toLowerCase())
                }}/>
        </label>
        <button className="btn btn-primary w-full my-4"
            disabled={!!error || !username}
            onClick={handleRegister}
        >{props.lang['Confirm']}</button>
        <div className="text-red-400 text-sm h-10">{error}</div>
    </>
}
