// helpers/siwe/siwe.ts
import { ethers } from "ethers"
var PREAMBLE = " wants you to sign in with your Ethereum account:"
var URI_TAG = "URI: "
var VERSION_TAG = "Version: "
var CHAIN_TAG = "Chain ID: "
var NONCE_TAG = "Nonce: "
var IAT_TAG = "Issued At: "
var EXP_TAG = "Expiration Time: "
var NBF_TAG = "Not Before: "
var RID_TAG = "Request ID: "
var ERC_191_PREFIX = "Ethereum Signed Message:\n"
var tagged = (line, tag) => {
    if (line && line.includes(tag)) {
        return line.replace(tag, "")
    } else {
        throw new Error(`Missing '${tag}'`)
    }
}
var parseSiweMessage = (inputString) => {
    const lines = inputString.split("\n")[Symbol.iterator]()
    const domain = tagged(lines.next()?.value, PREAMBLE)
    const address = lines.next()?.value
    lines.next()
    const nextValue = lines.next()?.value
    let statement
    if (nextValue) {
        statement = nextValue
        lines.next()
    }
    const uri = tagged(lines.next()?.value, URI_TAG)
    const version = tagged(lines.next()?.value, VERSION_TAG)
    const chain_id = tagged(lines.next()?.value, CHAIN_TAG)
    const nonce = tagged(lines.next()?.value, NONCE_TAG)
    const issued_at = tagged(lines.next()?.value, IAT_TAG)
    let expiration_time, not_before, request_id
    for (let line of lines) {
        if (line.startsWith(EXP_TAG)) {
            expiration_time = tagged(line, EXP_TAG)
        } else if (line.startsWith(NBF_TAG)) {
            not_before = tagged(line, NBF_TAG)
        } else if (line.startsWith(RID_TAG)) {
            request_id = tagged(line, RID_TAG)
        }
    }
    if (lines.next().done === false) {
        throw new Error("Extra lines in the input")
    }
    const siweMessageData = {
        domain,
        address,
        statement,
        uri,
        version,
        chain_id,
        nonce,
        issued_at,
        expiration_time,
        not_before,
        request_id
    }
    return siweMessageData
}
var generateSiweMessage = (siweMessageData) => {
    let siweMessage = ""
    if (siweMessageData.scheme) {
        siweMessage += `${siweMessageData.scheme}://${siweMessageData.domain} wants you to sign in with your Ethereum account:
`
    } else {
        siweMessage += `${siweMessageData.domain} wants you to sign in with your Ethereum account:
`
    }
    if (siweMessageData.address) {
        siweMessage += `${siweMessageData.address}
`
    } else {
        siweMessage += "{address}\n"
    }
    siweMessage += "\n"
    if (siweMessageData.statement) {
        siweMessage += `${siweMessageData.statement}
`
    }
    siweMessage += "\n"
    siweMessage += `URI: ${siweMessageData.uri}
`
    siweMessage += `Version: ${siweMessageData.version}
`
    siweMessage += `Chain ID: ${siweMessageData.chain_id}
`
    siweMessage += `Nonce: ${siweMessageData.nonce}
`
    siweMessage += `Issued At: ${siweMessageData.issued_at}
`
    if (siweMessageData.expiration_time) {
        siweMessage += `Expiration Time: ${siweMessageData.expiration_time}
`
    }
    if (siweMessageData.not_before) {
        siweMessage += `Not Before: ${siweMessageData.not_before}
`
    }
    if (siweMessageData.request_id) {
        siweMessage += `Request ID: ${siweMessageData.request_id}
`
    }
    return siweMessage
}
var SAFE_CONTRACT_ABI = [
    {
        name: "checkSignatures",
        type: "function",
        stateMutability: "view",
        inputs: [
            { name: "dataHash", type: "bytes32" },
            { name: "data", type: "bytes" },
            { name: "signature", type: "bytes" }
        ],
        outputs: []
    }
]
var verifySiweMessage = async (payload, nonce, statement, requestId, userProvider) => {
    if (typeof window !== "undefined") {
        throw new Error("Verify can only be called in the backend")
    }
    const { message, signature, address } = payload
    const siweMessageData = parseSiweMessage(message)
    if (siweMessageData.expiration_time) {
        const expirationTime = new Date(siweMessageData.expiration_time)
        if (expirationTime < /* @__PURE__ */ new Date()) {
            throw new Error("Expired message")
        }
    }
    if (siweMessageData.not_before) {
        const notBefore = new Date(siweMessageData.not_before)
        if (notBefore > /* @__PURE__ */ new Date()) {
            throw new Error("Not Before time has not passed")
        }
    }
    if (nonce && siweMessageData.nonce !== nonce) {
        throw new Error(
            `Nonce mismatch. Got: ${siweMessageData.nonce}, Expected: ${nonce}`
        )
    }
    if (statement && siweMessageData.statement !== statement) {
        throw new Error(
            `Statement mismatch. Got: ${siweMessageData.statement}, Expected: ${statement}`
        )
    }
    if (requestId && siweMessageData.request_id !== requestId) {
        throw new Error(
            `Request ID mismatch. Got: ${siweMessageData.request_id}, Expected: ${requestId}`
        )
    }
    let provider = userProvider || ethers.getDefaultProvider("https://mainnet.optimism.io")
    const signedMessage = `${ERC_191_PREFIX}${message.length}${message}`
    const messageBytes = Buffer.from(signedMessage, "utf8").toString("hex")
    const hashedMessage = ethers.utils.hashMessage(signedMessage)
    const contract = new ethers.Contract(address, SAFE_CONTRACT_ABI, provider)
    try {
        await contract.checkSignatures(
            hashedMessage,
            `0x${messageBytes}`,
            `0x${signature}`
        )
    } catch (error) {
        console.error(error)
        throw new Error("Signature verification failed")
    }
    return { isValid: true, siweMessageData }
}

