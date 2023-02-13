import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken(key) {
  const getKey = key || TokenKey
  return Cookies.get(getKey)
}

export function setToken(token, key) {
  const setKey = key || TokenKey
  return Cookies.set(setKey, token)
}

export function removeToken(key) {
  const removeKet = key || TokenKey
  return Cookies.remove(removeKet)
}
