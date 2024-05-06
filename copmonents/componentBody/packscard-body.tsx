import { User } from 'firebase/auth';
import Image from 'next/image';

import { PackCards } from '../Cards/packs-cards';
import { Package, Supplier } from '../types/types';

type Props = {
  data: Supplier;
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
          <Image
            src={'/sorry-item-not-found-3328225-2809510.webp'}
            alt="not found"
          ></Image>
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
