import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect } from '@storybook/test'
import RegisterForm from './RegisterForm'
import { en } from '@/lang/en'

const meta: Meta<typeof RegisterForm> = {
    component: RegisterForm,
    title: 'Auth/RegisterForm',
    args: {
        lang: en,
    },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const usernameInput = canvas.getByPlaceholderText('Your username')
        const confirmButton = canvas.getByText('Confirm')

        // Test typing a valid username
        await userEvent.type(usernameInput, 'validUser')
        await userEvent.click(confirmButton)
        await expect(usernameInput).toHaveValue('validUser')
        await expect(canvas.queryByText('Please input username')).not.toBeInTheDocument()

        // Test typing an invalid username
        await userEvent.clear(usernameInput)
        await userEvent.type(usernameInput, 'inv@lid')
        usernameInput.blur()
        setTimeout(async () => {
            await expect(canvas.getByText('Contain the English-language letters and the digits 0-9')).toBeInTheDocument()
        }, 100)
    }
}
