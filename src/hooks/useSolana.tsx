import useModal from '@/components/client/Modal/useModal'
import {useEffect, useState} from 'react'
import {useWallet, Wallet} from '@solana/wallet-adapter-react'
import {useWalletMultiButton} from '@solana/wallet-adapter-base-ui'
import {WalletName} from '@solana/wallet-adapter-base'
import Image from 'next/image'
import {useToast} from '@/components/client/shadcn/Toast/use-toast'
import {clientCheckUserLoggedInAndRedirect, setAuth} from '@/utils'

// demo: https://github.com/anza-xyz/wallet-adapter/tree/master/packages/starter/example/src/components

export default function useSolana() {
    const {openModal, showLoading, closeModal} = useModal()
    const {publicKey, signMessage} = useWallet()
    const {toast} = useToast()

    const [walletModalConfig, setWalletModalConfig] = useState<Readonly<{
        onSelectWallet(walletName: WalletName): void;
        wallets: Wallet[];
            }> | null>(null)

    const {buttonState, onConnect, onSelectWallet} = useWalletMultiButton({
        onSelectWallet: setWalletModalConfig,
    })

    const handleOpenModal = () => {
        onSelectWallet?.()
    }

    useEffect(() => {
        if (walletModalConfig) {
            openModal({
                content: () => {
                    return <div className="w-[360px] bg-[var(--background)] shadow p-4 rounded-lg">
                        <div className="mb-3 font-semibold">Select Wallet</div>
                        {walletModalConfig.wallets.map((wallet, index) => {
                            return <button className="btn w-full justify-start"
                                onClick={() => {
                                    if (onConnect) {
                                        onConnect()
                                    } else {
                                        walletModalConfig.onSelectWallet(wallet.adapter.name)
                                        setWalletModalConfig(null)
                                    }
                                }}
                                key={index}>
                                <Image src={wallet.adapter.icon} width={32} height={32} alt={wallet.adapter.name}/>
                                {wallet.adapter.name}
                            </button>
                        })}

                        {!walletModalConfig.wallets.length && <div>No wallet installed</div>}
                    </div>
                }
            })
        }
    }, [walletModalConfig])


    useEffect(() => {
        ;(async () => {
            if (buttonState === 'connected') {
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

                    const _address = [] as number[]
                    publicKey.toBytes().forEach((code: number, index: number) => {
                        _address[index] = code
                    })


                    console.log('signature', signature.toString())
                    console.log('signature', publicKey.toBytes())
                    console.log('message', message)
                    const response = await fetch('/api/solana-signin', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            signature: _signature,
                            message: _message,
                            address: _address
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
    }, [buttonState])

    return {
        buttonState,
        handleOpenModal
    }
}
