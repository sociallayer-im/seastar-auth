import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import FarcasterOptionItem from './FarcasterOptionItem'

const meta: Meta<typeof FarcasterOptionItem> = {
    component: FarcasterOptionItem,
    title: 'Auth/LoginOption/FarcasterOptionItem',
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const farcasterButton = canvas.getByText('Farcaster')

        // Simulate user clicking the Farcaster button
        await userEvent.click(farcasterButton)

        // Add assertions to verify the expected behavior
        await expect(farcasterButton).toBeInTheDocument()
    }
}
