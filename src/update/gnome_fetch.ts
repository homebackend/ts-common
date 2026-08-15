import Soup from 'gi://Soup';
import GLib from 'gi://GLib';

export async function fetch(url: string, headers: Record<string, string> = {}) {
    const session = new Soup.Session();
    const uri = GLib.Uri.parse(url, GLib.UriFlags.NONE);
    const message = new Soup.Message({ method: 'GET', uri });

    // Apply headers
    const reqHeaders = message.get_request_headers();
    for (const [key, value] of Object.entries(headers)) {
        reqHeaders.append(key, value);
    }

    // Execute request asynchronously using modern Soup 3 API
    const bytes = await session.send_and_read_async(
        message, 
        GLib.PRIORITY_DEFAULT, 
        null
    );
    
    const statusCode = message.get_status();
    if (statusCode !== 200) {
        throw new Error(`GitHub ${statusCode}`);
    }

    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(bytes.get_data()!);
    return JSON.parse(text);
}
