import {Connector, useConnect, useDisconnect, useSignMessage} from 'wagmi'
import {AuthResult, getNonce, signInWithWallet} from '@/service/solar'

export default function useSiwe() {
    const {connect} = useConnect()
    const {signMessage} = useSignMessage()
    const {disconnect} = useDisconnect()


    const createSiweMessag = async function (address: string) {
        const domain = window.location.host
        const origin = window.location.origin
        // The nonce comes from the backend and is single-use — the server
        // rejects any SIWE message whose nonce it didn't mint.
        const nonce = await getNonce()
        return `${domain} wants you to sign in with your Ethereum account:
${address}

Sign in with Ethereum to the app.

URI: ${origin}
Version: 1
Chain ID: 1
Nonce: ${nonce}
Issued At: ${new Date().toISOString()}`
    }

    const handleConnect = async (connector: Connector): Promise<readonly [`0x${string}`, ...`0x${string}`[]]> => {
        return new Promise((resolve, reject) => {
            connect({connector}, {
                onSuccess: ({accounts}) => {
                    resolve(accounts)
                },
                onError: (error: { message?: string }) => {
                    reject(error)
                }
            })
        })
    }

    const handleSignMessage = async (message: string, account: `0x${string}`): Promise<string> => {
        return new Promise((resolve, reject) => {
            signMessage({message, account}, {
                onSuccess: (signature: string) => {
                    resolve(signature)
                },
                onError: (error: unknown) => {
                    reject(error)
                }
            })
        })
    }

    const siwe = async (connector: Connector): Promise<AuthResult> => {
        return new Promise(async (resolve, reject) => {
            disconnect(undefined, {
                onSuccess: async () => {
                    try {
                        const account = (await handleConnect(connector))[0]
                        const message = await createSiweMessag(account)
                        const signature = await handleSignMessage(message, account)
                        const login = await signInWithWallet({signature, message})
                        resolve(login)
                    } catch (e) {
                        reject(e)
                    }
                },
                onError: (e) => {
                    reject(e)
                }
            })
        })
    }


    return {createSiweMessag, handleConnect, siwe}
}
