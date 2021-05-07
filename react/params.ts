import {
  getURIHashParams,
  convertDictionaryToQueryString,
  appendHashOnURI,
} from './utils/uri'

// See params explanation on: https://help.vtex.com/en/tutorial/configurar-o-app-linking-para-pagamentos-no-instore
export type PaymentParams = {
  action: 'payment'
  acquirerProtocol: string
  acquirerId: string
  installmentType: 1 | 2
  installments: number
  paymentId: string
  paymentType: 'debit' | 'credit'
  amount: number // In cents
  installmentsInterestRate: string
  transactionId: string
  scheme: string
  urlCallback: string
  autoConfirm: string
  paymentSystem: number
  paymentSystemName: string
  paymentGroupName: string
  sellerName: string
  payerEmail: string
  payerIdentification: string
  mobileLinkingUrl: string
}

export type RefundParams = {
  action: 'payment-reversal'
  acquirerProtocol: string
  acquirerAuthorizationCode: string
  acquirerId: string
  transactionId: string
  paymentId: string
  acquirerTid: string
  administrativeCode: string
  autoConfirm: string
  sellerName: string
  scheme: string
  urlCallback: string
  mobileLinkingUrl: string
}

export type ContextParams = PaymentParams | RefundParams

type MessageData = {
  type: 'changeParams'
  params: ContextParams
}

type ResponsePaymentType = 'payment-success' | 'payment-error'

type ResponseRefundType = 'payment-reversal-success' | 'payment-reversal-error'

export type ResponsePaymentData = {
  paymentId: string
  cardBrandName: string
  firstDigits: string
  lastDigits: string
  acquirerName: string
  tid: string
  acquirerAuthorizationCode: string
  nsu: string
  merchantReceipt: string
  customerReceipt: string
  responsecode: number // 0 -> Success, >=1 -> Error code
  reason: string // Error message
}

export type ResponseRefundData = {
  paymentId: string
  paymentAcquirerAuthorizationCode: string
  acquirerAuthorizationCode: string
  merchantReceipt: string
  customerReceipt: string
  responsecode: number // 0 -> Success, >=1 -> Error code
  reason: string // Error message
}

export class PaymentError extends Error {
  public responsecode?: number

  constructor(
    message: string,
    { responsecode }: { responsecode?: number } = {}
  ) {
    super(message)

    this.responsecode = responsecode ?? 1
  }
}

export function listenForNewParams(callback: (params: ContextParams) => void) {
  const newMessage = (event: Event) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Can't extend Event class so we need to force this event.data to be a type
    const data = event.data as MessageData

    if (!data || !data.type) {
      return
    }

    if (data.type === 'changeParams') {
      updateParamsOnCurrentUrl(data.params)

      callback(data.params)
    }
  }

  window.addEventListener('message', newMessage, false)

  return function unlistenForNewParams() {
    window.removeEventListener('message', newMessage, false)
  }
}

function getParentWindow() {
  if (window.parent && window.parent !== window) {
    return window.parent
  }

  if (window.opener && window.opener !== window) {
    return window.opener
  }

  return null
}

export function sendResponse({
  type,
  data,
}:
  | {
      type: ResponsePaymentType
      data: ResponsePaymentData
    }
  | {
      type: ResponseRefundType
      data: ResponseRefundData
    }) {
  const parent = getParentWindow()

  if (parent) {
    parent.postMessage({
      type,
      data,
    })
  }
}

export function getParamsFromCurrentUrl() {
  const url = window.location.href

  return getURIHashParams(url) as ContextParams
}

export function updateParamsOnCurrentUrl(newParams: ContextParams) {
  const url = window.location.href

  const hash = convertDictionaryToQueryString(newParams)

  const newUrl = appendHashOnURI(url, hash)

  if (newUrl) {
    window.location.href = newUrl
  }
}
