import { User } from 'firebase/auth';

import { PackCards } from '../Cards/packs-cards';

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
  stylingImgErr: any;
  user: User | null | undefined;
  adminId: string | undefined;
};

export const PacksCardBody: React.FC<Props> = ({
  data,
  stylingErr,
  stylingImgErr,
  stylingWarning,
  user,
  adminId,
}) => {
  const packages: Array<Package> = data?.package;

  if (!user || user.uid !== adminId) {
    return <div style={stylingErr}>Přístup pouze pro administrátora</div>;
  }

  if (!data) {
    return (
      <div style={stylingImgErr}>
        <div>
          <img src="/sorry-item-not-found-3328225-2809510.webp" alt="?" />
        </div>
      </div>
    );
  }

  if (packages.length === 0 || !packages) {
    return <div style={stylingWarning}>Tato zásilková služba nemá balíky</div>;
  }

  return (
    <div style={{ margin: 'auto' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'row',
          justifyContent: 'center',
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
              <PackCards
                key={key}
                Name={item[key].name_package}
                Cost={item[key].cost}
                Weight={item[key].weight}
                Width={item[key].width}
                Length={item[key].Plength}
                Heiht={item[key].height}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
