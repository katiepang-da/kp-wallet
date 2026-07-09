// Copyright (c) 2025-2026 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import { css, html, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import './back-link.js'
import { BaseElement } from '../internal/base-element.js'
import { PublicNetwork, Idp } from '@canton-network/core-wallet-user-rpc-client'
import cantonLogo from '../../images/logos/canton-logo.png'

/** Emitted when the user clicks the Connect button */
export class LoginConnectEvent extends Event {
    constructor(
        public selectedNetwork: PublicNetwork,
        public selectedIdp: Idp,
        public clientId: string
    ) {
        super('login-connect', { bubbles: true, composed: true })
    }
}

/** Emitted when the user clicks the Back link */
export class LoginBackEvent extends Event {
    constructor() {
        super('login-back', {
            bubbles: true,
            composed: true,
            cancelable: true,
        })
    }
}

@customElement('wg-login-form')
export class WgLoginForm extends BaseElement {
    /** Available networks to show in the dropdown */
    @property({ type: Array }) networks: PublicNetwork[] = []

    /** Available identity providers */
    @property({ type: Array }) idps: Idp[] = []

    /** IDs of networks to show in the "Recommended" section */
    @property({ type: Array }) recommendedNetworkIds: string[] = []

    @property({ type: Boolean }) connecting = false
    @property({ type: String }) backHref = '/'

    @state() accessor selectedNetwork: PublicNetwork | null = null
    @state() accessor selectedIdp: Idp | null = null
    @state() accessor message: string | null = null
    @state() accessor messageType: 'error' | 'info' | null = null

    static styles = [
        BaseElement.styles,
        css`
            :host {
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100dvh;
                padding: 1rem;
                box-sizing: border-box;
            }

            .modal-card {
                width: 100%;
                max-width: 420px;
                background: var(--wg-surface);
                border-radius: 16px;
                box-shadow: var(--wg-shadow-lg);
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .top-bar {
                display: flex;
                align-items: center;
                gap: 0.625rem;
                padding: 1rem 1.25rem 0;
            }

            .top-left {
                display: flex;
                align-items: center;
                gap: 0.625rem;
                flex: 1;
                min-width: 0;
            }

            .back-btn {
                border: none;
                background: transparent;
                color: var(--wg-accent);
                font-size: var(--wg-font-size-sm);
                font-weight: var(--wg-font-weight-medium);
                cursor: pointer;
                padding: 0.25rem 0;
                display: inline-flex;
                align-items: center;
                gap: 0.25rem;
                white-space: nowrap;
                flex-shrink: 0;
                transition: opacity 0.15s ease;
            }

            .back-btn:hover {
                opacity: 0.75;
            }

            .back-arrow {
                display: inline-flex;
                align-items: center;
                font-size: 1.1em;
                line-height: 1;
            }

            .top-logo {
                width: 28px;
                height: 28px;
                object-fit: contain;
                display: block;
                flex-shrink: 0;
            }

            .top-title {
                font-size: var(--wg-font-size-lg);
                font-weight: var(--wg-font-weight-bold);
                color: var(--wg-text);
                margin: 0;
                flex: 1;
                min-width: 0;
            }

            .content {
                padding: 1rem 1.25rem 0;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }

            .section-title {
                font-size: var(--wg-font-size-xs);
                font-weight: var(--wg-font-weight-semibold);
                color: var(--wg-text-secondary);
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin: 0.5rem 0 0.375rem;
            }

            .network-item {
                width: 100%;
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1rem;
                border: 1px solid var(--wg-border);
                border-radius: var(--wg-radius-lg);
                background: var(--wg-input-bg);
                cursor: pointer;
                transition:
                    border-color 0.15s ease,
                    box-shadow 0.15s ease;
                text-align: left;
                font: inherit;
                color: var(--wg-text);
                box-sizing: border-box;
            }

            .network-item:hover {
                border-color: var(--wg-accent);
            }

            .network-item.selected {
                border-color: var(--wg-accent);
                box-shadow: 0 0 0 3px rgba(var(--wg-accent-rgb), 0.15);
                background: rgba(var(--wg-accent-rgb), 0.04);
            }

            .network-item:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .network-item-body {
                flex: 1;
                min-width: 0;
            }

            .network-item-name {
                font-size: var(--wg-font-size-sm);
                font-weight: var(--wg-font-weight-semibold);
                display: block;
                line-height: 1.3;
            }

            .network-item-desc {
                font-size: var(--wg-font-size-xs);
                color: var(--wg-text-secondary);
                display: block;
                line-height: 1.3;
                margin-top: 0.125rem;
            }

            .network-check {
                width: 18px;
                height: 18px;
                border-radius: 50%;
                border: 2px solid var(--wg-border);
                flex: 0 0 auto;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: border-color 0.15s ease;
            }

            .network-check.selected {
                border-color: var(--wg-accent);
                background: var(--wg-accent);
            }

            .network-check.selected::after {
                content: '';
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: var(--wg-primary-text);
            }

            .section-divider {
                height: 1px;
                background: var(--wg-border);
                margin: 0.125rem 0;
            }

            .client-id-input {
                width: 100%;
                border: 1px solid var(--wg-border);
                border-radius: var(--wg-radius-md);
                background: var(--wg-input-bg);
                padding: 0.625rem 0.75rem;
                font: inherit;
                font-size: var(--wg-font-size-sm);
                line-height: var(--bs-body-line-height);
                outline: none;
                box-sizing: border-box;
            }

            .client-id-input:focus {
                border-color: var(--wg-input-border-focus);
                box-shadow: 0 0 0 3px rgba(var(--wg-accent-rgb), 0.12);
            }

            .footer {
                padding: 1rem 1.25rem;
            }

            .connect-btn {
                padding: 0.7rem 1.25rem;
                font-size: var(--wg-font-size-sm);
                font-weight: var(--wg-font-weight-semibold);
            }
        `,
    ]

