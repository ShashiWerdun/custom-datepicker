import { Box } from "@mui/material";
import CustomDatepicker from "./components/CustomDatepicker";
import { useState } from "react";
import moment from "moment";

function App() {
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const timezone = moment().tz();

  return (
    <Box>
      <CustomDatepicker
        startDate={startDate}
        endDate={endDate}
        showLabel
        timezone={timezone}
        format="MMM DD, YYYY"
        disablePast
        showDaysOutsideCurrentMonth
        onChangeStartDate={setStartDate}
        onChangeEndDate={setEndDate}
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
    </Box>
  );
}

export default App;
