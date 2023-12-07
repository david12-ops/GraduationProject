// eslint-disable-next-line unicorn/filename-case
import * as React from 'react';
import Select from 'react-select';

import { useUpdateSupplierMutation } from '@/generated/graphql';

import styles from '../../../styles/stylesForm/styleForms.module.css';

type Props = {
  id: string;
};

export const FormSupplierUpdate: React.FC<Props> = ({ id }) => {
  const options = [
    { value: true, label: 'Ano' },
    { value: false, label: 'Ne' },
  ];
  // upravit ! kod z create form

  const [SDelivery, SetDelivery] = React.useState(' ');
  const [SSendCashDelivery, SetsendCashDelivery] = React.useState(' ');
  const [SPackInBox, SetPackInBox] = React.useState('');
  const [PickUp, SetPickUp] = React.useState('');
  const [SInsurance, SetInsurance] = React.useState('');
  const [SShippingLabel, SetShippingLabel] = React.useState('');
  const [SFoil, SetFoil] = React.useState('');
  // const [PackageId, SetPackageId] = React.useState(' ');
  const [SupplierName, SetSupplierName] = React.useState(' ');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const [UpdateSupp] = useUpdateSupplierMutation();
  // validace dat
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const MyComponentFoil = () => (
    <Select
      className={styles.selectInput}
      onChange={(selectedOption: any) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
        SetFoil(selectedOption.value)
      }
      options={options}
      required
      // placeholder={}
    />
  );

  const MyComponentSendCash = () => (
    <Select
      className={styles.selectInput}
      onChange={(selectedOption: any) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
        SetsendCashDelivery(selectedOption.value)
      }
      options={options}
      required
    />
  );

  const MyComponentPackInB = () => (
    <Select
      className={styles.selectInput}
      onChange={(selectedOption: any) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
        SetPackInBox(selectedOption.value)
      }
      options={options}
      required
    />
  );

  const MyComponentShippingL = () => (
    <Select
      className={styles.selectInput}
      onChange={(selectedOption: any) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
        SetShippingLabel(selectedOption.value)
      }
      options={options}
      required
    />
  );
  // validace dat
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const Convert = (stringToNum: string) => {
    const numberFrString = 0;
    if (!Number.parseInt(stringToNum, numberFrString)) {
      alert('Invalid number argument');
    }
    return Number.parseInt(stringToNum, numberFrString);
  };

  const ConverDate = (dateU1: any) => {
    // eslint-disable-next-line no-constant-condition, @typescript-eslint/no-unsafe-argument
    if (!new Date(dateU1)) {
      alert('Invalid date argument');
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return dateU1;
  };

  const handleForm = async (event: React.FormEvent) => {
    // lepsi informovani o chybe
    // Apolo exepciton/error - bad return of vlaue from field
    // prirazeni id
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    event.preventDefault();
    // Mutation
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call

    alert('Dodavatel byl změněn');
  };

  return (
    // <Box>
    //   <Box
    //     sx={{
    //       display: 'flex',
    //       // flexWrap: 'wrap',
    //       flexDirection: 'column',
    //       justifyContent: 'center',
    //     }}
    //   >
    //     <div>
    //       <TextField
    //         label="With normal TextField"
    //         id="filled-start-adornment"
    //         sx={{ m: 1, width: '25ch' }}
    //         InputProps={{
    //           startAdornment: (
    //             <InputAdornment position="start">Info</InputAdornment>
    //           ),
    //         }}
    //         variant="filled"
    //         onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    //           SetInfo(event.target.value);
    //         }}
    //       />
    //       <TextField
    //         label="With normal TextField"
    //         id="filled-start-adornment"
    //         sx={{ m: 1, width: '25ch' }}
    //         InputProps={{
    //           startAdornment: (
    //             <InputAdornment position="start">Supplier name</InputAdornment>
    //           ),
    //         }}
    //         variant="filled"
    //         onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    //           SetSupplierName(event.target.value);
    //         }}
    //       />
    //       <TextField
    //         label="With normal TextField"
    //         id="filled-start-adornment"
    //         sx={{ m: 1, width: '25ch' }}
    //         InputProps={{
    //           startAdornment: (
    //             <InputAdornment position="start">Package id</InputAdornment>
    //           ),
    //         }}
    //         variant="filled"
    //         onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    //           SetPackageId(event.target.value);
    //         }}
    //       />
    //       {/* <TextField
    //       label="With normal TextField"
    //       id="filled-start-adornment"
    //       sx={{ m: 1, width: '25ch' }}
    //       InputProps={{
    //         startAdornment: (
    //           <InputAdornment position="start">Supplier id</InputAdornment>
    //         ),
    //       }}
    //       variant="filled"
    //       onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    //         SetSupplierId(event.target.value);
    //       }}
    //     /> */}
    //     </div>
    //   </Box>
    <div>
      <div className={styles.container}>
        <h1
          style={{
            textAlign: 'center',
            paddingBottom: '20px',
            fontWeight: 'bold',
            fontFamily: 'serif',
            color: 'orangered',
          }}
        >
          Update supplier
        </h1>
        <form onSubmit={handleForm} className={styles.form}>
          {/* <hr> */}
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Supplier name</p>
              <input
                className={styles.inputForSupp}
                onChange={(e) => SetSupplierName(e.target.value)}
                required
                type="text"
                placeholder="Name"
              />
            </label>
            {/* <label>
            <p>Supplier id</p>
            <input
              className={styles.suppId}
              onChange={(e) => SetSupplierId(e.target.value)}
              required
              type="number"
              name="suppId"
              id="suppId"
              placeholder=""
            />
          </label> */}
            {/* <label>
              <p className={styles.Odstavce}>Package id</p>
              <input
                className={styles.inputForSupp}
                onChange={(e) => SetPackageId(e.target.value)}
                required
                type="number"
                placeholder=""
              />
            </label> */}
          </div>
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Doručení</p>
              <input
                className={styles.inputDate}
                onChange={(e) => SetDelivery(e.target.value)}
                required
                type="date"
                placeholder=""
              />
            </label>
            <label>
              <p className={styles.Odstavce}>Vyzvednutí</p>
              <input
                className={styles.inputDate}
                onChange={(e) => SetPickUp(e.target.value)}
                required
                type="date"
                placeholder=""
              />
            </label>
          </div>
          <h3 className={styles.Nadpisy}>Info dopravce</h3>
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Pojištění</p>
              <input
                className={styles.inputForSupp}
                onChange={(e) => SetInsurance(e.target.value)}
                required
                type="number"
                placeholder=""
              />
            </label>
          </div>
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Na dobírku</p>
              {MyComponentSendCash()}
            </label>
            <label>
              <p className={styles.Odstavce}>Přepravní štítek</p>
              {MyComponentShippingL()}
            </label>
          </div>
          <div className={styles.divinput}>
            {' '}
            <label>
              <p className={styles.Odstavce}>Folie</p>
              {MyComponentFoil()}
            </label>
            <label>
              <p className={styles.Odstavce}>Do krabice</p>
              {MyComponentPackInB()}
            </label>
          </div>
          <div className={styles.divinput}>
            {' '}
            <button className={styles.crudbtn} type="submit">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>

    // </Box>
  );
};
