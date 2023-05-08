export async function getPublishableKey() {
    const response = await fetch('https://divine-cloud-1237.fly.dev/public-key')
    const { publicKey } = await response.json()

    return publicKey
}