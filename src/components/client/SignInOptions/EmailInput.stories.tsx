import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import EmailInput from './EmailInput'
import { en } from '@/lang/en'

const meta: Meta<typeof EmailInput> = {
    component: EmailInput,
    title: 'Auth/LoginOption/EmailInput',
    argTypes: {
        lang: {
            control: {
                type: 'object',
            },
        },
    }
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        lang: en,
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const emailInput = canvas.getByPlaceholderText('Email')

        // Test typing a valid email
        await userEvent.type(emailInput, 'test@example.com')
        await expect(emailInput).toHaveValue('test@example.com')
        await expect(canvas.queryByText('Invalid email')).not.toBeInTheDocument()

        // Test typing an invalid email
        await userEvent.clear(emailInput)
        await userEvent.type(emailInput, 'invalid-email')
        emailInput.blur()
        setTimeout(async () => {
            await expect(canvas.getByText('Invalid email')).toBeInTheDocument()
        }, 100)
    }
}
