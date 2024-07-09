import { TextField, iconButtonClasses, styled } from "@mui/material";
import {
  CalendarIcon,
  DatePicker,
  LocalizationProvider,
  dateCalendarClasses,
  dayCalendarClasses,
  pickersCalendarHeaderClasses,
  pickersSlideTransitionClasses,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { pickersArrowSwitcherClasses } from "@mui/x-date-pickers/internals";
import moment from "moment-timezone";
import { useEffect, useRef, useState } from "react";
import { TypographyBoldDefault } from "./Common";
import CustomPickersDay from "./CustomPickersDay";
import CustomPickersLayout from "./CustomPickersLayout";

const Root = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  flex: "auto",
  gap: "4px",
}));

export default function CustomDatepicker(props) {
  const {
    startDate,
    endDate,
    loading,
    showLabel,
    fixedRange,
    timezone,
    format,
    className,
    disabled,
    disablePast,
    disableFuture,
    showDaysOutsideCurrentMonth,
    minDate: inputMinDate,
    maxDate: inputMaxDate,
    onChangeStartDate,
    onChangeEndDate,
    onPopupToggle,
    onViewDateChange,
    getDayTooltipTitle,
    getDayMarker,
  } = props;

  const ref = useRef(null);
  const today = moment.tz(timezone).startOf("date");

  const [open, setOpen] = useState(false);
  const [selectInProgress, _setSelectInProgress] = useState(false);
  const setSelectInProgress = (inProgress) => {
    if (!fixedRange) {
      _setSelectInProgress(inProgress);
    }
  };
  const [hoverEndDate, setHoverEndDate] = useState(undefined);
  const [viewDate, setViewDate] = useState(startDate);

  useEffect(() => {
    /* fire callback for Popup toggle */
    onPopupToggle && onPopupToggle(open);
    if (open) {
      /* set viewDate to value when opening */
      setViewDate(startDate);
    } else {
      /* set selectInProgress to false if closed */
      setSelectInProgress(false);
    }
  }, [open]);

  useEffect(() => {
    /* fire callback for view date change */
    onViewDateChange && onViewDateChange(viewDate);
  }, [viewDate]);

  useEffect(() => {
    if (fixedRange) {
      onChangeEndDate &&
        onChangeEndDate(startDate.clone().add(fixedRange - 1, "days"));
      setOpen(false);
      return;
    }

    if (selectInProgress) {
      onChangeEndDate(startDate);
    }
  }, [startDate]);

  useEffect(() => {
    if (fixedRange) {
      onChangeEndDate(startDate.clone().add(fixedRange - 1, "days"));
    }
  }, [fixedRange]);

  const isToday = (date) => {
    return date.isSame(today, "days");
  };

  const getMinDate = () => {
    let minDate = inputMinDate;

    /* If past is disabled, minDate should be the later date from minDate or today */
    if (disablePast) {
      minDate = (minDate && moment.max(minDate, today)) || today;
    }

    /* If selecting endDate, minDate should be later than startDate */
    if (selectInProgress) {
      minDate = (minDate && moment.max(minDate, startDate)) || startDate;
    }

    return minDate;
  };

  const getMaxDate = () => {
    let maxDate = inputMaxDate;

    /* If future is disabled, maxDate should be earlier date from maxDate or today */
    if (disableFuture) {
      maxDate = (maxDate && moment.min(maxDate, today)) || today;
    }

    return maxDate;
  };

  const onDaySelect = (value) => {
    if (!selectInProgress) {
      onChangeStartDate(value);
      setSelectInProgress(true);
      return;
    }

    setOpen(false);
    onChangeEndDate(value);
  };

  const getTextFieldValue = () => {
    const startDateString = startDate.format(format);
    const endDateString = ` - ${
      selectInProgress ? "Select end date" : endDate.format(format)
    }`;
    return `${startDateString}${fixedRange === 1 ? "" : `${endDateString}`}`;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Root className={className}>
        {showLabel && (
          <TypographyBoldDefault>
            {"Start date - End date"}
          </TypographyBoldDefault>
        )}
        <TextField
          variant="outlined"
          value={getTextFieldValue()}
          inputRef={ref}
          InputProps={{
            endAdornment: <CalendarIcon sx={{ fontSize: "16px" }} />,
            readOnly: true,
            slotProps: {
              input: {
                sx: {
                  padding: "8px",
                  cursor: "pointer",
                },
              },
            },
            sx: {
              cursor: "pointer",
            },
          }}
          onClick={() => setOpen(true)}
        />
        <DatePicker
          open={open}
          onClose={() => setOpen(false)}
          value={startDate}
          disabled={disabled}
          timezone={timezone}
          showDaysOutsideCurrentMonth={showDaysOutsideCurrentMonth}
          minDate={getMinDate()}
          maxDate={getMaxDate()}
          onMonthChange={setViewDate}
          onYearChange={setViewDate}
          reduceAnimations
          slots={{
            day: (props) => {
              const showHoverRange = selectInProgress && hoverEndDate;
              const isStartDate = props.day.isSame(startDate, "day");
              const isEndDate = props.day.isSame(endDate, "day");
              const isHoverEndDate = props.day.isSame(hoverEndDate, "day");

              const isInSelectedRange = props.day.isBetween(
                startDate,
                endDate,
                "days",
                "()"
              );

              const isInHoverRange = props.day.isBetween(
                startDate,
                hoverEndDate,
                "days",
                "()"
              );

              return (
                <CustomPickersDay
                  {...props}
                  today={isToday(props.day)}
                  isStartDate={isStartDate}
                  isEndDate={!selectInProgress && isEndDate}
                  isInSelectedRange={isInSelectedRange}
                  isHoverEndDate={
                    showHoverRange && !isStartDate && isHoverEndDate
                  }
                  isInHoverRange={showHoverRange && isInHoverRange}
                  onDaySelect={onDaySelect}
                  onMouseEnter={() =>
                    selectInProgress && setHoverEndDate(props.day)
                  }
                  onMouseLeave={() =>
                    selectInProgress && setHoverEndDate(undefined)
                  }
                  getTooltipTitle={getDayTooltipTitle}
                  getMarker={getDayMarker}
                />
              );
            },
            layout: CustomPickersLayout,
            textField: () => null,
            switchViewButton: () => null,
          }}
          slotProps={{
            popper: {
              anchorEl: ref.current,
              sx: (theme) => ({
                zIndex: theme.zIndex.modal,
                [`& .${dateCalendarClasses.root}`]: {
                  maxHeight: "none",
                },
                [`& .${dayCalendarClasses.monthContainer}`]: {
                  paddingBottom: 1,
                },
                [`& .${pickersSlideTransitionClasses.root}`]: {
                  minHeight: "auto",
                },
              }),
            },
            calendarHeader: {
              sx: {
                position: "relative",
                [`& .${pickersCalendarHeaderClasses.labelContainer}`]: {
                  margin: "auto",
                },
                [`& .${pickersArrowSwitcherClasses.root}`]: {
                  width: 0,
                },
                [`& .${iconButtonClasses.edgeEnd}, & .${iconButtonClasses.edgeStart}`]:
                  {
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    borderRadius: "4px",
                  },
                [`& .${iconButtonClasses.edgeEnd}`]: {
                  left: 8,
                },
                [`& .${iconButtonClasses.edgeStart}`]: {
                  right: 8,
                },
              },
            },
            layout: {
              loading,
            },
          }}
        />
      </Root>
    </LocalizationProvider>
  );
}
