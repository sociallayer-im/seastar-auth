'use client'

import {useDisconnect} from 'wagmi'
import WagmiWrapper from '@/components/client/SignInOptions/WagmiWrapper'
import Cookies from 'js-cookie'
import {useEffect, useState} from 'react'
import {getProfileByToken} from '@/service/solar'
import {getAvatar, signOut} from '@/utils'

const authFiled = process.env.NEXT_PUBLIC_AUTH_FIELD!

const Content = () => {
    const {disconnect} = useDisconnect()

    const [authToken, setAuthToken] = useState<string>('')
    const [profile, setProfile] = useState<Solar.Profile | null>(null)

    useEffect(() => {
        const token = Cookies.get(authFiled)
        if (!token) {
            location.href = '/'
        }
        setAuthToken(Cookies.get(authFiled) || '')
    }, [])

    useEffect(() => {
        getProfileByToken(authToken).then(profile => {
            if (profile) {
                setProfile(profile)
            }
        })
    }, [authToken])

    return <div className="flex flex-col items-center justify-center w-full min-h-[100svh]">
        {!!profile &&
            <div className="card bg-base-100 w-96 shadow-xl">
                <figure className="px-10 pt-10">
                    <img src={getAvatar(profile.id, profile.image_url)} className="rounded-full w-20 h-20" alt=""/>
                </figure>
                <div className="card-body items-center text-center">
                    <h2 className="card-title">{profile.nickname || profile.handle}</h2>
                    <p>Your Account</p>
                    <div className="card-actions">
                        <div className="btn mt-8"
                            onClick={() => {
                                signOut()
                                disconnect()
                                location.href = '/'
                            }}>Logout
                        </div>
                    </div>
                </div>
            </div>
        }
    </div>
}
export default function TextPage() {
    return <WagmiWrapper>
        <Content/>
    </WagmiWrapper>
}

