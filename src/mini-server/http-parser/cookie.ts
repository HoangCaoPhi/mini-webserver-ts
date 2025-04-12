export function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};

  cookieHeader.split(";").forEach((cookie) => {
    const [key, value] = cookie.split("=");
    if (key && value) {
      cookies[key.trim()] = decodeURIComponent(value.trim());
    }
  });

  return cookies;
}
