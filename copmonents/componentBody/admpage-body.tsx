import { FC } from 'react';

import { DataGridSupplier } from '../componentsTables/table-supp';

type Props = {
  logged: boolean;
  admin: boolean;
};

export const AdminPageBody: FC<Props> = ({ logged, admin }) => {
  return !logged || !admin ? (
    <div
      style={{
        textAlign: 'center',
        color: 'red',
        fontSize: '30px',
        fontWeight: 'bold',
        margin: 'auto',
      }}
    >
      Přístup pouze pro administrátora
    </div>
  ) : (
    <div>
      <h2
        style={{
          marginTop: '70px',
          color: '#5193DE',
          fontSize: '30px',
          textAlign: 'center',
        }}
      >
        Zásilkové služby
      </h2>
      <DataGridSupplier />
    </div>
  );
};
