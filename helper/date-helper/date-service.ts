import { DateData, DateDays, dates } from "./dates";
const delimiter = "/";

export function getAllYears() {
  return dates.map((d: any) => d.Year);
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
