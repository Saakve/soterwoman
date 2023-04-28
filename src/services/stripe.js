const BASE_URL = 'https://divine-cloud-1237.fly.dev'

export async function createSetupIntentOnBackend() {
    const response = await fetch(`${BASE_URL}/create-setup-intent`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    })
    const responseObject = await response.json()
    return responseObject
}

export async function addCard({id}) {
    const response = await fetch(`${BASE_URL}/add-card/${id}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    })
    const responseObject = await response.json()
    return responseObject
}

// acct_1N1YZwFN3cAPLu0j 1
// acct_1N11tn2UWKvKuybi *

export async function getCards({id}) {
    const response = await fetch(`${BASE_URL}/accounts/${id}/cards`)

    const responseObject = await response.json()

    return responseObject
}