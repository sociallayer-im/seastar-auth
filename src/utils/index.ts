import Cookies from 'js-cookie'
// import {getProfileByToken} from '@/service/solar'

export const AUTH_FIELD = process.env.NEXT_PUBLIC_AUTH_FIELD!
export const COOKIE_DOMAIN = new URL(process.env.NEXT_PUBLIC_APP_URL!).hostname.split('.').slice(-2).join('.')

export const setAuth = (token: string) => {
    alert(COOKIE_DOMAIN)
    alert(AUTH_FIELD)
    Cookies.set(AUTH_FIELD, token, {expires: 365, domain: `.${COOKIE_DOMAIN}`})
}

export const getAuth = () => {
    return Cookies.get(AUTH_FIELD)
}

export const pickSearchParam = (param: string | string[] | undefined): string | undefined => {
    return Array.isArray(param) ? param[0] : param
}

export const clientRedirectToReturn = () => {
    const cookiePath = Cookies.get('return')
    window.location.href = cookiePath || process.env.NEXT_PUBLIC_APP_URL!
}

export const clientCheckUserLoggedInAndRedirect = async (auth_token: string, prefillUsername?: string) => {
    console.log(auth_token, prefillUsername)
    // const profile = await getProfileByToken(auth_token)
    //
    // if (profile && !profile.handle) {
    //     let registerUrl = '/register'
    //     if (prefillUsername) {
    //         registerUrl = `/register?username=${prefillUsername}`
    //     }
    //
    //     // window.location.href = registerUrl
    // } else {
    //     const cookiePath = Cookies.get('return')
    //     window.location.href = cookiePath || process.env.NEXT_PUBLIC_APP_URL!
    // }
}



