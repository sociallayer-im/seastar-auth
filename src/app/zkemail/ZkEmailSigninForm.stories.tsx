import type { Meta, StoryObj } from '@storybook/react'
import { within, userEvent, expect, waitFor } from '@storybook/test'
import ZkEmailSigninForm from './ZkEmailSigninForm'
import { Dictionary } from '@/lang'

const meta: Meta<typeof ZkEmailSigninForm> = {
    component: ZkEmailSigninForm,
    title: 'Auth/ZkEmailSigninForm',
    args: {
        lang: {
            'Your email': 'Your email',
            'Next': 'Next'
        } as Dictionary
    }
}

export default meta

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const emailInput = canvas.getByPlaceholderText('Your email')
        const nextButton = canvas.getByText('Next')

        // Add assertions to verify the expected behavior
        await expect(emailInput).toBeInTheDocument()
        await expect(nextButton).toBeInTheDocument()

        // Simulate user entering email and clicking the Next button
        // await userEvent.click(nextButton)

        await userEvent.type(emailInput, 'testexamplecom')
        emailInput.blur()
        await waitFor(() => expect(canvas.getByText('Invalid email')).toBeInTheDocument())

        await userEvent.clear(emailInput)
        await userEvent.type(emailInput, 'test@example.com')
        emailInput.blur()
        await waitFor(() => expect(canvas.queryAllByText('Invalid email').length).toEqual(0))
    }
}
