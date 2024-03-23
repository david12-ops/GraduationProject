import { InputAdornment, TextField } from '@mui/material';

type Params = {
  typeComp: string;
  idComp: string;
  labelComp: { err: string; withoutErr: string };
  placeholderComp?: string;
  funcComp: (inputVal: string) => void;
  errorComp: string;
  valueComp?: string | number;
  helpTexterComp?: string;
};
export const MyCompTextField: React.FC<Params> = ({
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
      helperText={
        helpTexterComp ||
        `Napište váš ${labelComp.withoutErr.toLocaleLowerCase()} limit na balík`
      }
      value={valueComp}
    />
  ) : (
    <TextField
      type={typeComp}
      label={labelComp.withoutErr}
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
