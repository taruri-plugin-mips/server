export function useSend201(message: string) {
  return useSend(201, message)
}

export function useSend202(message: string) {
  return useSend(202, message)
}

export function useSend200(message: string) {
  return useSend(200, message)
}

export function useSend500(message: string) {
  return useSend(500, message)
}

export function useSend(status: number, message: string) {
  return JSON.stringify({
    status,
    message,
  })
}
