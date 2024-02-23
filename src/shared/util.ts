/**
 * @param data Array of items
 * @param text String to be displayed
 * @param suffix default to "s", in case of custom suffix add last letter as well
 * e.g. box -> boxes
 * pluralize([...data], "Random box", "xes") - as adding suffix will remove the last
 * letter of the text (story -> stor + ies; box -> bo + xes; mass -> mass + es etc.)
 * @returns
 */
export const pluralize = (
  data: any[] | number,
  text: string,
  suffix: string = "s"
): string => {
  if (
    (typeof data === "number" && data <= 1) ||
    (Array.isArray(data) && data.length <= 1)
  )
    return text;
  return suffix === "s" ? `${text}s` : text.slice(0, -1) + suffix;
};

export const deleteMsg = (
  count: number,
  term: string,
  suffix: string = "s"
) => {
  return count > 1
    ? suffix === "s"
      ? `${count} ${term.toLowerCase()}s have`
      : `${count} ${term.toLowerCase()}${suffix} have`
    : `${term} has`;
};

export const debounceEvent = (func: any, time: number) => {
  let timer: any;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, time);
  };
};

export const formatDateWithoutTimezone = (date: Date) => {
  return new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
};
