/**
 * The bar displayed by a StatMeter component.
 */

import React from "react";
import { Box, useTheme } from "@mui/material";

interface BarProps {
  value: number;
}

export const Bar = ({ value }: BarProps) => {
  const theme = useTheme();

  const containerStyle = {
    position: "relative",
  };

  // the style of the parent bar (the empty outline that will be filled)
  const parentStyle = {
    backgroundColor: theme.palette.secondary.light,
    position: "relative",
    filter: "opacity(0.25)",
    height: 20,
    borderRadius: 1.5,
  };

  // the style of the child bar (the bar that fills the parent)
  const childStyle = {
    position: "absolute",
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 1.5,
    top: 0,
    bottom: 0,
    width: `${value}%`,
  };

  return (
    <>
      <Box sx={containerStyle}>
        <Box sx={parentStyle}></Box>
        <Box sx={childStyle} />
      </Box>
    </>
  );
};
