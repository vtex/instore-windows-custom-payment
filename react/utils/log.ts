/* eslint-disable no-console */
let result: Element | null

export function setLogResultContainer(resultContainer: Element | null) {
  result = resultContainer
}

export function logMsg(msg, className = '') {
  if (!result) {
    result = document.querySelector('#result')
  }

  // This shouldn't be an else, since #result could not be mounted yet
  if (result) {
    result.innerHTML += `<p ${
      className ? `class="${className}"` : ''
    }>${msg}</p>`
  }

  console.log('New message', msg)
}

function formatPrice(price) {
  return parseFloat(price).toFixed(2).replace('.', ',')
}

export function logPrice(msg, price) {
  const formattedPrice = formatPrice(price)

  logMsg(`${msg} R$${formattedPrice}`)
}

export function logError(msg) {
  logMsg(msg, 'error')
}

export function clearLogs() {
  if (result) {
    result.innerHTML = ''
  }
}
