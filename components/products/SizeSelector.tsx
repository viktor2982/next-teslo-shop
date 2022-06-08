import { Box, Button } from "@mui/material";
import { FC } from "react";
import { SizeT } from "../../interfaces";

interface Props {
    selectedSize?: SizeT;
    sizes: SizeT[];

    // Methods
    onSelectedSize: (size: SizeT) => void;
}

export const SizeSelector: FC<Props> = ({ selectedSize, sizes, onSelectedSize }) => {
  return (
    <Box sx={{ mb: 2 }}>
        {
            sizes.map(size => (
                <Button
                    key={size}
                    size='small'
                    color={selectedSize === size ? 'info' : 'primary'}
                    onClick={() => onSelectedSize(size)}
                >
                    { size }
                </Button>
            ))
        }
    </Box>
  )
}
