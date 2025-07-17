import { post } from "@/shared/services/ajaxService";
import { DateData, DateDays, dates } from "./dates";
const delimiter = "/";

export function getDays(yearId: number, monthId: number) {
  if (!yearId && !monthId) {
    return 0;
  }

  var data: DateData = {};
  dates.forEach((item) => {
    if (item.Year === yearId) {
      data = item;
      return;
    }
  });

  const month = data[`m${monthId}`] as DateDays;
  if (!month) {
    return 0;
  }

  return month.Days;
}

export function composeNpDate(year: number, month: number, date: number) {
  const dayString = Number(date) < 10 ? "0" + date : date;
  const monthString = Number(month) < 10 ? "0" + month : month;

  return `${year}${delimiter}${monthString}${delimiter}${dayString}`;
}

export function parseNpDate(dateString: string | undefined) {
  if (!dateString) return { day: 1, month: 4, year: 2075 };
  const splitted = dateString.split(delimiter);
  let year = Number(splitted[0] || 2074);
  let month = Number(splitted[1] || 1);
  let day = Number(splitted[2] || 1);

  if (year < getAllYears()[0]) year = getAllYears()[0];
  if (month < 1) month = 1;
  if (day < 1) day = 1;

  if (isNaN(year)) year = 1;
  if (isNaN(month)) month = 1;
  if (isNaN(day)) day = 1;

  if (month > 12) month = 12;
  const maxDays = getMaxDaysInMonthOfGivenYear(year, month) ?? 1;
  if (day > maxDays) day = maxDays;

  return {
    day,
    month,
    year,
  };
}

export function getAdDate(npDate: string) {
  if (!npDate) {
    return undefined;
  }
  const dateArr = npDate.split(delimiter);
  if (!dateArr) {
    return undefined;
  }

  const year = parseInt(dateArr[0]);
  const monthId = parseInt(dateArr[1]);
  const days = parseInt(dateArr[2]);

  if (!year || !monthId || !days) {
    return undefined;
  }

  let data: DateData = {};
  dates.forEach((item: any) => {
    if (item.Year === year) {
      data = item;
      return;
    }
  });

  const month = data[`m${monthId}`] as DateDays;
  if (!month) {
    return undefined;
  }

  if (days > month.Days) {
    //invalid np date
    return undefined;
  }

  const d = new Date(month.Date);
  d.setDate(d.getDate() + days - 1);

  //return d.toISOString().split('T')[0];
  return d;
}

export function getMaxDaysInMonthOfGivenYear(year: number, month: number) {
  if (!year && !month) {
    return;
  }

  let data: DateData = {};
  dates.forEach((item: any) => {
    if (item.Year === year) {
      data = item;
      return;
    }
  });

  const monthCode = data[`m${month}`] as DateDays;
  if (!monthCode) {
    return null;
  }

  return monthCode.Days;
}

export const getMonthNameNp = (
  monthId: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
) => {
  if (monthId == 1) return "वैशाख";
  if (monthId == 2) return "जेठ";
  if (monthId == 3) return "आषाढ";
  if (monthId == 4) return "श्रावण";
  if (monthId == 5) return "भाद्र";
  if (monthId == 6) return "आश्विन";
  if (monthId == 7) return "कार्तिक";
  if (monthId == 8) return "मंसिर";
  if (monthId == 9) return "पौष";
  if (monthId == 10) return "माघ";
  if (monthId == 11) return "फाल्गुन";
  if (monthId == 12) return "चैत्र";
};

export function getWeekDay(npDate: string) {
  const adDate = getAdDate(npDate);
  if (!adDate) {
    return 0;
  }
  return new Date(adDate).getDay();
}
export function getDefaultDate(adDate: string | Date) {
  return adDate !== undefined ? new Date(adDate) : undefined;
}
export function getMonthStartWeekDayForGivenYear(year: number, month: number) {
  const firstDay = `${year.toString()}/${month}/01`;
  return getWeekDay(firstDay);
}

