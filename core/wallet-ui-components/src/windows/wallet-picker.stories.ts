// Copyright (c) 2025-2026 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Meta, StoryObj } from '@storybook/web-components-vite'
import type {
    WalletPickerEntry,
    WalletPickerSuggestedEntry,
} from '@canton-network/core-types'
import { html } from 'lit'
import '../components/wallet-picker'

const meta: Meta = {
    title: 'Discovery',
}

export default meta

const MOCK_ENTRIES: WalletPickerEntry[] = [
    {
        providerId: 'canton-wallet',
        name: 'Wallet',
        description: 'Popup + Browser Extension',
        type: 'remote',
        icon: '/images/logos/canton-logo.png',
    },
    {
        providerId: 'bron',
        name: 'Bron',
        description: 'Enterprise',
        type: 'remote',
        icon: '/images/logos/bron-logo.svg',
    },
]

const MOCK_SUGGESTED_ENTRIES: WalletPickerSuggestedEntry[] = [
    {
        providerId: 'fireblocks',
        name: 'Fireblocks',
        description: 'Mobile Wallet',
        type: 'remote',
        icon: '/images/logos/fireblocks-logo.svg',
        installUrls: [
            {
                platform: 'chrome',
                url: 'https://chrome.google.com/webstore/detail/fireblocks',
            },
            {
                platform: 'firefox',
                url: 'https://addons.mozilla.org/en-US/firefox/addon/fireblocks',
            },
        ],
    },
    {
        providerId: 'custom-wallet-input',
        name: 'Custom Wallet',
        description: 'Link a CIP-103 wallet',
        type: 'remote',
        icon: '',
        installUrls: [],
    },
]

const CONTAINER_STYLE =
    'width: 400px; height: 700px; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;'

function seedEntries(entries: WalletPickerEntry[]): void {
    localStorage.setItem(
        'splice_wallet_picker_entries',
        JSON.stringify(entries)
    )
}

function seedRecentGateways(
    entries: { name: string; rpcUrl: string; description?: string }[]
): void {
    localStorage.setItem('splice_wallet_picker_recent', JSON.stringify(entries))
}

function seedSuggestedEntries(entries: WalletPickerSuggestedEntry[]): void {
    localStorage.setItem(
        'splice_wallet_picker_suggested_entries',
        JSON.stringify(entries)
    )
}

export const Default: StoryObj = {
    render: () => {
        seedEntries(MOCK_ENTRIES)
        seedSuggestedEntries(MOCK_SUGGESTED_ENTRIES)
        seedRecentGateways([
            {
                name: 'Custom wallet 1',
                description: 'custom API',
                rpcUrl: 'https://custom-wallet-1.example/rpc',
            },
        ])
        return html`
            <div style=${CONTAINER_STYLE}>
                <swk-wallet-picker></swk-wallet-picker>
            </div>
        `
    },
}

export const WithManualProviders: StoryObj = {
    render: () => {
        seedEntries(MOCK_ENTRIES)
        seedSuggestedEntries(MOCK_SUGGESTED_ENTRIES)
        seedRecentGateways([
            {
                name: 'https://manual-wallet.example/rpc',
                rpcUrl: 'https://manual-wallet.example/rpc',
            },
        ])
        return html`
            <div style=${CONTAINER_STYLE}>
                <swk-wallet-picker></swk-wallet-picker>
            </div>
        `
    },
}

export const Modal: StoryObj = {
    render: () => {
        seedEntries(MOCK_ENTRIES)
        seedSuggestedEntries(MOCK_SUGGESTED_ENTRIES)
        return html`
            <div
                style="position:fixed;inset:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:1000"
            >
                <div
                    style="background:var(--wg-theme-background-color,#fff);border-radius:16px;width:${440}px;max-width:95vw;max-height:85vh;overflow:hidden;box-shadow:0 14px 28px rgba(15,23,42,0.12)"
                >
                    <swk-wallet-picker></swk-wallet-picker>
                </div>
            </div>
        `
    },
}

export const Empty: StoryObj = {
    render: () => {
        localStorage.removeItem('splice_wallet_picker_entries')
        localStorage.removeItem('splice_wallet_picker_recent')
        return html`
            <div style=${CONTAINER_STYLE}>
                <swk-wallet-picker></swk-wallet-picker>
            </div>
        `
    },
}
