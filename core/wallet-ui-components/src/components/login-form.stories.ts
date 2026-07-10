// Copyright (c) 2025-2026 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import type { Meta, StoryObj } from '@storybook/web-components-vite'
import { html } from 'lit'
import type {
    PublicNetwork,
    Idp,
} from '@canton-network/core-wallet-user-rpc-client'

import './login-form'

const meta: Meta = {
    title: 'WgLoginForm',
}

export default meta

const sampleIdps: Idp[] = [
    { id: 'idp1', type: 'oauth', issuer: 'https://idp.example/oauth' },
    { id: 'idp2', type: 'self_signed', issuer: 'unsafe-issuer' },
]

const sampleNetworks: PublicNetwork[] = [
    {
        id: 'canton:mainnet',
        name: 'Canton Mainnet',
        description: 'Canton main network',
        identityProviderId: 'idp1',
        ledgerApi: 'https://ledger.mainnet.canton.io',
        authMethod: 'authorization_code',
        clientId: 'wk-service-account',
        scope: 'openid daml_ledger_api offline_access',
        audience: 'https://daml.com/jwt/aud/participant/participant1',
    },
    {
        id: 'canton:testnet',
        name: 'Canton Testnet',
        description: 'Canton test network',
        identityProviderId: 'idp1',
        ledgerApi: 'https://ledger.testnet.canton.io',
        authMethod: 'authorization_code',
        clientId: 'wk-service-account',
        scope: 'openid daml_ledger_api offline_access',
        audience: 'https://daml.com/jwt/aud/participant/participant1',
    },
    {
        id: 'canton:local',
        name: 'Local Network',
        description: 'Local development network',
        identityProviderId: 'idp2',
        ledgerApi: 'https://localhost:5001',
        authMethod: 'self_signed',
        clientId: 'wk-service-account',
    },
]

function onConnect(e: Event) {
    console.log('login-connect', e)
}

function onBack(e: Event) {
    console.log('login-back', e)
}

export const Default: StoryObj = {
    render: () => html`
        <wg-login-form
            .networks=${sampleNetworks}
            .idps=${sampleIdps}
            .recommendedNetworkIds=${['canton:mainnet', 'canton:testnet']}
            @login-connect=${onConnect}
            @login-back=${onBack}
        ></wg-login-form>
    `,
}

export const AllRecommended: StoryObj = {
    render: () => html`
        <wg-login-form
            .networks=${sampleNetworks}
            .idps=${sampleIdps}
            .recommendedNetworkIds=${[
                'canton:mainnet',
                'canton:testnet',
                'canton:local',
            ]}
            @login-connect=${onConnect}
            @login-back=${onBack}
        ></wg-login-form>
    `,
}

export const NoRecommended: StoryObj = {
    render: () => html`
        <wg-login-form
            .networks=${sampleNetworks}
            .idps=${sampleIdps}
            .recommendedNetworkIds=${[]}
            @login-connect=${onConnect}
            @login-back=${onBack}
        ></wg-login-form>
    `,
}

export const SelfSignedSelected: StoryObj = {
    render: () => {
        // Pre-select the self-signed network by waiting for the element to render
        const onConnectHandler = (e: Event) => console.log('login-connect', e)
        return html`
            <wg-login-form
                .networks=${sampleNetworks}
                .idps=${sampleIdps}
                .recommendedNetworkIds=${['canton:mainnet', 'canton:testnet']}
                @login-connect=${onConnectHandler}
                @login-back=${onBack}
            ></wg-login-form>
        `
    },
    play: async ({ canvasElement }) => {
        const el = canvasElement.querySelector('wg-login-form')!
        // Select the self-signed network to show the Client ID input
        const buttons = el.shadowRoot!.querySelectorAll('button.network-item')
        // Last button should be "Local Network" (self_signed)
        const localBtn = buttons[buttons.length - 1] as HTMLButtonElement
        localBtn.click()
    },
}

export const Connecting: StoryObj = {
    render: () => html`
        <wg-login-form
            .networks=${sampleNetworks}
            .idps=${sampleIdps}
            .recommendedNetworkIds=${['canton:mainnet', 'canton:testnet']}
            .connecting=${true}
            @login-connect=${onConnect}
            @login-back=${onBack}
        ></wg-login-form>
    `,
}

export const Empty: StoryObj = {
    render: () => html`
        <wg-login-form
            .networks=${[]}
            .idps=${sampleIdps}
            .recommendedNetworkIds=${[]}
            @login-connect=${onConnect}
            @login-back=${onBack}
        ></wg-login-form>
    `,
}
