import lscache from 'lscache'
import React, { useCallback, useEffect } from 'react'
import type { FC } from 'react'
import { FormattedMessage } from 'react-intl'

import './styles.global.css'
import { clearLogs } from './utils/log'
import init from './payment'

const start = () => {
  clearLogs()

  init()
}

const Root: FC = () => {
  const retryCallback = useCallback(() => {
    window.location.reload()
  }, [])

  const clearCacheCallback = useCallback(() => {
    lscache.flush()
    window.location.reload()
  }, [])

  useEffect(() => {
    start()
  }, [])

  return (
    <section className="container bg-base">
      <h2 id="container-title" className="center">
        <FormattedMessage id="store/waiting-payment-conection" />
      </h2>

      <form id="extra-info" className="extra-info hidden" />

      <div className="result">
        <h3>
          <FormattedMessage id="store/system-actions" />
        </h3>
        <div id="result" />
        <div className="actions">
          <button id="retry" onClick={retryCallback}>
            <FormattedMessage id="store/retry" />
          </button>
          <button id="clear-cache" onClick={clearCacheCallback}>
            <FormattedMessage id="store/clear-cache" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default Root
