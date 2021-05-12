import type {
  PaymentParams,
  RefundParams,
  ResponsePaymentData,
  ResponseRefundData,
} from '../params'
import { PaymentError } from '../params'
import { logMsg, logError } from '../utils/log'

declare global {
  interface Window {
    paymentSuccess: VoidFunction
    paymentFail: VoidFunction
    refundSuccess: VoidFunction
    refundFail: VoidFunction
    popupClose: VoidFunction
  }
}

function getExampleOfPaymentSuccess(
  params: PaymentParams
): ResponsePaymentData {
  return {
    paymentId: params.paymentId,
    cardBrandName: 'VISA',
    firstDigits: '0123',
    lastDigits: '456789',
    acquirerName: 'my acquirer name',
    tid: '1234',
    acquirerAuthorizationCode: '1234',
    nsu: '1234',
    merchantReceipt: 'Card payment receipt to merchant',
    customerReceipt: 'Card payment receipt to customer',
    responsecode: 0,
    reason: '',
  }
}

function getExampleOfRefundSuccess(params: RefundParams): ResponseRefundData {
  return {
    paymentId: params.paymentId,
    paymentAcquirerAuthorizationCode: '1234',
    acquirerAuthorizationCode: '1234',
    merchantReceipt: 'Card refund receipt to merchant',
    customerReceipt: 'Card refund receipt to customer',
    responsecode: 0,
    reason: '',
  }
}

export async function initPayment(
  params: PaymentParams
): Promise<ResponsePaymentData> {
  logMsg('Payment starting')

  const rootContainer = document.querySelector('#popup-container')

  if (!rootContainer) {
    throw new PaymentError('No root container found')
  }

  rootContainer.innerHTML += `
    <div class="payment-popup">
      <div class="absolute top-0 right-0 pa3">
        <button id="success" onclick="popupClose()">
          CLOSE
        </button>
      </div>
      <div class="flex flex-column items-center justify-center popup-content-center">
        <p class="flex bg-white h3 ph3 items-center center justify-center mb0 w-50">
          Choose option to test inStore response
        </p>
        <div class="flex bg-white h3 ph3 items-center center justify-center mb0 w-50">
          <button id="success" onclick="paymentSuccess()">
            PAYMENT SUCCESS
          </button>
          <button id="fail" onclick="paymentFail()">
            PAYMENT FAIL
          </button>
        </div>
      </div>
    </div>
  `

  window.popupClose = () => {
    const elem = document.querySelector('.payment-popup')

    if (elem) {
      elem.parentNode?.removeChild(elem)
    }
  }

  return new Promise((res, rej) => {
    window.paymentSuccess = () => {
      const response = getExampleOfPaymentSuccess(params)

      logMsg(`Payment finished with response: ${JSON.stringify(response)}`)

      res(response)
    }

    window.paymentFail = () => {
      logError('Payment finished with an error')

      rej(new PaymentError('An error happened during payment'))
    }
  })
}

export async function initRefund(
  params: RefundParams
): Promise<ResponseRefundData> {
  logMsg('Refund starting')

  const rootContainer = document.querySelector('#popup-container')

  if (!rootContainer) {
    throw new PaymentError('No root container found')
  }

  rootContainer.innerHTML += `
    <div class="payment-popup">
      <div class="absolute top-0 right-0 pa3">
        <button id="success" onclick="popupClose()">
          CLOSE
        </button>
      </div>
      <div class="flex flex-column items-center justify-center popup-content-center">
        <p class="flex bg-white h3 ph3 items-center center justify-center mb0 w-50">
          Choose option to test inStore response
        </p>
        <div class="flex bg-white h3 ph3 items-center center justify-center mb0 w-50">
          <button id="success" onclick="refundSuccess()">
            REFUND SUCCESS
          </button>
          <button id="fail" onclick="refundFail()">
          REFUND FAIL
          </button>
        </div>
      </div>
    </div>
  `

  window.popupClose = () => {
    const elem = document.querySelector('.payment-popup')

    console.log('>>> popupClose', elem)

    if (elem) {
      elem.parentNode?.removeChild(elem)
    }
  }

  return new Promise((res, rej) => {
    window.refundSuccess = () => {
      const response = getExampleOfRefundSuccess(params)

      logMsg(`Refund finished with response: ${JSON.stringify(response)}`)

      res(getExampleOfRefundSuccess(params))
    }

    window.refundFail = () => {
      logError('Refund finished with an error')

      rej(new PaymentError('An error happened during refund'))
    }
  })
}
