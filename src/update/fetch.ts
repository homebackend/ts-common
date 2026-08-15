export interface FetchWrapperResponse {
    readonly ok: boolean;
    readonly status: number;
    readonly statusText?: string;
    readonly url?: string;
    readonly headers?: Headers;
    json(): Promise<any>;
}

export async function fetchWrapper(url: string, headers: Record<string, string> = {}): Promise<FetchWrapperResponse> {
    if (isGjs()) {
        const soupModule = await import('./gnome_fetch.js');
        return soupModule.fetch(url, headers);
    }

    const response = await fetch(url, { headers });
    return {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: response.headers,
        json: () => response.json(),
    };
}

function isGjs(): boolean {
    return typeof globalThis !== 'undefined' && 'print' in globalThis && !('process' in globalThis);
}
