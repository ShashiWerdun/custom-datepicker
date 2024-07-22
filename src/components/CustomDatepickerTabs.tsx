import { Tab, Tabs, styled, tabsClasses } from "@mui/material";
import { DateView } from "@mui/x-date-pickers";
import React, { useCallback, useEffect, useState } from "react";

export enum DatepickerTab {
  RANGE = "range",
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
}

export const DefaultDatepickerTab = DatepickerTab.DAY;

export const DatepickerTabsDefaultViews: { [_: string]: DateView } = {
  [DatepickerTab.RANGE]: "day",
  [DatepickerTab.DAY]: "day",
  [DatepickerTab.WEEK]: "day",
  [DatepickerTab.MONTH]: "month",
  [DatepickerTab.YEAR]: "year",
};

export const DatepickerTabsViews: { [_: string]: DateView[] } = {
  [DatepickerTab.RANGE]: ["day", "year"],
  [DatepickerTab.DAY]: ["day", "year"],
  [DatepickerTab.WEEK]: ["day", "year"],
  [DatepickerTab.MONTH]: ["month", "year"],
  [DatepickerTab.YEAR]: ["year"],
};

interface ICustomDatepickerTabsProps {
  selectedTab?: DatepickerTab;
  onTabChange?: (selectedTab: DatepickerTab) => void;
}

const VerticalTabs = styled(Tabs)(({ theme }) => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  [`& .${tabsClasses.indicator}`]: {
    right: "unset",
    width: 4,
  },
}));

export const CustomDatepickerTabs: React.FC<ICustomDatepickerTabsProps> = (
  props
) => {
  const { selectedTab, onTabChange } = props;

  const [iSelectedTab, iSetSelectedTab] = useState(DefaultDatepickerTab);

  const setSelectedTab = useCallback(
    (value: DatepickerTab) => {
      if (onTabChange) {
        onTabChange(value);
        return;
      }

      iSetSelectedTab(value);
    },
    [onTabChange, iSetSelectedTab]
  );

  useEffect(() => {
    selectedTab && iSetSelectedTab(selectedTab);
  }, [selectedTab]);

  return (
    <VerticalTabs
      value={iSelectedTab}
      orientation="vertical"
      textColor="secondary"
      indicatorColor="secondary"
      onChange={(event, value) => setSelectedTab(value)}
    >
      {Object.values(DatepickerTab).map((tab) => (
        <Tab key={tab} label={tab} value={tab} />
      ))}
    </VerticalTabs>
  );
};
