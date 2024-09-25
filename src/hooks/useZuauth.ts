import {zuAuthPopup} from "@pcd/zuauth"
import {edge_tickets} from '@/service/zuauth/edge_tickets'
import {zuzalu_tickets} from '@/service/zuauth/zuzalu_tickets'

export default function useZuauth() {

    const login = async () => {
        const result = await zuAuthPopup({
            zupassUrl: 'https://zupass.org',
            fieldsToReveal: {
                revealAttendeeEmail: true,
                revealAttendeeName: true,
                revealEventId: true,
                revealProductId: true
            },
            watermark: '12345',
            config: [...edge_tickets, ...zuzalu_tickets],
            multi: true
        })

        const pcdStr = result.type === "multi-pcd"
            ? JSON.stringify(result.pcds)
            : result.type === "pcd"
                ? result.pcdStr : ''

        if (result.type === "pcd" || result.type === "multi-pcd") {
            const response = await fetch(`/api/zupass-signin`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({pcdStr})
            })

            if (!response.ok) {
                throw new Error('Authentication failed')
            }

            const data = await response.json()
            if (data.result !== 'ok') {
                throw new Error(data.message)
            }

            return data.auth_token as string
        } else {
            throw new Error('Invalid ticket zupass ticket type')
        }
    }

    return {login}
}
