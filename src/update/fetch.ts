export async function fetchWrapper(url: string, headers: Record<string, string> = {}) {
    if (isGjs()) {
        const soupModule = await import('./gnome_fetch.js');
        return soupModule.fetch(url, headers);
    }

    const response = await fetch(url, { headers });
    return response.json();
}

function isGjs(): boolean {
    return typeof globalThis !== 'undefined' && 'print' in globalThis && !('process' in globalThis);
}
