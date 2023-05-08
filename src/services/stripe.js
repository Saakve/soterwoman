const BASE_URL = 'https://divine-cloud-1237.fly.dev'

export async function payoffDebt({ idCustomer, idAccount, amount }) {
    try {
        const response = await fetch(`${BASE_URL}/payoff-debt/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ idCustomer, idAccount, amount })
        })

        return await response.json()
    } catch (error) {
        console.error(error)
    }
}

export async function createTipIntent({ idCustomer, idAccount, amount }) {
    try {
        const response = await fetch(`${BASE_URL}/create-tip-intent/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ idCustomer, idAccount, amount })
        })

        return await response.json()
    } catch (error) {
        console.error(error)
    }
}

export async function createDriverCard({ idAccount, tokenCard }) {
    try {
        const response = await fetch(`${BASE_URL}/create-account-card/${idAccount}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ tokenCard })
        })

        return await response.json()

    } catch (error) {
        console.error(error)
    }
}

export async function createFirstDriverCard({ tokenCard, rfc, name, email, address, dob }) {
    try {
        const response = await fetch(`${BASE_URL}/create-account-card/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ tokenCard, id_number: rfc, name, email, address, dob })
        })

        return await response.json()

    } catch (error) {
        console.error(error)
    }
}

export async function createPassengerPaymentMethod({ idCustomer }) {
    try {
        const response = await fetch(`${BASE_URL}/create-setup-intent/${idCustomer}`, {
            method: "POST"
        })

        return await response.json()

    } catch (error) {
        console.error(error)
    }
}

export async function createFirstPassengerPaymentMethod() {
    try {
        const response = await fetch(`${BASE_URL}/create-setup-intent/`, {
            method: "POST"
        })

        return await response.json()

    } catch (error) {
        console.error(error)
    }
}

export async function getDriverCards({ id }) {
    try {
        const response = await fetch(`${BASE_URL}/accounts/${id}/cards`)
        return await response.json()
    } catch (error) {
        console.error(error)
    }
}

export async function getDriverDefaultCard({ id }) {
    try {
        const response = await fetch(`${BASE_URL}/accounts/${id}/cards/default`)
        return await response.json()
    } catch (error) {
        console.error(error)
    }
}

export async function getPassengerPaymentMethods({ id }) {
    try {
        const response = await fetch(`${BASE_URL}/customers/${id}/payment-methods`)
        return await response.json()
    } catch (error) {
        console.error(error)
    }
}

export async function getPassengerDefaultPaymentMethod({ id }) {
    try {
        const response = await fetch(`${BASE_URL}/customers/${id}/payment-methods/default`)
        console.log(id)
        return await response.json()
    } catch (error) {
        console.error(error)
    }
}

export async function updateDriverCard({ idAccount, idCard, name, postal_code, isDefault }) {
    try {
        const response = await fetch(`${BASE_URL}/accounts/${idAccount}/cards/${idCard}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, postal_code, isDefault })
        })

        return await response.json()
    }
    catch (error) {
        console.error(error)
    }
}

export async function updatePassengerPaymentMethod({ idCustomer, idPaymentMethod, name, postal_code, isDefault }) {
    try {
        const response = await fetch(`${BASE_URL}/customers/${idCustomer}/payment-methods/${idPaymentMethod}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, postal_code, isDefault })
        })

        return await response.json()
    } catch (error) {
        console.error(error)
    }
}

export async function deleteDriverCard({ idAccount, idCard }) {
    try {
        const response = await fetch(`${BASE_URL}/accounts/${idAccount}/cards/${idCard}`, {
            method: "DELETE"
        })

        return response.status

    } catch (error) {
        console.error(error)
    }
}

export async function deletePassengerPaymentMethod({ idCustomer, idPaymentMethod }) {
    try {
        const response = await fetch(`${BASE_URL}/customers/${idCustomer}/payment-methods/${idPaymentMethod}`, {
            method: "DELETE"
        })

        return response.status

    } catch (error) {
        console.error(error)
    }
}