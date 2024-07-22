import { TextField, iconButtonClasses, styled } from "@mui/material";
import {
  CalendarIcon,
  DatePicker,
  DatePickerSlotProps,
  DateView,
  LocalizationProvider,
  PickersDayProps,
  PickersLayoutProps,
  dateCalendarClasses,
  dayCalendarClasses,
  pickersCalendarHeaderClasses,
  pickersSlideTransitionClasses,
} from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import {
  DayCalendarProps,
  pickersArrowSwitcherClasses,
} from "@mui/x-date-pickers/internals";
import moment, { Moment } from "moment-timezone";
import React, {
  useCallback,
  useMemo,
  useRef,
  useState
} from "react";
import { useEffectEvent } from "../hooks/useEffectEvent";
import { TypographyBoldDefault } from "./Common";
import {
  DatepickerTab,
  DatepickerTabsDefaultViews,
  DatepickerTabsViews,
  DefaultDatepickerTab,
} from "./CustomDatepickerTabs";
import { CustomPickersDay, ICustomPickersDayProps } from "./CustomPickersDay";
import {
  CustomPickersLayout,
  ICustomPickersLayoutProps,
} from "./CustomPickersLayout";

interface IRangeTabState {
  selectInProgress: boolean;
  hoverEndDate?: Moment;
}

interface IOwnProps {
  value?: { start?: Moment; end?: Moment };
  loading?: boolean;
  showLabel?: boolean;
  outlined?: boolean;
  timezone?: string;
  className?: string;
  disabled?: boolean;
  showDaysOutsideCurrentMonth?: boolean;
  /** Use Tabs */
  useTabs?: boolean;
  tab?: DatepickerTab;
  /** Disable past dates */
  disablePast?: boolean;
  /** Disable future dates */
  disableFuture?: boolean;
  minDate?: Moment;
  maxDate?: Moment;
  onChange?: (value: { start?: Moment; end?: Moment }) => void;
  onTabChange?: (tab: DatepickerTab) => void;
  /** Callback fired on Popup open and close */
  onPopupToggle?: (open: boolean) => void;
  /** Callback fired on view month and year change */
  onViewDateChange?: (month: Moment) => void;
  /** Function to get Day Tooltip Title Element */
  getDayTooltipTitle?: (date: Moment) => React.JSX.Element;
  /** Function to get Day Marker Element */
  getDayMarker?: (date: Moment) => React.JSX.Element;
}

const dateFormat = "MMM DD, YYYY";
const monthFormat = "MMM, YYYY";
const yearFormat = "YYYY";

const Root = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  flex: "auto",
  gap: "4px",
  "& .MuiInputBase-root": {
    cursor: "pointer",
  },
}));

