const riskyChars = ['=', '+', '-', '@'];

export function sanitizeCSVValue(str: any): string {
  if (!str) {
    return str;
  }
  if (typeof str === 'string' || str instanceof String) {
    str = str.replace(/\t|\r|\n/g, '');
    str = str.trim();
    const isInjected = riskyChars.includes(str.charAt(0));
    if (isInjected) {
      str = str.slice(1);
    }
    str = str.replace(/\"/g, '""');
    if (str.indexOf(',') != -1) {
      str = '"' + str + '"';
    }
  }
  return str;
}

export function escapeCSVValue(str: any): string {
  if (!str) {
    return str;
  }
  if (typeof str === 'string' || str instanceof String) {
    str = str.replace(/\t|\r|\n/g, '');
    str = str.trim();
    str = str.replace(/\"/g, '""');
    if (str.indexOf(',') != -1) {
      str = '"' + str + '"';
    }
  }
  return str;
}
