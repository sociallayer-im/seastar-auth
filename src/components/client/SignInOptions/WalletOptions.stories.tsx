import type {Meta, StoryObj} from '@storybook/react'
import {expect, within} from '@storybook/test'
import Index from './index'
import {en} from '@/lang/en'

const meta = {
    component: Index,
    title: 'Auth/LoginOption/WalletOptions',

} satisfies Meta<typeof Index>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        lang: en
    },
    play: async ({canvasElement}) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByText('Injected')).toBeInTheDocument()
        await expect(canvas.getByPlaceholderText('Email')).toBeInTheDocument()
    }
}
