import React, { useEffect, useRef, useState } from "react";
import "./NepaliDatePicker.css";
import { useLocale } from "@/shared/context/LocaleContext.tsx";
import {
  composeNpDate,
  getAdDate,
  getAllYears,
  getDays,
  getDiffFromDate,
  getMaxDaysInMonthOfGivenYear,
  getMonthStartWeekDayForGivenYear,
  getNpDate,
  parseNpDate,
} from "@/shared/helper/date-helper/date-service";
import { Input, InputRef, Popover, Tooltip } from "antd";
import { isEmpty } from "lodash";
import { CalendarOutlined, LoadingOutlined } from "@ant-design/icons";
import { useAuth } from "@/shared/context/AuthContext.tsx";
import { MdOutlineSocialDistance } from "react-icons/md";
import Cleave from "cleave.js/react";
import { showErrorMessage } from "@/shared/helper/message-helper/messageHelper";

export type TNepaliDatePickerProps = {
  date?: string;
  dateAd?: Date;
  minDate?: string | Date;
  maxDate?: string | Date;
  disabled?: boolean;
  onChange: (dateAd: Date | undefined, dateNp: string | undefined) => void;
  allowClear?: boolean;
  noDefault?: boolean;
  pinPicker?: boolean;
};

const NepaliDatePicker = (props: TNepaliDatePickerProps) => {
  const localize = useLocale();
  const userMeta = useAuth();

  const delemeter = "/";
  const noDefault = props.noDefault ?? false;

  const [years, setYears] = useState<number[]>([]);
  const monthNames: string[] = Array.from(
    { length: 12 },
    (_, i) => "month" + (i + 1).toString().padStart(2, "0")
  );
  const weekNames: string[] = Array.from(
    { length: 7 },
    (_, i) => "week" + (i + 1).toString().padStart(2, "0")
  );
  const [days, setDays] = useState<string[]>([]);
  const [maxDaysInActiveMonth, setMaxDaysInActiveMonth] = useState<number>(0);

  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [calenderLoading, setCalenderLoading] = useState<boolean>(false);
  const [isDatePickerVisible, setIsDatePickerVisible] =
    useState<boolean>(false);

  const [activeYear, setActiveYear] = useState<number>(0);
  const [activeMonth, setActiveMonth] = useState<number>(1);
  const [activeDay, setActiveDay] = useState<number | null>();

  const [shadowActiveYear, setShadowActiveYear] = useState<number>(0);
  const [shadowActiveMonth, setShadowActiveMonth] = useState<number>(1);
  const [shadowActiveDay, setShadowActiveDay] = useState<number | null>();
  const [shadowDate, setShadowDate] = useState<string>();
  const [shadowAdDate, setShadowAdDate] = useState<Date | undefined>();

  const [dateDiff, setDateDiff] = useState<number>(0);
  const [showAdChooser, setShowAdChooser] = useState<boolean>(false);

  const [displayValue, setDisplayValue] = useState<string>("");
  const [value, setValue] = useState<string | undefined>("");
  const [adDate, setAdDate] = useState<Date | undefined>();
  const [diffMode, setDiffMode] = useState<boolean>(false);

  const [minDateAd, setMinDateAd] = useState<Date | undefined>();
  const [minDate, setMinDate] = useState<{
    year: number;
    month: number;
    day: number;
  } | null>(null);
  const [maxDateAd, setMaxDateAd] = useState<Date | undefined>();
  const [maxDate, setMaxDate] = useState<{
    year: number;
    month: number;
    day: number;
  } | null>(null);

  useEffect(() => {
    if (!props.minDate) return;
    if (typeof props.minDate === typeof "")
      setMinDateAd(getAdDate(props.minDate as string));
    else setMinDateAd(props.minDate as Date);
  }, [props.minDate]);

  useEffect(() => {
    if (!props.maxDate) return;
    if (typeof props.maxDate === typeof "")
      setMaxDateAd(getAdDate(props.maxDate as string));
    else setMaxDateAd(props.maxDate as Date);
  }, [props.maxDate]);

  useEffect(() => {
    if (minDateAd) {
      setMinDate(parseNpDate(getNpDate(minDateAd)));
    }
  }, [minDateAd]);

  useEffect(() => {
    if (maxDateAd) {
      setMaxDate(parseNpDate(getNpDate(maxDateAd)));
    }
  }, [maxDateAd]);

  const isDayNotInBracket = (year: number, month: number, day: number) => {
    if (!maxDate && !minDateAd) return false;
    if (minDate) {
      if (year < minDate.year) return true;
      else if (year === minDate.year && month < minDate.month) return true;
      else
        return (
          year === minDate.year && month === minDate.month && day < minDate.day
        );
    } else if (maxDate) {
      if (year > maxDate.year) return true;
      else if (year === maxDate.year && month > maxDate.month) return true;
      else
        return (
          year === maxDate.year && month === maxDate.month && day > maxDate.day
        );
    } else {
      return false;
    }
  };
  // useEffect(() => {
  // 	if (props.date) {
  // 		props.onChange(props.dateAd, props.date);
  // 	}
  // }, []);
  const init = async () => {
    const supportedYears = getAllYears();
    if (supportedYears) {
      setYears(supportedYears);
      const { year, month, day } = { year: null, month: null, day: null };
      setActiveYear(year ?? supportedYears[0]);
      setActiveMonth(month ?? 1);
      setActiveDay(day ?? undefined);
    }
  };
  useEffect(() => {
    init().finally(() => setInitialLoading(false));
  }, []);

  useEffect(() => {
    if (
      (props.dateAd !== undefined &&
        props.dateAd !== null &&
        typeof props.dateAd === "object" &&
        props.dateAd.getFullYear() === adDate?.getFullYear() &&
        props.dateAd.getMonth() === adDate?.getMonth() &&
        props.dateAd.getDate() === adDate?.getDate()) ||
      (props.date !== undefined &&
        props.date !== null &&
        props.date !== "" &&
        props.date === value)
    )
      return;

    const initialDate =
      props.dateAd !== undefined
        ? getNpDate(props.dateAd)
        : noDefault
          ? undefined
          : userMeta.todayBS;

    const { year, month, day } = initialDate
      ? parseNpDate(initialDate)
      : { year: null, month: null, day: null };
    if (year && month && day) {
      setActiveYear(year);
      setActiveMonth(month);
      setActiveDay(day);
    }
  }, [props.dateAd, props.date]);

  const populateCalender = async () => {
    const daysInMonth = getMaxDaysInMonthOfGivenYear(activeYear, activeMonth);
    if (daysInMonth) {
      let days = Array.from({ length: daysInMonth }, (_, i) =>
        (i + 1).toString().padStart(2, "0")
      );
      setMaxDaysInActiveMonth(daysInMonth);
      const monthStartWeekDay = getMonthStartWeekDayForGivenYear(
        activeYear,
        activeMonth
      );
      const paddingDays = Array.from(
        { length: monthStartWeekDay },
        (_, __) => ""
      );
      days = [...paddingDays, ...days];
      setDays(days);
      if (daysInMonth < (activeDay ?? 0)) setActiveDay((_) => daysInMonth);
    }
  };
  useEffect(() => {
    setCalenderLoading(true);
    populateCalender().finally(() => setCalenderLoading(false));
  }, [activeYear, activeMonth]);

  const setDisplayValueFromActiveData = () => {
    if (!activeDay) {
      setDisplayValue((_) => "");
      return;
    }
    const combined = [
      activeYear.toString().padStart(4, "0"),
      activeMonth.toString().padStart(2, "0"),
      activeDay.toString().padStart(2, "0"),
    ].join(delemeter);
    setDisplayValue((_) => combined);
  };
  const setDate = async () => {
    if (!activeDay) {
      setDisplayValueFromActiveData();
      return;
    }

    if (isDayNotInBracket(activeYear, activeMonth, activeDay)) {
      setValue(undefined);
      setAdDate(undefined);
      setDisplayValue((_) => "");
      props.onChange(undefined, undefined);
      return;
    }

    const composedDate = composeNpDate(activeYear, activeMonth, activeDay);
    setValue(composedDate);
    const convertedToAd = getAdDate(composedDate) ?? undefined;
    setAdDate(convertedToAd);
    setDisplayValueFromActiveData();
  };
  const resetDate = () => {
    setDisplayValue((_) => "");
    setValue((_) => undefined);
    setAdDate((_) => undefined);
  };
  useEffect(() => {
    if (activeDay) setDate().then();
    // else resetDate();
  }, [activeYear, activeMonth, activeDay]);
  useEffect(() => {
    if (props.date) {
      const convertedToAd = getAdDate(props.date) ?? undefined;
      props.onChange(convertedToAd, undefined);
    }
  }, []);
  useEffect(() => {
    if (
      (value ?? "") === (props.date ?? "") ||
      (props.dateAd !== undefined &&
        props.dateAd !== null &&
        typeof props.dateAd === "object" &&
        adDate?.getFullYear() === props.dateAd?.getFullYear() &&
        adDate?.getMonth() === props.dateAd?.getMonth() &&
        adDate?.getDate() === props.dateAd?.getDate())
    )
      return;

    if (value && adDate) props.onChange(adDate, value);
    if (diffMode) {
      if (!shadowAdDate) initializeDiffBase();
      if (adDate && shadowAdDate) {
        const diff = getDiffFromDate(shadowAdDate, adDate);
        setDateDiff((_) => diff.totalDays);
      }
    }
  }, [value, adDate]);

  const initializeDiffBase = () => {
    setShadowActiveYear((_) => activeYear);
    setShadowActiveMonth((_) => activeMonth);
    setShadowActiveDay((_) => activeDay);
    setDateDiff((_) => 0);
    setShadowDate((_) => value);
    setShadowAdDate((_) => adDate);
  };
  useEffect(() => {
    if (diffMode) initializeDiffBase();
  }, [diffMode]);

  const previousMonthClick = () => {
    if (activeMonth === 1) {
      const minYear = years[0];
      if (activeYear !== minYear)
        setActiveYear((previousValue) => previousValue - 1);
      setActiveMonth(12);
    } else {
      setActiveMonth((previousValue) => previousValue - 1);
    }
  };

  const nextMonthClick = () => {
    if (activeMonth === 12) {
      const [maxYear] = years.slice(-1);
      if (activeYear !== maxYear)
        setActiveYear((previousValue) => previousValue + 1);
      setActiveMonth(1);
    } else {
      setActiveMonth((previousValue) => previousValue + 1);
    }
  };

  const previousYearClick = () => {
    const minYear = years[0];
    if (activeYear !== minYear)
      setActiveYear((previousValue) => previousValue - 1);
  };

  const nextYearClick = () => {
    const [maxYear] = years.slice(-1);
    if (activeYear !== maxYear)
      setActiveYear((previousValue) => previousValue + 1);
  };

  const dateInputValueChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let text = event.target.value;
    const maxYear = years[years.length - 1];

    if (isEmpty(text)) {
      setActiveDay(undefined);
      props.onChange(adDate, value);
      setDisplayValue("");
      return;
    }

    const nonNumericAndSlashPattern = /[^0-9]/g;
    text = text.replace(nonNumericAndSlashPattern, "");

    let year: string | null = text.slice(0, 4);
    let month: string | null = text.slice(4, 6);
    let day: string | null = text.slice(6, 8);

    if (year && year != "") {
      year =
        maxYear < Number(year) ? maxYear.toString().padStart(4, "0") : year;
    } else year = null;

    if (month && month != "") {
      month = Number(month) < 0 ? "01" : month;
      month = Number(month) < 13 ? month : "12";
    } else month = null;

    if (day && day != "") {
      day = Number(day) < 0 ? "01" : day;
      day =
        Number(day) <= maxDaysInActiveMonth
          ? day
          : maxDaysInActiveMonth.toString().padStart(2, "0");
    } else day = null;

    let stringValue = "";
    stringValue += year ? year : "";
    stringValue += year && month ? "/" + month : "";
    stringValue += year && month && day ? "/" + day : "";

    setDisplayValue((_) => stringValue);
  };

  const inputRef = useRef<InputRef>(null);
  const getInputBox = () => (
    <span style={{ display: "block" }}>
      {/* <Input
        required={!props.allowClear}
        value={displayValue}
        ref={inputRef}
        onBlur={(event) => {
          const { year, month, day } = parseNpDate(event.target.value);
          if (
            isEmpty(event.target.value) ||
            !year ||
            !month ||
            !day ||
            isDayNotInBracket(year, month, day)
          ) {
            setActiveDay(undefined);
            props.onChange(adDate, value);
          } else {
            setActiveYear(year);
            setActiveMonth(month);
            setActiveDay(day);
            setDisplayValueFromActiveData();
          }
        }}
        placeholder={"YYYY-MM-DD"}
        onChange={(event) => dateInputValueChanged(event)}
        disabled={props.disabled || initialLoading}
        allowClear={props.allowClear}
        suffix={initialLoading ? <LoadingOutlined /> : <CalendarOutlined />}
      /> */}
      <div className="cleave-container">
        <Cleave
          className="cleave-input"
          placeholder={"YYYY-MM-DD"}
          options={{
            blocks: [4, 2, 2],
            delimiter: "/",
            numericOnly: true,
          }}
          value={displayValue}
          onBlur={(event) => {
            const { year, month, day } = parseNpDate(event.target.value);
            if (
              isEmpty(event.target.value) ||
              !year ||
              !month ||
              !day ||
              isDayNotInBracket(year, month, day)
            ) {
              setActiveDay(undefined);
              props.onChange(adDate, value);
            } else {
              setActiveYear(year);
              setActiveMonth(month);
              setActiveDay(day);
              setDisplayValueFromActiveData();
            }
          }}
          //   onChange={(event) => dateInputValueChanged(event)}
          onChange={(e) => {
            var newDate = e.target.value.replace(/(\/)/g, "");

            if (e.target.value.length == 10) {
              if (
                Number(e.target.value.split("/")[1]) > 12 ||
                Number(e.target.value.split("/")[1]) == 0
              ) {
                showErrorMessage(
                  `Invalid Month Date ${Number(e.target.value.split("/")[1])}`
                );
                return;
              }

              if (
                Number(e.target.value.split("/")[2]) > 32 ||
                Number(e.target.value.split("/")[2]) == 0 ||
                Number(e.target.value.split("/")[2]) >
                  Number(
                    getDays(
                      Number(e.target.value.split("/")[0]),
                      Number(e.target.value.split("/")[1])
                    ) || 0
                  )
              ) {
                showErrorMessage(
                  `Invalid Day Date ${Number(e.target.value.split("/")[2])}`
                );
                return;
              }

              if (Number(e.target.value.split("/")[0]) < 2001) {
                showErrorMessage(
                  `Invalid Year Date ${Number(e.target.value.split("/")[0])}`
                );
                return;
              }

              if (Number(newDate) >= 0) {
                setActiveDay(Number(e.target.value.split("/")[2]));
                setActiveMonth(Number(e.target.value.split("/")[1]));
                setActiveYear(Number(e.target.value.split("/")[0]));
              }
            }
          }}
          disabled={props.disabled || initialLoading}
        />
        <CalendarOutlined className="calendar-icon" />
      </div>
    </span>
  );

  const getDatePicker = () => (
    <>
      {calenderLoading ? (
        <LoadingOutlined />
      ) : (
        <div
          className={"datepicker"}
          onMouseEnter={(x) => {
            x.currentTarget.focus();
          }}
          tabIndex={99}
        >
          {(minDate || maxDate) && (
            <div className={"date-preview date-limit"}>
              {minDate && (
                <small>
                  <strong>
                    {localize("Min")}:{" "}
                    {composeNpDate(minDate.year, minDate.month, minDate.day)
                      .split("/")
                      .map((x) => localize(x as any))
                      .join("/")}
                  </strong>
                </small>
              )}
              {maxDate && (
                <small>
                  <strong>
                    {localize("Max")}:{" "}
                    {composeNpDate(maxDate.year, maxDate.month, maxDate.day)
                      .split("/")
                      .map((x) => localize(x as any))
                      .join("/")}
                  </strong>
                </small>
              )}
            </div>
          )}
          <div className={"datepicker-header"}>
            <button onClick={() => previousYearClick()}>&lt;&lt;</button>
            <button onClick={() => previousMonthClick()}>&lt;</button>
            <select
              id={"yearSelect"}
              value={activeYear}
              onChange={(e) => setActiveYear(Number(e.target.value))}
            >
              {years.map((x) => (
                <option className={"picker-select-options"} value={x} key={x}>
                  {localize(x.toString().padStart(4, "0") as any)}
                </option>
              ))}
            </select>
            <select
              id="monthSelect"
              value={activeMonth}
              onChange={(e) => setActiveMonth(Number(e.target.value))}
            >
              {monthNames.map((x, i) => (
                <option
                  value={i + 1}
                  key={i}
                  className={"picker-month-select-options"}
                >
                  {localize(x as any)}
                </option>
              ))}
            </select>
            <Tooltip title={localize("DateDiff")}>
              <button
                className={diffMode ? "active" : ""}
                onClick={() => setDiffMode((old) => !old)}
              >
                <MdOutlineSocialDistance />
              </button>
            </Tooltip>
            <Popover
              overlayStyle={{ padding: 0 }}
              open={showAdChooser}
              getPopupContainer={(triggerNode) =>
                triggerNode.parentNode as HTMLElement
              }
              trigger={[]}
              arrow={false}
              onOpenChange={setShowAdChooser}
              content={
                <Input
                  type="date"
                  value={adDate?.toLocaleDateString("en-CA")}
                  min={minDateAd?.toLocaleDateString("en-CA") ?? undefined}
                  max={maxDateAd?.toLocaleDateString("en-CA") ?? undefined}
                  className={"ad-picker"}
                  onChange={(e) => {
                    const selectedDate = e.target.valueAsDate;
                    if (!selectedDate) return;
                    const bsDate = getNpDate(selectedDate);
                    const { year, month, day } = parseNpDate(bsDate);
                    setActiveYear((_) => year);
                    setActiveMonth((_) => month);
                    setActiveDay((_) => day);
                  }}
                />
              }
            >
              <Tooltip
                title={localize("PickFromAD")}
                trigger={["hover", "click"]}
              >
                <button onClick={() => setShowAdChooser((old) => !old)}>
                  <CalendarOutlined />
                </button>
              </Tooltip>
            </Popover>
            <button onClick={() => nextMonthClick()}>&gt;</button>
            <button onClick={() => nextYearClick()}>&gt;&gt;</button>
          </div>
          <div
            className={"datepicker-day-headers "}
            style={{ overflow: "auto", fontSize: "10px", fontWeight: "bold" }}
          >
            {weekNames.map((x) => (
              <div className={"datepicker-day-header"} key={x}>
                {localize(x as any)}
              </div>
            ))}
          </div>
          {value && (
            <div className={"date-preview"}>
              <small>
                <strong>
                  {localize("BS")}:{" "}
                  {value
                    .split("/")
                    .map((x) => localize(x as any))
                    .join("/")}
                </strong>
              </small>
              <small>
                <strong>
                  {localize("AD")}: {adDate?.toDateString()}
                </strong>
              </small>
            </div>
          )}
          {diffMode && shadowAdDate && (dateDiff ?? 0) > 0 && (
            <div className={"date-preview"}>
              <small>
                <strong>
                  {localize("Diff")}:{" "}
                  {shadowDate!
                    .split("/")
                    .map((x) => localize(x as any))
                    .join("/")}{" "}
                  [{shadowAdDate!.toDateString()}]
                </strong>
              </small>
              <small>
                <strong>
                  {localize(dateDiff as any) +
                    " " +
                    (dateDiff === 1 ? localize("Day") : localize("Days"))}
                </strong>
              </small>
            </div>
          )}
          <div className={"datepicker-body"}>
            {days.map((x) => (
              <div
                //key={x}
                className={
                  "datepicker-day" +
                  (isDayNotInBracket(activeYear, activeMonth, Number(x))
                    ? " disabled"
                    : "") +
                  (x !== "" ? " allow-hover" : "") +
                  (Number(x) === activeDay ? " active" : "") +
                  (diffMode &&
                  activeYear == shadowActiveYear &&
                  activeMonth == shadowActiveMonth &&
                  Number(x) === shadowActiveDay
                    ? " shadow"
                    : "")
                }
                onClick={(_) => {
                  if (
                    x === "" ||
                    isDayNotInBracket(activeYear, activeMonth, Number(x))
                  )
                    return;
                  setActiveDay(Number(x));
                  if (!diffMode) setIsDatePickerVisible(false);
                }}
              >
                <span>{localize(x as any)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <Popover
        overlayStyle={{ padding: 0 }}
        overlayClassName="date-picker-popover"
        trigger="click"
        onOpenChange={(x) => {
          setShowAdChooser((_) => false);
          setIsDatePickerVisible((_) => x);
        }}
        placement="bottom"
        content={getDatePicker()}
        open={
          (isDatePickerVisible && !props.disabled) || (props.pinPicker ?? false)
        }
      >
        {getInputBox()}
      </Popover>
    </>
  );
};

export default NepaliDatePicker;
