export const equalsIgnoreCase = (str1: string, str2: string) => {
  return (
    (!str1 && !str2) ||
    (str1 && str2 && str1.toUpperCase() == str2.toUpperCase())
  );
};

export function capitalizeFirstLetter(str: string) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

export function lowerCaseFirstLetter(str: string) {
  return str ? str.charAt(0).toLowerCase() + str.slice(1) : '';
}

export function isValidURL(input: string) {
  const pattern =
    '^(https?:\\/\\/)?' + // protocol
    '((([a-zA-Z\\d]([a-zA-Z\\d-]{0,61}[a-zA-Z\\d])*\\.)+' + // sub-domain + domain name
    '[a-zA-Z]{2,13})' + // extension
    '|((\\d{1,3}\\.){3}\\d{1,3})' + // OR ip (v4) address
    '|localhost)' + // OR localhost
    '(\\:\\d{1,5})?' + // port
    '(\\/[a-zA-Z\\&\\d%_.~+-:@]*)*' + // path
    '(\\?[a-zA-Z\\&\\d%_.,~+-:@=;&]*)?' + // query string
    '(\\#[-a-zA-Z&\\d_]*)?$'; // fragment locator
  const regex = new RegExp(pattern);
  return regex.test(input);
}

export function getNameInitials(name: string): string {
  if (name) {
    const fullName = name.split(' ');
    let initials = '';
    if (fullName.length == 1) {
      initials = fullName[0].charAt(0) + fullName[0].charAt(1);
    } else {
      initials =
        fullName[fullName.length - 1].charAt(0) + fullName[0].charAt(0);
    }
    return initials.toUpperCase();
  }
  return '';
}

export function getFirstNameInitials(name: string): string {
  if (name) {
    const fullName = name.trim().split(' ');
    let initials = '';
    if (fullName.length == 1) {
      initials = fullName[0].charAt(0);
    } else {
      initials = fullName[fullName.length - 1].charAt(0);
    }
    return initials.toUpperCase();
  }
  return '';
}
