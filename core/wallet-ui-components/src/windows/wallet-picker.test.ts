// Copyright (c) 2025-2026 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import type { WalletPickerEntry } from '@canton-network/core-types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { makeWalletPickerEntry } from '../components/fixtures.js'
import '../components/wallet-picker.js'
import {
    notifyWalletPickerConnected,
    notifyWalletPickerError,
    pickWallet,
    waitForWalletPickerRetrySelection,
} from './wallet-picker.js'

const ENTRIES_KEY = 'splice_wallet_picker_entries'
const OVERLAY_SELECTOR = '.swk-wallet-picker-modal-overlay'

describe('windows/wallet-picker', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    afterEach(() => {
        // Clean up any leftover modal from the DOM
        const overlay = document.querySelector(OVERLAY_SELECTOR)
        if (overlay) overlay.remove()
        vi.restoreAllMocks()
    })

    it('pickWallet stores entries and creates modal with picker', async () => {
        const entries: WalletPickerEntry[] = [
            makeWalletPickerEntry({
                providerId: 'ext:selected',
                name: 'Selected Wallet',
            }),
        ]

        const pickPromise = pickWallet(entries)

        const overlay = document.querySelector(OVERLAY_SELECTOR)
        expect(overlay).not.toBeNull()
        expect(overlay!.querySelector('swk-wallet-picker')).not.toBeNull()
        expect(JSON.parse(localStorage.getItem(ENTRIES_KEY) ?? '[]')).toEqual(
            entries
        )

        // Resolve by dispatching result on the picker
        const picker = overlay!.querySelector('swk-wallet-picker')!
        picker.dispatchEvent(
            new CustomEvent('wallet-picker-result', {
                detail: {
                    providerId: 'ext:selected',
                    name: 'Selected Wallet',
                    walletType: 'browser',
                },
                bubbles: true,
                composed: true,
            })
        )

        await expect(pickPromise).resolves.toEqual({
            providerId: 'ext:selected',
            name: 'Selected Wallet',
            type: 'browser',
        })

        expect(document.querySelector(OVERLAY_SELECTOR)).toBeNull()
    })

    it('pickWallet rejects on Escape key', async () => {
        const pickPromise = pickWallet([makeWalletPickerEntry()])

        const overlay = document.querySelector(OVERLAY_SELECTOR)!
        overlay.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

        await expect(pickPromise).rejects.toThrow(
            'User closed the wallet picker'
        )

        expect(document.querySelector(OVERLAY_SELECTOR)).toBeNull()
    })

    it('pickWallet rejects on overlay click', async () => {
        const pickPromise = pickWallet([makeWalletPickerEntry()])

        const overlay = document.querySelector(OVERLAY_SELECTOR)!
        overlay.dispatchEvent(new MouseEvent('click', { bubbles: true }))

        await expect(pickPromise).rejects.toThrow(
            'User closed the wallet picker'
        )

        expect(document.querySelector(OVERLAY_SELECTOR)).toBeNull()
    })

    it('notifyWalletPickerConnected calls setConnected on the picker', async () => {
        const entries = [makeWalletPickerEntry()]
        void pickWallet(entries)

        const overlay = document.querySelector(OVERLAY_SELECTOR)!
        const picker = overlay.querySelector('swk-wallet-picker')!

        // setConnected changes state to 'connected' and renders
        const setConnectedSpy = vi.spyOn(
            picker as unknown as { setConnected: () => void },
            'setConnected'
        )

        notifyWalletPickerConnected()
        expect(setConnectedSpy).toHaveBeenCalled()
    })

    it('notifyWalletPickerError calls setError on the picker', async () => {
        const entries = [makeWalletPickerEntry()]
        void pickWallet(entries)

        const overlay = document.querySelector(OVERLAY_SELECTOR)!
        const picker = overlay.querySelector('swk-wallet-picker')!

        const setErrorSpy = vi.spyOn(
            picker as unknown as { setError: (msg: string) => void },
            'setError'
        )

        notifyWalletPickerError('Something went wrong')
        expect(setErrorSpy).toHaveBeenCalledWith('Something went wrong')
    })

    it('waitForWalletPickerRetrySelection resolves on a new selection', async () => {
        const entries = [makeWalletPickerEntry()]
        const pickPromise = pickWallet(entries)

        // First selection
        const overlay = document.querySelector(OVERLAY_SELECTOR)!
        const picker = overlay.querySelector('swk-wallet-picker')!
        picker.dispatchEvent(
            new CustomEvent('wallet-picker-result', {
                detail: {
                    providerId: 'ext:first',
                    name: 'First',
                    walletType: 'browser',
                },
                bubbles: true,
                composed: true,
            })
        )

        await pickPromise

        // After pick resolves, the modal is gone.
        // waitForWalletPickerRetrySelection should reject since no modal is open.
        await expect(waitForWalletPickerRetrySelection()).rejects.toThrow(
            'Wallet picker is not open'
        )
    })

    it('pickWallet does not leave orphan modals after resolution', async () => {
        const pickPromise = pickWallet([makeWalletPickerEntry()])

        const overlay = document.querySelector(OVERLAY_SELECTOR)!
        const picker = overlay.querySelector('swk-wallet-picker')!
        picker.dispatchEvent(
            new CustomEvent('wallet-picker-result', {
                detail: {
                    providerId: 'ext:done',
                    name: 'Done',
                    walletType: 'browser',
                },
                bubbles: true,
                composed: true,
            })
        )

        await pickPromise
        expect(document.querySelector(OVERLAY_SELECTOR)).toBeNull()
    })
})
