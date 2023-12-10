// eslint-disable-next-line unicorn/filename-case
import router from 'next/router';
import * as React from 'react';

import { useNewPackageToFirestoreMutation } from '@/generated/graphql';

import styles from '../../../styles/stylesForm/styleForms.module.css';

type Props = {
  id: string;
};
export const FormPackage: React.FC<Props> = ({ id }) => {
  // vice se v jednom!
  const [kg, SetKg] = React.useState(' ');
  const [cost, SetCost] = React.useState(' ');
  const [delka, SetDelka] = React.useState(' ');
  const [vyska, SetVyska] = React.useState(' ');
  const [sirka, SetSirka] = React.useState(' ');
  // const [odkud, Setodkud] = React.useState(' ');
  // const [psc_odkud, SetPSC_odkud] = React.useState(' ');
  // const [kam, Setkam] = React.useState(' ');
  // const [psc_kam, SetPSC_kam] = React.useState(' ');
  const [packName, SetPackName] = React.useState(' ');
  // const [suppId, SetSuppId] = React.useState(' ');
  const [newPackage] = useNewPackageToFirestoreMutation();
  // const Supp = useSuppDataQuery();

  // validace dat - je
  // eslint-disable-next-line unicorn/consistent-function-scoping
  function Convert(stringToNum: string) {
    const numberFrString = 0;
    if (!Number.parseInt(stringToNum, numberFrString)) {
      alert('Invalid number argument');
    }
    return Number.parseInt(stringToNum, numberFrString);
  }
  // validace psc - neni
  // validace adresy - neni
  // string v resolveru
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const PSCVal = (psc: string) => {
    // eslint-disable-next-line unicorn/better-regex
    const option = /^[0-9]{3} ?[0-9]{2}/;
    if (!option.test(psc)) {
      alert('Invalid psc argument');
    }
    return psc;
  };

  // Nefunkcni
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const addressVal = (address: string) => {
    // nepodporuje diakritiku!!
    // eslint-disable-next-line unicorn/better-regex
    const option = /^[A-Z][a-z]+ [0-9]{1,3}, [A-Z][a-z]+$/;
    if (!option.test(address)) {
      alert('Invalid adress argument');
    }
    return address;
  };

  // const Options = () => {
  //   const option: Array<{ value: string; label: string }> = [];
  //   Supp?.data?.suplierData.forEach(function (supval) {
  //     option.push({ value: supval.supplierId, label: supval.suppName });
  //   });
  //   return option;
  // };

  // const MyComponent = () => (
  //   <Select
  //     className={styles.selectInput}
  //     onChange={(selectedOption: any) =>
  //       // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
  //       SetSuppId(selectedOption.value)
  //     }
  //     options={Options()}
  //     required
  //   />
  // );

  const handleForm = async (event: React.FormEvent) => {
    // lepsi informovani o chybe - je
    // Apolo exepciton/error - bad return of vlaue from field
    event.preventDefault();
    // Mutation
    // create zjistit jestli tam id uz nejake je, upravit create resolveru
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const packd = await newPackage({
      variables: {
        Hmotnost: Convert(kg),
        Cost: Convert(cost),
        Delka: Convert(delka),
        Vyska: Convert(vyska),
        Sirka: Convert(sirka),
        Pack_name: packName,
        // SuppId: Object.values(suppId)
        //   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
        //   .slice(0, Object.values(suppId).lastIndexOf(','))
        //   .toString(),
        // Úprava id potom, error page
        SuppID: id,
      },
    });
    if (packd.data?.PackageToFirestore?.error) {
      // pri vytvareni supp pridelovat id supp = id document
      // prace s errory
      const message = packd.data?.PackageToFirestore?.error.toString();
      alert(`${message} `);
    } else {
      const message = 'Balíček byl vytvořen';
      alert(`${message}`);
      return router.push(`/../admpage/${id}`);
    }
  };

  return (
    // <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
    //   <div
    //     style={{
    //       display: 'flex',
    //       flexDirection: 'row',
    //     }}
    //   >
    //     <TextField
    //       label="With normal TextField"
    //       id="filled-start-adornment"
    //       sx={{ m: 1, width: '25ch' }}
    //       InputProps={{
    //         startAdornment: (
    //           <InputAdornment position="start">Package name</InputAdornment>
    //         ),
    //       }}
    //       variant="filled"
    //       onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    //         SetPackName(event.target.value);
    //       }}
    //     />
    //     <TextField
    //       label="With normal TextField"
    //       id="filled-start-adornment"
    //       sx={{ m: 1, width: '25ch' }}
    //       InputProps={{
    //         startAdornment: (
    //           <InputAdornment position="start">cost</InputAdornment>
    //         ),
    //       }}
    //       variant="filled"
    //       onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    //         SetCost(event.target.value);
    //       }}
    //     />
    //   </div>

    //   <div
    //     style={{
    //       display: 'flex',
    //       flexDirection: 'row',
    //     }}
    //   >
    //     <TextField
    //       label="With normal TextField"
    //       id="filled-start-adornment"
    //       sx={{ m: 1, width: '25ch' }}
    //       InputProps={{
    //         startAdornment: (
    //           <InputAdornment position="start">Delka</InputAdornment>
    //         ),
    //       }}
    //       variant="filled"
    //       onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    //         SetDelka(event.target.value);
    //       }}
    //     />
    //     <TextField
    //       label="With normal TextField"
    //       id="filled-start-adornment"
    //       sx={{ m: 1, width: '25ch' }}
    //       InputProps={{
    //         startAdornment: (
    //           <InputAdornment position="start">Vyska</InputAdornment>
    //         ),
    //       }}
    //       variant="filled"
    //       onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    //         SetVyska(event.target.value);
    //       }}
    //     />
    //     <TextField
    //       label="With normal TextField"
    //       id="filled-start-adornment"
    //       sx={{ m: 1, width: '25ch' }}
    //       InputProps={{
    //         startAdornment: (
    //           <InputAdornment position="start">Sirka</InputAdornment>
    //         ),
    //       }}
    //       variant="filled"
    //       onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    //         SetSirka(event.target.value);
    //       }}
    //     />
    //     <TextField
    //       label="With normal TextField"
    //       id="filled-start-adornment"
    //       sx={{ m: 1, width: '25ch' }}
    //       InputProps={{
    //         startAdornment: (
    //           <InputAdornment position="start">kg</InputAdornment>
    //         ),
    //       }}
    //       variant="filled"
    //       onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    //         SetKg(event.target.value);
    //       }}
    //     />
    //   </div>

    //   <div
    //     style={{
    //       display: 'flex',
    //       flexDirection: 'row',
    //     }}
    //   >
    //     <TextField
    //       label="With normal TextField"
    //       id="filled-start-adornment"
    //       sx={{ m: 1, width: '25ch' }}
    //       InputProps={{
    //         startAdornment: (
    //           <InputAdornment position="start">odkud</InputAdornment>
    //         ),
    //       }}
    //       variant="filled"
    //       onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    //         Setodkud(event.target.value);
    //       }}
    //     />
    //     <TextField
    //       label="With normal TextField"
    //       id="filled-start-adornment"
    //       sx={{ m: 1, width: '25ch' }}
    //       InputProps={{
    //         startAdornment: (
    //           <InputAdornment position="start">PSČ</InputAdornment>
    //         ),
    //       }}
    //       variant="filled"
    //       onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    //         SetPSC_odkud(event.target.value);
    //       }}
    //     />
    //     <TextField
    //       label="With normal TextField"
    //       id="filled-start-adornment"
    //       sx={{ m: 1, width: '25ch' }}
    //       InputProps={{
    //         startAdornment: (
    //           <InputAdornment position="start">kam</InputAdornment>
    //         ),
    //       }}
    //       variant="filled"
    //       onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    //         Setkam(event.target.value);
    //       }}
    //     />
    //     <TextField
    //       label="With normal TextField"
    //       id="filled-start-adornment"
    //       sx={{ m: 1, width: '25ch' }}
    //       InputProps={{
    //         startAdornment: (
    //           <InputAdornment position="start">PSČ</InputAdornment>
    //         ),
    //       }}
    //       variant="filled"
    //       onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    //         SetPSC_kam(event.target.value);
    //       }}
    //     />
    //   </div>
    //   <button onClick={handleForm} className={styles.registerbtn} type="submit">
    //     Submit
    //   </button>
    // </Box>
    // vyber podle jmena udelat i u supplier ?
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
          Create package
        </h1>
        <form onSubmit={handleForm} className={styles.form}>
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Package name</p>
              <input
                className={styles.input}
                onChange={(e) => SetPackName(e.target.value)}
                required
                type="text"
                placeholder="Name"
              />
            </label>
            {/* <label>
              <p className={styles.Odstavce}>Dodavatel</p>
              {MyComponent()}
            </label> */}
            <label>
              <p className={styles.Odstavce}>Cena</p>
              <input
                className={styles.input}
                onChange={(e) => SetCost(e.target.value)}
                required
                type="number"
                placeholder="Kč"
              />
            </label>
          </div>
          <h3 className={styles.Nadpisy}>Parametry baliku</h3>
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Sirka</p>
              <input
                className={styles.input}
                onChange={(e) => SetSirka(e.target.value)}
                required
                type="number"
                placeholder="Cm"
              />
            </label>
            <label>
              <p className={styles.Odstavce}>Hmotnost</p>
              <input
                className={styles.input}
                onChange={(e) => SetKg(e.target.value)}
                required
                type="number"
                placeholder="Kg"
              />
            </label>
          </div>
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Delka</p>
              <input
                className={styles.input}
                onChange={(e) => SetDelka(e.target.value)}
                required
                type="number"
                placeholder="Cm"
              />
            </label>
            <label>
              <p className={styles.Odstavce}>Vyska</p>
              <input
                className={styles.input}
                onChange={(e) => SetVyska(e.target.value)}
                required
                type="number"
                placeholder="Cm"
              />
            </label>
          </div>
          {/* </div>
          <h3 className={styles.Nadpisy}>Adresa dovozci</h3>
          <div className={styles.divinput}>
            <label>
              <p className={styles.Odstavce}>Kam</p>
              <input
                className={styles.input}
                onChange={(e) => Setkam(e.target.value)}
                required
                type="text"
                placeholder="Ulice popis. číslo, Město" // format adresy
              />
            </label>
            <label>
              <p className={styles.Odstavce}>PSČ</p>
              <input
                className={styles.input}
                onChange={(e) => SetPSC_kam(e.target.value)}
                required
                type="text"
                placeholder="92732/927 32" // format psc
              />
            </label>
            <label>
              <p className={styles.Odstavce}>Odkud</p>
              <input
                className={styles.input}
                onChange={(e) => Setodkud(e.target.value)}
                required
                type="text"
                placeholder="Ulice popis. číslo, Město"
              />
            </label>
            <label>
              <p className={styles.Odstavce}>PSČ</p>
              <input
                className={styles.input}
                onChange={(e) => SetPSC_odkud(e.target.value)}
                required
                type="text"
                placeholder="92732/927 32" // format psc
              />
            </label>
          </div> */}
          <div className={styles.divinput}>
            {' '}
            <button
              onClick={handleForm}
              className={styles.crudbtn}
              type="submit"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
