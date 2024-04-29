import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { User } from 'firebase/auth';
import Link from 'next/link';

import { PackCard } from '../Cards/packs-card';
import { AdmPageSuppCard } from '../Cards/supp-card';

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

type Props = {
  data: SuppData;
  stylingErr: any;
  stylingWarning: any;
  user: User | null | undefined;
  id: string | undefined;
  adminId: string | undefined;
};

const CreateButton = styled(Button)({
  backgroundColor: 'green',
  color: 'white',
  padding: '6px 11px',
});

export const AdminPageBody: React.FC<Props> = ({
  data,
  stylingErr,
  stylingWarning,
  user,
  id,
  adminId,
}) => {
  const packages: Array<Package> = data?.package;

  if (!user || user.uid !== adminId) {
    return <div style={stylingErr}>Přístup pouze pro administrátora</div>;
  }

  if (!data) {
    return (
      <div style={stylingErr}>
        <p>Zásilková služba nenalazena</p>
      </div>
    );
  }

  if (!packages) {
    return (
      <div>
        {data ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '30px',
            }}
          >
            <AdmPageSuppCard
              key={data.supplierId}
              packInBox={data.packInBox}
              name={data.suppName}
              sendCash={data.sendCashDelivery}
              folie={data.foil}
              shippingLabel={data.shippingLabel}
              pickUp={data.pickUp}
              delivery={data.delivery}
              insurance={data.insurance}
              suppId={data.supplierId}
            />
            <div style={stylingWarning}>Tato zásilková služba nemá balíky</div>

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
      {data ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
          }}
        >
          <AdmPageSuppCard
            key={data.supplierId}
            packInBox={data.packInBox}
            name={data.suppName}
            sendCash={data.sendCashDelivery}
            folie={data.foil}
            shippingLabel={data.shippingLabel}
            pickUp={data.pickUp}
            delivery={data.delivery}
            insurance={data.insurance}
            suppId={data.supplierId}
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
                    sId={data.supplierId}
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
