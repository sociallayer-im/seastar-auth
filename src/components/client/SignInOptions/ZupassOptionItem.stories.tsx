import type { Meta, StoryObj } from '@storybook/react'
import { within, expect } from '@storybook/test'
import ZupassOptionItem from './ZupassOptionItem'

const meta: Meta<typeof ZupassOptionItem> = {
    component: ZupassOptionItem,
    title: 'Auth/LoginOption/ZupassOptionItem',
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const zupassButton = canvas.getByText('Zupass')

        await expect(zupassButton).toBeInTheDocument()
    }
}
