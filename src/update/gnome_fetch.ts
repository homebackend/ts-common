import Soup from "gi://Soup?version=3.0";
import GLib from "gi://GLib";
import { FetchWrapperResponse } from "./app_initialization_cubit.js";

export async function gnomeFetch(
  url: string,
  headers: Record<string, string> = {},
): Promise<FetchWrapperResponse> {
  const session = new Soup.Session();
  const message = Soup.Message.new("GET", url);

  const reqHeaders = message.get_request_headers();
  reqHeaders.append('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
  for (const [key, value] of Object.entries(headers["headers"])) {
    reqHeaders.append(key, value);
  }

  const bytes = await new Promise<GLib.Bytes>((resolve, reject) => {
    session.send_and_read_async(
      message,
      GLib.PRIORITY_DEFAULT,
      null,
      (sess, result) => {
        try {
          resolve(sess!.send_and_read_finish(result) as GLib.Bytes);
        } catch (e) {
          reject(e);
        }
      },
    );
  });

  const statusCode = message.get_status();
  if (statusCode !== Soup.Status.OK) {
    const reason = message.get_reason_phrase();
    const text = new TextDecoder().decode(bytes.get_data() ?? new Uint8Array());
    return {
      ok: false,
      status: statusCode,
      statusText: `${reason}: ${text}`,
      json: async () => "",
    };
  }

  const text = new TextDecoder().decode(bytes.get_data()!);
  const json = JSON.parse(text);

  return {
    ok: true,
    status: statusCode,
    json: async () => json,
  };
}
