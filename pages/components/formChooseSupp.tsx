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
  onChangeVyska: (inputVal: number) => void;
  onChangeHmotnost: (inputVal: number) => void;
  onChangeDelka: (inputVal: number) => void;
  onChangeSirka: (inputVal: number) => void;
  onChangeCena: (inputVal: number) => void;
  onChangeDo: (inputVal: string) => void;
  onChangeZ: (inputVal: string) => void;
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
  buttonEl,
}) => {
  const MyComponentPicker = () => {
    const options = [
      { value: 'personal', label: 'ruky' },
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
            required
            placeholder="depo/ruky"
          />
        </div>
        <div>
          <label>Do</label>
          <Select
            className={styles.selectInput}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
            onChange={(selectedOption: any) => onChangeDo(selectedOption.value)}
            options={options}
            required
            placeholder="depo/ruky"
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
                onChange={(e) => onChangeVyska(Number(e.target.value))}
                required
                type="number"
                placeholder="Cm"
              />
            </label>
          </div>
          <div>
            <label>
              <p style={{ textAlign: 'center' }}>Hmotnost</p>
              <input
                className={styles.input}
                onChange={(e) => onChangeHmotnost(Number(e.target.value))}
                required
                type="number"
                placeholder="Kg"
              />
            </label>
          </div>
          <div>
            <label>
              <p style={{ textAlign: 'center' }}>Délka</p>
              <input
                className={styles.input}
                onChange={(e) => onChangeDelka(Number(e.target.value))}
                required
                type="number"
                placeholder="Cm"
              />
            </label>
          </div>
          <div>
            <label>
              <p style={{ textAlign: 'center' }}>Šířka</p>
              <input
                className={styles.input}
                onChange={(e) => onChangeSirka(Number(e.target.value))}
                required
                type="number"
                placeholder="Cm"
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
              onChange={(e) => onChangeCena(Number(e.target.value))}
              required
              type="number"
              placeholder="Kč"
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
