import Box from '@mui/material/Box';
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';
import Link from 'next/link';
import router from 'next/router';
import * as React from 'react';

import { useDeleteSupp2Mutation, useSuppDataQuery } from '@/generated/graphql';

import styles from '../../../styles/stylesForm/style.module.css';

export const DataGridSupplier = () => {
  // refresh tabulky
  const suppD = useSuppDataQuery();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const [deleteSuppD] = useDeleteSupp2Mutation();
  const [selection, setSelection] = React.useState<GridRowSelectionModel>([]);

  const rows =
    !suppD.data || suppD.loading
      ? []
      : suppD.data.suplierData.map((SuupD, index) => {
          return {
            id: index,
            supplierName: SuupD.suppName,
            // packInBox: SuupD.packInBox === 'true' ? 'Ano' : 'Ne',
            packId: SuupD.packageId,
            // sendCashDelivery: SuupD.sendCashDelivery === 'true' ? 'Ano' : 'Ne',
            // pickUp: SuupD.pickUp,
            // delivery: SuupD.delivery,
            // insurance: SuupD.insurance,
            // shippingLabel: SuupD.shippingLabel === 'true' ? 'Ano' : 'Ne',
            // foil: SuupD.foil === 'true' ? 'Ano' : 'Ne',
            suppId: SuupD.supplierId,
          };
        });

  const IdSupp = () => {
    return selection.map(
      (selectedId) => rows.find((item) => item.id === selectedId)?.suppId,
    );
  };

  // const Ids = () => {
  //   // eslint-disable-next-line sonarjs/no-ignored-return
  //   return (
  //     selection
  //       .map((selectedId) => rows.find((item) => item.id === selectedId))
  //       // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  //       .map(({ suppId }) => ({ ids: suppId }.ids))
  //       .toString()
  //   );
  // };

  const Check = () => {
    let errmsg;
    if (IdSupp().length === 0) {
      errmsg = 'Vyberte si prosím záznam';
    } else if (IdSupp().length > 1) {
      errmsg = 'Vzberte jen jednoho dodavatele';
    } else {
      return router.push(`/../admpage/${IdSupp()}`);
    }
    // eslint-disable-next-line no-alert
    return alert(errmsg);
  };

  const DeleteS = async (event: React.FormEvent) => {
    // alert(IdSupp());
    if (IdSupp().length === 0) {
      alert('Nebyl vybrán dodavatel pro mazání');
    } else {
      const DeletedId: any = IdSupp();
      event.preventDefault();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await deleteSuppD({
        variables: {
          Id: DeletedId,
        },
      });
      alert('Deletion secusfull');
    }
  };

  return (
    <Box>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          // eslint-disable-next-line sonarjs/no-duplicate-string
          style={{ background: '#ADADD6', border: 'solid white' }}
          onRowSelectionModelChange={setSelection}
          loading={suppD.loading}
          rows={rows}
          columns={[
            // {
            //   field: 'id',
            //   headerName: 'ID',
            //   width: 80,
            //   align: 'center',
            //   headerAlign: 'center',
            // },
            {
              field: 'supplierName',
              headerName: 'Supplier name',
              width: 125,
              editable: true,
            },
            // {
            //   field: 'packInBox',
            //   headerName: 'Zbaleni do krabice',
            //   width: 110,
            //   editable: true,
            //   align: 'center',
            //   headerAlign: 'center',
            // },
            // {
            //   field: 'sendCashDelivery',
            //   headerName: 'Na dobírku',
            //   width: 110,
            //   editable: true,
            //   align: 'center',
            //   headerAlign: 'center',
            // },
            // {
            //   field: 'pickUp',
            //   headerName: 'Vyzvednutí',
            //   width: 110,
            //   editable: true,
            //   align: 'center',
            //   headerAlign: 'center',
            // },
            // {
            //   field: 'delivery',
            //   headerName: 'Doručení',
            //   width: 110,
            //   editable: true,
            //   align: 'center',
            //   headerAlign: 'center',
            // },
            // {
            //   field: 'insurance',
            //   headerName: 'Pojištění',
            //   width: 110,
            //   editable: true,
            //   align: 'center',
            //   headerAlign: 'center',
            // },
            // {
            //   field: 'shippingLabel',
            //   headerName: 'Přepravní štítek',
            //   width: 110,
            //   editable: true,
            //   align: 'center',
            //   headerAlign: 'center',
            // },
            // {
            //   field: 'foil',
            //   headerName: 'Do folie',
            //   width: 110,
            //   editable: true,
            //   align: 'center',
            //   headerAlign: 'center',
            // },
            {
              field: 'packId',
              headerName: 'Pack Id',
              width: 125,
              align: 'center',
              headerAlign: 'center',
            },
            {
              field: 'suppId',
              headerName: 'Supplier Id',
              type: 'number',
              width: 125,
              align: 'center',
              headerAlign: 'center',
            },
            // {
            //   field: 'ButtonUpdate',
            //   headerName: 'Actoins',
            //   width: 110,
            //   align: 'center',
            //   headerAlign: 'center',
            //   renderCell: () => (
            //     <Link
            //       key="UpdateFromSupplier"
            //       href={`/../Forms/UpdateFromSupplier/${IdSupp()}`}
            //     >
            //       <button className={styles.crudbtnTable}>Update</button>
            //     </Link>
            //   ),
            // },
            {
              field: 'ButtonDetail',
              headerName: 'Action',
              width: 110,
              align: 'center',
              headerAlign: 'center',
              renderCell: () => (
                // <Link key="admpage" href={`/../admpage/${IdSupp()}`}>
                <button onClick={Check} className={styles.crudbtnTable}>
                  Manage
                </button>
                // </Link>
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
        {/* <div>{Ids()}</div> */}
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
        <Link key="CreateFormSupp" href="/../Forms/CreateFormSupp">
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
