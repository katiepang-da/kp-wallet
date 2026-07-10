// Copyright (c) 2025-2026 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { css } from 'lit'
import { BaseElement } from '../internal/base-element'
import { cssToString } from '../utils'
import {
    BrowserPlatform,
    WalletPickerEntry,
    WalletPickerSuggestedEntry,
} from '@canton-network/core-types'

export type {
    WalletPickerEntry,
    WalletPickerResult,
} from '@canton-network/core-types'

const SUBSTITUTABLE_CSS = cssToString([
    BaseElement.styles,
    css`
        * {
            box-sizing: border-box;
            font-family: var(--wg-theme-font-family);
            color: var(--wg-theme-text-color);
        }

        :host {
            display: flex;
            flex-direction: column;
            height: 100%;
            border-radius: 16px;
            overflow: hidden;
            background-color: var(--wg-theme-background-color);
            background-image:
                linear-gradient(
                    90deg,
                    rgba(0, 0, 0, 0.04) 1px,
                    transparent 1px
                ),
                linear-gradient(0deg, rgba(0, 0, 0, 0.04) 1px, transparent 1px);
            background-size:
                25px 25px,
                25px 25px;
        }

        .view-container {
            width: 100%;
            flex: 1;
            min-height: 0;
            max-height: 100%;
            display: flex;
            flex-direction: column;
            box-shadow: var(--wg-shadow-lg, 0 14px 28px rgba(15, 23, 42, 0.12));
        }

        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 24px 12px;
        }

        .header-title {
            font-weight: 600;
            font-size: large;
        }

        .header-close-btn {
            border: none;
            background: transparent;
            padding: 0;
            color: var(--wg-theme-text-color);
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
        }

        .header-close-btn:hover {
            color: var(--wg-theme-text-secondary);
        }

        .header-close-btn svg {
            width: 18px;
            height: 18px;
        }

        .header-back-btn {
            border: none;
            background: transparent;
            padding: 0;
            color: var(--wg-theme-text-color);
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
        }

        .header-back-btn:hover {
            color: var(--wg-theme-text-secondary);
        }

        .header-back-btn svg {
            width: 18px;
            height: 18px;
        }

        .wallet-list {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 4px 24px 0;
            min-height: 0;
            margin-bottom: 16px;
        }

        .wallet-suggested-card {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
            padding: 14px 12px;
            border-radius: 8px;
            background: rgb(255 255 255 / 80%);
            border: 1px solid transparent;
            box-shadow:
                0 2px 6px rgba(0, 0, 0, 0.06),
                0 4px 12px rgba(0, 0, 0, 0.04);
            transition: all 0.15s ease;
            width: 100%;
            text-align: left;
            margin-bottom: 8px;
            opacity: 0.9;
            position: relative;
        }

        .wallet-suggested-card::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 8px;
            background:
                radial-gradient(
                    ellipse 120% 100% at calc(var(--mx, 10) * 1%)
                        calc(var(--my, 40) * 1%),
                    rgba(124, 58, 237, 0.12) 0%,
                    transparent 50%
                ),
                radial-gradient(
                    ellipse 100% 120% at calc(100% - var(--mx, 85) * 1%)
                        calc(var(--my, 60) * 1%),
                    rgba(124, 58, 237, 0.12) 0%,
                    transparent 50%
                ),
                radial-gradient(
                    ellipse 80% 80% at 50% 80%,
                    rgba(0, 0, 0, 0.06) 0%,
                    transparent 50%
                );
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
            z-index: -1;
        }

        .wallet-suggested-card:not(
                .wallet-suggested-card-disabled
            ):hover::before {
            opacity: 1;
        }

        .wallet-suggested-card.wallet-suggested-card-disabled {
            opacity: 0.6;
            background: var(--wg-theme-border-color);
            border-color: transparent;
            box-shadow: none;
        }

        .wallet-suggested-card:not(.wallet-suggested-card-disabled):hover {
            border-color: rgba(0, 0, 0, 0.08);
            box-shadow:
                -8px -8px 20px rgba(255, 255, 255, 0.95),
                10px 10px 28px rgba(0, 0, 0, 0.16);
        }

        .btn-secondary.wallet-install-btn {
            text-decoration: none;
            padding: 2px 4px;
            font-size: 12px;
            background: var(--wg-theme-surface-color);
        }

        .wallet-install-buttons
            > .btn-secondary.wallet-install-btn:not(:first-child) {
            margin-left: 4px;
        }

        .wallet-install-btn:hover {
            background: var(--wg-theme-surface-hover);
            border-color: var(--wg-theme-accent-color);
        }

        .wallet-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 12px;
            border-radius: 8px;
            background: rgb(255 255 255 / 80%);
            border: 1px solid transparent;
            box-shadow:
                0 2px 6px rgba(0, 0, 0, 0.06),
                0 4px 12px rgba(0, 0, 0, 0.04);
            cursor: pointer;
            transition: all 0.15s ease;
            width: 100%;
            text-align: left;
            margin-bottom: 8px;
            opacity: 0.9;
            position: relative;
        }

        .wallet-card::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 8px;
            background:
                radial-gradient(
                    ellipse 120% 100% at calc(var(--mx, 10) * 1%)
                        calc(var(--my, 40) * 1%),
                    rgba(124, 58, 237, 0.12) 0%,
                    transparent 50%
                ),
                radial-gradient(
                    ellipse 100% 120% at calc(100% - var(--mx, 85) * 1%)
                        calc(var(--my, 60) * 1%),
                    rgba(124, 58, 237, 0.12) 0%,
                    transparent 50%
                ),
                radial-gradient(
                    ellipse 80% 80% at 50% 80%,
                    rgba(0, 0, 0, 0.06) 0%,
                    transparent 50%
                );
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
            z-index: -1;
        }

        .wallet-card:hover::before {
            opacity: 1;
        }

        .wallet-card:hover {
            border-color: rgba(0, 0, 0, 0.08);
            box-shadow:
                -8px -8px 20px rgba(255, 255, 255, 0.95),
                10px 10px 28px rgba(0, 0, 0, 0.16);
        }

        .wallet-card:focus-visible {
            outline: 2px solid var(--wg-theme-accent-color);
            outline-offset: 2px;
        }

        .wallet-card:active {
            transform: scale(0.99);
        }

        .wallet-icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: var(--wg-theme-icon-bg);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            overflow: hidden;
        }

        .wallet-icon img {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            object-fit: cover;
        }

        .wallet-icon svg {
            width: 22px;
            height: 22px;
            color: var(--wg-theme-text-secondary);
        }

        .wallet-name {
            flex: 1;
            min-width: 0;
            font-size: 15px;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .wallet-remove-btn {
            border: none;
            background: transparent;
            color: var(--wg-theme-text-secondary);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: color 0.15s ease;
            flex-shrink: 0;
            padding: 0;
            width: 16px;
            height: 16px;
        }

        .wallet-remove-btn:hover {
            color: var(--wg-theme-error-color);
        }

        .wallet-remove-btn:focus-visible {
            outline: 2px solid var(--wg-theme-accent-color);
            outline-offset: 4px;
            border-radius: 4px;
        }

        .wallet-remove-btn svg {
            width: 16px;
            height: 16px;
        }

        .custom-url-section {
            padding: 8px 12px 16px;
        }

        .custom-url-label {
            position: relative;
            display: flex;
            align-items: center;
            gap: 6px;
            width: 100%;
            font-size: 11px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #928ca0;
            padding: 0 0 8px;
        }

        .suggested-title {
            margin-top: 24px;
        }

        .custom-url-label .info-wrap {
            display: inline-flex;
            align-items: center;
        }

        .custom-url-label .info-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 14px;
            height: 14px;
            color: var(--wg-theme-text-secondary);
            border: none;
            background: transparent;
            padding: 0;
            cursor: pointer;
        }

        .custom-url-label .info-icon:focus-visible {
            outline: 2px solid var(--wg-theme-accent-color);
            border-radius: 999px;
        }

        .custom-url-label .info-tooltip {
            position: absolute;
            bottom: calc(100% + 8px);
            left: 50%;
            transform: translateX(-50%);
            z-index: 20;
            width: max-content;
            max-width: min(320px, 90vw);
            padding: 8px 10px;
            border: none;
            border-radius: 10px;
            background: var(--wg-theme-primary-color);
            color: var(--wg-theme-primary-text-color);
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.22);
            font-size: 12px;
            font-weight: 500;
            line-height: 1.4;
            text-transform: none;
            letter-spacing: normal;
            white-space: normal;
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: opacity 0.12s ease;
        }

        .custom-url-label .info-wrap:hover .info-tooltip {
            opacity: 1;
            visibility: visible;
        }

        .custom-url-row {
            display: flex;
            align-items: center;
        }

        .custom-url-input-wrap {
            display: flex;
            align-items: center;
            flex: 1;
            border: 1px solid var(--wg-theme-border-color);
            border-radius: 8px;
            background: var(--wg-theme-surface-color);
            transition:
                border-color 0.15s,
                box-shadow 0.15s;
        }

        .custom-url-input-wrap:focus-within {
            border-color: var(--wg-theme-accent-color);
            box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.15);
        }

        .custom-url-input {
            flex: 1;
            padding: 10px 12px;
            border: none;
            outline: none;
            font-size: 14px;
            background: transparent;
            color: var(--wg-theme-text-color);
            min-width: 0;
        }

        .custom-url-input::placeholder {
            color: var(--wg-theme-text-secondary);
        }

        .btn-connect {
            background: transparent;
            color: var(--wg-theme-text-secondary);
            border: 1px solid var(--wg-theme-border-color);
            border-radius: 6px;
            padding: 5px 10px;
            margin-right: 5px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.15s;
            flex-shrink: 0;
        }

        .btn-connect:hover {
            background: var(--wg-theme-surface-hover);
            color: var(--wg-theme-text-color);
            border-color: var(--wg-theme-accent-color);
        }

        .btn-connect:disabled {
            opacity: 0.5;
            cursor: default;
        }

        .status-view {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 48px 24px;
            gap: 16px;
            text-align: center;
            flex: 1;
        }

        .status-view h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
        }

        .status-view p {
            margin: 0;
            font-size: 14px;
            color: var(--wg-theme-text-secondary);
        }

        .spinner {
            width: 36px;
            height: 36px;
            border: 3px solid var(--wg-theme-border-color);
            border-top-color: var(--wg-theme-accent-color);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }

        .success-icon {
            color: var(--wg-theme-success-color);
        }

        .error-icon {
            color: var(--wg-theme-error-color);
        }

        .btn-row {
            display: flex;
            gap: 8px;
            margin-top: 8px;
        }

        .btn-primary {
            background: var(--wg-theme-primary-color);
            color: var(--wg-theme-primary-text-color);
            border: none;
            border-radius: 8px;
            padding: 10px 24px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.15s;
        }

        .btn-primary:hover {
            background: var(--wg-theme-primary-hover);
        }

        .btn-secondary {
            background: transparent;
            color: var(--wg-theme-text-secondary);
            border: 1px solid var(--wg-theme-border-color);
            border-radius: 8px;
            padding: 10px 24px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
        }

        .empty-state {
            color: var(--wg-theme-text-secondary);
        }

        .connecting-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 16px 12px 40px 12px;
            gap: 4px;
        }

        .connecting-logo {
            position: relative;
            width: 72px;
            height: 72px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .connecting-logo::after {
            content: '';
            position: absolute;
            bottom: -12px;
            left: 50%;
            transform: translateX(-50%);
            width: 60%;
            height: 8px;
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.25);
            animation: shadow-pulse 2s ease-in-out infinite;
            pointer-events: none;
        }

        .connecting-logo-inner {
            width: 72px;
            height: 72px;
            border-radius: 16px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .connecting-logo-inner img {
            width: 72px;
            height: 72px;
            object-fit: cover;
        }

        .connecting-logo-inner svg {
            width: 48px;
            height: 48px;
            color: var(--wg-theme-text-secondary);
        }

        .connecting-logo.sweep .connecting-logo-inner {
            animation: float-load 2s ease-in-out infinite;
        }

        @keyframes float-load {
            0%,
            100% {
                transform: translateY(0) scale(1);
            }
            50% {
                transform: translateY(-12px) scale(1.08);
            }
        }

        @keyframes shadow-pulse {
            0%,
            100% {
                transform: translateX(-50%) scale(1);
                opacity: 0.8;
            }
            50% {
                transform: translateX(-50%) scale(0.6);
                opacity: 0.3;
            }
        }

        .connecting-title {
            font-size: 18px;
            font-weight: 500;
            color: var(--wg-theme-text-color);
            text-align: center;
            margin-top: 16px;
        }

        .connecting-desc {
            font-size: 14px;
            color: var(--wg-theme-text-secondary);
            text-align: center;
        }
    `,
])

