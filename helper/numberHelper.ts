import { roundTo } from "round-to";

const nepali_numerals = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

const ones = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const tens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

export type TNumberFormatType = "Nepali" | "English";
const nepali_units = [
  "",
  "Thousand",
  "Lakh",
  "Crore",
  "Arba",
  "Kharba",
  "Nil",
  // Add more units as needed
];
const english_units = [
  "",
  "Thousand",
  "Million",
  "Billion",
  "Trillion",
  "Quadrillion",
  "Quintillion",
  // Add more units as needed
];

export function convertToWords(
  number: number,
  formatter?: (key: string, ...args: any[]) => string,
  type?: TNumberFormatType | undefined
): string {
  const internalFormatter = formatter || ((str: string) => str);

  // eslint-disable-next-line prefer-const
  let [integerPart, decimalPart] = String(number).split(".");

  let words = "";
  try {
    const integerPartInWords = convertNumberToWords(Number(integerPart), type);

    decimalPart = decimalPart?.substring(0, 2);
    if (decimalPart?.length === 1) decimalPart += "0";

    words = decimalPart
      ? `${integerPartInWords} And ${convertNumberToWords(
          Number(decimalPart),
          type
        )} Paisa Only`
      : integerPartInWords + " Only";
  } catch (e) {
    words = "OopsTooBigNumber";
  } finally {
    words = words
      .replace("Zero And", "")
      .trim()
      .replace("Zero Only", "Zero")
      .trim()
      .replace("Zero Paisa Only", "Zero")
      .trim()
      .replace("And Zero", "Only")
      .trim();
    words = words.trim().split(" ").map(internalFormatter).join(" ");
  }

  return words;
}

export function convertNumberToWords(
  number: number,
  type?: TNumberFormatType | undefined
): string {
  if (number === 0) return "Zero";
  type ??= "Nepali";

  let words = "";
  let unitIndex = 0;
  let isFirstIteration = true;

  while (number > 0) {
    const modValue = isFirstIteration ? 1000 : type === "Nepali" ? 100 : 1000;
    isFirstIteration = false;
    if (number % modValue !== 0) {
      const part = convertThreeDigitNumberToWords(number % modValue);
      const units = type === "Nepali" ? nepali_units : english_units;
      const unit = units[unitIndex];
      if (unit === undefined) throw new Error("Number is too big!");
      if (words !== "") {
        words = part + " " + unit + " " + words;
      } else {
        words = part + " " + unit;
      }
    }
    number = Math.floor(number / modValue);
    unitIndex++;
  }

  return words.trim();
}

function convertThreeDigitNumberToWords(number: number): string {
  const hundred = ones[Math.floor(number / 100)] + " Hundred";
  const ten_value = Math.floor((number % 100) / 10);
  let ten = tens[ten_value];
  let one = ones[number % 10];

  if (ten_value !== 0 && ten === "") {
    const tryAmbiguousTenValuePresentedAsOne = ones[number % 100];
    if (tryAmbiguousTenValuePresentedAsOne !== "") {
      ten = tryAmbiguousTenValuePresentedAsOne;
      one = "";
    }
  }

  let words = "";
  if (hundred !== " Hundred") {
    words += " " + hundred;
  }
  if (ten !== "") {
    words += " " + ten;
  }
  if (one !== "") {
    if (ten === "") {
      words += " " + one;
    } else {
      words += one;
    }
  }

  return words.trim();
}

// export function commaFormatNumber(
//   value?: any,
//   type?: TNumberFormatType
// ): string {
//   if (value && value === "*") {
//     return "Unauthorized";
//   }
//   value ??= 0;
//   type ??= "Nepali";

//   const [integer, decimal] = String(roundTo(Number(value), 2)).split(".");
//   const decimalPrefix = decimal && Number(decimal) !== 0 ? `.${decimal}` : "";

//   const number = Number(integer) ?? 0;
//   const last3digits = number.toString().slice(-3);
//   const rest = number.toString().slice(0, -3);

//   const restReversed = rest.split("").reverse().join("");
//   const regex = type === "Nepali" ? /.{1,2}/g : /.{1,3}/g;

//   const groupOf2 =
//     restReversed
//       .match(regex)
//       ?.reverse()
//       .map((x) => x.split("").reverse().join("")) ?? [];
//   const commaSeparatedRest = groupOf2.join(",");
//   const commaTrimmedFromStartAndEnd = commaSeparatedRest.replace(/^,|,$/g, "");

//   return commaTrimmedFromStartAndEnd === "" ||
//     commaTrimmedFromStartAndEnd === "0"
//     ? `${last3digits}${decimalPrefix}`
//     : `${commaTrimmedFromStartAndEnd},${last3digits}${decimalPrefix}`;
// }
export function commaFormatNumber(
  value?: any,
  type?: TNumberFormatType
): string {
  if (value && value === "*") {
    return "Unauthorized";
  }
  value ??= 0;
  type ??= "Nepali";

  const isNegative = Number(value) < 0;
  const absoluteValue = Math.abs(Number(value));

  const [integer, decimal] = String(roundTo(absoluteValue, 2)).split(".");
  const decimalPrefix = decimal && Number(decimal) !== 0 ? `.${decimal}` : "";

  const number = Number(integer) ?? 0;
  const last3digits = number.toString().slice(-3);
  const rest = number.toString().slice(0, -3);

  const restReversed = rest.split("").reverse().join("");
  const regex = type === "Nepali" ? /.{1,2}/g : /.{1,3}/g;

  const groupOf2 =
    restReversed
      .match(regex)
      ?.reverse()
      .map((x) => x.split("").reverse().join("")) ?? [];
  const commaSeparatedRest = groupOf2.join(",");
  const commaTrimmedFromStartAndEnd = commaSeparatedRest.replace(/^,|,$/g, "");

  const formattedNumber =
    commaTrimmedFromStartAndEnd === "" || commaTrimmedFromStartAndEnd === "0"
      ? `${last3digits}${decimalPrefix}`
      : `${commaTrimmedFromStartAndEnd},${last3digits}${decimalPrefix}`;

  return isNegative ? `-${formattedNumber}` : formattedNumber;
}

export function commaParseNumber(number: string): number {
  return Number(number.replace(/,/g, ""));
}

export function toNepaliNumber(number: number): string {
  return number
    .toString()
    .split("")
    .map((digit) => {
      const isNumber = !isNaN(Number(digit));
      if (isNumber) return nepali_numerals[Number(digit)];
      return digit;
    })
    .join("");
}
