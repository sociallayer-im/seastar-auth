import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import BindEmailForm from '@/app/bind-email/BindEmailForm'
import { Dictionary } from '@/lang'

const meta: Meta<typeof BindEmailForm> = {
    component: BindEmailForm,
    title: 'Auth/BindEmailForm',
    args: {
        lang: {
            'Your email': 'Your email',
            'Continue': 'Continue'
        } as Dictionary
    }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const emailInput = canvas.getByPlaceholderText('Your email')
        const continueButton = canvas.getByText('Continue')


        await expect(continueButton).toBeInTheDocument()

        // Simulate user input
        await userEvent.type(emailInput, 'test@example.com')

        // Add assertions to verify the expected behavior
        await expect(emailInput).toHaveValue('test@example.com')
    }
}
