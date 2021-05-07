import lscache from 'lscache'
import React, { useCallback, useEffect } from 'react'
import type { FC } from 'react'
import { FormattedMessage } from 'react-intl'

import './styles.global.css'
import { clearLogs } from './utils/log'
import { initPayment, initRefund } from './payment'
import type {
  ContextParams,
  PaymentParams,
  RefundParams,
  ResponsePaymentData,
  ResponseRefundData,
  PaymentError,
} from './params'
import {
  listenForNewParams,
  getParamsFromCurrentUrl,
  sendResponse,
} from './params'

const start = (params: ContextParams) => {
  clearLogs()

  if (params.action === 'payment') {
    initPayment(params as PaymentParams)
      .then((data: ResponsePaymentData) => {
        sendResponse({ type: 'payment-success', data })
      })
      .catch((error: PaymentError) => {
        sendResponse({
          type: 'payment-error',
          data: {
            paymentId: params.paymentId,
            cardBrandName: '',
            firstDigits: '',
            lastDigits: '',
            acquirerName: '',
            tid: '',
            acquirerAuthorizationCode: '',
            nsu: '',
            merchantReceipt: '',
            customerReceipt: '',
            responsecode: error.responsecode ?? 1,
            reason: error.message,
          },
        })
      })
  } else if (params.action === 'payment-reversal') {
    initRefund(params as RefundParams)
      .then((data: ResponseRefundData) => {
        sendResponse({ type: 'payment-reversal-success', data })
      })
      .catch((error: PaymentError) => {
        sendResponse({
          type: 'payment-reversal-error',
          data: {
            paymentId: params.paymentId,
            paymentAcquirerAuthorizationCode: '',
            acquirerAuthorizationCode: '',
            merchantReceipt: '',
            customerReceipt: '',
            responsecode: error.responsecode ?? 1,
            reason: error.message,
          },
        })
      })
  }
}

const Root: FC = () => {
  useEffect(() => {
    start(getParamsFromCurrentUrl())

    return listenForNewParams(start)
  }, [])

  return (
    <section id="root-container" className="container bg-base">
      <div id="popup-container" />
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
          <button
            id="retry"
            onClick={() => {
              window.location.reload()
            }}
          >
            <FormattedMessage id="store/retry" />
          </button>
          <button
            id="clear-cache"
            onClick={() => {
              lscache.flush()
              window.location.reload()
            }}
          >
            <FormattedMessage id="store/clear-cache" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default Root
