import { ImmutableObject } from '@hookstate/core';
import { Box, TextField } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import * as React from 'react';
import Select from 'react-select';

type Props = {
  onChangeHeight: (inputVal: string) => void;
  onChangeWeight: (inputVal: string) => void;
  onChangeLength: (inputVal: string) => void;
  onChangeWidth: (inputVal: string) => void;
  onChangeCost: (inputVal: string) => void;
  onChangeFrom: (inputVal: string) => void;
  onChangeFromWhere: (inputVal: string) => void;
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
  onChangeFrom,
  onChangeFromWhere,
  buttonEl,
  errors,
}) => {
  const LocationPart = (error: LocErrors) => {
    const options = [
      { value: 'personal', label: 'personal' },
      { value: 'depo', label: 'depo' },
    ];

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
          <div>
            <label style={{ fontSize: '18px' }}>Where</label>
            <div>
              <Select
                onChange={(selectedOption) =>
                  onChangeFrom(selectedOption ? selectedOption.value : '')
                }
                options={options}
                required
                aria-errormessage={error.errPlaceTo}
                placeholder="depo/personal"
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '18px' }}>From</label>
            <div>
              <Select
                onChange={(selectedOption) =>
                  onChangeFromWhere(selectedOption ? selectedOption.value : '')
                }
                options={options}
                required
                aria-errormessage={error.errFrom}
                placeholder="depo/personal"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ParamsPart = (error: ParamErrors) => {
    return (
      <div>
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
          {error.errHeight === '' ? (
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
          )}

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
          )}

          {error.errLength === '' ? (
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
          )}

          {error.errWidth === '' ? (
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
          )}
          {error.errCost === '' ? (
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
          )}
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
          {ParamsPart({
            errWidth: errors.errWidth,
            errHeight: errors.errHeight,
            errWeight: errors.errWeight,
            errLength: errors.errLength,
            errCost: errors.errCost,
          })}
        </CardContent>
      </Card>
      <Card
        style={{
          border: '5px solid #F565AD',
          borderRadius: '10px',
          maxWidth: '700px',
          height: '260px',
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
