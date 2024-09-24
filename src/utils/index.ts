import Cookies from 'js-cookie'

export const AUTH_FIELD = process.env.NEXT_PUBLIC_AUTH_FIELD!

export const setAuth = (token: string) => {
    Cookies.set(AUTH_FIELD, token, {expires: 365})
}

export const pickSearchParam = (param: string | string[] | undefined): string | undefined => {
    return Array.isArray(param) ? param[0] : param
}

export const clientRedirect = () => {
    const cookiePath = Cookies.get('return')
    window.location.href = cookiePath || process.env.NEXT_PUBLIC_DEFAULT_RETURN!
}