// types/errors.ts
import { AppErrorCodes } from "@worldcoin/idkit-core"
import { AppErrorCodes as AppErrorCodes2 } from "@worldcoin/idkit-core"
var VerificationErrorMessage = {
    [AppErrorCodes.VerificationRejected]: "You\u2019ve cancelled the request in World App.",
    [AppErrorCodes.MaxVerificationsReached]: "You have already verified the maximum number of times for this action.",
    [AppErrorCodes.CredentialUnavailable]: "It seems you do not have the verification level required by this app.",
    [AppErrorCodes.MalformedRequest]: "There was a problem with this request. Please try again or contact the app owner.",
    [AppErrorCodes.InvalidNetwork]: "Invalid network. If you are the app owner, visit docs.worldcoin.org/test for details.",
    [AppErrorCodes.InclusionProofFailed]: "There was an issue fetching your credential. Please try again.",
    [AppErrorCodes.InclusionProofPending]: "Your identity is still being registered. Please wait a few minutes and try again.",
    [AppErrorCodes.UnexpectedResponse]: "Unexpected response from your wallet. Please try again.",
    [AppErrorCodes.FailedByHostApp]: "Verification failed by the app. Please contact the app owner for details.",
    [AppErrorCodes.GenericError]: "Something unexpected went wrong. Please try again.",
    [AppErrorCodes.ConnectionFailed]: "Connection to your wallet failed. Please try again."
}
var PaymentErrorCodes = /* @__PURE__ */ ((PaymentErrorCodes2) => {
    PaymentErrorCodes2["InputError"] = "input_error"
    PaymentErrorCodes2["PaymentRejected"] = "payment_rejected"
    PaymentErrorCodes2["InvalidReceiver"] = "invalid_receiver"
    PaymentErrorCodes2["InsufficientBalance"] = "insufficient_balance"
    PaymentErrorCodes2["TransactionFailed"] = "transaction_failed"
    PaymentErrorCodes2["GenericError"] = "generic_error"
    PaymentErrorCodes2["UserBlocked"] = "user_blocked"
    return PaymentErrorCodes2
})(PaymentErrorCodes || {})
var PaymentErrorMessage = {
    ["input_error" /* InputError */]: "There was a problem with this request. Please try again or contact the app owner.",
    ["payment_rejected" /* PaymentRejected */]: "You\u2019ve cancelled the payment in World App.",
    ["invalid_receiver" /* InvalidReceiver */]: "The receiver address is invalid. Please contact the app owner.",
    ["insufficient_balance" /* InsufficientBalance */]: "You do not have enough balance to complete this transaction.",
    ["transaction_failed" /* TransactionFailed */]: "The transaction failed. Please try again.",
    ["generic_error" /* GenericError */]: "Something unexpected went wrong. Please try again.",
    ["user_blocked" /* UserBlocked */]: "User's region is blocked from making payments."
}
var PaymentValidationErrors = /* @__PURE__ */ ((PaymentValidationErrors2) => {
    PaymentValidationErrors2["MalformedRequest"] = "There was a problem with this request. Please try again or contact the app owner."
    PaymentValidationErrors2["InvalidTokenAddress"] = "The token address is invalid. Please contact the app owner."
    PaymentValidationErrors2["InvalidAppId"] = "The app ID is invalid. Please contact the app owner."
    PaymentValidationErrors2["DuplicateReference"] = "This reference ID already exists please generate a new one and try again."
    return PaymentValidationErrors2
})(PaymentValidationErrors || {})
var WalletAuthErrorCodes = /* @__PURE__ */ ((WalletAuthErrorCodes2) => {
    WalletAuthErrorCodes2["MalformedRequest"] = "malformed_request"
    WalletAuthErrorCodes2["UserRejected"] = "user_rejected"
    WalletAuthErrorCodes2["GenericError"] = "generic_error"
    return WalletAuthErrorCodes2
})(WalletAuthErrorCodes || {})
var WalletAuthErrorMessage = {
    ["malformed_request" /* MalformedRequest */]: "Provided parameters in the request are invalid.",
    ["user_rejected" /* UserRejected */]: "User rejected the request.",
    ["generic_error" /* GenericError */]: "Something unexpected went wrong."
}
var MiniKitInstallErrorCode = /* @__PURE__ */ ((MiniKitInstallErrorCode2) => {
    MiniKitInstallErrorCode2["Unknown"] = "unknown"
    MiniKitInstallErrorCode2["AlreadyInstalled"] = "already_installed"
    MiniKitInstallErrorCode2["OutsideOfWorldApp"] = "outside_of_worldapp"
    MiniKitInstallErrorCode2["NotOnClient"] = "not_on_client"
    MiniKitInstallErrorCode2["AppOutOfDate"] = "app_out_of_date"
    return MiniKitInstallErrorCode2
})(MiniKitInstallErrorCode || {})
var MiniKitInstallErrorMessage = {
    ["unknown" /* Unknown */]: "Failed to install MiniKit.",
    ["already_installed" /* AlreadyInstalled */]: "MiniKit is already installed.",
    ["outside_of_worldapp" /* OutsideOfWorldApp */]: "MiniApp launched outside of WorldApp.",
    ["not_on_client" /* NotOnClient */]: "Window object is not available.",
    ["app_out_of_date" /* AppOutOfDate */]: "WorldApp is out of date. Please update the app."
}

