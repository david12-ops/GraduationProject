import { getAuth } from 'firebase/auth';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useSuppDataQuery } from '@/generated/graphql';

import styles from '../../styles/Home.module.css';
import stylesF from '../../styles/stylesForm/style.module.css';
import { PackCard } from '../components/Cards/packsCard';
import { AdmPageSuppCard } from '../components/Cards/suppCard';
import { Navbar } from '../components/navbar2';

// responzivitu vyresit a  sortovani

const IsTherePackage = (data: any) => {
  // eslint-disable-next-line sonarjs/prefer-single-boolean-return
  console.log('how much', data?.length > 0);
  // eslint-disable-next-line sonarjs/prefer-single-boolean-return
  if (data?.length > 0) {
    return true;
  }
  return false;
};

const IsThereSupp = (data: any) => {
  console.log('co kontrolujeme', data);
  // eslint-disable-next-line sonarjs/prefer-single-boolean-return
  if (data) {
    return true;
  }
  return false;
};

const PageBody = (
  error: any,
  warning: any,
  dataSupp: any,
  id: string,
  logged: boolean,
  admin: boolean,
) => {
  if (!logged || !admin) {
    return (
      <div
        style={{
          textAlign: 'center',
          color: 'red',
          fontSize: '30px',
          fontWeight: 'bold',
        }}
      >
        Nejsi admin!!!!
      </div>
    );
  }

  if (!error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (
      <div
        style={{
          textAlign: 'center',
          color: 'red',
          fontSize: '40px',
          fontWeight: 'bold',
        }}
      >
        <p>Dodavatel nenalazen!!</p>
      </div>
    );
  }

  if (!warning) {
    return (
      <div>
        <AdmPageSuppCard
          key={dataSupp?.supplierId}
          packInBox={dataSupp?.packInBox}
          name={dataSupp?.suppName}
          sendCash={dataSupp?.sendCashDelivery}
          folie={dataSupp?.foil}
          shippingLabel={dataSupp?.shippingLabel}
          pickUp={dataSupp?.pickUp}
          delivery={dataSupp?.delivery}
          insurance={dataSupp?.insurance}
          suppId={dataSupp?.supplierId}
        />

        <div
          style={{
            textAlign: 'center',
            color: 'orange',
            fontSize: '30px',
            fontWeight: 'bold',
          }}
        >
          Tento dodavatel nemá balíčky
        </div>

        <div>
          <Link
            key="CreateFormPackage"
            href={`../../Forms/CreateFormPackage/${id}`}
          >
            <button className={stylesF.crudbtn}>Create</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <AdmPageSuppCard
          key={dataSupp?.supplierId}
          packInBox={dataSupp?.packInBox}
          name={dataSupp?.suppName}
          sendCash={dataSupp?.sendCashDelivery}
          folie={dataSupp?.foil}
          shippingLabel={dataSupp?.shippingLabel}
          pickUp={dataSupp?.pickUp}
          delivery={dataSupp?.delivery}
          insurance={dataSupp?.insurance}
          suppId={dataSupp?.supplierId}
        />
      </div>
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            maxWidth: '800px',
          }}
        >
          {dataSupp?.package.map((item: any) => {
            const keys = Object.keys(item);
            return keys.map((key: any) => (
              <div
                key={key}
                style={{
                  backgroundColor: '#D67F76',
                  padding: '10px',
                  margin: '10px',
                  borderRadius: '10px',
                }}
              >
                <PackCard
                  key={key}
                  Name={item[key].name_package}
                  Cost={item[key].cost}
                  Weight={item[key].weight}
                  Width={item[key].width}
                  Length={item[key].Plength}
                  Heiht={item[key].height}
                  sId={dataSupp.supplierId}
                  keyPac={key}
                />
              </div>
            ));
          })}
        </div>
      </div>

      <div>
        <Link
          key="CreateFormPackage"
          href={`../../Forms/CreateFormPackage/${id}`}
        >
          <button className={stylesF.crudbtn}>Create</button>
        </Link>
      </div>
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default function Page() {
  const suppD = useSuppDataQuery();
  const [body, SetBody] = useState({ element: <div></div> });
  const [admin, SetAdmin] = useState(false);
  const [logged, SetLogin] = useState(false);

  const router = useRouter();
  const { query } = router;
  const { id } = query;
  const auth = getAuth();
  const title = `Welocome to package detail of supplier ${
    auth.currentUser
      ? // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
        auth.currentUser.email
        ? auth.currentUser.email
        : ''
      : ''
  }`;

  useEffect(() => {
    const Admin = process.env.NEXT_PUBLIC_AdminEm;
    if (auth.currentUser) {
      SetLogin(true);
    }
    if (auth.currentUser?.email === Admin) {
      SetAdmin(true);
    }
    if (!suppD.loading) {
      const selectedSupp = suppD.data?.suplierData.find(
        (actPack: any) => actPack.supplierId === id,
      );

      console.log(selectedSupp);
      const errSup = IsThereSupp(selectedSupp);
      const errPack = IsTherePackage(selectedSupp?.package);

      SetBody({
        element: PageBody(
          errSup,
          errPack,
          selectedSupp,
          id ? String(id) : '',
          logged,
          admin,
        ),
      });
    }
  }, [
    suppD.data?.suplierData,
    suppD.loading,
    id,
    logged,
    admin,
    auth.currentUser,
  ]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Upadte package</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className={styles.main}>
        <h1 style={{ textAlign: 'center' }}>{title} </h1>
        {body.element}
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
