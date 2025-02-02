// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffectIgnoreInitial } from '@w3ux/hooks'
import { setStateWithRef } from '@w3ux/utils'
import type { Plugin } from 'config/plugins'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useNetwork } from 'contexts/Network'
import { Subscan } from 'controllers/Subscan'
import type { ReactNode } from 'react'
import { createContext, useContext, useRef, useState } from 'react'
import * as defaults from './defaults'
import type { PluginsContextInterface } from './types'
import { getAvailablePlugins } from './Utils'

export const PluginsContext = createContext<PluginsContextInterface>(
  defaults.defaultPluginsContext
)

export const usePlugins = () => useContext(PluginsContext)

export const PluginsProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useNetwork()
  const { isReady, activeEra } = useApi()
  const { activeAccount } = useActiveAccounts()

  // Store the currently active plugins.
  const [plugins, setPlugins] = useState<Plugin[]>(getAvailablePlugins())
  const pluginsRef = useRef(plugins)

  // Toggle a plugin.
  const togglePlugin = (key: Plugin) => {
    let localPlugins = [...plugins]
    const found = localPlugins.find((p) => p === key)

    if (found) {
      localPlugins = localPlugins.filter((p) => p !== key)
    } else {
      localPlugins.push(key)
    }

    localStorage.setItem('plugins', JSON.stringify(localPlugins))
    setStateWithRef(localPlugins, setPlugins, pluginsRef)
  }

  // Check if a plugin is currently enabled.
  const pluginEnabled = (key: Plugin) => pluginsRef.current.includes(key)

  // Reset payouts on Subscan plugin not enabled. Otherwise fetch payouts.
  useEffectIgnoreInitial(() => {
    if (!plugins.includes('subscan')) {
      Subscan.resetData()
    } else if (isReady && !activeEra.index.isZero()) {
      Subscan.network = network
      if (activeAccount) {
        Subscan.handleFetchPayouts(activeAccount)
      }
    }
  }, [plugins.includes('subscan'), isReady, network, activeAccount, activeEra])

  return (
    <PluginsContext.Provider
      value={{
        togglePlugin,
        pluginEnabled,
        plugins: pluginsRef.current,
      }}
    >
      {children}
    </PluginsContext.Provider>
  )
}
