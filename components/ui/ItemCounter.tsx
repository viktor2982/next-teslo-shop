import { FC } from "react";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material"
import { Box, IconButton, Typography } from "@mui/material"

interface Props {
  currentValue: number;
  maxValue: number;

  // Methods
  onUpdateQuantity: (value: number) => void;
}

export const ItemCounter: FC<Props> = ({ currentValue, maxValue, onUpdateQuantity }) => {
  return (
    <Box display="flex" alignItems='center'>
        <IconButton
          onClick={() => {
            if (currentValue === 1) return;
            onUpdateQuantity(currentValue - 1);
          }}
        >
            <RemoveCircleOutline />
        </IconButton>
        <Typography sx={{ width: 40, textAlign: 'center' }}> {currentValue} </Typography>
        <IconButton
          onClick={() => {
            if (currentValue === maxValue) return;
            onUpdateQuantity(currentValue + 1);
          }}
        >
            <AddCircleOutline />
        </IconButton>
    </Box>
  )
}
