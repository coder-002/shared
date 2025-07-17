export const isEmpty = (value: any) =>
  !(value && value !== "undefined" && value !== "" && value !== "null");
export const isStringEmpty = (value: string | undefined | null) =>
  !(value && value !== "undefined" && value !== "" && value !== "null");

export const replaceEmptyString = (
  value: string | null | undefined,
  alternative?: string
): string => {
  if (isEmpty(value)) {
    if (isEmpty(alternative)) return "Not Provided";
    return alternative!;
  }
  return value!;
};

export function formatString(value: string, ...args: string[]) {
  let formatted = value;
  for (let i = 0; i < args.length; i++) {
    const regexp = new RegExp("\\{" + i + "\\}", "gi");
    formatted = formatted.replace(regexp, args[i]);
  }
  return formatted;
}

export function humanizeUnderscoreCase(str: string) {
  const frags = str.split("_");
  for (let i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(" ");
}

export function underscoreToPascalCase(str: string) {
  const frags = str.split("_");
  for (let i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join("");
}

export function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
  });
}

export function uppercaseFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const newGuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (c: string) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
};

export const addStringPadding = (
  originalValue: string,
  expectedLength: number,
  toRight = false
) => {
  const paddingCount = expectedLength - String(originalValue).length;
  for (let i = 0; i < paddingCount; i++)
    originalValue = toRight ? `${originalValue}0` : `0${originalValue}`;
  return originalValue;
};

export const getOrdinalSuffixedString = (value: number) => {
  const ones = value % 10;
  const tens = Math.floor(value / 10) % 10;
  if (tens === 1) {
    return value + "th";
  }
  switch (ones) {
    case 1:
      return value + "st";
    case 2:
      return value + "nd";
    case 3:
      return value + "rd";
    default:
      return value + "th";
  }
};

export function countInString(source: string, target: string) {
  let count = 0;
  for (let i = 0; i < source.length; i++) {
    if (source[i] === target) {
      count++;
    }
  }
  return count;
}
