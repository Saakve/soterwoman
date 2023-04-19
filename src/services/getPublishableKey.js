export async function getPublishableKey() {
    const response = await fetch('localhost:4242/public-key')
    const { publicKey } = await response.json()

    return publicKey
}