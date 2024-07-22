import { Box } from "@mui/material";
import {
  DateView,
  PickersLayoutContentWrapper,
  PickersLayoutProps,
  PickersLayoutRoot,
  pickersLayoutClasses,
  usePickerLayout,
} from "@mui/x-date-pickers";
import { Moment } from "moment";
import React from "react";
import { CustomLinearProgress } from "./Common";
import { CustomDatepickerTabs, DatepickerTab } from "./CustomDatepickerTabs";

export interface ICustomPickersLayoutProps {
  loading?: boolean;
  useTabs?: boolean;
  selectedTab?: DatepickerTab;
  onTabChange?: (selectedTab: DatepickerTab) => void;
}

export const CustomPickersLayout: React.FC<
  ICustomPickersLayoutProps &
    PickersLayoutProps<Moment | null, Moment, DateView>
> = (props) => {
  const { loading, useTabs, selectedTab, onTabChange } = props;
  const { content } = usePickerLayout(props);

  return (
    <PickersLayoutRoot className={pickersLayoutClasses.root} ownerState={props}>
      <PickersLayoutContentWrapper
        className={pickersLayoutClasses.contentWrapper}
      >
        <Box display="flex">
          {useTabs && (
            <CustomDatepickerTabs
              selectedTab={selectedTab}
              onTabChange={onTabChange}
            />
          )}
          {content}
        </Box>
        {loading && (
          <CustomLinearProgress
            sx={{
              borderBottomLeftRadius: "4px",
              borderBottomRightRadius: "4px",
            }}
          />
        )}
      </PickersLayoutContentWrapper>
    </PickersLayoutRoot>
  );
};