/**
 * <swk-wallet-picker> — a wallet selection component modelled after PartyLayer's
 * WalletModal. Designed for on-page modal rendering.
 *
 * Communication:
 *   - Reads wallet entries from localStorage key `splice_wallet_picker_entries`
 *   - Dispatches a `wallet-picker-result` CustomEvent on selection
 *   - Dispatches a `wallet-picker-close` CustomEvent when it should be dismissed
 *
 * States: list → connecting → connected | error
 */
export class WalletPicker extends HTMLElement {
    static styles = SUBSTITUTABLE_CSS

    private readonly RECENT_KEY = 'splice_wallet_picker_recent'

    private entries: WalletPickerEntry[] = []
    private platform: BrowserPlatform | 'unsupported' = 'unsupported'
    private suggestedEntries: WalletPickerSuggestedEntry[] = []
    private recentGateways: { name: string; rpcUrl: string }[] = []
    private state: 'list' | 'connecting' | 'connected' | 'error' = 'list'
    private selectedEntry: WalletPickerEntry | null = null
    private errorMessage = ''

    private wcUri: string | null = null
    private wcQrDataUrl: string | null = null

    private readonly onMouseMove = (event: MouseEvent): void => {
        const rect = this.getBoundingClientRect()
        const x = ((event.clientX - rect.left) / rect.width) * 100
        const y = ((event.clientY - rect.top) / rect.height) * 100
        this.style.setProperty('--mx', String(x))
        this.style.setProperty('--my', String(y))
    }

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })

        const ctor = this.constructor as typeof HTMLElement & {
            styles?: string
        }
        if (ctor.styles) {
            const style = document.createElement('style')
            style.textContent = ctor.styles
            this.shadowRoot!.appendChild(style)
        }

        this.loadEntries()
        this.loadSuggestedEntries()
        this.recentGateways = this.loadRecentGateways()
        this.platform = this.detectBrowserPlatform()
    }

    // ── localStorage helpers (inlined so they survive .toString() serialisation) ──

    private loadRecentGateways(): { name: string; rpcUrl: string }[] {
        try {
            const raw = localStorage.getItem(this.RECENT_KEY)
            if (raw) return JSON.parse(raw)
        } catch {
            // ignore
        }
        return []
    }

    private saveRecentGateway(entry: { name: string; rpcUrl: string }): void {
        const recent = this.loadRecentGateways().filter(
            (r) => r.rpcUrl !== entry.rpcUrl
        )
        recent.unshift(entry)
        this.recentGateways = recent.slice(0, 5)
        localStorage.setItem(
            this.RECENT_KEY,
            JSON.stringify(this.recentGateways)
        )
    }

    private removeRecentGateway(rpcUrl: string): void {
        this.recentGateways = this.loadRecentGateways().filter(
            (r) => r.rpcUrl !== rpcUrl
        )

        if (this.recentGateways.length === 0) {
            localStorage.removeItem(this.RECENT_KEY)
        } else {
            localStorage.setItem(
                this.RECENT_KEY,
                JSON.stringify(this.recentGateways)
            )
        }

        this.render()
    }

    private loadEntries(): void {
        const stored = localStorage.getItem('splice_wallet_picker_entries')
        if (!stored) return
        try {
            this.entries = JSON.parse(stored)
        } catch {
            this.entries = []
        }
    }

    private loadSuggestedEntries(): void {
        const stored = localStorage.getItem(
            'splice_wallet_picker_suggested_entries'
        )
        if (!stored) return
        try {
            this.suggestedEntries = JSON.parse(stored)
        } catch {
            this.suggestedEntries = []
        }
    }

    private getAllEntries(): WalletPickerEntry[] {
        // Merge all entries into a single flat list:
        // 1. Registered entries (extensions + gateways from discovery)
        // 2. Recent gateways not already in the registered list
        const knownUrls = new Set(
            this.entries
                .filter((e) => e.type === 'remote' && e.url)
                .map((e) => e.url)
        )

        const recentEntries: WalletPickerEntry[] = this.recentGateways
            .filter((r) => !knownUrls.has(r.rpcUrl))
            .map((r) => ({
                providerId: 'remote:' + r.rpcUrl,
                name: r.name,
                type: 'remote' as const,
                url: r.rpcUrl,
                reuseGlobalWalletPopup: true,
            }))

        return [...this.entries, ...recentEntries]
    }

    private getSuggestedEntries(): WalletPickerSuggestedEntry[] {
        // We only want to show the following suggested entries:
        // 1. Extensions that are not already detected (i.e. not in entries list)
        const detectedEntries = this.getAllEntries()

        const entries = this.suggestedEntries.filter((entry) => {
            const alreadyInstalled = detectedEntries.some(
                (e) => e.providerId === entry.providerId
            )
            return !alreadyInstalled
        })

        // We then want to sort the list priority by:
        // 1. Extensions that are supported in the user's current browser
        // 2. Alphabetically by name

        return entries.sort((a, b) => {
            const aSupported = a.installUrls.some(
                (url) => url.platform === this.platform
            )
            const bSupported = b.installUrls.some(
                (url) => url.platform === this.platform
            )

            if (aSupported && !bSupported) return -1
            if (!aSupported && bSupported) return 1

            return a.name.localeCompare(b.name)
        })
    }

    private isRemovableEntry(entry: WalletPickerEntry): boolean {
        if (entry.type !== 'remote' || !entry.url) {
            return false
        }

        const isRegisteredEntry = this.entries.some(
            (knownEntry) =>
                knownEntry.type === 'remote' && knownEntry.url === entry.url
        )
        const isManualEntry = this.recentGateways.some(
            (recentEntry) => recentEntry.rpcUrl === entry.url
        )

        return isManualEntry && !isRegisteredEntry
    }

    // ── Actions ─────────────────────────────────────────────

    private selectWallet(entry: WalletPickerEntry): void {
        this.selectedEntry = entry
        this.state = 'connecting'
        this.render()

        this.dispatchEvent(
            new CustomEvent('wallet-picker-result', {
                detail: {
                    providerId: entry.providerId,
                    name: entry.name,
                    walletType: entry.type,
                    url: entry.url,
                    reuseGlobalWalletPopup: entry.reuseGlobalWalletPopup,
                },
                bubbles: true,
                composed: true,
            })
        )
    }

    private connectCustomUrl(rpcUrl: string): void {
        const trimmed = rpcUrl.trim()
        if (!trimmed) return

        this.selectWallet({
            providerId: 'remote:' + trimmed,
            name: trimmed,
            type: 'remote',
            url: trimmed,
            reuseGlobalWalletPopup: true,
        })
    }

    public setConnected(): void {
        this.state = 'connected'
        this.render()
        setTimeout(() => {
            this.dispatchEvent(
                new CustomEvent('wallet-picker-close', {
                    bubbles: true,
                    composed: true,
                })
            )
        }, 1200)
    }

    public setError(message: string): void {
        this.errorMessage = message
        this.state = 'error'
        this.render()
    }

    private goBackToList(): void {
        this.selectedEntry = null
        this.errorMessage = ''
        this.state = 'list'
        this.render()
    }

    // ── Rendering ──────────────────────────────────────────

    private renderHeader(showBack = false): HTMLElement {
        const header = this.el('div', '', { class: 'header' })

        if (showBack) {
            const backBtn = this.el('button', '', {
                class: 'header-back-btn',
                type: 'button',
                'aria-label': 'Back',
            })
            backBtn.innerHTML =
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg> Back'
            backBtn.addEventListener('click', () => {
                this.state = 'list'
                this.render()
            })
            header.appendChild(backBtn)
        } else {
            const title = this.el('span', 'Connect a Wallet', {
                class: 'header-title',
            })
            header.appendChild(title)
        }

        const closeBtn = this.el('button', '×', {
            class: 'header-close-btn',
            type: 'button',
            'aria-label': 'Close',
        })
        closeBtn.addEventListener('click', () => {
            this.dispatchEvent(
                new CustomEvent('wallet-picker-close', {
                    bubbles: true,
                    composed: true,
                })
            )
        })
        header.appendChild(closeBtn)

        return header
    }

    private renderWalletCard(entry: WalletPickerEntry): HTMLElement {
        const card = this.el('div', '', {
            class: 'wallet-card',
            role: 'button',
            tabindex: '0',
            'aria-label': `Connect to ${entry.name}`,
        })

        const icon = this.el('div', '', { class: 'wallet-icon' })
        if (entry.icon) {
            const img = this.el('img', '', { src: entry.icon, alt: entry.name })
            icon.appendChild(img)
        } else {
            icon.innerHTML =
                entry.type === 'browser'
                    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
                    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/><circle cx="12" cy="10" r="2"/></svg>'
        }
        card.appendChild(icon)

        card.appendChild(this.el('span', entry.name, { class: 'wallet-name' }))
        card.addEventListener('click', () => this.selectWallet(entry))

        if (this.isRemovableEntry(entry) && entry.url) {
            const removeButton = this.el('button', '', {
                class: 'wallet-remove-btn',
                type: 'button',
                'aria-label': `Remove custom wallet ${entry.name}`,
                title: `Remove custom wallet ${entry.name}`,
            })
            removeButton.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/></svg>'
            removeButton.addEventListener('click', (event: Event) => {
                event.stopPropagation()
                this.removeRecentGateway(entry.url!)
            })
            card.appendChild(removeButton)
        }

        return card
    }

    private renderSuggestedWalletCard(
        entry: WalletPickerSuggestedEntry
    ): HTMLElement {
        const isCustom = entry.installUrls.length === 0
        const existsForCurrentPlatform =
            !isCustom &&
            entry.installUrls.some(
                (install) => install.platform === this.platform
            )

        const className = isCustom
            ? 'wallet-suggested-card'
            : existsForCurrentPlatform
              ? 'wallet-suggested-card'
              : 'wallet-suggested-card wallet-suggested-card-disabled'

        const card = this.el('div', '', {
            class: className,
            tabindex: isCustom ? '-1' : '0',
            'aria-label': isCustom
                ? 'Custom wallet input'
                : `Install ${entry.name}`,
        })

        const icon = this.el('div', '', { class: 'wallet-icon' })
        if (entry.icon) {
            const img = this.el('img', '', { src: entry.icon, alt: entry.name })
            icon.appendChild(img)
        } else {
            icon.innerHTML =
                entry.type === 'browser'
                    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
                    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/><circle cx="12" cy="10" r="2"/></svg>'
        }
        card.appendChild(icon)

        card.appendChild(this.el('span', entry.name, { class: 'wallet-name' }))

        if (isCustom) {
            const wrap = this.el('div', '', { class: 'custom-url-input-wrap' })
            wrap.style.flex = '0 0 100%'
            const input = this.el('input', '', {
                class: 'custom-url-input',
                type: 'text',
                placeholder: 'Wallet API URL',
            })
            const addBtn = this.el('button', 'Connect', {
                class: 'btn-connect',
            })
            const doConnect = () => {
                const value = (input as HTMLInputElement).value
                if (value.trim()) {
                    this.connectCustomUrl(value)
                }
            }
            addBtn.addEventListener('click', doConnect)
            input.addEventListener('keydown', (e: Event) => {
                if ((e as KeyboardEvent).key === 'Enter') doConnect()
            })
            wrap.append(input, addBtn)
            card.appendChild(wrap)
            return card
        }

        const installButtons = this.el('div', '', {
            class: 'wallet-install-buttons',
        })

        // Sort the available install URLs by:
        // 1. The user's current detected browser
        // 2. Alphabetically
        const sortedInstallUrls = [...entry.installUrls].sort((a, b) => {
            const aIsCurrentBrowser = this.platform === a.platform
            const bIsCurrentBrowser = this.platform === b.platform

            if (aIsCurrentBrowser && !bIsCurrentBrowser) return -1
            if (!aIsCurrentBrowser && bIsCurrentBrowser) return 1

            return a.platform.localeCompare(b.platform)
        })

        for (const { url, platform } of sortedInstallUrls) {
            const badge = this.el('a', `Get for ${platform}`, {
                class: 'btn-secondary wallet-install-btn',
                href: url,
                rel: 'noopener',
                target: '_blank',
            })
            badge.addEventListener('click', (e: Event) => {
                e.stopPropagation()
                this.dispatchEvent(
                    new CustomEvent('wallet-picker-close', {
                        bubbles: true,
                        composed: true,
                    })
                )
            })
            installButtons.appendChild(badge)
        }

        card.appendChild(installButtons)

        return card
    }

    private renderList(): HTMLElement {
        const container = this.el('div', '', {
            class: 'view-container',
        })

        container.appendChild(this.renderHeader())

        const allEntries = this.getAllEntries()

        const list = this.el('div', '', { class: 'wallet-list' })

        if (allEntries.length === 0) {
            const empty = this.el('div', '', { class: 'status-view' })
            empty.appendChild(
                this.el('h3', 'No wallets available', { class: 'empty-state' })
            )
            empty.appendChild(
                this.el(
                    'p',
                    'Install a Canton wallet extension or enter a Wallet Gateway URL below.'
                )
            )
            list.appendChild(empty)
        } else {
            const otherTitle = this.el('div', 'Favorite', {
                class: 'custom-url-label',
            })
            list.appendChild(otherTitle)
            for (const entry of allEntries) {
                list.appendChild(this.renderWalletCard(entry))
            }
        }

        const suggestedEntries = this.getSuggestedEntries()

        if (suggestedEntries.length > 0) {
            const suggestedTitle = this.el('div', 'More Wallets', {
                class: 'custom-url-label suggested-title',
            })
            list.appendChild(suggestedTitle)

            for (const entry of suggestedEntries) {
                list.appendChild(this.renderSuggestedWalletCard(entry))
            }
        }

        container.appendChild(list)

        return container
    }

    private renderConnecting(): HTMLElement {
        const container = this.el('div', '', {
            class: 'view-container',
        })
        container.appendChild(this.renderHeader(true))

        const view = this.el('div', '', { class: 'status-view' })

        if (this.wcUri) {
            if (this.wcQrDataUrl) {
                const qrImg = this.el('img', '', {
                    src: this.wcQrDataUrl,
                    alt: 'QR Code',
                })
                qrImg.style.cssText =
                    'display:block;margin:0 auto 12px;width:200px;height:200px;border-radius:8px;'
                view.appendChild(qrImg)
            }

            view.appendChild(
                this.el(
                    'h3',
                    this.wcQrDataUrl
                        ? 'Or paste this URI in your wallet'
                        : 'Paste this URI in your wallet'
                )
            )

            const code = this.el('code', this.wcUri)
            code.style.cssText =
                'display:block;word-break:break-all;font-size:11px;' +
                'background:var(--wg-theme-background-color, #111);' +
                'padding:12px;border-radius:6px;margin:8px 0;' +
                'max-height:120px;overflow:auto;user-select:all;cursor:pointer;'
            view.appendChild(code)

            const uri = this.wcUri
            const copyBtn = this.el('button', 'Copy URI')
            copyBtn.style.cssText =
                'padding:8px 16px;border-radius:4px;border:none;' +
                'background:#646cff;color:white;cursor:pointer;font-size:14px;margin-top:4px;'
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(uri)
                copyBtn.innerText = 'Copied!'
                setTimeout(() => {
                    copyBtn.innerText = 'Copy URI'
                }, 2000)
            })
            view.appendChild(copyBtn)
        } else {
            const content = this.el('div', '', { class: 'connecting-content' })

            const logoSvg =
                this.selectedEntry?.type === 'browser'
                    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
                    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/><circle cx="12" cy="10" r="2"/></svg>'

            const logo = this.el('div', '', { class: 'connecting-logo sweep' })
            const logoInner = this.el('div', '', {
                class: 'connecting-logo-inner',
            })
            if (this.selectedEntry?.icon) {
                const img = this.el('img', '', {
                    src: this.selectedEntry.icon,
                    alt: this.selectedEntry.name,
                })
                logoInner.appendChild(img)
            } else {
                logoInner.innerHTML = logoSvg
            }
            logo.appendChild(logoInner)
            content.appendChild(logo)

            content.appendChild(
                this.el(
                    'div',
                    'Connecting to ' +
                        (this.selectedEntry?.name || 'wallet') +
                        '...',
                    { class: 'connecting-title' }
                )
            )
            content.appendChild(
                this.el(
                    'div',
                    'Approve the connection in your wallet to continue',
                    { class: 'connecting-desc' }
                )
            )
            view.appendChild(content)
        }

        container.appendChild(view)
        return container
    }

    private renderConnected(): HTMLElement {
        const container = this.el('div', '', {
            class: 'view-container',
        })
        container.appendChild(this.renderHeader())

        const view = this.el('div', '', { class: 'status-view' })

        const icon = this.el('div', '', { class: 'success-icon' })
        icon.innerHTML =
            '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
        view.appendChild(icon)

        view.appendChild(
            this.el(
                'h3',
                'Connected to ' + (this.selectedEntry?.name || 'wallet')
            )
        )
        container.appendChild(view)
        return container
    }

    private renderError(): HTMLElement {
        const container = this.el('div', '', {
            class: 'view-container',
        })
        container.appendChild(this.renderHeader())

        const view = this.el('div', '', { class: 'status-view' })

        const icon = this.el('div', '', { class: 'error-icon' })
        icon.innerHTML =
            '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>'
        view.appendChild(icon)

        view.appendChild(this.el('h3', 'Failed to connect'))
        view.appendChild(
            this.el('p', this.errorMessage || 'An unexpected error occurred')
        )

        const btnRow = this.el('div', '', { class: 'btn-row' })
        const retryBtn = this.el('button', 'Try Again', {
            class: 'btn-primary',
            type: 'button',
        })
        retryBtn.addEventListener('click', () => this.goBackToList())
        const cancelBtn = this.el('button', 'Cancel', {
            class: 'btn-secondary',
            type: 'button',
        })
        cancelBtn.addEventListener('click', () => {
            this.dispatchEvent(
                new CustomEvent('wallet-picker-close', {
                    bubbles: true,
                    composed: true,
                })
            )
        })
        btnRow.append(retryBtn, cancelBtn)
        view.appendChild(btnRow)

        container.appendChild(view)
        return container
    }

    render(): void {
        let content: HTMLElement
        switch (this.state) {
            case 'connecting':
                content = this.renderConnecting()
                break
            case 'connected':
                content = this.renderConnected()
                break
            case 'error':
                content = this.renderError()
                break
            default:
                content = this.renderList()
        }

        if (this.shadowRoot) {
            Array.from(this.shadowRoot.childNodes).forEach((node) => {
                if (!(node instanceof HTMLStyleElement)) {
                    this.shadowRoot!.removeChild(node)
                }
            })
            this.shadowRoot.appendChild(content)
        }
    }

    connectedCallback(): void {
        this.addEventListener('mousemove', this.onMouseMove)
        this.render()

        // Listen for WalletConnect URI from the adapter via postMessage
        window.addEventListener('message', (e) => {
            if (e.data?.type === 'wc-uri' && typeof e.data.uri === 'string') {
                this.wcUri = e.data.uri
                this.wcQrDataUrl = e.data.qrDataUrl ?? null
                if (this.state === 'connecting') this.render()
            }
        })
    }

    disconnectedCallback(): void {
        this.removeEventListener('mousemove', this.onMouseMove)
    }

    // ── DOM helpers ─────────────────────────────────────────

    private el<K extends keyof HTMLElementTagNameMap>(
        tag: K,
        text?: string,
        attrs: Record<string, string> = {}
    ): HTMLElementTagNameMap[K] {
        const element = document.createElement(tag)
        if (text) element.innerText = text
        for (const [key, val] of Object.entries(attrs)) {
            element.setAttribute(key, val)
        }
        return element
    }

    private detectBrowserPlatform(): BrowserPlatform | 'unsupported' {
        const userAgent = window.navigator.userAgent

        const isFirefox = /firefox/i.test(userAgent)
        const isChrome = /chrome|chromium|crios/i.test(userAgent)

        if (isFirefox) return 'firefox'
        if (isChrome) return 'chrome'

        return 'unsupported'
    }
}

customElements.define('swk-wallet-picker', WalletPicker)
