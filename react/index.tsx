import lscache from 'lscache'
import React, { useCallback, useEffect } from 'react'
import type { FC } from 'react'
import { FormattedMessage } from 'react-intl'

import init from './payment'

const Root: FC = () => {
  const retryCallback = useCallback(() => {
    window.location.reload()
  }, [])

  const clearCacheCallback = useCallback(() => {
    lscache.flush()
    window.location.reload()
  }, [])

  useEffect(() => {
    init()
  }, [])

  return (
    <section className="container">
      <h2 id="container-title" className="center">
        <FormattedMessage id="instore/waiting-payment-conection" />
      </h2>

      <form id="extra-info" className="extra-info hidden" />

      <div className="result">
        <h3 className="">
          <FormattedMessage id="instore/system-actions" />
        </h3>
        <div id="result" />
        <div className="actions">
          <button id="retry" onClick={retryCallback}>
            <FormattedMessage id="instore/retry" />
          </button>
          <button id="clear-cache" onClick={clearCacheCallback}>
            <FormattedMessage id="instore/clear-cache" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default Root
