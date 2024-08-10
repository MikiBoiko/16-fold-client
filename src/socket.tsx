const HOST: string = '192.168.1.143'
const PORT: string = '3002'
const USER_URL: string = `${HOST}:${PORT}`
const WS_URL = `ws://${USER_URL}`
const HTTP_URL = `http://${USER_URL}`

export { WS_URL, HTTP_URL, USER_URL }