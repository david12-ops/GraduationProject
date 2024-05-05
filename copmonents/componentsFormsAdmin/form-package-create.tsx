import { useHookstate } from '@hookstate/core';
import { Button, styled, Typography } from '@mui/material';
import router from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  SuppDataDocument,
  useNewPackageToFirestoreMutation,
} from '@/generated/graphql';

import { Validation } from '../../utility/uthils';
import { CustomAlert } from '../alert-component';
import { useAuthContext } from '../auth-context-provider';
import { MyCompTextField } from '../text-field';
import { CreatedPackage } from '../types/types';

type Props = {
  id: string;
};

const CreateButton = styled(Button)({
  backgroundColor: 'green',
  color: 'white',
  width: '30%',
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

const BackButtn = styled(Button)({
  backgroundColor: '#5193DE',
  color: 'white',
  width: '30%',
});

const Back = async (ids: string) => {
  await router.push(`/../../admpage/${ids}`);
};

const Response = (
  response:
    | {
        __typename?: 'Pack' | undefined;
        data: {
          __typename?: 'PackageDataCreate' | undefined;
          weight: number;
          cost: number;
          Plength: number;
          height: number;
          width: number;
          name_package: string;
          supplier_id: string;
        };
      }
    | {
        __typename?: 'PackageError' | undefined;
        message: string;
      }
    | null
    | undefined,
) => {
  const responseFromQuery: {
    data: CreatedPackage | undefined;
    error: string | undefined;
  } = {
    data: undefined,
    error: undefined,
  };
  // eslint-disable-next-line no-underscore-dangle
  if (response?.__typename === 'Pack') {
    responseFromQuery.data = response.data ?? undefined;
  }
  // eslint-disable-next-line no-underscore-dangle
  if (response?.__typename === 'PackageError') {
    responseFromQuery.error = response.message ?? undefined;
  }
  return responseFromQuery;
};

export const FormPackage: React.FC<Props> = ({ id }) => {
  const { user } = useAuthContext();
  const settersForDataPack = useHookstate({
    Weight: '',
    Cost: '',
    Plength: ' ',
    Height: '',
    Width: '',
    PackName: '',
  });

  const setterForAlertMesssage = useHookstate({
    errCreate: '',
    successCreate: '',
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

  const [newPackage] = useNewPackageToFirestoreMutation();

  useEffect(() => {
    const adminId = process.env.NEXT_PUBLIC_ADMIN_ID;
    if (user) {
      userApp.LoggedIn.set(true);
    }
    if (user?.uid === adminId) {
      userApp.Admin.set(true);
    }
  }, [userApp]);

  const handleForm = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const pID = uuidv4();
    const valid = Validation(
      'packCreate',
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
      const result = await newPackage({
        variables: {
          Weight: Number(settersForDataPack.Weight.get()),
          Cost: Number(settersForDataPack.Cost.get()),
          Length: Number(settersForDataPack.Plength.get()),
          Height: Number(settersForDataPack.Height.get()),
          Width: Number(settersForDataPack.Width.get()),
          Pack_name: settersForDataPack.PackName.get(),
          SuppID: id,
          PackId: pID,
        },
        refetchQueries: [{ query: SuppDataDocument }],
        awaitRefetchQueries: true,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }).catch((error: string) => console.error('Chyba při vytváření balíku'));

      const response = Response(result?.data?.PackageToFirestore);

      if (
        response.error &&
        /Toto označení pužívá jíny balík/.test(response.error) === false
      ) {
        setterForAlertMesssage.errCreate.set(response.error);
      }

      if (
        response.error &&
        /Toto označení pužívá jíny balík/.test(response.error)
      ) {
        setterErrors.errLabel.set(response.error);
      }
      if (response.data) {
        setterForAlertMesssage.successCreate.set(JSON.stringify(response.data));
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
            errCreate: '',
            successCreate: '',
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
              successCreate: setterForAlertMesssage.successCreate.value,
              errCreate: setterForAlertMesssage.errCreate.value,
            }}
            operation="packageCreate"
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
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelCost}
            errorComp={setterErrors.errCost.get()}
            funcComp={(e) => settersForDataPack.Cost.set(e)}
            helpTexterComp="Zadejte cenu balíčku"
            placeholderComp="Kč"
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
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelWeigth}
            errorComp={setterErrors.errWeight.get()}
            funcComp={(e) => settersForDataPack.Weight.set(e)}
            helpTexterComp="Zadejte hmotnost balíku"
            placeholderComp="Cm"
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelLength}
            errorComp={setterErrors.errpLength.get()}
            funcComp={(e) => settersForDataPack.Plength.set(e)}
            helpTexterComp="Zadejte délku balíku"
            placeholderComp="Cm"
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelHeight}
            errorComp={setterErrors.errHeight.get()}
            funcComp={(e) => settersForDataPack.Height.set(e)}
            helpTexterComp="Zadejte výšku balíku"
            placeholderComp="Cm"
          />
        </CustomFieldset>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
          }}
        >
          <CreateButton type="submit">Vytvořit</CreateButton>
          <BackButtn onClick={() => Back(id)}>Zpět</BackButtn>
        </div>
      </form>
    </Typography>
  );
};