// helpers/send-webview-event.ts
var sendWebviewEvent = (payload) => {
    if (window.webkit) {
        window.webkit?.messageHandlers?.minikit?.postMessage?.(payload)
    } else if (window.Android) {
        window.Android.postMessage?.(JSON.stringify(payload))
    }
}

// types/commands.ts
var Command = /* @__PURE__ */ ((Command2) => {
    Command2["Verify"] = "verify"
    Command2["Pay"] = "pay"
    Command2["WalletAuth"] = "wallet-auth"
    return Command2
})(Command || {})

// types/responses.ts
var ResponseEvent = /* @__PURE__ */ ((ResponseEvent2) => {
    ResponseEvent2["MiniAppVerifyAction"] = "miniapp-verify-action"
    ResponseEvent2["MiniAppPayment"] = "miniapp-payment"
    ResponseEvent2["MiniAppWalletAuth"] = "miniapp-wallet-auth"
    return ResponseEvent2
})(ResponseEvent || {})

// types/payment.ts
var Tokens = /* @__PURE__ */ ((Tokens2) => {
    Tokens2["USDCE"] = "USDCE"
    Tokens2["WLD"] = "WLD"
    return Tokens2
})(Tokens || {})
var TokenDecimals = {
    ["USDCE" /* USDCE */]: 6,
    ["WLD" /* WLD */]: 18
}
var Network = /* @__PURE__ */ ((Network2) => {
    Network2["Optimism"] = "optimism"
    return Network2
})(Network || {})

