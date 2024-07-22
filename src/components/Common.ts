import { LinearProgress, Typography, styled } from "@mui/material";
import { linearProgressClasses } from "@mui/material/LinearProgress";

export const TypographyBoldDefault = styled(Typography)(() => ({
  display: "inline-block",
  // ellipsis
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
  // typography properties
  fontFamily: "Roboto",
  fontSize: "14px",
  fontStyle: "normal",
  fontWeight: 600,
  lineHeight: "20px" /* 142.857% */,
  letterSpacing: "0.28px",
}));

export const CustomLinearProgress = styled(LinearProgress)(() => ({
  [`&.${linearProgressClasses.root}`]: {
    backgroundColor: "var(--linear-progress-primary)",
  },
  [`& .${linearProgressClasses.bar}`]: {
    backgroundColor: "var(--linear-progress-secondary)",
  },
}));
