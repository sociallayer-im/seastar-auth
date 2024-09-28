import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import SolanaOptionItem from './SolanaOptionItem'

const meta: Meta<typeof SolanaOptionItem> = {
    component: SolanaOptionItem,
    title: 'Auth/LoginOption/SolanaOptionItem',
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const solanaButton = canvas.getByText(/Solana/)

        // Simulate user clicking the Solana button
        await userEvent.click(solanaButton)

        // Add assertions to verify the expected behavior
        await expect(solanaButton).toBeInTheDocument()
    }
}
