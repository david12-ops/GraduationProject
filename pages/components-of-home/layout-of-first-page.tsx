import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import * as React from 'react';

import { useCardDataQuery } from '@/generaze-graph';

import { Cards } from './cards/card';

// const Item = styled(Paper)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//   ...theme.typography.body2,
//   padding: theme.spacing(1),
//   textAlign: 'center',
//   color: theme.palette.text.secondary,
// }));

export const FullBorderedGridOfHomePage = () => {
  const query = useCardDataQuery();
  const ImageBox = (path: string) => {
    return (
      <Grid item xs={2}>
        <Box p={2}>
          <img height={400} src={path} alt="" />
        </Box>
      </Grid>
    );
  };

  const TextBox = (text: any, fontSize: any, Xs: any, Align: any) => {
    return (
      <Grid item xs={Xs}>
        <Box textAlign={Align} fontSize={fontSize} p={2}>
          {text}
        </Box>
      </Grid>
    );
  };

  return (
    <Grid container my={6}>
      {/* Prazdý box */}
      <Grid item xs={12}>
        <Box p={2}></Box>
      </Grid>

      {/* Odstavec */}
      {TextBox(
        <div>
          <h1>Vítáme Vás na TopFive!</h1>
          <p>Web s aktuálními informacemi o hraném zápase</p>
        </div>,
        18,
        6,
        'none',
      )}
      {ImageBox(
        'https://www.footyrenders.com/render/Cristiano-Ronaldo-Real-Madrid-CL-Final-Cardiff_3-2017-render.png',
      )}
      {ImageBox('https://pngimg.com/d/football_player_PNG88.png')}
      {/* Prazdý box */}
      <Grid item xs={3}>
        <Box p={2}></Box>
      </Grid>
      {TextBox(<h1>Co zde budete moct vidět?</h1>, 18, 6, 'center')}
      {/* Prazdý box */}
      <Grid item xs={3}>
        <Box p={2}></Box>
      </Grid>

      {/* Karty */}
      <Grid container justifyContent={'space-around'}>
        {query?.data?.cardValues.map(
          (values) =>
            values && (
              <Box key={values?.id}>
                <Cards
                  description={values.description}
                  image={values.image}
                  title={values.title}
                />
              </Box>
            ),
        )}
      </Grid>
    </Grid>
  );
};
