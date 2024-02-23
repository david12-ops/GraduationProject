import { getAuth } from 'firebase/auth';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useSuppDataQuery } from '@/generated/graphql';

import styles from '../../styles/Home.module.css';
import stylesF from '../../styles/stylesForm/style.module.css';
import { PackCard } from '../components/Cards/packs-card';
import { AdmPageSuppCard } from '../components/Cards/supp-card';
import { Navbar } from '../components/navbar2';

type Package = {
  [name: string]: {
    weight: number;
    height: number;
    width: number;
    Plength: number;
    name_package: string;
    cost: number;
    supplier_id: string;
  };
};
type SuppData =
  | {
      __typename?: 'QuerySuppD' | undefined;
      sendCashDelivery: string;
      packInBox: string;
      supplierId: string;
      suppName: string;
      pickUp: string;
      delivery: string;
      insurance: number;
      shippingLabel: string;
      foil: string;
      package?: any | undefined;
      location?: any | undefined;
    }
  | undefined;

// responzivitu vyresit a  sortovani

const IsTherePackage = (data: any) => {
  const packages: Array<Package> = data;
  return packages && packages.length > 0;
};

const IsThereSupp = (data: SuppData) => {
  return !!data;
};

const PageBody = (
  error: boolean,
  warning: boolean,
  dataSupp: SuppData,
  id: string,
  logged: boolean,
  admin: boolean,
) => {
  // Mozna uprava
  const packages: Array<Package> = dataSupp?.package;

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
        {dataSupp ? (
          <div>
            <AdmPageSuppCard
              key={dataSupp.supplierId}
              packInBox={dataSupp.packInBox}
              name={dataSupp.suppName}
              sendCash={dataSupp.sendCashDelivery}
              folie={dataSupp.foil}
              shippingLabel={dataSupp.shippingLabel}
              pickUp={dataSupp.pickUp}
              delivery={dataSupp.delivery}
              insurance={dataSupp.insurance}
              suppId={dataSupp.supplierId}
            />
          </div>
        ) : (
          <div></div>
        )}

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
      {dataSupp ? (
        <div>
          <div>
            <AdmPageSuppCard
              key={dataSupp.supplierId}
              packInBox={dataSupp.packInBox}
              name={dataSupp.suppName}
              sendCash={dataSupp.sendCashDelivery}
              folie={dataSupp.foil}
              shippingLabel={dataSupp.shippingLabel}
              pickUp={dataSupp.pickUp}
              delivery={dataSupp.delivery}
              insurance={dataSupp.insurance}
              suppId={dataSupp.supplierId}
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
              {packages.map((item) => {
                const key = Object.keys(item)[0];

                return (
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
                );
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
      ) : (
        <div></div>
      )}
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
        (actPack) => actPack.supplierId === id,
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
