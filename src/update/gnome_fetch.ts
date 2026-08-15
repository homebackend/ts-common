import Soup from 'gi://Soup';
import GLib from 'gi://GLib';
import { FetchWrapperResponse } from './fetch.js';

export async function fetch(url: string, headers: Record<string, string> = {}): Promise<FetchWrapperResponse> {
    const session = new Soup.Session();
    const uri = GLib.Uri.parse(url, GLib.UriFlags.NONE);
    const message = new Soup.Message({ method: 'GET', uri });

    const reqHeaders = message.get_request_headers();
    for (const [key, value] of Object.entries(headers)) {
        reqHeaders.append(key, value);
    }

    const bytes = await session.send_and_read_async(
        message,
        GLib.PRIORITY_DEFAULT,
        null
    );

    const statusCode = message.get_status();
    if (statusCode !== 200) {
        return {
            ok: false,
            status: statusCode,
            json: async () => '',
        };
    }

    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(bytes.get_data()!);
    const json = JSON.parse(text);
    message.get_response_headers

    return {
        ok: true,
        status: statusCode,
        json: async () => json,
    };
}
