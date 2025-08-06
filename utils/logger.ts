export function logError(context: string, error: unknown) {
  if (error instanceof Error) {
    console.error(`${context}:`, error.message, error)
  } else {
    console.error(`${context}:`, error)
  }
}

export default logError
