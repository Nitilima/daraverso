const BASE_URL = import.meta.env.VITE_API_URL

export async function post(endpoint: string, corpo: object, token?: string) {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    const resposta = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(corpo),
    })

    const dados = await resposta.json()

    if (!resposta.ok) {
        throw new Error(dados.erro || 'Algo deu errado')
    }

    return dados
}

export async function put(endpoint: string, corpo: object, token?: string) {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    const resposta = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(corpo),
    })

    const dados = await resposta.json()

    if (!resposta.ok) {
        throw new Error(dados.erro || 'Algo deu errado')
    }

    return dados
}

export async function del(endpoint: string, corpo: object, token?: string) {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    const resposta = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify(corpo),
    })

    const dados = await resposta.json()

    if (!resposta.ok) {
        throw new Error(dados.erro || 'Algo deu errado')
    }

    return dados
}

export async function get(endpoint: string, token?: string) {
    const headers: Record<string, string> = {}

    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    const resposta = await fetch(`${BASE_URL}/${endpoint}`, { headers })
    const dados = await resposta.json()

    if (!resposta.ok) {
        throw new Error(dados.erro || 'Algo deu errado')
    }

    return dados
}
