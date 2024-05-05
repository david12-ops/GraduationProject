import { useHookstate } from '@hookstate/core';
import { Button, styled, Typography } from '@mui/material';
import router from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';

import {
  HistoryDataDocument,
  SuppDataDocument,
  useSuppDataQuery,
  useUpdateHistoryMutation,
  useUpdatePackageMutation,
} from '@/generated/graphql';
import { Validation } from '@/utility/uthils';

import { CustomAlert } from '../alert-component';
import { useAuthContext } from '../auth-context-provider';
import { MyCompTextField } from '../text-field';
import {
  DataFrServer,
  Package,
  PackageData,
  ResponsePackUpdate,
  SupplierData,
} from '../types/types';

type Props = {
  id: string;
};

const BackButtn = styled(Button)({
  backgroundColor: '#5193DE',
  color: 'white',
  width: '30%',
});

const UpdateButton = styled(Button)({
  backgroundColor: '#5362FC',
  color: 'white',
  width: '30%',
  alignSelf: 'center',
});

const CustomFieldset = styled('fieldset')({
  border: '5px solid #5193DE',
  borderRadius: '10px',
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  padding: '1rem',
});

const Back = async (ids: string) => {
  await router.push(`/../../admpage/${ids}`);
};

const setDataDatabase = (
  pId: string,
  data: SupplierData,
): DataFrServer | undefined => {
  for (const item of data) {
    const packs: Array<Package> = item.package as Array<Package>;
    if (packs) {
      // eslint-disable-next-line max-depth
      for (const pack of packs) {
        const itm = pack[pId];
        // eslint-disable-next-line max-depth
        if (itm) {
          return {
            SuppId: item.supplierId,
            PackName: itm.name_package,
            Cost: itm.cost.toString(),
            Plength: itm.Plength.toString(),
            Weight: itm.weight.toString(),
            Width: itm.width.toString(),
            Height: itm.height.toString(),
          };
        }
      }
    }
  }
  return undefined;
};

const Response = (response: ResponsePackUpdate) => {
  const responseFromQuery: {
    data: PackageData | undefined;
    error: string | undefined;
  } = {
    data: undefined,
    error: undefined,
  };
  // eslint-disable-next-line no-underscore-dangle
  if (response?.__typename === 'UPack') {
    responseFromQuery.data = response.data ?? undefined;
  }
  // eslint-disable-next-line no-underscore-dangle
  if (response?.__typename === 'PackageUpdateError') {
    responseFromQuery.error = response.message ?? undefined;
  }
  return responseFromQuery;
};

