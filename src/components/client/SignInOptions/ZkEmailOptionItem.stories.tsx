import type { Meta, StoryObj } from '@storybook/react'
import { within, expect } from '@storybook/test'
import ZkEmailOptionItem from './ZkEmailOptionItem'

const meta: Meta<typeof ZkEmailOptionItem> = {
    component: ZkEmailOptionItem,
    title: 'Auth/LoginOption/ZkEmailOptionItem',
}

export default meta

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const zkEmailButton = canvas.getByText('ZK Email')

        // Simulate user clicking the ZK Email button
        // await userEvent.click(zkEmailButton)

        // Add assertions to verify the expected behavior
        await expect(zkEmailButton).toBeInTheDocument()
    }
}
