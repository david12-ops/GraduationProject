import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import * as React from 'react';
import Select from 'react-select';

import styles from '../../styles/stylesForm/styleForms.module.css';

// const bull = (
//   <Box
//     component="span"
//     sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
//   >
//     •
//   </Box>
// );

type Props = {
  onChangeVyska: (inputVal: number) => any;
  onChangeHmotnost: (inputVal: number) => any;
  onChangeDelka: (inputVal: number) => any;
  onChangeSirka: (inputVal: number) => any;
  onChangeCena: (inputVal: number) => any;
  // onChangeCityFromWhere: (inputVal: string) => any;
  // onChangePscFromWhere: (inputVal: string) => any;
  // onChangeCityWhere: (inputVal: string) => any;
  // onChangePscWhere: (inputVal: string) => any;
  onChangeDo: (inputVal: string) => any;
  onChangeZ: (inputVal: string) => any;

  buttonEl: any;
};

export const FormChooseSup: React.FC<Props> = ({
  onChangeVyska,
  onChangeHmotnost,
  onChangeDelka,
  onChangeSirka,
  onChangeCena,
  onChangeDo,
  onChangeZ,
  // onChangeCityFromWhere,
  // onChangePscFromWhere,
  // onChangeCityWhere,
  // onChangePscWhere,
  buttonEl,
}) => {
  const MyComponentPicker = () => {
    const options = [
      { value: 'adresa', label: 'ruky' },
      { value: 'depo', label: 'depa' },
    ];

    return (
      <div>
        <div>
          <label>Z</label>
          <Select
            className={styles.selectInput}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
            onChange={(selectedOption: any) => onChangeZ(selectedOption.value)}
            options={options}
            // value={options.find((opt) => opt.value === SFoil)}
            required
          />
        </div>
        <div>
          <label>Do</label>
          <Select
            className={styles.selectInput}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
            onChange={(selectedOption: any) => onChangeDo(selectedOption.value)}
            options={options}
            // value={options.find((opt) => opt.value === SFoil)}
            required
          />
        </div>
      </div>
    );
  };

  return (
    <Card sx={{ width: 500 }}>
      <CardContent>
        <h1 style={{ textAlign: 'center', paddingBottom: '30px' }}>
          Parametry
        </h1>
        <div
          style={{
            display: 'flex',
            // justifyContent: 'space-around',
            // flexDirection: 'row',
            // alignItems: 'center',
            // flexWrap: 'wrap',
            // gap: '29x',
          }}
        >
          <div>
            <label>
              <p style={{ textAlign: 'center' }}>Výška</p>
              <input
                className={styles.input}
                onChange={(e) => onChangeVyska(e.target.value)}
                required
                type="number"
                placeholder="0"
              />
            </label>
          </div>
          <div>
            <label>
              <p style={{ textAlign: 'center' }}>Hmotnost</p>
              <input
                className={styles.input}
                onChange={(e) => onChangeHmotnost(e.target.value)}
                required
                type="number"
                placeholder="0"
              />
            </label>
          </div>
          <div>
            <label>
              <p style={{ textAlign: 'center' }}>Délka</p>
              <input
                className={styles.input}
                onChange={(e) => onChangeDelka(e.target.value)}
                required
                type="number"
                placeholder="0"
              />
            </label>
          </div>
          <div>
            <label>
              <p style={{ textAlign: 'center' }}>Šířka</p>
              <input
                className={styles.input}
                onChange={(e) => onChangeSirka(e.target.value)}
                required
                type="number"
                placeholder="0"
              />
            </label>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <label>
            <p style={{ textAlign: 'center' }}>Cena</p>
            <input
              className={styles.input}
              onChange={(e) => onChangeCena(e.target.value)}
              required
              type="number"
              placeholder="0"
            />
          </label>
        </div>
        <h1
          style={{
            textAlign: 'center',
            paddingBottom: '30px',
            paddingTop: '30px',
          }}
        >
          Lokace
        </h1>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {MyComponentPicker()}
          {/* <div>
            <label>
              <p style={{ textAlign: 'center' }}>Město (odkud)</p>
              <input
                className={styles.input}
                onChange={(e) => onChangeCityFromWhere(e.target.value)}
                required
                type="text"
              />
            </label>
          </div>
          <div>
            <label>
              <p style={{ textAlign: 'center' }}>PSČ </p>
              <input
                className={styles.input}
                onChange={(e) => onChangePscFromWhere(e.target.value)}
                required
                type="text"
              />
            </label>
          </div>
          <div>
            <label>
              <p style={{ textAlign: 'center' }}>Město (kam)</p>
              <input
                className={styles.input}
                onChange={(e) => onChangeCityWhere(e.target.value)}
                required
                type="text"
              />
            </label>
          </div>
          <div>
            <label>
              <p style={{ textAlign: 'center' }}>PSČ</p>
              <input
                className={styles.input}
                onChange={(e) => onChangePscWhere(e.target.value)}
                required
                type="text"
              />
            </label>
          </div> */}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        ></div>
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
        }}
      >
        {buttonEl}
      </CardActions>
    </Card>
  );
};
