import CloseIcon from '@mui/icons-material/Close';
import {
  CardActions,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  styled,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import { SuppDataDocument, useDeletePacMutation } from '@/generated/graphql';

import styles from '../../../styles/stylesForm/style.module.css';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const ErrDialog = (title: string, description: JSX.Element) => {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {title}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Typography gutterBottom>{description}</Typography>
      </DialogContent>
    </BootstrapDialog>
  );
};

type Props = {
  Heiht: number;
  Weight: number;
  Width: number;
  Length: number;
  Name: string;
  Cost: number;
  keyPac: string;
  sId: string;
};

const Description = (deleteion: boolean, error: string | null | undefined) => {
  let description: JSX.Element | undefined;
  if (!deleteion) {
    description = (
      <Typography component={'p'}>Smazaní balíku nebylo úspěšné</Typography>
    );
  }
  if (error) {
    description = <Typography component={'p'}>{error}</Typography>;
  }
  if (!deleteion && error) {
    description = (
      <Typography component={'p'}>
        Smazaní balíku nebylo úspěšné : {error}
      </Typography>
    );
  }
  return description;
};

export const PackCard: React.FC<Props> = ({
  Heiht,
  Weight,
  Width,
  Length,
  Name,
  Cost,
  keyPac,
  sId,
}) => {
  const [del] = useDeletePacMutation();
  const Del = async (key: string, suppId: string) => {
    const deleted = await del({
      variables: {
        Id: suppId,
        Key: key,
      },
      refetchQueries: [{ query: SuppDataDocument }],
      awaitRefetchQueries: true,
    }).catch((error: string) => console.error(error));
    const description = Description(
      !!deleted?.data?.deletePack?.deletion,
      deleted?.data?.deletePack?.error,
    );
    if (description) {
      ErrDialog('Chyba při mazání', description);
    }
  };
  return (
    <Card sx={{ maxWidth: 290 }}>
      <CardMedia
        component="img"
        alt={Name}
        height="140"
        image="/nettes-karikaturbeitragspaketgekritzel-geschenk-shop-logo-grafiksymbol-fuer-medienmarkierungen_44769-1534.webp"
      />
      <CardContent>
        <Typography
          sx={{ textAlign: 'center' }}
          gutterBottom
          variant="h5"
          component="div"
        >
          {Name}
        </Typography>

        <Typography
          sx={{ textAlign: 'center', borderBottom: 'solid' }}
          gutterBottom
          variant="h6"
          component="div"
        >
          Parametry
        </Typography>

        <Typography
          sx={{ textAlign: 'center' }}
          sx-gutterbottom="true"
          variant="body1"
          component="div"
        >
          Výška: {Heiht} cm
        </Typography>

        <Typography
          sx={{ textAlign: 'center' }}
          sx-gutterbottom="true"
          variant="body1"
          component="div"
        >
          Šířka: {Width} cm
        </Typography>

        <Typography
          sx={{ textAlign: 'center' }}
          sx-gutterbottom="true"
          variant="body1"
          component="div"
        >
          Délka: {Length} cm
        </Typography>

        <Typography
          sx={{ textAlign: 'center' }}
          sx-gutterbottom="true"
          variant="body1"
          component="div"
        >
          Hmotnost: {Weight} Kg
        </Typography>

        <Typography
          sx={{ textAlign: 'center', borderBottom: 'solid' }}
          gutterBottom
          variant="h6"
          component="div"
        >
          Cena
        </Typography>

        <Typography
          sx={{ textAlign: 'center' }}
          sx-gutterbottom="true"
          variant="body1"
          component="div"
        >
          {Cost} Kč
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <button onClick={() => Del(keyPac, sId)} className={styles.crudbtDel}>
          Smazat
        </button>

        <Link
          key="UpdateFormPackage"
          href={`../../Forms/UpdateFormPackage/${keyPac}`}
        >
          <button className={styles.crudbtnTable}>Upravit</button>
        </Link>
      </CardActions>
    </Card>
  );
};
