import {
  previousDay,
  addDays,
  addMonths,
  addYears,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";

//TODO - check if last week means mon-sun or previous 7 days
export const calcLastWeek = () => {
  const weekEnd = endOfDay(previousDay(new Date(), 1));
  const weekStart = addDays(startOfDay(previousDay(new Date(), 1)), -6);
  return {
    from: weekStart,
    to: weekEnd,
  };
};

export const calcLastMonth = () => {
  const dayInPrevMonth = addMonths(startOfMonth(new Date()), -1);
  const monthStart = startOfMonth(dayInPrevMonth);
  const monthEnd = endOfMonth(dayInPrevMonth);
  return {
    from: monthStart,
    to: monthEnd,
  };
};

export const calcLastYear = () => {
  const dayInPrevYear = addYears(startOfYear(new Date()), -1);
  const yearStart = startOfYear(dayInPrevYear);
  const yearEnd = endOfYear(dayInPrevYear);
  return {
    from: yearStart,
    to: yearEnd,
  };
};

export const calcRange = (val: string) => {
  switch (val) {
    case "last-week":
      return calcLastWeek();

    case "last-month":
      return calcLastMonth();

    case "last-year":
      return calcLastYear();

    default:
      return undefined;
  }
};
