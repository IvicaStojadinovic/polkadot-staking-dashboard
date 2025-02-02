// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChartPie } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTooltip } from 'contexts/Tooltip'
import { TooltipTrigger } from 'library/ListItem/Wrappers'
import { useTranslation } from 'react-i18next'

export const RewardShare = ({ share }: { share: number }) => {
  const { t } = useTranslation('pages')
  const { setTooltipTextAndOpen } = useTooltip()

  const tooltipText = t('decentralization.nominationShareInRewards')

  return (
    <div className="label">
      <TooltipTrigger
        className="tooltip-trigger-element"
        data-tooltip-text={tooltipText}
        onMouseMove={() => setTooltipTextAndOpen(tooltipText)}
      />
      <FontAwesomeIcon icon={faChartPie} style={{ marginRight: '0.25rem' }} />
      {share}%{' '}
    </div>
  )
}
