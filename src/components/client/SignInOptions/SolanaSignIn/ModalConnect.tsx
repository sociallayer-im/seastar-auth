import {useWallet} from '@solana/wallet-adapter-react'
import {Provider} from '@/components/client/SignInOptions/SolanaSignIn/SolanaProvider'
import {useEffect} from 'react'
import {clientCheckUserLoggedInAndRedirect, setAuth} from '@/utils'
import useModal from '@/components/client/Modal/useModal'
import {useToast} from '@/components/client/shadcn/Toast/use-toast'

function ModalConnect() {
    const {showLoading, closeModal} = useModal()
    const {connect, wallets, select, wallet, connecting, connected, signMessage, publicKey} = useWallet()
    const {toast} = useToast()

    useEffect(() => {
        ;(async () => {
            if (connected) {
                const modalId = showLoading()
                try {
                    if (!publicKey) throw new Error('Wallet not connected!')
                    if (!signMessage) throw new Error('Wallet does not support message signing!')

                    const message = new TextEncoder().encode(
                        `${window.location.host} wants you to sign in with your Solana account:\n${publicKey.toBase58()}\n\nPlease sign in.`
                    )

                    const signature = await signMessage(message)
                    const _signature = [] as number[]
                    signature.forEach((code: number, index: number) => {
                        _signature[index] = code
                    })

                    const _message = [] as number[]
                    message.forEach((code: number, index: number) => {
                        _message[index] = code
                    })

                    const _publicKey = [] as number[]
                    publicKey.toBytes().forEach((code: number, index: number) => {
                        _publicKey[index] = code
                    })

                    const response = await fetch('/api/solana-signin', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            signature: _signature,
                            message: _message,
                            publicKey: _publicKey,
                            address: publicKey.toBase58()
                        })
                    })

                    if (!response.ok) {
                        throw new Error('Sing in with Solana: Verification failed')
                    }

                    const data = await response.json()
                    if (data.result !== 'ok') {
                        throw new Error(data.message)
                    }
                    setAuth(data.auth_token)
                    await clientCheckUserLoggedInAndRedirect(data.auth_token)

                } catch (e: unknown) {
                    console.error(e)
                    toast({
                        title: 'Sing in with Solana failed',
                        description: (e as Error).message,
                        variant: 'destructive'
                    })
                } finally {
                    closeModal(modalId)
                }
            }
        })()
    }, [connected])

    return <div className="w-[360px] bg-[var(--background)] shadow p-4 rounded-lg">
        <div className="mb-3 font-semibold">Select Wallet</div>
        {wallets.map((_wallet, index) => {
            return <button data-testid="solana-sigin-in-wallet" className={`btn w-full justify-start my-1 ${wallet?.adapter.name === _wallet.adapter.name ? 'border-primary border-[2px]' : ''}`}
                onClick={() => {
                    select(_wallet.adapter.name)
                }}
                key={index}>
                <img src={_wallet.adapter.icon} width={24} height={24} alt={_wallet.adapter.name}/>
                {_wallet.adapter.name}
            </button>
        })}

        {!!wallets.length &&
            <button data-testid="solana-sigin-in-btn"  className={`${!!wallet || connecting ? '' : 'btn-disabled '}btn w-full mt-3`}
                onClick={async () => {
                    await connect()
                }}>
                <div className="label">Connect</div>
            </button>
        }

        {!wallets.length && <div>No wallet installed</div>}
    </div>
}

export default function Modal() {
    return <Provider>
        <ModalConnect/>
    </Provider>
}