    private get recommendedNetworks(): PublicNetwork[] {
        return this.networks.filter((n) =>
            this.recommendedNetworkIds.includes(n.id)
        )
    }

    private get otherNetworks(): PublicNetwork[] {
        return this.networks.filter(
            (n) => !this.recommendedNetworkIds.includes(n.id)
        )
    }

    protected updated(changedProperties: PropertyValues<this>) {
        super.updated(changedProperties)

        if (changedProperties.has('networks') && !this.selectedNetwork) {
            const recommended = this.recommendedNetworks
            const preferred =
                recommended.length > 0 ? recommended : this.networks

            const index = preferred.findIndex(
                (network) => network.authMethod !== 'client_credentials'
            )

            if (index >= 0) {
                this.selectNetwork(preferred[index])
            } else if (preferred.length > 0) {
                this.selectNetwork(preferred[0])
            }
        }
    }

    private selectNetwork(network: PublicNetwork) {
        this.selectedNetwork = network
        this.selectedIdp =
            this.idps.find((idp) => idp.id === network.identityProviderId) ??
            null
        this.message = null
    }

    private handleConnect() {
        this.message = null

        if (!this.selectedNetwork) {
            this.messageType = 'error'
            this.message = 'Please select a network before connecting.'
            return
        }

        const idp = this.idps.find(
            (candidate) =>
                candidate.id === this.selectedNetwork?.identityProviderId
        )

        if (!idp) {
            this.messageType = 'error'
            this.message = 'Identity provider misconfigured for this network.'
            return
        }

        const clientId =
            (
                this.renderRoot.querySelector(
                    '#client-id'
                ) as HTMLInputElement | null
            )?.value || this.selectedNetwork.clientId

        this.dispatchEvent(
            new LoginConnectEvent(this.selectedNetwork, idp, clientId || '')
        )
    }

    /** Set a status message on the form (e.g. "Redirecting...") */
    setMessage(message: string, type: 'error' | 'info') {
        this.message = message
        this.messageType = type
    }

    /** Clear the status message */
    clearMessage() {
        this.message = null
        this.messageType = null
    }

    private renderNetworkItem(network: PublicNetwork) {
        const isSelected = this.selectedNetwork?.id === network.id
        const disabled =
            this.connecting || network.authMethod === 'client_credentials'

        return html`
            <button
                type="button"
                class="network-item ${isSelected ? 'selected' : ''}"
                ?disabled=${disabled}
                @click=${() => this.selectNetwork(network)}
            >
                <div class="network-item-body">
                    <span class="network-item-name">${network.name}</span>
                    ${network.description
                        ? html`<span class="network-item-desc"
                              >${network.description}</span
                          >`
                        : ''}
                </div>
                <div
                    class="network-check ${isSelected ? 'selected' : ''}"
                ></div>
            </button>
        `
    }

    private handleBack() {
        this.dispatchEvent(new LoginBackEvent())
    }

    protected render() {
        const recommended = this.recommendedNetworks
        const other = this.otherNetworks
        const hasRecommended = recommended.length > 0

        return html`
            <div class="modal-card">
                <div class="top-bar">
                    <div class="top-left">
                        <button
                            type="button"
                            class="back-btn"
                            @click=${this.handleBack}
                        >
                            <span class="back-arrow">&larr;</span>
                            Back
                        </button>
                        <img
                            class="top-logo"
                            src=${cantonLogo}
                            alt="Canton logo"
                        />
                        <h1 class="top-title">Wallet Gateway</h1>
                    </div>
                </div>

                <div class="content">
                    ${hasRecommended
                        ? html`
                              <p class="section-title">Recommended</p>
                              ${recommended.map((n) =>
                                  this.renderNetworkItem(n)
                              )}
                              ${other.length > 0
                                  ? html`<div class="section-divider"></div>`
                                  : ''}
                          `
                        : ''}
                    ${other.length > 0
                        ? html`
                              <p class="section-title">Other</p>
                              ${other.map((n) => this.renderNetworkItem(n))}
                          `
                        : ''}
                    ${this.selectedIdp?.type === 'self_signed'
                        ? html`
                              <label
                                  class="form-label fw-semibold text-body mt-2 mb-1"
                                  for="client-id"
                                  >Client ID</label
                              >
                              <input
                                  id="client-id"
                                  class="client-id-input form-control"
                                  type="text"
                                  .value=${this.selectedNetwork?.clientId || ''}
                                  ?disabled=${this.connecting}
                              />
                          `
                        : null}
                    ${this.message
                        ? html`<div
                              class="alert ${this.messageType === 'error'
                                  ? 'alert-danger'
                                  : 'alert-info'} py-2 px-3 small mt-1 mb-0"
                              role="alert"
                          >
                              ${this.message}
                          </div>`
                        : ''}
                </div>

                <div class="footer">
                    <button
                        class="connect-btn btn btn-primary w-100 rounded-pill"
                        @click=${this.handleConnect}
                        ?disabled=${this.connecting || !this.selectedNetwork}
                    >
                        ${this.connecting ? 'Connecting…' : 'Connect'}
                    </button>
                </div>
            </div>
        `
    }
}
