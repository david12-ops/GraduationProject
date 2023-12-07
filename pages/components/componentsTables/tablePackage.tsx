import Box from '@mui/material/Box';
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';
import * as React from 'react';

import {
  useDeletePac2Mutation,
  usePackageDataQuery,
} from '@/generated/graphql';

import styles from '../../../styles/stylesForm/style.module.css';

export const DataGridPackage = () => {
  // refresh tabulky
  const packD = usePackageDataQuery();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const [deletePackD] = useDeletePac2Mutation(); // problem s hook
  const [selection, setSelection] = React.useState<GridRowSelectionModel>([]);

  const rows =
    !packD.data || packD.loading
      ? []
      : packD.data.packageData.map((packageD, index) => {
          return {
            id: index,
            PackId: packageD.packgeId,
            packageName: packageD.packName,
            // hmostnost: packageD.hmotnost,
            // cost: packageD.costPackage,
            // vyska: packageD.vyska,
            // delka: packageD.delka,
            // sirka: packageD.sirka,
            // kam: packageD.kam,
            // PSC_kam: packageD.Pkam,
            // Odkud: packageD.odkud,
            // PSC_odkud: packageD.Podkud,
            SuppId: packageD.supplierId,
          };
        });

  // const Idp = () => {
  //   // eslint-disable-next-line sonarjs/no-ignored-return
  //   return (
  //     selection
  //       .map((selectedId) => rows.find((item) => item.id === selectedId))
  //       // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  //       .map(({ PackId }) => ({ idp: PackId }.idp))
  //       .toString()
  //   );
  // };

  const IdPack = () => {
    return selection.map(
      (selectedId) => rows.find((item) => item.id === selectedId)?.PackId,
    );
  };

  const DeleteP = async (event: React.FormEvent) => {
    if (IdPack().length === 0) {
      alert('Nebyl vybrán balícek pro mazání');
    } else {
      const DeletedId: any = IdPack();
      event.preventDefault();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await deletePackD({
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
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          onRowSelectionModelChange={setSelection}
          loading={packD.loading}
          rows={rows}
          columns={[
            // {
            //   field: 'id',
            //   headerName: 'Id',
            //   width: 80,
            //   align: 'center',
            //   headerAlign: 'center',
            // },
            {
              field: 'PackId',
              headerName: 'Pack Id',
              width: 125,
            },
            {
              field: 'SuppId',
              headerName: 'Supp Id',
              width: 125,
            },
            {
              field: 'packageName',
              headerName: 'Package name',
              width: 125,
            },
            // {
            //   field: 'hmostnost',
            //   headerName: 'Hmotnost',
            //   width: 110,
            //   align: 'center',
            //   headerAlign: 'center',
            // },
            // {
            //   field: 'cost',
            //   headerName: 'Cena',
            //   width: 110,
            //   align: 'center',
            //   headerAlign: 'center',
            // },
            // {
            //   field: 'vyska',
            //   headerName: 'Výška',
            //   width: 110,
            //   align: 'center',
            //   headerAlign: 'center',
            // },
            // {
            //   field: 'delka',
            //   headerName: 'Delka',
            //   width: 110,
            //   align: 'center',
            //   headerAlign: 'center',
            // },
            // {
            //   field: 'sirka',
            //   headerName: 'Sířka',
            //   width: 110,
            //   align: 'center',
            //   headerAlign: 'center',
            // },
            // {
            //   field: 'kam',
            //   headerName: 'Adresa kam',
            //   width: 110,
            // },
            // {
            //   field: 'PSC_kam',
            //   headerName: 'PSČ',
            //   width: 110,
            //   align: 'center',
            //   headerAlign: 'center',
            // },
            // {
            //   field: 'Odkud',
            //   headerName: 'Adresa odkud',
            //   width: 110,
            // },
            // {
            //   field: 'PSC_odkud',
            //   headerName: 'PSČ',
            //   width: 110,
            //   align: 'center',
            //   headerAlign: 'center',
            // },
            // {
            //   field: 'ButtonUpdate',
            //   headerName: 'Actoins',
            //   width: 110,
            //   align: 'center',
            //   headerAlign: 'center',
            //   renderCell: () => (
            //     <Link
            //       key="UpdateFormPackage"
            //       href={`/../Forms/UpdateFormPackage/${IdPack()}`}
            //     >
            //       <button className={styles.crudbtnTable}>Update</button>
            //     </Link>
            //   ),
            // },
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
        {/* <div>{Idp()}</div>
        <div>{IdPack()}</div> */}
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
        <button onClick={DeleteP} className={styles.crudbtDel}>
          Delete
        </button>
        {/* <Link key="CreateFormPackage" href="/../Forms/CreateFormPackage">
          <button className={styles.crudbtn}>Create</button>
        </Link> */}
      </div>
    </Box>
  );
};

// delete zaznamu po zavolani resolveru
