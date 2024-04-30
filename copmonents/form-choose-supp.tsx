import { ImmutableObject } from '@hookstate/core';
import { Box, MenuItem, TextField } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import * as React from 'react';

import { MyCompTextField } from './text-field';
import { LocErrors, ParamErrors } from './types/types';

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
    { value: 'personal', label: 'osobně' },
    { value: 'depo', label: 'depo' },
  ];

  const LocationPart = (error: LocErrors) => {
    return (
      <div>
        <h1
          style={{
            textAlign: 'center',
            paddingBottom: '20px',
          }}
        >
          Lokace
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
                label="Odkud"
                placeholder="depo/osobně"
                required
                helperText="Prosím vyberte odkud jak chcete balík doručit"
                onChange={(selectedOption) =>
                  onChangeFromWhere(selectedOption.target.value)
                }
                defaultValue={''}
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
                label="Chyba"
                placeholder="depo/osobně"
                required
                error
                helperText="Prosím vyberte z možností (depo/osobně)"
                onChange={(selectedOption) =>
                  onChangeFromWhere(selectedOption.target.value)
                }
                defaultValue={''}
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
                  label="Kam"
                  placeholder="depo/osobně"
                  required
                  helperText="Prosím vyberte kam jak chcete balík doručit"
                  onChange={(selectedOption) =>
                    onChangeWhere(selectedOption.target.value)
                  }
                  defaultValue={''}
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
                  label="Chyba"
                  placeholder="depo/osobně"
                  required
                  error
                  helperText="Prosím vyberte z možností (depo/osobně)"
                  onChange={(selectedOption) =>
                    onChangeWhere(selectedOption.target.value)
                  }
                  defaultValue={''}
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

    const labelHeight = { err: 'Chyba', withoutErr: 'Výška' };
    const labelWeigth = { err: 'Chyba', withoutErr: 'Hmotnost' };
    const labelLength = { err: 'Chyba', withoutErr: 'Délka' };
    const labelWidth = { err: 'Chyba', withoutErr: 'Šířka' };
    const labelCost = { err: 'Chyba', withoutErr: 'Cena' };

    return (
      <div onChange={onChangeForm}>
        <h1 style={{ textAlign: 'center', paddingBottom: '30px' }}>
          Parametry
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
            <MyCompTextField
              typeComp="number"
              idComp={idComponent}
              labelComp={labelHeight}
              placeholderComp="Cm"
              errorComp={error.errHeight}
              funcComp={onChangeHeight}
            />
          </div>

          <div>
            <MyCompTextField
              typeComp="number"
              idComp={idComponent}
              labelComp={labelWeigth}
              placeholderComp="Kg"
              errorComp={error.errWeight}
              funcComp={onChangeWeight}
            />
          </div>

          <div>
            <MyCompTextField
              typeComp="number"
              idComp={idComponent}
              labelComp={labelLength}
              placeholderComp="Cm"
              errorComp={error.errLength}
              funcComp={onChangeLength}
            />
          </div>

          <div>
            <MyCompTextField
              typeComp="number"
              idComp={idComponent}
              labelComp={labelWidth}
              placeholderComp="Cm"
              errorComp={error.errWidth}
              funcComp={onChangeWidth}
            />
          </div>

          <div>
            <MyCompTextField
              typeComp="number"
              idComp={idComponent}
              labelComp={labelCost}
              placeholderComp="Kč"
              errorComp={error.errCost}
              funcComp={onChangeCost}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <Card style={{ border: '5px solid #0E95EB', borderRadius: '10px' }}>
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
          border: '5px solid #0E95EB',
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
