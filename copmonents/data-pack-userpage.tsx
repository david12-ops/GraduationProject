// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-depth */
import { Typography } from '@mui/material';

import { useSuppDataQuery } from '@/generated/graphql';

import { Package, SuppData, Supplier } from './types/types';

type Props = {
  suppName: string;
  packName: string;
};

const GetData = (suppName: string, packName: string, data: SuppData) => {
  const dataOfSuppPack = data?.suplierData as Array<Supplier>;
  for (const item of dataOfSuppPack) {
    if (item?.suppName === suppName) {
      for (const pack of item.package as Array<Package>) {
        const key = Object.keys(pack)[0];
        if (pack[key].name_package === packName) {
          return {
            width: pack[key].width,
            height: pack[key].height,
            length: pack[key].Plength,
            weight: pack[key].weight,
          };
        }
      }
    }
  }
  return undefined;
};
export const DataPack: React.FC<Props> = ({ suppName, packName }) => {
  let element = <div></div>;
  const { data, loading, error } = useSuppDataQuery();
  const packData = GetData(suppName, packName, data);

  if (!loading && !error && packData) {
    element = (
      <div>
        <Typography component={'p'} style={{ margin: '10px' }}>
          <strong>Šířka</strong>: {packData.width} cm
        </Typography>
        <Typography component={'p'} style={{ margin: '10px' }}>
          <strong>Výška</strong>: {packData.height} cm
        </Typography>
        <Typography component={'p'} style={{ margin: '10px' }}>
          <strong>Délka</strong>: {packData.length} cm
        </Typography>
        <Typography component={'p'} style={{ margin: '10px' }}>
          <strong>Hmotnost</strong>: {packData.weight} kg
        </Typography>
      </div>
    );
  }
  return element;
};
