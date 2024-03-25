import { Alert, Button, styled } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';
import Link from 'next/link';
import router from 'next/router';
import * as React from 'react';

import {
  HistoryDataDocument,
  SuppDataDocument,
  useDeleteSuppMutation,
  useSuppDataQuery,
} from '@/generated/graphql';

const DelButton = styled(Button)({
  backgroundColor: 'red',
  color: 'white',
  padding: '8px 13px',
});

const UpdateButton = styled(Button)({
  backgroundColor: '#5362FC',
  color: 'white',
  padding: '8px 13px',
});

const CreateButton = styled(Button)({
  backgroundColor: 'green',
  color: 'white',
  padding: '8px 13px',
});

const DeatilButton = styled(Button)({
  backgroundColor: '#00C2E0',
  color: 'white',
  padding: '8px 13px',
});

const Counter = (ids: Array<string>) => {
  console.error('eee', typeof ids);
  console.error('data', ids);
  console.error('delka', ids.length);
  console.log('nooo', Boolean(ids.length === 1));

  return ids.length;
};

const MyAlert = (message: string, severityCode: string) => {
  switch (severityCode) {
    case 'error': {
      return <Alert severity={severityCode}>{message}</Alert>;
    }
    case 'success': {
      return <Alert severity={severityCode}>{message}</Alert>;
    }
    default: {
      return <div></div>;
    }
  }
};

const Check = async (
  arrayOfString: Array<string>,
  setAlert: React.Dispatch<React.SetStateAction<JSX.Element>>,
) => {
  console.error(arrayOfString);
  if (Counter(arrayOfString) === 0) {
    console.error(arrayOfString);
    setAlert(MyAlert('Vyberte si zásilkovou službu', 'error'));
  } else if (Counter(arrayOfString) > 1) {
    setAlert(MyAlert('Vyberte si jen jednu zásilkovou službu', 'error'));
  } else {
    await router.push(`/../admpage/${arrayOfString[0]}`);
  }
};
export const DataGridSupplier = () => {
  // refresh tabulky
  const suppD = useSuppDataQuery();
  const [deleteSuppD] = useDeleteSuppMutation();
  const [selection, setSelection] = React.useState<GridRowSelectionModel>([]);
  const [alert, setAlert] = React.useState<JSX.Element>(<div></div>);

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

  const DeleteS = async () => {
    if (IdSupp().length === 0) {
      console.error('Nebyla vybrána zásilková služba pro smazání');
    } else {
      const DeletedId = IdSupp();
      await deleteSuppD({
        variables: {
          Id: DeletedId,
        },
        refetchQueries: [
          { query: SuppDataDocument },
          { query: HistoryDataDocument },
        ],
        awaitRefetchQueries: true,
      }).catch((error: string) => console.error(error));
    }
  };

  return (
    <Box>
      {alert}
      <Box sx={{ height: '100%', width: '100%' }}>
        <DataGrid
          style={{ background: 'white', border: '2px solid #1BB6E0' }}
          onRowSelectionModelChange={setSelection}
          loading={suppD.loading}
          rows={rows}
          columns={[
            {
              field: 'supplierName',
              headerName: 'Jméno',
              width: 125,
            },
            {
              field: 'ButtonDetail',
              headerName: 'Akce',
              width: 100,
              align: 'center',
              headerAlign: 'center',
              renderCell: () => (
                <UpdateButton onClick={() => Check(IdSupp(), setAlert)}>
                  Změnit
                </UpdateButton>
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
          flexDirection: 'column',
        }}
      >
        <div style={{ alignSelf: 'center' }}>
          <DelButton onClick={DeleteS}>Smazat</DelButton>
        </div>
        <div style={{ alignSelf: 'center' }}>
          <Link key="create-form-supp" href="/../Forms/create-form-supp">
            <CreateButton>Vytvořit zásilkovou službu</CreateButton>
          </Link>
        </div>
        <div style={{ alignSelf: 'center' }}>
          <Link key="suppcard-page" href="/../../suppcard-page">
            <DeatilButton>Detail služeb</DeatilButton>
          </Link>
        </div>
      </div>
    </Box>
  );
};

// delete zaznamu po zavolani resolveru
