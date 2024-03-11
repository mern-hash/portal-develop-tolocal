import { FunctionComponent, ReactElement, useState } from "react";
import { DatePicker, DatePickerInput, Heading } from "carbon-components-react";
import { Button } from "@/components/ui";
import { ArrowRight } from "@carbon/icons-react";
import { startOfDay, endOfDay } from "date-fns";

const DateFilter: FunctionComponent<{
  dateFilter: { id: string; label_from: string; label_to: string }[];
  filterVisible: boolean;
  onFilterByDate: (val) => void;
  toggleFilter: () => void;
}> = ({
  dateFilter,
  filterVisible,
  toggleFilter,
  onFilterByDate,
}): ReactElement | null => {
  const [filterInfo, setFilterInfo] = useState({});
  if (!filterVisible) return null;

  const onResetFilter = () => {
    setFilterInfo({});
    toggleFilter();
  };

  const onChangeMain = (item, dates) => {
    if (dates.length) {
      setFilterInfo({
        ...filterInfo,
        [item.id]:
          dates.length === 1 ? [dates[0]] : [dates[0], endOfDay(dates[1])],
      });
    } else {
      setFilterInfo({
        ...filterInfo,
        [item.id]: [],
      });
    }
  };

  const onBlurFrom = (item, evt) => {
    /**
     * When manually clearing "from" value, the evt.cT.value is empty, so if it's empty and there are some
     * params stored for filtering, we set it to empty array to clear all values stored and allow form to
     * be reseted by "Apply"-ing empty fields
     */
    if (!evt.currentTarget.value && !!filterInfo[item.id]?.length) {
      setFilterInfo({
        ...filterInfo,
        [item.id]: [],
      });
    }
    /**
     * If selected dates are empty (and they will be if user doesn't select values from popup calendar,
     * but instead writes the date himself) and there is onBlur value (as in user has typed in something
     * and blured away) set that value in the filter state.
     * If user has selected the date from the calendar this won't fire.
     */
    if (evt.currentTarget.value && !filterInfo[item.id]) {
      setFilterInfo({
        ...filterInfo,
        [item.id]: [new Date(evt.currentTarget.value)],
      });
    }
  };

  const onBlurTo = (item, evt) => {
    /**
     * If there is already selected date and there is e.cT.value, that means that user has manually entered
     * second date, and therefore need to update the state onBlur, or else it will not be added.
     * If there isn't already selected date, and there is e.cT.value, that means that user decided to manually
     * add end-date first, and that I had no idea what to do with start-date in that case, since this is a
     * date-range component and needs both values, so it will set start-date as start of entered day...
     */
    if (filterInfo[item.id] && evt.currentTarget.value) {
      if (filterInfo[item.id].length === 1) {
        setFilterInfo({
          ...filterInfo,
          [item.id]: [
            ...filterInfo[item.id],
            endOfDay(new Date(evt.currentTarget.value)),
          ],
        });
      }
    } else if (evt.currentTarget.value) {
      setFilterInfo({
        ...filterInfo,
        [item.id]: [
          startOfDay(new Date(evt.currentTarget.value)),
          endOfDay(new Date(evt.currentTarget.value)),
        ],
      });
    }
  };

  // Method required to configure the filter data, enabling it to submit empty array
  // to clear the filter
  const configFilterData = () => {
    const finalData = {};

    for (let obj in filterInfo) {
      // filterInfo[obj] is [from, to]
      if (filterInfo[obj].length === 2) {
        finalData[obj] = filterInfo[obj];
      } else {
        // Has only [from] -> make it [from, endOfDay(from)] to enable submitting with only 1 value
        if (filterInfo[obj].length) {
          finalData[obj] = [filterInfo[obj][0], endOfDay(filterInfo[obj][0])];
          setFilterInfo({
            ...filterInfo,
            [obj]: [filterInfo[obj][0], endOfDay(filterInfo[obj][0])],
          });
        }
      }
    }

    return finalData;
  };

  return (
    <div className="datatable__filter">
      <Heading className="heading">Filter</Heading>

      {dateFilter.map((item, key: number) => (
        <div className="datatable__filter__row" key={key}>
          <ArrowRight className="datatable__filter__arrow" />
          <DatePicker
            allowInput={true}
            datePickerType="range"
            dateFormat="m/d/Y"
            value={filterInfo[item.id]}
            onChange={(dateSelected) => onChangeMain(item, dateSelected)}
          >
            {/** Disclaimer: onBlur is required for date inputs to work with manual date inputs. It will not be fired
             * if user decides to select the date from the calendar, as it is supposed to do, or if user confirms the choice
             * by clicking enter. Only if he types in dates and clicks away. */}
            <DatePickerInput
              id={`${item.id}-start`}
              placeholder="mm/dd/yyyy"
              labelText={item.label_from}
              size="md"
              onBlur={(e) => onBlurFrom(item, e)}
            />
            <DatePickerInput
              id={`${item.id}-end`}
              placeholder="mm/dd/yyyy"
              labelText={item.label_to}
              size="md"
              onBlur={(e) => onBlurTo(item, e)}
            />
          </DatePicker>
        </div>
      ))}

      <div className="datatable__filter__actions">
        <Button
          label="Reset filters"
          type="button"
          kind="secondary"
          clickFn={() => {
            onFilterByDate({});
            onResetFilter();
          }}
          aria_label="clear"
        />
        <Button
          label="Apply filters"
          type="button"
          kind="primary"
          clickFn={() => {
            onFilterByDate(configFilterData());
            toggleFilter();
          }}
          aria_label="submit"
        />
      </div>
    </div>
  );
};

export default DateFilter;
