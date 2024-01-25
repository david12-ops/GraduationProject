import { SxProps, Theme } from '@mui/material';

export interface BaseMuiCmpProps {
  sx?: SxProps<Theme>;
  component?: React.ElementType<any>;
  className?: string;
  role?: string;
}

export interface BaseMuiCmpChildProps extends BaseMuiCmpProps {
  children?: React.ReactNode;
}
