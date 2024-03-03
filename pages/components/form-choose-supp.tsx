import { ImmutableObject } from '@hookstate/core';
import {
  Box,
  InputAdornment,
  MenuItem,
  TextField,
  TextFieldProps,
} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import * as React from 'react';

type Props = {
  onChangeHeight: (inputVal: string) => void;
  onChangeWeight: (inputVal: string) => void;
  onChangeLength: (inputVal: string) => void;
  onChangeWidth: (inputVal: string) => void;
  onChangeCost: (inputVal: string) => void;
  onChangeWhere: (inputVal: string) => void;
  onChangeFromWhere: (inputVal: string) => void;
  onChangeForm: () => void;
  buttonEl: any;
  errors: ImmutableObject<{
    errWidth: string;
    errHeight: string;
    errWeight: string;
    errLength: string;
    errCost: string;
    errPlaceTo: string;
    errFrom: string;
  }>;
};

type LocErrors = {
  errPlaceTo: string;
  errFrom: string;
};

type MyInputProps = {
  onChangeAdd?: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
} & TextFieldProps;

type Params = {
  typeComp: string;
  idComp: string;
  labelComp: { err: string; withoutErr: string };
  placeholderComp: string;
  funcComp: (inputVal: string) => void;
  errorComp: string;
};

