import Box from '@mui/material/Box';
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';
import Link from 'next/link';
import router from 'next/router';
import * as React from 'react';

import {
  SuppDataDocument,
  useDeleteSuppMutation,
  useSuppDataQuery,
} from '@/generated/graphql';

import styles from '../../../styles/stylesForm/style.module.css';

// Mozna kontrola na id
const Counter = (ids: Array<string>) => {
  const counter = 0;
  ids.forEach((id) => (id === '' ? counter + 0 : counter + 1));
  return counter;
};

export const DataGridSupplier = () => {
  // refresh tabulky
  const suppD = useSuppDataQuery();
  const [deleteSuppD] = useDeleteSuppMutation();
  const [selection, setSelection] = React.useState<GridRowSelectionModel>([]);

  const rows =
    !suppD.data || suppD.loading
      ? []
      : suppD.data.suplierData.map((SuupD, index) => {
          return {
            id: index,
            supplierName: SuupD.suppName,
            suppId: SuupD.supplierId,
          };
        });

  const IdSupp = () => {
    return selection.map(
      (selectedId) => rows.find((item) => item.id === selectedId)?.suppId ?? '',
    );
  };

  // nefunkcni
  const Check = async () => {
    // let errmsg;
    // if (Counter(IdSupp()) === 0) {
    //   errmsg = 'Vyberte si prosím záznam';
    // } else if (Counter(IdSupp()) > 1) {
    //   errmsg = 'Vzberte jen jednoho dodavatele';
    //   alert(errmsg);
    // } else {
    await router.push(`/../admpage/${IdSupp()}`);
    // }
    // alert(errmsg);
  };

  const DeleteS = async () => {
    if (IdSupp().length === 0) {
      alert('Nebyl vybrán dodavatel pro mazání');
    } else {
      const DeletedId: Array<string> = IdSupp();
      const result = await deleteSuppD({
        variables: {
          Id: DeletedId,
        },
        refetchQueries: [{ query: SuppDataDocument }],
        awaitRefetchQueries: true,
      })
        // .then((res) => {
        //   return res.data;
        // })
        .catch((error: string) => alert(error));

      const err = result?.data?.deleteSupp?.error;
      const deleted = result?.data?.deleteSupp?.deletion;
      if (deleted) {
        alert('Deletion secusfull');
      }
      if (err) {
        alert(err);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          style={{ background: '#ADADD6', border: 'solid white' }}
          onRowSelectionModelChange={setSelection}
          loading={suppD.loading}
          rows={rows}
          columns={[
            {
              field: 'supplierName',
              headerName: 'Supplier name',
              width: 125,
              editable: true,
            },
            {
              field: 'suppId',
              headerName: 'Supplier Id',
              type: 'number',
              width: 125,
              align: 'center',
              headerAlign: 'center',
            },
            {
              field: 'ButtonDetail',
              headerName: 'Action',
              width: 110,
              align: 'center',
              headerAlign: 'center',
              renderCell: () => (
                <button onClick={Check} className={styles.crudbtnTable}>
                  Manage
                </button>
              ),
            },
          ]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
      <div
        style={{
          display: 'flex',
          // flexWrap: 'wrap',
          flexDirection: 'row',
          justifyContent: 'space-around',
          background: '#FFE8C4',
          borderBottom: 'solid white',
          borderLeft: 'solid white',
          borderRight: 'solid white',
        }}
      >
        <h1
          style={{
            color: 'gray',
          }}
        >
          Actions
        </h1>
        <button onClick={DeleteS} className={styles.crudbtDel}>
          Delete
        </button>
        <Link key="create-form-supp" href="/../Forms/create-form-supp">
          <button className={styles.crudbtn}>Create</button>
        </Link>
        <Link key="suppcard-page" href="/../../suppcard-page">
          <button className={styles.crudbtn}>Suppliers</button>
        </Link>
      </div>
    </Box>
  );
};

// Page na not Found
// delete zaznamu po zavolani resolveru
