import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import * as React from 'react';
import Select from 'react-select';

import styles from '../../styles/stylesForm/styleForms.module.css';

type Props = {
  onChangeVyska: (inputVal: string) => void;
  onChangeHmotnost: (inputVal: string) => void;
  onChangeDelka: (inputVal: string) => void;
  onChangeSirka: (inputVal: string) => void;
  onChangeCena: (inputVal: string) => void;
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
            onChange={(selectedOption) =>
              onChangeZ(selectedOption ? selectedOption.value : '')
            }
            options={options}
            required
            placeholder="depo/ruky"
          />
        </div>
        <div>
          <label>Do</label>
          <Select
            className={styles.selectInput}
            onChange={(selectedOption) =>
              onChangeDo(selectedOption ? selectedOption.value : '')
            }
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
                placeholder="Cm"
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
                placeholder="Kg"
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
                placeholder="Cm"
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
              onChange={(e) => onChangeCena(e.target.value)}
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
