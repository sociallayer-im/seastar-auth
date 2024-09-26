import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import InputPinCode from './index'

const meta: Meta<typeof InputPinCode> = {
    component: InputPinCode,
    title: 'Auth/InputPinCode',
    parameters:{
        layout: 'centered',
    }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const input = canvas.getByTestId('pin-code-input')

        // Simulate user input
        await userEvent.type(input, '12345')

        // Add assertions to verify the expected behavior
        const inputs = canvas.getAllByRole('textbox')
        await expect(inputs[0]).toHaveValue('1')
        await expect(inputs[1]).toHaveValue('2')
        await expect(inputs[2]).toHaveValue('3')
        await expect(inputs[3]).toHaveValue('4')
        await expect(inputs[4]).toHaveValue('5')
    }
}
