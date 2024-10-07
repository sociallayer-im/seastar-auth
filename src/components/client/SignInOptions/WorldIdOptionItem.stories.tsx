import type { Meta, StoryObj } from '@storybook/react'
import { within, expect } from '@storybook/test'
import WorldIdOptionItem from './WorldIdOptionItem'

const meta: Meta<typeof WorldIdOptionItem> = {
    component: WorldIdOptionItem,
    title: 'Auth/LoginOption/WorldIdOptionItem',
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const worldIdButton = canvas.getByTestId('worldid-option-item')

        // Simulate user clicking the World ID button
        // await userEvent.click(worldIdButton)

        // Add assertions to verify the expected behavior
        await expect(worldIdButton).toBeInTheDocument()
        // await expect(MiniKit.isInstalled()).toBe(true)
    }
}