const ParamComponent = (
  typeComp: string,
  idComp: string,
  labelComp: { err: string; withoutErr: string },
  placeholderComp: string,
  funcComp: (inputVal: string) => void,
  errorComp: string,
) => {
  // eslint-disable-next-line sonarjs/prefer-immediate-return
  const Comp = () => {
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
        helperText={`Write your ${labelComp.withoutErr.toLocaleLowerCase()} limit on package`}
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

  return Comp;
};

const FromWhereErr: React.FC<MyInputProps> = () => {
  return (
    <TextField
      id="outlined-select-currency"
      select
      label="From where"
      placeholder="depo/personal"
      required
      helperText="Expext values depo/personal"
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

const MySelectComp = (
  labelarg: string,
  helptexter: { err: string; withoutErr: string },
  errorarg: string,
  optionsSelectVal: Array<{ value: string; label: string }>,
) => {
  const myComp: React.FC<MyInputProps> = () => {
    return errorarg === '' ? (
      <TextField
        id="outlined-select-currency"
        select
        label={labelarg}
        placeholder="depo/personal"
        required
        helperText={helptexter.withoutErr}
      >
        {optionsSelectVal.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    ) : (
      <TextField
        id="outlined-select-currency"
        select
        label={labelarg}
        placeholder="depo/personal"
        required
        error
        helperText={helptexter.err}
      >
        {optionsSelectVal.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  };

  return myComp;
};

type ParamErrors = {
  errWidth: string;
  errHeight: string;
  errWeight: string;
  errLength: string;
  errCost: string;
};

export const FormChooseSup: React.FC<Props> = ({
  onChangeHeight,
  onChangeWeight,
  onChangeLength,
  onChangeWidth,
  onChangeCost,
  onChangeWhere,
  onChangeFromWhere,
  onChangeForm,
  buttonEl,
  errors,
}) => {
  const options = [
    { value: 'personal', label: 'personal' },
    { value: 'depo', label: 'depo' },
  ];
  const LocationPart = (error: LocErrors) => {
    // const Zkouska = MySelectComp(
    //   'zkouska',
    //   { err: 'error', withoutErr: 'pleaseeee ok!!' },
    //   'Heleeee!!!',
    //   options,
    // );
    return (
      <div>
        <h1
          style={{
            textAlign: 'center',
            paddingBottom: '20px',
          }}
        >
          Location
        </h1>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          }}
        >
          {error.errFrom === '' ? (
            <div>
              <TextField
                id="outlined-select-currency"
                select
                label="From where"
                placeholder="depo/personal"
                required
                helperText="Please select option how to want from us retrieve our package"
                onChange={(selectedOption) =>
                  onChangeFromWhere(selectedOption.target.value)
                }
              >
                {options.map((option: { value: string; label: string }) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              {/* <FromWhere
                onChangeAdd={() => onchange}
                onChange={(selectedOption) =>
                  onChangeFromWhere(selectedOption.target.value)
                }
              ></FromWhere> */}
            </div>
          ) : (
            <div>
              <TextField
                id="outlined-select-currency"
                select
                label="From where"
                placeholder="depo/personal"
                required
                error
                helperText="Please select option how to want from us retrieve our package"
                onChange={(selectedOption) =>
                  onChangeFromWhere(selectedOption.target.value)
                }
              >
                {options.map((option: { value: string; label: string }) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          )}
          <div>
            {error.errPlaceTo === '' ? (
              <div>
                <TextField
                  id="outlined-select-currency"
                  select
                  label="From where"
                  placeholder="depo/personal"
                  required
                  helperText="Please select option how to want from us retrieve our package"
                  onChange={(selectedOption) =>
                    onChangeWhere(selectedOption.target.value)
                  }
                >
                  {options.map((option: { value: string; label: string }) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            ) : (
              <div>
                <TextField
                  id="outlined-select-currency"
                  select
                  label="From where"
                  placeholder="depo/personal"
                  required
                  error
                  helperText="Please select option how to want from us retrieve our package"
                  onChange={(selectedOption) =>
                    onChangeWhere(selectedOption.target.value)
                  }
                >
                  {options.map((option: { value: string; label: string }) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ParamsPart = (error: ParamErrors) => {
    const idComponent = 'outlined-start-adornment';

    const HeighComp = ParamComponent(
      'number',
      idComponent,
      { err: 'Error', withoutErr: 'Height' },
      'Cm',
      onChangeHeight,
      error.errHeight,
    );

    const WeightComp = ParamComponent(
      'number',
      idComponent,
      { err: 'Error', withoutErr: 'Weight' },
      'Kg',
      onChangeWeight,
      error.errWeight,
    );

    const LengthComp = ParamComponent(
      'number',
      idComponent,
      { err: 'Error', withoutErr: 'Length' },
      'Cm',
      onChangeLength,
      error.errLength,
    );

    const WidthComp = ParamComponent(
      'number',
      idComponent,
      { err: 'Error', withoutErr: 'Width' },
      'Cm',
      onChangeWidth,
      error.errWeight,
    );

    const CostComp = ParamComponent(
      'number',
      idComponent,
      { err: 'Error', withoutErr: 'Cost' },
      'Kč',
      onChangeCost,
      error.errCost,
    );

    return (
      <div onChange={onChangeForm}>
        <h1 style={{ textAlign: 'center', paddingBottom: '30px' }}>
          Parameters
        </h1>
        <div
          style={{
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          }}
        >
          <div>
            <HeighComp />
          </div>
          {/* {error.errHeight === '' ? (
            <div>
              <TextField
                type="number"
                id="outlined-basic"
                required
                label="Height"
                placeholder="Cm"
                onChange={(e) => onChangeHeight(e.target.value)}
                variant="outlined"
              />
            </div>
          ) : (
            <div>
              <TextField
                error
                id="outlined-error-helper-text"
                label="Error"
                onChange={(e) => onChangeHeight(e.target.value)}
                helperText={error.errHeight}
              />
            </div>
          )} */}
          {/* onChange={(e) => onChangeWeight(e.target.value)} */}
          <div>
            <WeightComp />
          </div>
          {/* 
          {error.errWeight === '' ? (
            <div>
              <TextField
                type="number"
                id="outlined-basic"
                required
                label="Weight"
                placeholder="Kg"
                onChange={(e) => onChangeWeight(e.target.value)}
                variant="outlined"
              />
            </div>
          ) : (
            <div>
              <TextField
                error
                id="outlined-error-helper-text"
                label="Error"
                onChange={(e) => onChangeWeight(e.target.value)}
                helperText={error.errWeight}
              />
            </div>
          )} */}
          <div>
            <LengthComp />
          </div>
          {/* {error.errLength === '' ? (
            <div>
              <TextField
                type="number"
                id="outlined-basic"
                required
                label="Length"
                placeholder="Cm"
                onChange={(e) => onChangeLength(e.target.value)}
                variant="outlined"
              />
            </div>
          ) : (
            <div>
              <TextField
                error
                id="outlined-error-helper-text"
                label="Error"
                onChange={(e) => onChangeLength(e.target.value)}
                helperText={error.errLength}
              />
            </div>
          )} */}

          <div>
            <WidthComp />
          </div>

          {/* {error.errWidth === '' ? (
            <div>
              <TextField
                type="number"
                id="outlined-basic"
                required
                label="Width"
                placeholder="Cm"
                onChange={(e) => onChangeWidth(e.target.value)}
                variant="outlined"
              />
            </div>
          ) : (
            <div>
              <TextField
                error
                id="outlined-error-helper-text"
                label="Error"
                onChange={(e) => onChangeWidth(e.target.value)}
                helperText={error.errWidth}
              />
            </div>
          )} */}
          <div>
            <CostComp />
          </div>
          {/* {error.errCost === '' ? (
            <div>
              <TextField
                type="number"
                id="outlined-basic"
                required
                label="Cost"
                placeholder="Kč"
                onChange={(e) => onChangeCost(e.target.value)}
                variant="outlined"
              />
            </div>
          ) : (
            <div>
              <TextField
                error
                id="outlined-error-helper-text"
                label="Error"
                onChange={(e) => onChangeCost(e.target.value)}
                helperText={error.errCost}
              />
            </div>
          )} */}
        </div>
      </div>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
      }}
    >
      <Card style={{ border: '5px solid #F565AD', borderRadius: '10px' }}>
        <CardContent>
          <div onChange={onChangeForm}>
            {ParamsPart({
              errWidth: errors.errWidth,
              errHeight: errors.errHeight,
              errWeight: errors.errWeight,
              errLength: errors.errLength,
              errCost: errors.errCost,
            })}
          </div>
        </CardContent>
      </Card>
      <Card
        style={{
          border: '5px solid #F565AD',
          borderRadius: '10px',
        }}
      >
        <CardContent>
          {LocationPart({
            errPlaceTo: errors.errPlaceTo,
            errFrom: errors.errFrom,
          })}
        </CardContent>
      </Card>

      {buttonEl}
    </Box>
  );
};