export const CustomDatepicker: React.FC<IOwnProps> = (props) => {
  const {
    value: eValue,
    tab: eTab,
    className,
    loading,
    showLabel,
    outlined,
    useTabs,
    disabled,
    timezone,
    showDaysOutsideCurrentMonth,
    disablePast,
    disableFuture,
    minDate,
    maxDate,
    onChange: eOnChange,
    onTabChange: eOnTabChange,
    onPopupToggle: eOnPopupToggle,
    onViewDateChange,
    getDayTooltipTitle,
    getDayMarker,
  } = props;

  const ref = useRef(null);
  const now = moment.tz(timezone || "utc");
  const today = now.startOf("day");
  const [iValue, setIValue] = useState({ start: now, end: now });
  const [iTab, setITab] = useState<DatepickerTab>(DefaultDatepickerTab);
  const [iIsOpen, setIIsOpen] = useState(false);
  const [rangeTabState, setRangeTabState] = useState<IRangeTabState>({
    selectInProgress: false,
  });

  const tab = eTab || iTab;
  const value = useMemo(() => ({ ...iValue, ...eValue }), [eValue, iValue]);

  const onChange = useCallback(
    (argValue: { start?: Moment; end?: Moment }) => {
      eOnChange && eOnChange(argValue);
      !eValue && setIValue({ ...value, ...argValue });
    },
    [eOnChange, eValue, value]
  );

  useEffectEvent(tab, () => {
    setRangeTabState({ selectInProgress: false });

    if (tab === DatepickerTab.RANGE) {
      return;
    }

    if (tab === DatepickerTab.DAY) {
      onChange({ end: value.start.clone() });
      return;
    }

    if (tab === DatepickerTab.WEEK) {
      onChange({ end: value.start.clone().add({ weeks: 1, days: -1 }) });
      return;
    }

    if (tab === DatepickerTab.MONTH) {
      onChange({
        start: value.start.clone().set({ date: 1 }),
        end: value.start.clone().add({ months: 1 }).set({ date: 0 }),
      });
      return;
    }

    if (tab === DatepickerTab.YEAR) {
      onChange({
        start: value.start.clone().set({ date: 1, month: 0 }),
        end: value.start.clone().add({ years: 1 }).set({ date: 0, month: 0 }),
      });
      return;
    }
  })

  const onTabChange = useCallback(
    (argTab: DatepickerTab) => {
      eOnTabChange && eOnTabChange(argTab);
      !eTab && setITab(argTab);
    },
    [eOnTabChange, eTab]
  );

  const onPopupToggle = useCallback(
    (argIsOpen: boolean) => {
      eOnPopupToggle && eOnPopupToggle(argIsOpen);
      setIIsOpen(argIsOpen);
    },
    [eOnPopupToggle]
  );

  const datepickerOnChange = useCallback(
    (argDate: Moment) => {
      let resultValue: { start?: Moment; end?: Moment } = {
        start: argDate.clone(),
      };

      if (tab === DatepickerTab.RANGE) {
        resultValue.end = argDate.clone();
        if (rangeTabState.selectInProgress) {
          delete resultValue.start;
          onPopupToggle(false);
        }
        setRangeTabState({ selectInProgress: !rangeTabState.selectInProgress });
      }

      if (tab === DatepickerTab.DAY) {
        resultValue.end = argDate.clone();
      }

      if (tab === DatepickerTab.WEEK) {
        resultValue.end = argDate.clone().add({ weeks: 1, days: -1 });
      }

      if (tab === DatepickerTab.MONTH) {
        resultValue.end = argDate.clone().add({ months: 1 }).set({ date: 0 });
      }

      if (tab === DatepickerTab.YEAR) {
        resultValue.end = argDate
          .clone()
          .add({ years: 1 })
          .set({ month: 0, date: 0 });
      }

      onChange(resultValue);
    },
    [onChange, onPopupToggle, rangeTabState.selectInProgress, tab]
  );

  const getMinDate = useCallback(() => {
    let iMinDate = minDate;

    /* If past is disabled, minDate should be the later date from minDate or todayBroadcastDate */
    if (disablePast) {
      iMinDate = (iMinDate && moment.max(iMinDate, today)) || today;
    }

    /* If in RANGE tab and selection in progress, minDate should be later than startDate */
    if (rangeTabState.selectInProgress) {
      iMinDate = (iMinDate && moment.max(iMinDate, value.start)) || value.start;
    }

    return iMinDate;
  }, [
    disablePast,
    minDate,
    rangeTabState.selectInProgress,
    today,
    value.start,
  ]);

  const getMaxDate = useCallback(() => {
    let iMaxDate = maxDate;

    /* If future is disabled, maxDate should be earlier date from maxDate or todayBroadcastDate */
    if (disableFuture) {
      iMaxDate = (iMaxDate && moment.min(iMaxDate, today)) || today;
    }

    return iMaxDate;
  }, [disableFuture, maxDate, today]);

  const getTextFieldValue = useCallback(() => {
    switch (tab) {
      case DatepickerTab.RANGE:
      case DatepickerTab.WEEK:
        return `${value.start.format(dateFormat)} - ${rangeTabState.selectInProgress
          ? "Select end date"
          : value.end.format(dateFormat)
          }`;
      case DatepickerTab.DAY:
        return value.start.format(dateFormat);
      case DatepickerTab.MONTH:
        return value.start.format(monthFormat);
      case DatepickerTab.YEAR:
        return value.start.format(yearFormat);
    }
  }, [rangeTabState.selectInProgress, tab, value.end, value.start]);

  const getCustomPickersDayProps = useCallback(
    (
      props: DayCalendarProps<Moment> & { day: Moment }
    ): Partial<PickersDayProps<Moment>> => {
      const isStartDate = props.day.isSame(value.start, "day");
      const isEndDate =
        !rangeTabState.selectInProgress && props.day.isSame(value.end, "day");
      const isHoverEndDate =
        rangeTabState.hoverEndDate &&
        !props.day.isSame(value.start, "day") &&
        props.day.isSame(rangeTabState.hoverEndDate, "day");

      const isInSelectedRange = props.day.isBetween(
        value.start,
        value.end,
        "days",
        "()"
      );

      const isInHoverRange =
        rangeTabState.hoverEndDate &&
        props.day.isBetween(
          value.start,
          rangeTabState.hoverEndDate,
          "days",
          "()"
        );

      return {
        ...({
          timezone,
          isStartDate,
          isEndDate,
          isInSelectedRange,
          isHoverEndDate,
          isInHoverRange,
          getDayTooltipTitle,
          getDayMarker,
        } as ICustomPickersDayProps),
        onMouseEnter: (_, day) =>
          rangeTabState.selectInProgress &&
          setRangeTabState({
            ...rangeTabState,
            hoverEndDate: day,
          }),
        onMouseLeave: () =>
          rangeTabState.selectInProgress &&
          setRangeTabState({ ...rangeTabState, hoverEndDate: undefined }),
      };
    },
    [
      getDayMarker,
      getDayTooltipTitle,
      rangeTabState,
      timezone,
      value.end,
      value.start,
    ]
  );

  const getLabel = useCallback(() => {
    switch (tab) {
      case DatepickerTab.RANGE:
      case DatepickerTab.WEEK:
        return "Start date - End date";
      case DatepickerTab.DAY:
        return "Start date";
      case DatepickerTab.MONTH:
        return "Month";
      case DatepickerTab.YEAR:
        return "Year";
    }
  }, [tab]);

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Root className={className}>
        {showLabel && (
          <TypographyBoldDefault>{getLabel()}</TypographyBoldDefault>
        )}
        <TextField
          variant={outlined ? "outlined" : "standard"}
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
          }}
          onClick={() => {
            onViewDateChange && onViewDateChange(value.start);
            onPopupToggle(true);
          }}
        />
        <DatePicker
          open={iIsOpen}
          value={value.start}
          onChange={(argDate) => {
            argDate && datepickerOnChange(argDate);
          }}
          onMonthChange={(month) => onViewDateChange && onViewDateChange(month)}
          onYearChange={(year) => onViewDateChange && onViewDateChange(year)}
          onClose={() => {
            setRangeTabState({ selectInProgress: false });
            onPopupToggle(false);
          }}
          disabled={disabled}
          timezone={timezone}
          minDate={getMinDate()}
          maxDate={getMaxDate()}
          showDaysOutsideCurrentMonth={showDaysOutsideCurrentMonth}
          openTo={DatepickerTabsDefaultViews[tab]}
          {...((tab === DatepickerTab.MONTH || tab === DatepickerTab.YEAR) && {
            views: DatepickerTabsViews[tab],
          })}
          view={DatepickerTabsDefaultViews[tab]}
          reduceAnimations
          closeOnSelect={tab !== DatepickerTab.RANGE}
          slots={{
            textField: () => null,
            switchViewButton: () => null,
            layout: CustomPickersLayout as React.JSXElementConstructor<
              PickersLayoutProps<Moment | null, Moment, DateView>
            >,
            day: CustomPickersDay as React.JSXElementConstructor<
              PickersDayProps<Moment>
            >,
          }}
          slotProps={
            {
              popper: {
                anchorEl: ref.current,
                sx: {
                  zIndex: 1,
                  [`& .${dateCalendarClasses.root}`]: {
                    maxHeight: "none",
                  },
                  [`& .${dayCalendarClasses.monthContainer}`]: {
                    paddingBottom: 1,
                  },
                  [`& .${pickersSlideTransitionClasses.root}`]: {
                    minHeight: "auto",
                  },
                },
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
                ...({
                  loading,
                  useTabs,
                  selectedTab: tab,
                  onTabChange,
                } as Partial<ICustomPickersLayoutProps>),
              },
              day: (props) => getCustomPickersDayProps(props),
            } as DatePickerSlotProps<Moment, false>
          }
        />
      </Root>
    </LocalizationProvider>
  );
};
