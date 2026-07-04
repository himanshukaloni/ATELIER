const API = "https://atelier-4r88.onrender.com/api";

async function apiRequest(endpoint, options = {}, token = null) {
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
    };

    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Request failed');
    }

    return data;
}

export default apiRequest;
