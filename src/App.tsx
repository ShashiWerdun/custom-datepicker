import { Box } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { CustomDatepicker } from "./components/CustomDatepicker";
import {
  CustomDatepickerTabs,
  DefaultDatepickerTab,
} from "./components/CustomDatepickerTabs";

function App() {
  const now = moment();
  const timezone = now.tz();
  const [tab, setTab] = useState(DefaultDatepickerTab);
  const [startDate, setStartDate] = useState(now);
  const [endDate, setEndDate] = useState(now);

  useEffect(() => {
    console.log("debug: App startDate", startDate.toLocaleString());
  }, [startDate]);

  useEffect(() => {
    console.log("debug: App endDate", endDate.toLocaleString());
  }, [endDate]);

  return (
    <Box>
      <CustomDatepicker
        value={{ start: startDate, end: endDate }}
        showLabel
        timezone={timezone}
        useTabs
        tab={tab}
        onTabChange={setTab}
        onChange={(argValue) => {
          argValue.start && setStartDate(argValue.start);
          argValue.end && setEndDate(argValue.end);
        }}
        getDayTooltipTitle={(day) => (
          <Box>{day.format("ddd MMM DD, YYYY Z")}</Box>
        )}
        getDayMarker={(day) => {
          const color =
            day.dayOfYear() % 3 === 0
              ? "red"
              : day.dayOfYear() % 3 === 1
              ? "blue"
              : "green";
          return (
            <Box
              sx={{
                height: "4px",
                width: "4px",
                backgroundColor: color,
                borderRadius: "4px",
              }}
            />
          );
        }}
      />
      <CustomDatepickerTabs selectedTab={tab} onTabChange={setTab} />
    </Box>
  );
}

export default App;
