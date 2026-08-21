import 'react-datepicker/dist/react-datepicker.css';

import type { FC } from 'react';
import type { DatePickerProps, FilterOption } from './types';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { formatFilterDate, indonesianDate, toTimestamp } from 'utility/date';

import ReactDatePicker, { registerLocale } from 'react-datepicker';
import { Flex, Box, useOutsideClick } from '@chakra-ui/react';
import { colors } from 'styles/theme/constants';
import { When } from 'react-if';
import Text from 'components/Typography/Text';
import CustomHeader from './CustomHeader';
import CustomDay from './CustomDay';
import id from 'date-fns/locale/id';
import { Button } from 'components/Button/Button';
import Minus from 'components/Icon/Minus';
import DatePickerWrapper from './DatePickerWrapper';
import classNames from 'classnames';
import Filter from './Filter';
import { isEqual, startOfDay, subDays, addDays } from 'date-fns';
import FormInput from 'components/Forms/FormInput';
import { Modal } from 'components/Modal';
import Close from 'components/Icon/Close';

const DatePicker: FC<DatePickerProps> = ({
  queryStartDate,
  queryEndDate,
  setDateFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  applyFilterEvent,
  position = 'left',
  minDate,
  maxDate,
  filterItems,
  handleConfirm,
  selectsRange = false,
  infoComponent,
  filteredItem,
  setFilteredItem,
  width,
  containerWidth,
  label = 'Tanggal Mulai',
  placeholder = 'Masukkan Tanggal Mulai',
  icon,
  value,
  disabled,
  isClear,
  variant,
  required
}) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const [filterDateSelectedPopup, setFilterDateSelectedPopup] = useState<FilterOption>();
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [isAllDates, setIsAllDates] = useState<boolean>(false);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);

  const onChangeFilterDate = (dates: any) => {
    if (!selectsRange) {
      setTempStartDate(dates);
    } else {
      const [startDateOnChange, endDateOnChange] = dates;
      setTempStartDate(startDateOnChange);
      setTempEndDate(endDateOnChange);
    }
  };

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
    if (isButtonDisabled) return;
    if (!!setFilteredItem) setFilteredItem(filterDateSelectedPopup);

    if (selectsRange) {
      setStartDate(tempStartDate);
      setEndDate(tempEndDate);
      if (setDateFilter) {
        if (isAllDates) {
          setDateFilter('all');
        } else {
          const formInputDate =
            indonesianDate(toTimestamp(formatFilterDate(tempStartDate))) +
            ' - ' +
            indonesianDate(toTimestamp(formatFilterDate(tempEndDate)));
          setDateFilter(formInputDate);
        }
      }
    } else {
      setStartDate(tempStartDate);
      if (isClear) {
        setEndDate(null);
      }
      if (setDateFilter) {
        if (isAllDates) {
          setDateFilter('all');
        } else {
          const formInputDate = indonesianDate(toTimestamp(formatFilterDate(tempStartDate)));
          setDateFilter(formInputDate || '-');
        }
      }
    }

    if (applyFilterEvent) {
      applyFilterEvent();
    }
    // if (!!handleConfirm) handleConfirm();
    // isShow = false;

    setIsOpen(false);
  };

  const cancelFilterDate = () => {
    setIsOpen(false);
    // isShow = false;
  };

  const selectFilterDate = (filterOption: FilterOption) => {
    switch (filterOption) {
      case 'all':
        setTempStartDate(null);
        setTempEndDate(null);
        setIsAllDates(true);
        break;
      case 'today':
        setTempStartDate(new Date());
        setTempEndDate(new Date());
        setIsAllDates(false);
        break;
      case 'yesterday':
        // eslint-disable-next-line no-case-declarations
        const today = new Date();

        // eslint-disable-next-line no-case-declarations
        let yesterday = new Date(today);

        yesterday = new Date(yesterday.setDate(today.getDate() - 1));

        setTempStartDate(yesterday);
        setTempEndDate(yesterday);
        setIsAllDates(false);
        break;
      case 'last week':
        setTempStartDate(subDays(new Date(), 6));
        setTempEndDate(new Date());
        setIsAllDates(false);
        break;
      case 'custom':
        setTempStartDate(null);
        setTempEndDate(null);
        setIsAllDates(false);
        break;
      default:
        setTempStartDate(new Date());
        setTempEndDate(new Date());
        setIsAllDates(false);
        break;
    }

    if (typeof filterOption === 'number') {
      if (filterOption < 0) {
        setTempStartDate(subDays(new Date(), filterOption));
        setTempEndDate(new Date());
      } else {
        setTempStartDate(new Date());
        setTempEndDate(addDays(new Date(), filterOption));
      }
      setIsAllDates(false);
    }

    setFilterDateSelectedPopup(filterOption);
  };

  useEffect(() => {
    if (isOpen) {
      setTempStartDate(startDate);
      setTempEndDate(endDate ? endDate : null);
      setFilterDateSelectedPopup(filteredItem);
    } else {
      setTempStartDate(null);
      setTempEndDate(null);
      setFilterDateSelectedPopup(undefined);
    }
  }, [endDate, filteredItem, isOpen, startDate]);

  useEffect(() => {
    setIsButtonDisabled(
      ((selectsRange ? !tempStartDate || !tempEndDate : !tempStartDate) &&
        !filterItems &&
        (!filterDateSelectedPopup || filterDateSelectedPopup === 'custom')) ||
        (minDate &&
          tempStartDate &&
          minDate.setHours(0, 0, 0, 0) > tempStartDate.setHours(0, 0, 0, 0)) ||
        false
    );
  }, [
    endDate,
    filterDateSelectedPopup,
    filterItems,
    minDate,
    selectsRange,
    tempEndDate,
    tempStartDate
  ]);

  useEffect(() => {
    if (!router.isReady) return;
    dropdownFilterSelectedHandler(queryStartDate as string, queryEndDate as string);
  }, [dropdownFilterSelectedHandler, queryEndDate, queryStartDate, router.isReady]);

  useEffect(() => {
    if (!!handleConfirm) handleConfirm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  registerLocale('id', id);

  const [heightModal, setHeightModal] = useState(0);
  const [month, setMonth] = useState(new Date().getMonth());

  const ref = useRef<HTMLInputElement>(null);
  useOutsideClick({
    ref,
    handler: () => setIsOpen(false)
  });

  useEffect(() => {
    if (ref.current !== null) {
      setHeightModal(ref.current.clientHeight);
    }
  }, [month]);

  const children = () => {
    return (
      <Box
        position="absolute"
        mt="8px"
        zIndex="40"
        left={variant === 'modal' ? '-35%' : '0'}
        transform={variant === 'modal' ? 'translate(50%, -48%)' : ''}
        className={classNames(
          position === 'right' ? 'right-0' : 'left-0',
          isOpen ? 'block' : 'hidden'
        )}
        ref={ref}
      >
        <div
          className={`overflow-hidden rounded-lg border border-flash_white bg-white shadow-option_custom`}
        >
          <Flex>
            {!!filterItems && (
              <Filter
                items={filterItems}
                selectedFilter={filterDateSelectedPopup}
                handleSelect={selectFilterDate}
              />
            )}
            <Box minW={width ? width : '320px'}>
              <Box mx="26px" borderBottom={`solid 1px ${colors.callaLily}`} py="12px">
                {infoComponent && infoComponent}
                <Text variant="headlineBold" color={colors.darkWillow} mb="10px">
                  SELECT DATE
                </Text>
                <Flex justify="space-between" minH="24px">
                  <When
                    condition={
                      isAllDates && filterItems && filterItems.some((item) => item.key === 'all')
                    }
                  >
                    <Text variant="headingSmallBlack" color={colors.darkWillow}>
                      {filterItems?.find((item) => item.key === 'all')?.label}
                    </Text>
                  </When>
                  <When condition={!!tempStartDate}>
                    <Text variant="headingSmallBlack" color={colors.darkWillow}>
                      {indonesianDate(toTimestamp(formatFilterDate(tempStartDate)))}
                    </Text>
                  </When>
                  <When condition={!!tempEndDate}>
                    <Text variant="headingSmallBlack" color={colors.darkWillow}>
                      <Minus />
                    </Text>
                    <Text variant="headingSmallBlack" color={colors.darkWillow}>
                      {indonesianDate(toTimestamp(formatFilterDate(tempEndDate)))}
                    </Text>
                  </When>
                </Flex>
              </Box>
              <div className="block">
                <div className="filter-date">
                  {isOpen && (
                    <DatePickerWrapper
                      isDateRange={
                        formatFilterDate(tempStartDate) !== formatFilterDate(tempEndDate)
                      }
                    >
                      <ReactDatePicker
                        renderCustomHeader={(props: any) => {
                          return <CustomHeader setMonthDate={setMonth} {...props} />;
                        }}
                        renderDayContents={(_dayOfMonth, date) =>
                          date ? <CustomDay date={date} /> : null
                        }
                        inline
                        selectsRange={selectsRange}
                        locale="id"
                        selected={tempStartDate}
                        startDate={tempStartDate}
                        endDate={tempEndDate}
                        minDate={minDate}
                        maxDate={maxDate}
                        dateFormat="LL"
                        onChange={onChangeFilterDate}
                        disabledKeyboardNavigation
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                      />
                    </DatePickerWrapper>
                  )}
                </div>
              </div>
            </Box>
          </Flex>
          <div
            className="flex justify-end border-t border-t-calla_lily px-4 py-6"
            style={{
              alignItems: 'center'
            }}
          >
            <Text
              as="span"
              mr="36px"
              variant="buttonMediumBold"
              onClick={cancelFilterDate}
              color={colors.darkWillow}
              className="cursor-pointer"
            >
              Cancel
            </Text>
            <Button
              text="Apply"
              size="large"
              style={{
                width: '85px',
                height: '48px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 700,
                color: colors.white,
                backgroundColor: colors.ottomanRed,
                borderColor: colors.callaLily,
                marginRight: '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '8px'
              }}
              disabled={isButtonDisabled}
              onClick={applyFilterDate}
            />
          </div>
        </div>
      </Box>
    );
  };

  return (
    <>
      <FormInput
        type="text"
        size="small"
        label={label}
        placeholder={placeholder}
        value={value}
        onClick={(e: any) => {
          setIsOpen(!isOpen);
        }}
        icon={icon}
        readOnly
        style={{
          color: colors.bastille,
          width: containerWidth ? containerWidth : '100%',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
        disabled={disabled}
        required={required}
      />
      {variant === 'modal' ? (
        <Modal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
          closeOnEsc={false}
          closeOnOverlayClick={false}
          scrollBehavior={'inside'}
          isCentered
        >
          <Flex
            h="fit-content"
            justify={'center'}
            align={'center'}
            background={colors.white}
            borderRadius={'100%'}
            position={'absolute'}
            top={heightModal >= 598 ? '-320px' : '-300px'}
            right={'30px'}
            cursor={'pointer'}
            onClick={() => {
              setIsOpen(false);
            }}
            padding={'4px'}
          >
            <Close width={24} height={24} fill={colors.blackLead} />
          </Flex>
          {children()}
        </Modal>
      ) : (
        children()
      )}
    </>
  );
};

export default DatePicker;
