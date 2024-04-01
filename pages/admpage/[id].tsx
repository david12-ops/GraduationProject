import { Button, styled } from '@mui/material';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useSuppDataQuery } from '@/generated/graphql';

import { useAuthContext } from '../../copmonents/auth-context-provider';
import { PackCard } from '../../copmonents/Cards/packs-card';
import { AdmPageSuppCard } from '../../copmonents/Cards/supp-card';
import { Navbar } from '../../copmonents/navbar';
import styles from '../../styles/Home.module.css';

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

const CreateButton = styled(Button)({
  backgroundColor: 'green',
  color: 'white',
  padding: '6px 11px',
});

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
  const packages: Array<Package> = dataSupp?.package;

  if (!logged || !admin) {
    return (
      <div
        style={{
          textAlign: 'center',
          color: 'red',
          fontSize: '30px',
          fontWeight: 'bold',
          margin: 'auto',
        }}
      >
        Nejsi admin
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
          margin: 'auto',
        }}
      >
        <p>Zásilková služba nenalazena</p>
      </div>
    );
  }

  if (!warning) {
    return (
      <div>
        {dataSupp ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '30px',
              justifyContent: 'center',
            }}
          >
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
            <div
              style={{
                textAlign: 'center',
                color: 'orange',
                fontSize: '30px',
                fontWeight: 'bold',
              }}
            >
              Tato zásilková služba nemá balíčky
            </div>

            <div style={{ alignSelf: 'center' }}>
              <Link
                key="CreateFormPackage"
                href={`../../Forms/CreateFormPackage/${id}`}
              >
                <CreateButton>Vytvořit nový balík</CreateButton>
              </Link>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }

  return (
    <div>
      {dataSupp ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
            justifyContent: 'center',
          }}
        >
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

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '30px',
            }}
          >
            {packages.map((item) => {
              const key = Object.keys(item)[0];

              return (
                <div
                  key={key}
                  style={{
                    border: '7px solid #0E95EB',
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
          <div style={{ alignSelf: 'center' }}>
            <Link
              key="CreateFormPackage"
              href={`../../Forms/CreateFormPackage/${id}`}
            >
              <CreateButton>Vytvořit nový balík</CreateButton>
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
  const { user } = useAuthContext();
  const suppD = useSuppDataQuery();
  const [body, SetBody] = useState({ element: <div></div> });
  const [admin, SetAdmin] = useState(false);
  const [logged, SetLogin] = useState(false);

  const router = useRouter();
  const { query } = router;
  const { id } = query;

  useEffect(() => {
    const adminEm = process.env.NEXT_PUBLIC_AdminEm;
    if (user) {
      SetLogin(true);
    }
    if (user?.email === adminEm) {
      SetAdmin(true);
    }
    if (!suppD.loading) {
      const selectedSupp = suppD.data?.suplierData.find(
        (actPack) => actPack.supplierId === id,
      );

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
  }, [suppD.data?.suplierData, suppD.loading, logged]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Úprava zásilkové služby/balíků</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar user={user} />
      <main className={styles.main}>{body.element}</main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
