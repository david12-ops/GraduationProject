import { Button, styled } from '@mui/material';

export const ButtonCmp = styled(Button)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'transparent',
  },
  color: 'inherit',
})) as typeof Button;
