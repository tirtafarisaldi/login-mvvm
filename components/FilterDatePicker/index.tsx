import type { FilterDatePickerProps, FilterOption } from './types';
import { useState, useEffect, useCallback, type FC } from 'react';
import { useRouter } from 'next/router';
import { add, subDays, startOfDay, isEqual } from 'date-fns';
import { formatFilterDate } from 'utility/date';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FilterDatePicker: FC<FilterDatePickerProps> = ({
  queryStartDate,
  queryEndDate,
  showDropdownFilterTable,
  setShowDropdownFilterTable,
  setDateFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  applyFilterEvent,
  position = 'left'
}) => {
  const router = useRouter();

  const [maxDate, setMaxDate] = useState(new Date());
  const [filterDateSelectedPopup, setFilterDateSelectedPopup] = useState('');
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);

  const selectFilterDate = (filterOption: FilterOption) => {
    switch (filterOption) {
      case 'today':
        setTempStartDate(new Date());
        setTempEndDate(new Date());

        break;
      case 'yesterday':
        let today = new Date();
        let yesterday = new Date(today);

        yesterday = new Date(yesterday.setDate(today.getDate() - 1));

        setTempStartDate(yesterday);
        setTempEndDate(yesterday);

        break;
      case 'last week':
        setTempStartDate(subDays(new Date(), 6));
        setTempEndDate(new Date());

        break;
      case 'custom':
        setTempStartDate(null);
        setTempEndDate(null);

        break;
      default:
        setTempStartDate(new Date());
        setTempEndDate(new Date());
        break;
    }

    setFilterDateSelectedPopup(filterOption);
  };

  const onChangeFilterDate = (dates: any) => {
    const currentDate = new Date();
    const [datePickerStartDate, datePickerEndDate] = dates;
    setTempStartDate(datePickerStartDate);
    setTempEndDate(datePickerEndDate);

    // handle selected max date datepicker for custom filter
    // set max date that can be selected to current date when start date less than 31 days from today
    if (add(datePickerStartDate, { days: 30 }) > currentDate) {
      setMaxDate(currentDate);
    } else {
      // set max date that can be selected to full 31 days when start date more than 31 days from today
      setMaxDate(add(datePickerStartDate, { days: 30 }));
    }

    // set max date that can be selected to default (current date) when user has made a selection range (start date and end date)
    if (datePickerEndDate) {
      setMaxDate(currentDate);
    }
  };

  const setSelectFilter = useCallback(() => {
    if (startDate && endDate) {
      // set default dropdown filter to today when query string activity_start_date & activity_end_date equal with current date
      if (
        isEqual(startOfDay(new Date(startDate)), startOfDay(new Date())) &&
        isEqual(startOfDay(new Date(endDate)), startOfDay(new Date()))
      ) {
        setFilterDateSelectedPopup('today');
      } else if (
        // set default dropdown filter to yesterday when query string activity_start_date & activity_end_date equal with yesterday date
        isEqual(
          startOfDay(new Date(startDate)),
          startOfDay(new Date(new Date().setDate(new Date().getDate() - 1)))
        ) &&
        isEqual(
          startOfDay(new Date(endDate)),
          startOfDay(new Date(new Date().setDate(new Date().getDate() - 1)))
        )
      ) {
        setFilterDateSelectedPopup('yesterday');
      } else if (
        // set default dropdown filter to last week when query string activity_start_date equal with 7 days before today & activity_end_date equal with today
        isEqual(
          startOfDay(new Date(startDate)),
          startOfDay(new Date(new Date().setDate(new Date().getDate() - 6)))
        ) &&
        isEqual(startOfDay(new Date(endDate)), startOfDay(new Date()))
      ) {
        setFilterDateSelectedPopup('last week');
      } else {
        // otherwise set default dropdown filter to custom
        setFilterDateSelectedPopup('custom');
      }
    } else {
      setFilterDateSelectedPopup('');
    }
  }, [endDate, startDate]);

  const dropdownFilterSelectedHandler = useCallback(
    (queryStartDate: string, queryEndDate: string) => {
      if (queryStartDate && queryEndDate) {
        // set default dropdown filter to today when query string activity_start_date & activity_end_date equal with current date
        if (
          isEqual(startOfDay(new Date(queryStartDate)), startOfDay(new Date())) &&
          isEqual(startOfDay(new Date(queryEndDate)), startOfDay(new Date()))
        ) {
          setFilterDateSelectedPopup('today');

          setStartDate(startOfDay(new Date(queryStartDate)));
          setEndDate(startOfDay(new Date(queryEndDate)));
        } else if (
          // set default dropdown filter to yesterday when query string activity_start_date & activity_end_date equal with yesterday date
          isEqual(
            startOfDay(new Date(queryStartDate)),
            startOfDay(new Date(new Date().setDate(new Date().getDate() - 1)))
          ) &&
          isEqual(
            startOfDay(new Date(queryEndDate)),
            startOfDay(new Date(new Date().setDate(new Date().getDate() - 1)))
          )
        ) {
          setFilterDateSelectedPopup('yesterday');

          setStartDate(startOfDay(new Date(queryStartDate)));
          setEndDate(startOfDay(new Date(queryEndDate)));
        } else if (
          // set default dropdown filter to last week when query string activity_start_date equal with 7 days before today & activity_end_date equal with today
          isEqual(
            startOfDay(new Date(queryStartDate)),
            startOfDay(new Date(new Date().setDate(new Date().getDate() - 6)))
          ) &&
          isEqual(startOfDay(new Date(queryEndDate)), startOfDay(new Date()))
        ) {
          setFilterDateSelectedPopup('last week');

          setStartDate(startOfDay(new Date(queryStartDate)));
          setEndDate(startOfDay(new Date(queryEndDate)));
        } else {
          // otherwise set default dropdown filter to custom
          setFilterDateSelectedPopup('custom');

          setStartDate(startOfDay(new Date(queryStartDate)));
          setEndDate(startOfDay(new Date(queryEndDate)));
        }
      }
    },
    [setEndDate, setStartDate]
  );

  const applyFilterDate = () => {
    // if (startDate && endDate) {
    //   setShowDropdownFilterTable(false);

    //   if (setDateFilter) {
    //     const formInputDate = formatFilterDate(startDate) + ' - ' + formatFilterDate(endDate);
    //     setDateFilter(formInputDate);
    //   }

    //   if (applyFilterEvent) {
    //     applyFilterEvent();
    //   }
    //   // isShow = false;
    // }

    if (tempStartDate && tempEndDate) {
      setStartDate(tempStartDate);
      setEndDate(tempEndDate);

      if (setDateFilter) {
        const formInputDate =
          formatFilterDate(tempStartDate) + ' - ' + formatFilterDate(tempEndDate);
        setDateFilter(formInputDate);
      }

      if (applyFilterEvent) {
        applyFilterEvent();
      }
      setShowDropdownFilterTable(false);
      // isShow = false;
    }
  };

  const cancelFilterDate = () => {
    setShowDropdownFilterTable(false);
    // isShow = false;
  };

  useEffect(() => {
    if (showDropdownFilterTable) {
      setTempStartDate(startDate);
      setTempEndDate(endDate);
      setSelectFilter();
    } else {
      setTempStartDate(null);
      setTempEndDate(null);
    }
  }, [endDate, setSelectFilter, showDropdownFilterTable, startDate]);

  useEffect(() => {
    if (!router.isReady) return;
    dropdownFilterSelectedHandler(queryStartDate as string, queryEndDate as string);
  }, [dropdownFilterSelectedHandler, queryEndDate, queryStartDate, router.isReady]);

  return (
    <>
      <div
        className={`z-40 absolute mt-4 ${
          position == 'right' ? 'right-0' : 'left-0'
        } border border-flash_white bg-white shadow-option_custom rounded-lg overflow-hidden ${
          showDropdownFilterTable ? 'block' : 'hidden'
        }`}
      >
        <div className="block">
          <div className="md:flex block">
            <ul className="w-full min-w-166px">
              <li
                className={`px-4 py-3 font-bold text-size14 leading-17px cursor-pointer hover:bg-calla_lily ${
                  filterDateSelectedPopup == 'today' ? 'bg-calla_lily' : ''
                }`}
                onClick={() => selectFilterDate('today')}
              >
                Today
              </li>
              <li
                className={`px-4 py-3 font-bold text-size14 leading-17px cursor-pointer hover:bg-calla_lily ${
                  filterDateSelectedPopup == 'yesterday' ? 'bg-calla_lily' : ''
                }`}
                onClick={() => selectFilterDate('yesterday')}
              >
                Yesterday
              </li>
              <li
                className={`px-4 py-3 font-bold text-size14 leading-17px cursor-pointer hover:bg-calla_lily ${
                  filterDateSelectedPopup == 'last week' ? 'bg-calla_lily' : ''
                }`}
                onClick={() => selectFilterDate('last week')}
              >
                Last Week
              </li>
              <hr className="my-3" />
              <li
                className={`px-4 py-3 font-bold text-size14 leading-17px cursor-pointer hover:bg-calla_lily ${
                  filterDateSelectedPopup == 'custom' ? 'bg-calla_lily' : ''
                }`}
                onClick={() => selectFilterDate('custom')}
              >
                Custom...
              </li>
            </ul>
            <div className="border-l border-l-calla_lily">
              <div className="filter-date">
                {showDropdownFilterTable && (
                  <DatePicker
                    inline
                    selectsRange
                    selected={tempStartDate}
                    startDate={tempStartDate}
                    endDate={tempEndDate}
                    maxDate={maxDate}
                    dateFormat="yyyy-MM-dd"
                    onChange={onChangeFilterDate}
                    disabledKeyboardNavigation
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between border-t border-t-calla_lily px-4 py-6">
            <span className="text-size14 leading-17px text-tarnished_silver">Filter Date</span>
            <div>
              <span
                onClick={cancelFilterDate}
                className="font-bold text-size14 leading-17px text-black_lead px-4 cursor-pointer"
              >
                Cancel
              </span>
              <a
                className={`font-bold text-size14 leading-17px px-4 ${
                  tempStartDate && tempEndDate
                    ? 'cursor-pointer text-deep_skyblue'
                    : 'cursor-not-allowed text-black_lead'
                }`}
                onClick={applyFilterDate}
              >
                Apply
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterDatePicker;
