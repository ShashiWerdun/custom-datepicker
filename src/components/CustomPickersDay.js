import { Tooltip, styled } from "@mui/material";
import { PickersDay, pickersDayClasses } from "@mui/x-date-pickers";
import classNames from "classnames";
import { useState } from "react";

const CustomPickersDayRoot = styled("div")(() => ({
  height: 26,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  margin: "8px 0px",
}));

export default function CustomPickersDay(props) {
  const {
    isStartDate,
    isEndDate,
    isInSelectedRange,
    isHoverEndDate,
    isInHoverRange,
    getTooltipTitle,
    getMarker,
    ...pickersDayProps
  } = props;

  const {
    day,
    showDaysOutsideCurrentMonth,
    outsideCurrentMonth,
    onMouseEnter,
    onMouseLeave,
  } = pickersDayProps;

  const [tooltipOpen, setTooltipOpen] = useState(false);

  return (
    <Tooltip
      open={tooltipOpen}
      title={getTooltipTitle && getTooltipTitle(day)}
      placement="bottom"
      arrow
      disableFocusListener
      disableTouchListener
      sx={{
        background: "transparent",
        padding: 0,
      }}
    >
      <CustomPickersDayRoot>
        <PickersDay
          {...pickersDayProps}
          autoFocus={false}
          selected={false}
          className={classNames(
            (showDaysOutsideCurrentMonth || !outsideCurrentMonth) && {
              firstSelected: isStartDate,
              lastSelected: isEndDate,
              selectedRange: isInSelectedRange,
              hoverEnd: isHoverEndDate,
              hoverRange: isInHoverRange,
            }
          )}
          onMouseEnter={(event) => {
            onMouseEnter && onMouseEnter(event, day);
            setTooltipOpen(true);
          }}
          onMouseLeave={(event) => {
            onMouseLeave && onMouseLeave(event);
            setTooltipOpen(false);
          }}
          sx={{
            height: 20,
            width: 40,
            margin: 0,
            lineHeight: 0,
            [`&.${pickersDayClasses.root}, &.firstSelected.lastSelected`]: {
              borderRadius: 10,
            },
            "&.hoverEnd, &.hoverRange, &:hover": {
              backgroundColor: "var(--button-tertiary-hover)",
            },
            "&.firstSelected, &.lastSelected, &.selectedRange": {
              color: "var(--font-primary)",
              backgroundColor: "var(--highlight)",
            },
            "&.firstSelected": {
              borderBottomRightRadius: 0,
              borderTopRightRadius: 0,
            },
            "&.lastSelected, &.hoverEnd": {
              borderBottomLeftRadius: 0,
              borderTopLeftRadius: 0,
            },
            "&.selectedRange, &.hoverRange": {
              borderRadius: 0,
            },
          }}
        />
        {(showDaysOutsideCurrentMonth || !outsideCurrentMonth) &&
          getMarker &&
          getMarker(day)}
      </CustomPickersDayRoot>
    </Tooltip>
  );
}