export function getAllYears() {
  return dates.map((d: any) => d.Year);
}

export function dateDiff(first: Date, second: Date) {
  if (
    first === null ||
    first === undefined ||
    second === null ||
    second === undefined
  )
    return 0;
  const firstDate = Date.UTC(
    first.getFullYear(),
    first.getMonth(),
    first.getDate()
  );
  const secondDate = Date.UTC(
    second.getFullYear(),
    second.getMonth(),
    second.getDate()
  );

  return Math.floor((secondDate - firstDate) / (1000 * 60 * 60 * 24));
}

export function getNpDate(adDate: Date) {
  const items = dates.filter(
    (x: any) => new Date(x.m1.Date) <= new Date(adDate)
  );
  const item = items[items.length - 1] as DateData;

  if (!item) return;

  if (item) {
    const startDate = new Date((item["m1"] as DateDays).Date);
    if (!startDate) return;
    let totalDays = dateDiff(startDate, new Date(adDate));
    let year = Number(item.Year);
    let month = 1;
    let day = 0;
    while (totalDays > 0) {
      const days = (item[`m${month}`] as DateDays).Days;
      if (totalDays >= days) {
        totalDays -= days;
        if (month < 12) month += 1;
        else {
          month = 1;
          if (totalDays == 0) year = Number(year) + 1;
        }
      } else {
        day = totalDays;
        totalDays = 0;
      }
    }

    let strMonth = month.toString();
    let strDay = (day + 1).toString();
    if (strMonth.length < 2) strMonth = "0" + strMonth;
    if (strDay.length < 2) strDay = "0" + strDay;

    return [year, strMonth, strDay].join("/");
  }
}

export function formatDate(date: Date) {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

export function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);

  return d;
}

export const getDuration = async (
  year: number,
  month: number,
  day: number,
  date?: any
) => {
  const res = await post<number>("/date/get-duration", {
    year: year,
    month: month,
    day: day,
    date: date,
  });

  return res && res.data;
};

export const getDiffFromDate = (srcDate: Date, destination: Date) => {
  if (!srcDate || !destination)
    return { years: 0, months: 0, days: 0, totalDays: 0 };

  const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds

  const startDate = Date.UTC(
    srcDate.getFullYear(),
    srcDate.getMonth(),
    srcDate.getDate()
  );
  const endDate = Date.UTC(
    destination.getFullYear(),
    destination.getMonth(),
    destination.getDate()
  );

  const timeDifference = Math.abs(endDate - startDate);
  const totalDays = Math.floor(timeDifference / oneDay) ?? 0;

  const years = Math.floor(totalDays / 365);
  const remainingDays = totalDays % 365;
  const months = Math.floor(remainingDays / 30);
  const days = remainingDays % 30;

  return { years, months, days, totalDays };
};

export const getNewDate = (
  fromDate: Date,
  year: number | undefined,
  month: number | undefined,
  day: number | undefined
) => {
  if (!fromDate) return { toDate: fromDate, diffInDays: 0 };
  const toDate = new Date(fromDate.toLocaleDateString("en-CA"));

  if (year !== undefined && year > 0)
    toDate.setFullYear(toDate.getFullYear() + year);
  if (month !== undefined && month > 0)
    toDate.setMonth(toDate.getMonth() + month);
  if (day !== undefined && day > 0) toDate.setDate(toDate.getDate() + day);

  const diff = getDiffFromDate(fromDate, toDate);
  return { toDate, diffInDays: diff.totalDays };
};

export const isValidDate = (date: Date | undefined | null) =>
  date !== undefined && date !== null && !isNaN(date.valueOf());
export const isSameDate = (
  left: Date | undefined | null,
  right: Date | undefined | null
) => {
  const isLeftValid = isValidDate(left);
  const isRightValid = isValidDate(right);
  if (!isLeftValid || !isRightValid) return false;
  return (
    left?.getFullYear() === right?.getFullYear() &&
    left?.getMonth() === right?.getMonth() &&
    left?.getDate() === right?.getDate()
  );
};
