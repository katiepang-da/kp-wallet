// Copyright (c) 2025-2026 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { fixture, html } from '@open-wc/testing-helpers'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { makeWalletPickerEntry } from './fixtures.js'
import './wallet-picker.js'
import { WalletPicker } from './wallet-picker.js'

const ENTRIES_KEY = 'splice_wallet_picker_entries'
const RECENT_KEY = 'splice_wallet_picker_recent'

function setPickerEntries(entries: ReturnType<typeof makeWalletPickerEntry>[]) {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries))
}

function setRecentGateways(gateways: { name: string; rpcUrl: string }[]) {
    localStorage.setItem(RECENT_KEY, JSON.stringify(gateways))
}

describe('WalletPicker', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('mounts without error', async () => {
        const el = await fixture<WalletPicker>(
            html`<swk-wallet-picker></swk-wallet-picker>`
        )
        expect(el).toBeInstanceOf(WalletPicker)
    })

    it('shows empty state when no wallets are registered', async () => {
        const el = await fixture<WalletPicker>(
            html`<swk-wallet-picker></swk-wallet-picker>`
        )

        expect(el.shadowRoot!.textContent).toContain('No wallets available')
    })

    it('renders registered wallet entries from localStorage', async () => {
        setPickerEntries([
            makeWalletPickerEntry({ name: 'Remote Gateway 1' }),
            makeWalletPickerEntry({
                providerId: 'remote:provider-id2',
                name: 'Remote Gateway 2',
                type: 'remote',
                url: 'http://gw',
            }),
        ])

        const el = await fixture<WalletPicker>(
            html`<swk-wallet-picker></swk-wallet-picker>`
        )

        const cards = el.shadowRoot!.querySelectorAll('.wallet-card')
        expect(cards.length).toBe(2)
        expect(el.shadowRoot!.textContent).toContain('Remote Gateway 1')
        expect(el.shadowRoot!.textContent).toContain('Remote Gateway 2')
    })

    it('includes recent gateways not in the registered list', async () => {
        setPickerEntries([makeWalletPickerEntry({ name: 'Registered' })])
        setRecentGateways([{ name: 'Recent', rpcUrl: 'http://recent.example' }])

        const el = await fixture<WalletPicker>(
            html`<swk-wallet-picker></swk-wallet-picker>`
        )

        expect(el.shadowRoot!.textContent).toContain('Registered')
        expect(el.shadowRoot!.textContent).toContain('Recent')
    })

    it('dispatches wallet-picker-result when a wallet card is clicked', async () => {
        setPickerEntries([
            makeWalletPickerEntry({
                providerId: 'browser:ext:ext-wallet',
                name: 'Ext Wallet',
                type: 'extension',
            }),
        ])

        const el = await fixture<WalletPicker>(
            html`<swk-wallet-picker></swk-wallet-picker>`
        )

        const resultPromise = new Promise<CustomEvent>((resolve) => {
            el.addEventListener('wallet-picker-result', resolve, { once: true })
        })

        const card = el.shadowRoot!.querySelector('.wallet-card') as HTMLElement
        card.click()

        const event = await resultPromise
        expect(event.detail).toEqual({
            providerId: 'browser:ext:ext-wallet',
            name: 'Ext Wallet',
            walletType: 'extension',
            url: undefined,
            reuseGlobalWalletPopup: undefined,
        })
        expect(el.shadowRoot!.textContent).toContain('Connecting')
    })

    it('connects via custom URL input', async () => {
        const el = await fixture<WalletPicker>(
            html`<swk-wallet-picker></swk-wallet-picker>`
        )

        const input = el.shadowRoot!.querySelector(
            '.custom-url-input'
        ) as HTMLInputElement
        input.value = 'http://custom.example'

        const connectBtn = el.shadowRoot!.querySelector(
            '.btn-connect'
        ) as HTMLButtonElement

        const resultPromise = new Promise<CustomEvent>((resolve) => {
            el.addEventListener('wallet-picker-result', resolve, { once: true })
        })

        connectBtn.click()

        const event = await resultPromise
        expect(event.detail).toMatchObject({
            providerId: 'remote:http://custom.example',
            name: 'http://custom.example',
            walletType: 'remote',
            url: 'http://custom.example',
            reuseGlobalWalletPopup: true,
        })
    })

    it('shows connected state when setConnected is called', async () => {
        setPickerEntries([
            makeWalletPickerEntry({
                name: 'Wallet123',
                providerId: 'remote:wallet123',
            }),
        ])

        const el = await fixture<WalletPicker>(
            html`<swk-wallet-picker></swk-wallet-picker>`
        )

        const card = el.shadowRoot!.querySelector('.wallet-card') as HTMLElement
        card.click()

        el.setConnected()

        expect(el.shadowRoot!.textContent).toContain('Connected')
        expect(el.shadowRoot!.textContent).toContain('Wallet123')
    })

    it('shows error state when setError is called', async () => {
        setPickerEntries([makeWalletPickerEntry()])

        const el = await fixture<WalletPicker>(
            html`<swk-wallet-picker></swk-wallet-picker>`
        )

        el.setError('Connection refused')

        expect(el.shadowRoot!.textContent).toContain('Connection Failed')
        expect(el.shadowRoot!.textContent).toContain('Connection refused')
    })

    it('returns to list view from error by Try Again button', async () => {
        setPickerEntries([makeWalletPickerEntry({ name: 'Retry Wallet' })])

        const el = await fixture<WalletPicker>(
            html`<swk-wallet-picker></swk-wallet-picker>`
        )

        el.setError('Timeout')

        const tryAgain = el.shadowRoot!.querySelector(
            '.btn-primary'
        ) as HTMLButtonElement
        tryAgain.click()

        expect(el.shadowRoot!.textContent).toContain('Retry Wallet')
        expect(el.shadowRoot!.textContent).not.toContain('Failed to connect')
    })

    it('removes a recent gateway entry', async () => {
        setRecentGateways([
            { name: 'Removable GW', rpcUrl: 'http://remove.me' },
        ])

        const el = await fixture<WalletPicker>(
            html`<swk-wallet-picker></swk-wallet-picker>`
        )

        const removeBtn = el.shadowRoot!.querySelector(
            '.wallet-remove-btn'
        ) as HTMLButtonElement
        removeBtn.click()

        expect(el.shadowRoot!.textContent).not.toContain('Removable GW')
        expect(JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')).toEqual([])
    })
})
