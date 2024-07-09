import {
  PickersLayoutContentWrapper,
  PickersLayoutRoot,
  pickersLayoutClasses,
  usePickerLayout,
} from "@mui/x-date-pickers";
import { CustomLinearProgress } from "./Common";

export default function CustomPickersLayout(props) {
  const { loading } = props;
  const { content } = usePickerLayout(props);

  return (
    <PickersLayoutRoot className={pickersLayoutClasses.root} ownerState={props}>
      <PickersLayoutContentWrapper
        className={pickersLayoutClasses.contentWrapper}
      >
        {content}
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
}
