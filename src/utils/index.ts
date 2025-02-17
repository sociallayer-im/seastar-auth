import Cookies from 'js-cookie'
import {getProfileByToken} from '@/service/solar'
import {sha3_256} from 'js-sha3'

export const AUTH_FIELD = process.env.NEXT_PUBLIC_AUTH_FIELD!
export const COOKIE_DOMAIN = new URL(process.env.NEXT_PUBLIC_APP_URL!).hostname.split('.').slice(-2).join('.')

export const setAuth = (token: string) => {
    Cookies.set(AUTH_FIELD, token, {expires: 365, domain: COOKIE_DOMAIN})
}

export const getAuth = () => {
    return Cookies.get(AUTH_FIELD)
}

export const signOut = () => {
    Cookies.remove(AUTH_FIELD, {domain: COOKIE_DOMAIN})
}

export const pickSearchParam = (param: string | string[] | undefined): string | undefined => {
    return Array.isArray(param) ? param[0] : param
}

export const clientRedirectToReturn = () => {
    const cookiePath = Cookies.get('return')
    window.location.href = cookiePath || process.env.NEXT_PUBLIC_APP_URL!
}

export const clientCheckUserLoggedInAndRedirect = async (auth_token: string, prefillUsername?: string) => {
    const profile = await getProfileByToken(auth_token)

    if (profile && !profile.handle) {
        let registerUrl = '/register'
        if (prefillUsername) {
            registerUrl = `/register?username=${prefillUsername}`
        }

        window.location.href = registerUrl
    } else {
        const cookiePath = Cookies.get('return')
        window.location.href = cookiePath || process.env.NEXT_PUBLIC_APP_URL!
    }
}

export const getAvatar = (id?: number | null, url?: string | null) => {
    if (url) return url

    const defAvatars = [
        '/images/default_avatar/avatar_0.png',
        '/images/default_avatar/avatar_1.png',
        '/images/default_avatar/avatar_2.png',
        '/images/default_avatar/avatar_3.png',
        '/images/default_avatar/avatar_4.png',
        '/images/default_avatar/avatar_5.png'
    ]

    if (!id) return defAvatars[0]

    const hash = sha3_256(id.toString())
    const lastNum16 = hash[hash.length - 1]
    const lastNum10 = parseInt(lastNum16, 16)
    const avatarIndex = lastNum10 % defAvatars.length
    return defAvatars[avatarIndex]
}