// minikit.ts
import { VerificationLevel } from "@worldcoin/idkit-core"

// helpers/siwe/validate-wallet-auth-command-input.ts
var validateWalletAuthCommandInput = (params) => {
    if (!params.nonce) {
        return { valid: false, message: "'nonce' is required" }
    }
    if (params.nonce.length < 8) {
        return { valid: false, message: "'nonce' must be at least 8 characters" }
    }
    if (params.statement && params.statement.includes("\n")) {
        return { valid: false, message: "'statement' must not contain newlines" }
    }
    if (params.expirationTime && new Date(params.expirationTime) < /* @__PURE__ */ new Date()) {
        return { valid: false, message: "'expirationTime' must be in the future" }
    }
    if (params.expirationTime && new Date(params.expirationTime) > new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3)) {
        return { valid: false, message: "'expirationTime' must be within 7 days" }
    }
    if (params.notBefore && new Date(params.notBefore) > new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3)) {
        return { valid: false, message: "'notBefore' must be within 7 days" }
    }
    return { valid: true }
}

// helpers/payment/client.ts
var tokenToDecimals = (amount, token) => {
    const decimals = TokenDecimals[token]
    if (decimals === void 0) {
        throw new Error(`Invalid token: ${token}`)
    }
    const factor = 10 ** decimals
    const result = amount * factor
    if (!Number.isInteger(result)) {
        throw new Error(`The resulting amount is not a whole number: ${result}`)
    }
    return result
}
var validatePaymentPayload = (payload) => {
    if (payload.tokens.some(
        (token) => token.symbol == "USDCE" && parseFloat(token.token_amount) < 0.1
    )) {
        console.error("USDCE amount should be greater than $0.1")
        return false
    }
    if (payload.reference.length > 36) {
        console.error("Reference must not exceed 36 characters")
        return false
    }
    return true
}

