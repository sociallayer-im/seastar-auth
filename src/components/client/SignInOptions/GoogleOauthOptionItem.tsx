import {useGoogleLogin, GoogleOAuthProvider} from '@react-oauth/google'
import {useToast} from '@/components/client/shadcn/Toast/use-toast'
import useModal from '@/components/client/Modal/useModal'
import {clientCheckUserLoggedInAndRedirect, setAuth} from '@/utils'

export default function GoogleOauthOptionItem() {

    return <GoogleOAuthProvider clientId="38737182462-6qg5sl6ch58lgsgad7kieoig5parc5j5.apps.googleusercontent.com">
        <CustomBtn/>
    </GoogleOAuthProvider>
}

function CustomBtn() {

    const {showLoading, closeModal} = useModal()
    const {toast} = useToast()

    const login = useGoogleLogin({
        onSuccess: async (user) => {
            const loading = showLoading()
            try {
                const res = await fetch(`/api/google-siginin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        access_token: user.access_token
                    }),
                })

                if (!res.ok) {
                    throw new Error('Failed to sign in with google: ' + res.statusText)
                }
                const data = await res.json()

                if (data.result !== 'ok') {
                    console.error(data.message)
                    toast({
                        title: data.message,
                        variant: 'destructive'
                    })
                    return
                }

                setAuth(data.auth_token)
                clientCheckUserLoggedInAndRedirect(data.auth_token)
            } catch (e: unknown) {
                toast({
                    title: 'Error',
                    description: e instanceof Error ? e.message : 'An error occurred',
                    variant: 'destructive',
                })
            } finally {
                closeModal(loading)
            }
        },
        onError: (e: unknown) => {
            console.log('error', e)
            toast({
                title: 'Error',
                description: e instanceof Error ? e.message : 'An error occurred',
                variant: 'destructive',
            })
        }
    })

    return <div
        onClick={() => login()}
        className={`cursor-pointer w-full shadow btn btn-md bg-[var(--background)] mb-3 sm:mb-0 justify-start`}
    >
        <svg className="svg mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 18 18">
            <path fill="#4285f4" fillOpacity="1" fillRule="evenodd" stroke="none"
                d="M17.64 9.2q-.002-.956-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"></path>
            <path fill="#34a853" fillOpacity="1" fillRule="evenodd" stroke="none"
                d="M9.003 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.26c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18"></path>
            <path fill="#fbbc05" fillOpacity="1" fillRule="evenodd" stroke="none"
                d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042z"></path>
            <path fill="#ea4335" fillOpacity="1" fillRule="evenodd" stroke="none"
                d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.002 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71"></path>
        </svg>
        Google Auth
    </div>
}