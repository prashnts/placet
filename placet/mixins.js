import reqwest from 'reqwest'


function request (params) {
  const defaults = {
    type: 'json',
    method: 'get',
    contentType: 'application/json',
  }

  let payload = Object.assign({}, defaults, params)
  if (payload.method.toLowerCase() !== 'get' && !!payload.data) {
    payload.data = JSON.stringify(payload.data)
  }
  return reqwest(payload)
}


export { request }
