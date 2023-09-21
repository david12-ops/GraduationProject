import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';
import { FC } from 'react';

import { BasicTableOfMatches } from '../components/table-of-favorite-matches';
import { BasicTableOFLeagues } from '../components/teble-of-favorite-leagues';

export const FullBorderedGridOfCounty1: FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid
        container
        spacing={2}
        sx={{
          '--Grid-borderWidth': '1px',
          borderTop: 'var(--Grid-borderWidth) solid',
          borderLeft: 'var(--Grid-borderWidth) solid',
          borderColor: 'divider',
          '& > div': {
            borderRight: 'var(--Grid-borderWidth) solid',
            borderBottom: 'var(--Grid-borderWidth) solid',
            borderColor: 'divider',
          },
        }}
      >
        {Array.from({ length: 20 }).map((_, index) => {
          return (
            <Grid
              key={index}
              {...{ xs: 12, sm: 6, md: 4, lg: 3 }}
              minHeight={160}
            >
              {index === 3 && 6 ? <BasicTableOfMatches /> : null}
              {index === 0 && 4 ? <BasicTableOFLeagues /> : null}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