// minikit.ts
var sendMiniKitEvent = (payload) => {
    sendWebviewEvent(payload)
}
var _MiniKit = class _MiniKit {
    static sendInit() {
        sendWebviewEvent({
            command: "init",
            payload: { version: this.MINIKIT_VERSION }
        })
    }
    static subscribe(event, handler) {
        this.listeners[event] = handler
    }
    static unsubscribe(event) {
        delete this.listeners[event]
    }
    static trigger(event, payload) {
        if (!this.listeners[event]) {
            console.error(`No handler for event ${event}`)
            return
        }
        this.listeners[event](payload)
    }
    static commandsValid(input) {
        return input.every(
            (command) => command.supported_versions.includes(this.commandVersion[command.name])
        )
    }
    static install() {
        if (typeof window === "undefined" || Boolean(window.MiniKit)) {
            return {
                success: false,
                errorCode: "already_installed" /* AlreadyInstalled */,
                errorMessage: MiniKitInstallErrorMessage["already_installed" /* AlreadyInstalled */]
            }
        }
        if (!window.WorldApp) {
            return {
                success: false,
                errorCode: "outside_of_worldapp" /* OutsideOfWorldApp */,
                errorMessage: MiniKitInstallErrorMessage["outside_of_worldapp" /* OutsideOfWorldApp */]
            }
        }
        if (!this.commandsValid(window.WorldApp.supported_commands)) {
            return {
                success: false,
                errorCode: "app_out_of_date" /* AppOutOfDate */,
                errorMessage: MiniKitInstallErrorMessage["app_out_of_date" /* AppOutOfDate */]
            }
        }
        try {
            window.MiniKit = _MiniKit
            this.sendInit()
        } catch (error) {
            console.error(
                MiniKitInstallErrorMessage["unknown" /* Unknown */],
                error
            )
            return {
                success: false,
                errorCode: "unknown" /* Unknown */,
                errorMessage: MiniKitInstallErrorMessage["unknown" /* Unknown */]
            }
        }
        return { success: true }
    }
    static isInstalled(debug) {
        if (debug)
            console.log("MiniKit is alive!")
        return Boolean(window.MiniKit)
    }
}
_MiniKit.MINIKIT_VERSION = 1
_MiniKit.commandVersion = {
    ["verify" /* Verify */]: 1,
    ["pay" /* Pay */]: 1,
    ["wallet-auth" /* WalletAuth */]: 1
}
_MiniKit.listeners = {
    ["miniapp-verify-action" /* MiniAppVerifyAction */]: () => {
    },
    ["miniapp-payment" /* MiniAppPayment */]: () => {
    },
    ["miniapp-wallet-auth" /* MiniAppWalletAuth */]: () => {
    }
}
_MiniKit.commands = {
    verify: (payload) => {
        const timestamp = (/* @__PURE__ */ new Date()).toISOString()
        const eventPayload = {
            ...payload,
            signal: payload.signal || "",
            verification_level: payload.verification_level || VerificationLevel.Orb,
            timestamp
        }
        sendMiniKitEvent({
            command: "verify" /* Verify */,
            version: _MiniKit.commandVersion["verify" /* Verify */],
            payload: eventPayload
        })
        return eventPayload
    },
    pay: (payload) => {
        if (typeof window === "undefined") {
            console.error(
                "'pay' method is only available in a browser environment."
            )
            return null
        }
        if (!validatePaymentPayload(payload)) {
            return null
        }
        const network = "optimism" /* Optimism */
        const eventPayload = {
            ...payload,
            network
        }
        sendMiniKitEvent({
            command: "pay" /* Pay */,
            version: _MiniKit.commandVersion["pay" /* Pay */],
            payload: eventPayload
        })
        return eventPayload
    },
    walletAuth: (payload) => {
        if (typeof window === "undefined") {
            console.error(
                "'walletAuth' method is only available in a browser environment."
            )
            return null
        }
        const validationResult = validateWalletAuthCommandInput(payload)
        if (!validationResult.valid) {
            console.error(
                "Failed to validate wallet auth input:\n\n -->",
                validationResult.message
            )
            return null
        }
        let protocol = null
        try {
            const currentUrl = new URL(window.location.href)
            protocol = currentUrl.protocol.split(":")[0]
        } catch (error) {
            console.error("Failed to get current URL", error)
            return null
        }
        const siweMessage = generateSiweMessage({
            scheme: protocol,
            domain: window.location.host,
            statement: payload.statement ?? void 0,
            uri: window.location.href,
            version: 1,
            chain_id: 10,
            nonce: payload.nonce,
            issued_at: (/* @__PURE__ */ new Date()).toISOString(),
            expiration_time: payload.expirationTime?.toISOString() ?? void 0,
            not_before: payload.notBefore?.toISOString() ?? void 0,
            request_id: payload.requestId ?? void 0
        })
        const walletAuthPayload = { siweMessage }
        sendMiniKitEvent({
            command: "wallet-auth" /* WalletAuth */,
            version: _MiniKit.commandVersion["wallet-auth" /* WalletAuth */],
            payload: walletAuthPayload
        })
        return walletAuthPayload
    },
    closeWebview: () => {
        sendWebviewEvent({ command: "close" })
    }
}
var MiniKit = _MiniKit

// index.ts
import { VerificationLevel as VerificationLevel2 } from "@worldcoin/idkit-core"
import {
    verifyCloudProof
} from "@worldcoin/idkit-core/backend"
export {
    Command,
    MiniKit,
    MiniKitInstallErrorCode,
    MiniKitInstallErrorMessage,
    Network,
    PaymentErrorCodes,
    PaymentErrorMessage,
    PaymentValidationErrors,
    ResponseEvent,
    SAFE_CONTRACT_ABI,
    TokenDecimals,
    Tokens,
    AppErrorCodes2 as VerificationErrorCodes,
    VerificationErrorMessage,
    VerificationLevel2 as VerificationLevel,
    WalletAuthErrorCodes,
    WalletAuthErrorMessage,
    parseSiweMessage,
    tokenToDecimals,
    verifyCloudProof,
    verifySiweMessage
}
