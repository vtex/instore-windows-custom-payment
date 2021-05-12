/* eslint-disable no-console */

export function logMsg(msg, className = '') {
  const result = document.querySelector('#result')

  // This shouldn't be an else, since #result could not be mounted yet
  if (result) {
    result.innerHTML += `<p ${
      className ? `class="${className}"` : ''
    }>${msg}</p>`
  }

  console.log('New message', msg)
}

export function formatPrice(price) {
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
  const result = document.querySelector('#result')

  if (result) {
    result.innerHTML = ''
  }
}
