'use client'

import {Dictionary} from '@/lang'
import {useEffect, useState} from 'react'
import useModal from '@/components/client/Modal/useModal'
import {setName, getProfileByName, getProfileByToken} from '@/service/solar'
import {clientRedirectToReturn, getAuth} from '@/utils'
import {useToast} from '@/components/client/shadcn/Toast/use-toast'

export default function RegisterForm(props: { lang: Dictionary, prefill?: string }) {
    const [error, setError] = useState('')
    const [username, setUsername] = useState(props.prefill || '')
    const {showLoading, closeModal} = useModal()
    const {toast} = useToast()

    // Mirrors soon's username rule: /\A[a-z0-9_]{3,30}\z/
    const handleCheckUsername = (username: string) => {
        if (!/^[a-z0-9_]+$/.test(username)) {
            return props.lang['Contain the English-language letters and the digits 0-9']
        }
        if (username.length < 3) {
            return 'Should be equal or longer than 3 characters'
        }
        if (username.length > 30) {
            return 'Should be equal or shorter than 30 characters'
        }
    }

    const checkDomainInput = (domain: string) => {
        return !domain.match(/[^a-zA-Z0-9_]/)
    }

    const handleRegister = async () => {
        if (error) return

        const modalId = showLoading()
        try {
            const usernameTrim = username.trim()
            const checkUserExist = await getProfileByName(usernameTrim)
            if (!!checkUserExist) {
                setError('User already exists')
                closeModal(modalId)
                return
            }

            const authToken = getAuth()
            await setName({authToken: authToken!, name: usernameTrim})

            const currProfile = await getProfileByToken(authToken)

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
