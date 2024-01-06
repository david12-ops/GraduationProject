import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import * as React from 'react';

type Props = {
  img: string;
  label: string;
  description: string;
};

export const CardOffer: React.FC<Props> = ({ img, label, description }) => {
  return (
    <Card
      sx={{
        maxWidth: '300px',
        maxHeight: '500px',
      }}
    >
      <CardMedia component="img" image={`/${img}`} />
      <CardContent>
        <Typography
          sx={{ textAlign: 'center' }}
          gutterBottom
          variant="h5"
          component="div"
        >
          {label}
        </Typography>

        <Typography
          sx={{ textAlign: 'center' }}
          sx-gutterbottom="true"
          variant="body1"
          component="div"
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};
