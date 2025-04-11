export function routerParser(path: string): {
    pattern: RegExp;
    paramNames: string[];
} {
    const paramNames: string[] = [];

    const regexStr = path.replace(/:([^/]+)/g, (_, key) => {
      paramNames.push(key);
      return '([^/]+)';
    });
  
    const pattern = new RegExp(`^${regexStr}$`);
  
    return { pattern, paramNames };
}
