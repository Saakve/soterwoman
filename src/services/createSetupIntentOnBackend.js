export async function createSetupIntentOnBackend() {
    const response = await fetch('https://divine-cloud-1237.fly.dev/create-setup-intent', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    })
    console.log(response)
    const responseObject = await response.json()
    console.log(responseObject)
    return responseObject
}