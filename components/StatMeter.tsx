import React from "react";
import { Typography } from "@mui/material";
import { Bar } from "./meters/Bar";

export enum MeterType {
  Bar, // bar, where 0% => empty, 100% => full
  Star, // 0 to 5 stars
  Percentage, // display as raw percentage
  Flag, // boolean
}

interface StatMeterProps {
  title: string; // displayed above the meter
  value: number | boolean; // 0 to 100 OR t/f
  type: MeterType;
}

const StatMeter = ({ title, value, type }: StatMeterProps) => {
  return (
    <>
      <Typography>{title}</Typography>
      {typeof value !== "boolean" && <Bar value={value} />}
    </>
  );
};

export default StatMeter;
