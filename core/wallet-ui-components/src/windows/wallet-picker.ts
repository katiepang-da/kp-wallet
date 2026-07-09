// Copyright (c) 2025-2026 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import type {
    WalletPickerEntry,
    WalletPickerResult,
} from '../components/wallet-picker.js'
import { WalletPicker } from '../components/wallet-picker.js'

const PICKER_MAX_WIDTH = 440

let activeWalletPickerInstance: WalletPicker | null = null
let activeModalElement: HTMLElement | null = null
let activeCloseHandler: (() => void) | null = null

export const notifyWalletPickerConnected = (): void => {
    const picker = activeWalletPickerInstance
    if (!picker) return
    picker.setConnected()
    // The picker dispatches 'wallet-picker-close' after showing connected state,
    // so we don't force-close here.
}

export const notifyWalletPickerError = (message: string): void => {
    const picker = activeWalletPickerInstance
    if (!picker) return
    picker.setError(message)
}

function createModalStyles(): HTMLStyleElement {
    const style = document.createElement('style')
    style.textContent = `
        .swk-wallet-picker-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .swk-wallet-picker-modal-content {
            background: var(--wg-theme-background-color, #fff);
            border-radius: 16px;
            width: ${PICKER_MAX_WIDTH}px;
            max-width: 95vw;
            max-height: 85vh;
            overflow: hidden;
            box-shadow: 0 14px 28px rgba(15, 23, 42, 0.12);
        }
        .swk-wallet-picker-modal-content swk-wallet-picker {
            height: 100%;
            max-height: 80vh;
        }
    `
    return style
}

function buildModal(picker: WalletPicker): HTMLElement {
    const overlay = document.createElement('div')
    overlay.className = 'swk-wallet-picker-modal-overlay'
    overlay.setAttribute('role', 'dialog')
    overlay.setAttribute('aria-modal', 'true')
    overlay.setAttribute('aria-label', 'Connect a Wallet')

    const content = document.createElement('div')
    content.className = 'swk-wallet-picker-modal-content'
    content.appendChild(picker)

    overlay.appendChild(content)

    const styleEl = createModalStyles()
    document.head.appendChild(styleEl)

    activeModalElement = overlay
    document.body.appendChild(overlay)

    // Cleanup injected styles when modal is removed
    const cleanup = () => {
        styleEl.remove()
    }
    activeCloseHandler = cleanup

    return overlay
}

function removeModal(): void {
    if (activeModalElement) {
        activeModalElement.remove()
        activeModalElement = null
    }
    if (activeCloseHandler) {
        activeCloseHandler()
        activeCloseHandler = null
    }
    activeWalletPickerInstance = null
}

const awaitWalletPickerSelection = (
    picker: WalletPicker,
    overlay: HTMLElement
): Promise<WalletPickerResult> => {
    return new Promise<WalletPickerResult>((resolve, reject) => {
        let settled = false

        const cleanup = (): void => {
            removeModal()
        }

        const onResult = (event: Event): void => {
            if (settled) return
            const detail = (event as CustomEvent).detail as Record<
                string,
                unknown
            >
            settled = true
            cleanup()
            resolve({
                providerId: detail.providerId as string,
                name: detail.name as string,
                type: detail.walletType as string,
                url: detail.url as string | undefined,
                reuseGlobalWalletPopup: detail.reuseGlobalWalletPopup as
                    | boolean
                    | undefined,
            })
        }

        const onClose = (): void => {
            if (settled) return
            settled = true
            cleanup()
            reject(new Error('User closed the wallet picker'))
        }

        const onKeyDown = (e: KeyboardEvent): void => {
            if (e.key === 'Escape' && !settled) {
                settled = true
                cleanup()
                reject(new Error('User closed the wallet picker'))
            }
        }

        const onOverlayClick = (e: MouseEvent): void => {
            if (e.target === overlay && !settled) {
                settled = true
                cleanup()
                reject(new Error('User closed the wallet picker'))
            }
        }

        picker.addEventListener('wallet-picker-result', onResult, {
            once: true,
        })
        picker.addEventListener('wallet-picker-close', onClose, { once: true })
        overlay.addEventListener('keydown', onKeyDown)
        overlay.addEventListener('click', onOverlayClick)
    })
}

export const waitForWalletPickerRetrySelection =
    async (): Promise<WalletPickerResult> => {
        const picker = activeWalletPickerInstance
        const overlay = activeModalElement
        if (!picker || !overlay) {
            throw new Error('Wallet picker is not open')
        }

        return await awaitWalletPickerSelection(picker, overlay)
    }

/**
 * Opens a wallet picker modal and resolves with the user's selection.
 *
 * Wallet entries are passed via localStorage and the user's choice is
 * communicated back via CustomEvent on the picker element.
 */
export async function pickWallet(
    entries: WalletPickerEntry[]
): Promise<WalletPickerResult> {
    localStorage.setItem(
        'splice_wallet_picker_entries',
        JSON.stringify(entries)
    )

    const picker = new WalletPicker()
    activeWalletPickerInstance = picker

    const overlay = buildModal(picker)
    picker.render()

    // Focus the modal for keyboard events
    overlay.setAttribute('tabindex', '-1')
    overlay.focus()

    return await awaitWalletPickerSelection(picker, overlay)
}
