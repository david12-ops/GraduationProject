'use client';

import { useGridApiRef } from '@mui/x-data-grid';
import { Inter } from '@next/font/google';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { useAuthContext } from '@/components/auth-context-provider';
import { ButtonCmp } from '@/components/ButtonCmp';
import { DataTableCmp } from '@/components/DataTableCmp';
import { ActivePage, HomePageLayoutCmp } from '@/components/HomePageLayoutCmp';
import { LoadingCmp } from '@/components/LoadingCmp';
import { FormMode } from '@/components/ModalFormCmp';
import { ProtectionCmp } from '@/components/ProtectionCmp';
import { RowFormModalCmp, RowState } from '@/components/RowFormModalCmp';
import {
  useCreateTableRowMutation,
  useDeleteTableRowMutation,
  useTableRowsQuery,
} from '@/generated/graphql';
import { Row } from '@/types';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [scuFormMode, setScuFormMode] = React.useState<FormMode | undefined>(
    undefined,
  );
  const { user, loading: userLoading } = useAuthContext();
  const router = useRouter();
  const gridApiRef = useGridApiRef();

  const {
    data: tableRowsData,
    loading: tableRowsLoading,
    error: tableRowsError,
    refetch: refetchTableRows,
  } = useTableRowsQuery({
    variables: {
      name: true,
      cal: true,
      thp: true,
      revision: true,
      attach: true,
    },
  });
  const [createRow] = useCreateTableRowMutation();
  const [deleteRow] = useDeleteTableRowMutation();

  /* const {data,loading,error} = usePeopleQuery(); */
  useEffect(() => {
    document.title = 'Informační rozhraní Kesa s.r.o.';
  }, []);

  const scuFormCancel = () => {
    setScuFormMode(undefined);
  };

  const createTableRow = async (state: RowState) => {
    const res = await createRow({
      variables: {
        row: {
          name: state.name,
          revision: state.revision.toString(),
          cal: state.cal.toString(),
          thp: state.thp.toString(),
          attach: state.attach,
        },
      },
    });
    console.log(JSON.stringify(res));
    const createdId = res.data?.createTableRow;
    let message = 'Row created successfully';
    if (createdId == null) {
      message = 'Failed to create row';
    } else {
      gridApiRef.current.updateRows([{ id: createdId, ...state }]);
    }
    window.alert(message);
  };

  const scuFormSubmit = async (state: RowState) => {
    let voidPromise;
    switch (scuFormMode) {
      case FormMode.Create: {
        voidPromise = createTableRow(state);
        break;
      }
      case FormMode.Update: {
        break;
      }
      default: {
        break;
      }
    }
    setScuFormMode(undefined);
    await voidPromise;
  };

  const deleteRowAction = async (row: Row) => {
    const deletedIdPromise = deleteRow({
      variables: { id: row.id.toString() },
    });
    gridApiRef.current.updateRows([{ id: row.id, _action: 'delete' }]);
    const deletedIdResponse = await deletedIdPromise;
    const success = deletedIdResponse.data?.deleteTableRow;
    let message = 'Row deleted successfully';
    if (success !== true) {
      gridApiRef.current.updateRows([row]);
      message = 'Failed to delete row';
    }
    window.alert(message);
  };

  const scuFormTitle = (mode?: FormMode) => {
    switch (mode) {
      case FormMode.Create: {
        return 'Vytvoření záznamu';
      }
      case FormMode.Update: {
        return 'Úprava záznamu';
      }
      case FormMode.Show: {
        return 'Detail záznamu';
      }
      default: {
        return null;
      }
    }
  };

  const dateFormatter = (params) => dayjs(params?.value).format('DD/MM/YYYY');

  const cols = [
    { field: 'id', headerName: 'Číslo', editable: true },
    { field: 'name', headerName: 'Název', editable: true },
    {
      field: 'cal',
      headerName: 'Kalibrace',
      editable: true,
      valueFormatter: dateFormatter,
    },
    {
      field: 'thp',
      headerName: 'THP',
      editable: true,
      valueFormatter: dateFormatter,
    },
    {
      field: 'revision',
      headerName: 'Revize',
      editable: true,
      valueFormatter: dateFormatter,
    },
    { field: 'attach', headerName: 'Přílohy', editable: true },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 400,
      renderCell: (params) => {
        return (
          <ButtonCmp
            onClick={() => deleteRowAction(params.row)}
            variant="contained"
          >
            Delete
          </ButtonCmp>
        );
      },
    },
  ];

  const notLoggedIn = () => {
    router.push('/login');
    return <>401</>;
  };
  return (
    <LoadingCmp loading={!!userLoading}>
      <ProtectionCmp access={!!user} unauthorized={notLoggedIn}>
        <HomePageLayoutCmp
          user={user ? { email: user.email! } : undefined}
          activePage={ActivePage.planovani}
        >
          <DataTableCmp
            sx={{ minHeight: '70vh' }}
            cols={cols}
            rows={tableRowsData?.tableRows ?? []}
            loading={tableRowsLoading}
            apiRef={gridApiRef}
            addRow={() => setScuFormMode(FormMode.Create)}
            refresh={() =>
              refetchTableRows({
                name: true,
                cal: true,
                thp: true,
                revision: true,
                attach: true,
              })
            }
          />
        </HomePageLayoutCmp>

        <RowFormModalCmp
          title={scuFormTitle(scuFormMode)}
          mode={scuFormMode}
          onSubmit={scuFormSubmit}
          onCancel={scuFormCancel}
        />
      </ProtectionCmp>
    </LoadingCmp>
  );
}