export const FormPackageUpdate: React.FC<Props> = ({ id }) => {
  const { user } = useAuthContext();
  const settersForDataPack = useHookstate({
    Weight: '',
    Cost: '',
    Plength: ' ',
    Height: '',
    Width: '',
    PackName: '',
    SuppId: '',
  });

  const setterForAlertMesssage = useHookstate({
    errUpdate: '',
    successUpdate: '',
    msgHistory: '',
  });

  const setterErrors = useHookstate({
    errWeight: '',
    errCost: '',
    errpLength: '',
    errHeight: '',
    errWidth: '',
    errLabel: '',
  });

  const idComp = 'outlined-required';

  const labelHeight = { err: 'Chyba', withoutErr: 'Výška' };
  const labelWeigth = { err: 'Chyba', withoutErr: 'Hmotnost' };
  const labelLength = { err: 'Chyba', withoutErr: 'Délka' };
  const labelWidth = { err: 'Chyba', withoutErr: 'Šířka' };
  const labelCost = { err: 'Chyba', withoutErr: 'Cena' };
  const labelName = { err: 'Chyba', withoutErr: 'Označení' };

  const userApp = useHookstate({ Admin: false, LoggedIn: false });

  const [UpdatePackage] = useUpdatePackageMutation();
  const [UpdateHistory] = useUpdateHistoryMutation();
  const SuppPackages = useSuppDataQuery();
  const [oldPackName, SetOldPackName] = React.useState('');
  const [suppId, SetSuppId] = React.useState('');

  useEffect(() => {
    const adminId = process.env.NEXT_PUBLIC_ADMIN_ID;
    if (user) {
      userApp.LoggedIn.set(true);
    }
    if (user?.uid === adminId) {
      userApp.Admin.set(true);
    }
    if (id && SuppPackages.data && SuppPackages) {
      const data = setDataDatabase(id, SuppPackages.data.suplierData);
      if (data) {
        SetSuppId(data.SuppId);
        SetOldPackName(data.PackName);
        settersForDataPack.set({
          SuppId: data.SuppId,
          PackName: data.PackName,
          Cost: data.Cost,
          Plength: data.Plength,
          Weight: data.Weight,
          Width: data.Width,
          Height: data.Height,
        });
      }
    }
  }, [SuppPackages, userApp]);

  const handleForm = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const valid = Validation(
      'packUpdate',
      {
        packageData: {
          weight: settersForDataPack.Weight.get(),
          cost: settersForDataPack.Cost.get(),
          pLength: settersForDataPack.Plength.get(),
          height: settersForDataPack.Height.get(),
          width: settersForDataPack.Width.get(),
        },
      },
      setterErrors,
    )?.message;
    if (valid) {
      console.error(valid);
    } else {
      const result = await UpdatePackage({
        variables: {
          Weight: Number(settersForDataPack.Weight.get()),
          Cost: Number(settersForDataPack.Cost.get()),
          Length: Number(settersForDataPack.Plength.get()),
          Height: Number(settersForDataPack.Height.get()),
          Width: Number(settersForDataPack.Width.get()),
          Pack_name: settersForDataPack.PackName.get(),
          PackKey: id,
          SuppId: settersForDataPack.SuppId.get(),
        },
        refetchQueries: [
          { query: SuppDataDocument },
          { query: HistoryDataDocument },
        ],
        awaitRefetchQueries: true,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }).catch((error: string) => console.error('Chyba při úpravě balíku'));

      const response = Response(result?.data?.updatePack);

      if (
        response.error &&
        /Toto označení pužívá jíny balík/.test(response.error) === false
      ) {
        setterForAlertMesssage.errUpdate.set(response.error);
      }

      if (
        response.error &&
        /Toto označení pužívá jíny balík/.test(response.error)
      ) {
        setterErrors.errLabel.set(response.error);
      }

      if (response.data && !response.error) {
        SetSuppId(response.data.supplier_id);
        setterForAlertMesssage.successUpdate.set(JSON.stringify(response.data));
        const updateHistory = await UpdateHistory({
          variables: {
            PackageName: response.data.name_package,
            OldPackName: oldPackName,
            NewPricePack: response.data.cost,
            SuppId: response.data.supplier_id,
          },
          refetchQueries: [{ query: HistoryDataDocument }],
          awaitRefetchQueries: true,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }).catch((error: string) => console.error('Chyba při úpravě historie'));
        // eslint-disable-next-line max-depth
        if (updateHistory?.data?.updateHistory?.message) {
          setterForAlertMesssage.msgHistory.set(
            updateHistory?.data?.updateHistory?.message,
          );
        }
      }
    }
  };

  if (!userApp.LoggedIn.get() || !userApp.Admin.get()) {
    return (
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
    );
  }
  return (
    <Typography component={'div'}>
      <form
        onSubmit={handleForm}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
        onChange={() => {
          setterForAlertMesssage.set({
            errUpdate: '',
            successUpdate: '',
            msgHistory: '',
          });
          setterErrors.set({
            errCost: '',
            errHeight: '',
            errpLength: '',
            errWeight: '',
            errWidth: '',
            errLabel: '',
          });
        }}
      >
        <div style={{ alignSelf: 'center' }}>
          <CustomAlert
            messages={{
              successUpade: setterForAlertMesssage.successUpdate.value,
              errUpdate: setterForAlertMesssage.errUpdate.value,
              msgHisotry: setterForAlertMesssage.msgHistory.value,
            }}
            operation="packageUpdate"
          />
        </div>
        <CustomFieldset>
          <legend
            style={{
              textAlign: 'center',
              fontSize: '30px',
              fontWeight: 'bold',
            }}
          >
            Balík
          </legend>
          <MyCompTextField
            typeComp="text"
            idComp={idComp}
            labelComp={labelName}
            errorComp={setterErrors.errLabel.get()}
            funcComp={(e) => settersForDataPack.PackName.set(e)}
            helpTexterComp="Zadejte označení balíku"
            valueComp={settersForDataPack.PackName.get()}
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelCost}
            errorComp={setterErrors.errCost.get()}
            funcComp={(e) => settersForDataPack.Cost.set(e)}
            helpTexterComp="Zadejte cenu balíku"
            placeholderComp="Kč"
            valueComp={settersForDataPack.Cost.get()}
          />
        </CustomFieldset>

        <CustomFieldset>
          <legend
            style={{
              textAlign: 'center',
              fontSize: '30px',
              fontWeight: 'bold',
            }}
          >
            Parametry balíku
          </legend>
          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelWidth}
            errorComp={setterErrors.errWidth.get()}
            funcComp={(e) => settersForDataPack.Width.set(e)}
            helpTexterComp="Zadejte šířku balíku"
            placeholderComp="Cm"
            valueComp={settersForDataPack.Width.get()}
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelWeigth}
            errorComp={setterErrors.errWeight.get()}
            funcComp={(e) => settersForDataPack.Weight.set(e)}
            helpTexterComp="Zadejte hmotnost balíku"
            placeholderComp="Cm"
            valueComp={settersForDataPack.Weight.get()}
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelLength}
            errorComp={setterErrors.errpLength.get()}
            funcComp={(e) => settersForDataPack.Plength.set(e)}
            helpTexterComp="Zadejte délu balíku"
            placeholderComp="Cm"
            valueComp={settersForDataPack.Plength.get()}
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelHeight}
            errorComp={setterErrors.errHeight.get()}
            funcComp={(e) => settersForDataPack.Height.set(e)}
            helpTexterComp="Zadejte výšku balíku"
            placeholderComp="Cm"
            valueComp={settersForDataPack.Height.get()}
          />
        </CustomFieldset>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
          }}
        >
          <UpdateButton type="submit">Upravit</UpdateButton>
          <BackButtn onClick={() => Back(suppId)}>Zpět</BackButtn>
        </div>
      </form>
    </Typography>
  );
};
