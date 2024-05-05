import { InputAdornment, TextField } from '@mui/material';

type Props = {
  typeComp: string;
  idComp: string;
  labelComp: { err: string; withoutErr: string };
  placeholderComp?: string;
  funcComp: (inputVal: string) => void;
  errorComp: string;
  valueComp?: string | number;
  helpTexterComp?: string;
};

const lComp = (input: string) => {
  switch (input) {
    case 'Výška': {
      return 'Zadejte maximalní výšku';
    }
    case 'Hmotnost': {
      return 'Zadejte maximální hmotnost';
    }
    case 'Délka': {
      return 'Zadejte maximální délku';
    }
    case 'Šířka': {
      return 'Zadejte maximální šířku';
    }
    case 'Cena': {
      return 'Zadejte maximální cenu';
    }
    default: {
      return '';
    }
  }
};
export const MyCompTextField: React.FC<Props> = ({
  typeComp,
  idComp,
  labelComp,
  placeholderComp,
  funcComp,
  errorComp,
  valueComp,
  helpTexterComp,
}) => {
  return errorComp === '' ? (
    <TextField
      type={typeComp}
      label={labelComp.withoutErr}
      required
      id={idComp}
      sx={{ m: 1, width: '25ch' }}
      onChange={(e) => funcComp(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">{placeholderComp}</InputAdornment>
        ),
      }}
      helperText={helpTexterComp || lComp(labelComp.withoutErr)}
      value={valueComp}
    />
  ) : (
    <TextField
      type={typeComp}
      label={labelComp.err}
      required
      id={idComp}
      helperText={errorComp}
      error
      sx={{ m: 1, width: '25ch' }}
      onChange={(e) => funcComp(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">{placeholderComp}</InputAdornment>
        ),
      }}
    />
  );
};
