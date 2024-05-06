import { useHookstate } from '@hookstate/core';
import { Button, styled, Typography } from '@mui/material';
import { DateValidationError, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import router from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';

import {
  SuppDataDocument,
  useNewSupplierToFirestoreMutation,
} from '@/generated/graphql';
import { Validation } from '@/utility/uthils';

import { CustomAlert } from '../alert-component';
import { useAuthContext } from '../auth-context-provider';
import { SelectComponent } from '../select-component';
import { MyCompTextField } from '../text-field';
import { DataCreatedSupp } from '../types/types';

const Back = async () => {
  await router.push(`/../admin-page`);
};

const CreateButton = styled(Button)({
  backgroundColor: 'green',
  color: 'white',
  width: '30%',
  alignSelf: 'center',
});

const BackButtn = styled(Button)({
  backgroundColor: '#5193DE',
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

const Response = (
  response:
    | {
        __typename?: 'Supp' | undefined;
        data: {
          __typename?: 'SupplierData' | undefined;
          sendCashDelivery: string;
          packInBox: string;
          suppName: string;
          pickUp: string;
          delivery: string;
          insurance: number;
          shippingLabel: string;
          foil: string;
        };
      }
    | {
        __typename?: 'SupplierError' | undefined;
        message: string;
      }
    | null
    | undefined,
) => {
  const responseFromQuery: {
    data: DataCreatedSupp | undefined;
    error: string | undefined;
  } = {
    data: undefined,
    error: undefined,
  };
  // eslint-disable-next-line no-underscore-dangle
  if (response?.__typename === 'Supp') {
    responseFromQuery.data = response.data ?? undefined;
  }
  // eslint-disable-next-line no-underscore-dangle
  if (response?.__typename === 'SupplierError') {
    responseFromQuery.error = response.message ?? undefined;
  }
  return responseFromQuery;
};

export const FormSupplier = () => {
  const { user } = useAuthContext();
  const options = [
    { value: 'Yes', label: 'Ano' },
    { value: 'No', label: 'Ne' },
  ];

  const settersOfDataSupp = useHookstate({
    SuppId: '',
    SupplierName: '',
    ActualSupplierName: '',
    Delivery: ' ',
    PickUp: '',
    Insurance: '',
    SendCashDelivery: '',
    PackInBox: '',
    ShippingLabel: '',
    Foil: '',
    DepoCost: '',
    PersonalCost: '',
  });

  const setterForAlertMesssage = useHookstate({
    errCreate: '',
    successCreate: '',
  });

  const setterDateErr = useHookstate({
    errPickUp: '',
    errDelivery: '',
  });

  const setterErrors = useHookstate({
    errInsurance: '',
    errSendCashDelivery: '',
    errFoil: '',
    errShippingLabel: '',
    errPackInBox: '',
    errDepoCost: '',
    errPersonalCost: '',
    errName: '',
  });

  const idComp = 'outlined-required';

  const labelPersonalCost = {
    err: 'Chyba',
    withoutErr: 'Cena za osobní vyzvednutí/dodání',
  };
  const labelDepoCost = {
    err: 'Chyba',
    withoutErr: 'Cena vyzvednutí/dodání na depo',
  };
  const labelInsurance = { err: 'Chyba', withoutErr: 'Pojištění' };
  const labelName = { err: 'Chyba', withoutErr: 'Jméno' };

  const userApp = useHookstate({ Admin: false, LoggedIn: false });
  const [newSupp] = useNewSupplierToFirestoreMutation();

  useEffect(() => {
    const adminId = process.env.NEXT_PUBLIC_ADMIN_ID;
    if (user) {
      userApp.LoggedIn.set(true);
    }
    if (user?.uid === adminId) {
      userApp.Admin.set(true);
    }
  }, [userApp]);

  const handleForm = async (event: React.FormEvent) => {
    event.preventDefault();
    const valid = Validation(
      'suppCreate',
      {
        suppData: {
          pickUp: setterDateErr.errPickUp.get(),
          delivery: setterDateErr.errDelivery.get(),
          insurance: settersOfDataSupp.Insurance.get(),
          sendCashDelivery: settersOfDataSupp.SendCashDelivery.get(),
          foil: settersOfDataSupp.Foil.get(),
          shippingLabel: settersOfDataSupp.ShippingLabel.get(),
          packInBox: settersOfDataSupp.PackInBox.get(),
          depoCost: settersOfDataSupp.DepoCost.get(),
          personalCost: settersOfDataSupp.PersonalCost.get(),
        },
      },
      setterErrors,
    )?.message;
    if (valid) {
      console.error(valid);
    } else {
      const result = await newSupp({
        variables: {
          SupName: settersOfDataSupp.SupplierName.get(),
          PickUp: settersOfDataSupp.PickUp.get(),
          Delivery: settersOfDataSupp.Delivery.get(),
          Insurance: Number(settersOfDataSupp.Insurance.get()),
          SendCashDelivery: settersOfDataSupp.SendCashDelivery.get(),
          Foil: settersOfDataSupp.Foil.get(),
          ShippingLabel: settersOfDataSupp.ShippingLabel.get(),
          PackInBox: settersOfDataSupp.PackInBox.get(),
          DepoCost: Number(settersOfDataSupp.DepoCost.get()),
          PersonalCost: Number(settersOfDataSupp.PersonalCost.get()),
        },
        refetchQueries: [{ query: SuppDataDocument }],
        awaitRefetchQueries: true,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }).catch((error: string) =>
        console.error('Chyba při vytváření zásilkové služby'),
      );

      const response = Response(result?.data?.SupplierToFirestore);

      if (
        response.error &&
        /Toto jméno používá jiná zásilková služba/.test(response.error) ===
          false
      ) {
        setterForAlertMesssage.errCreate.set(response.error);
      }

      if (
        response.error &&
        /Toto jméno používá jiná zásilková služba/.test(response.error)
      ) {
        setterErrors.errName.set(response.error);
      }

      if (response.data) {
        setterForAlertMesssage.successCreate.set(JSON.stringify(response.data));
      }
    }
  };

  if (!userApp.Admin.get() || !userApp.LoggedIn.get()) {
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
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
        onSubmit={handleForm}
        onChange={() => {
          setterForAlertMesssage.set({
            errCreate: '',
            successCreate: '',
          });
          setterErrors.set({
            errInsurance: '',
            errSendCashDelivery: '',
            errFoil: '',
            errShippingLabel: '',
            errPackInBox: '',
            errDepoCost: '',
            errPersonalCost: '',
            errName: '',
          });
        }}
      >
        <div style={{ alignSelf: 'center' }}>
          <CustomAlert
            messages={{
              successCreate: setterForAlertMesssage.successCreate.value,
              errCreate: setterForAlertMesssage.errCreate.value,
            }}
            operation="supplierCreate"
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
            Informace o zásilkové služby
          </legend>

          <MyCompTextField
            typeComp="text"
            idComp={idComp}
            labelComp={labelName}
            errorComp={setterErrors.errName.get()}
            funcComp={(e) => settersOfDataSupp.SupplierName.set(e)}
            helpTexterComp={'Zadejte jméno zásilkové služby'}
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelInsurance}
            errorComp={setterErrors.errInsurance.get()}
            funcComp={(e) => settersOfDataSupp.Insurance.set(e)}
            helpTexterComp={'Zadejte pojištění na balík'}
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
            Datum
          </legend>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Dodání"
              disablePast
              minDate={dayjs()}
              onError={(e: DateValidationError) =>
                setterDateErr.errDelivery.set(e || '')
              }
              onChange={(e: dayjs.Dayjs | null) =>
                settersOfDataSupp.Delivery.set(
                  e ? e.toDate().toDateString() : '',
                )
              }
              slotProps={{
                textField: {
                  helperText:
                    'Zadejte minimálně aktuální datum dodaní ve formátu (MM/DD/YYYY)',
                },
              }}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Vyzvednutí"
              disablePast
              minDate={dayjs()}
              onError={(e: DateValidationError) =>
                setterDateErr.errPickUp.set(e || '')
              }
              onChange={(e: dayjs.Dayjs | null) =>
                settersOfDataSupp.PickUp.set(e ? e.toDate().toDateString() : '')
              }
              slotProps={{
                textField: {
                  helperText:
                    'Zadejte minimálně aktuální datum vyzvednutí ve formátu (MM/DD/YYYY)',
                },
              }}
            />
          </LocalizationProvider>
        </CustomFieldset>

        <CustomFieldset>
          <legend
            style={{
              textAlign: 'center',
              fontSize: '30px',
              fontWeight: 'bold',
            }}
          >
            Detaily
          </legend>

          <SelectComponent
            options={options}
            paragraph={'Na dobírku'}
            state={settersOfDataSupp.SendCashDelivery}
            error={setterErrors.errSendCashDelivery.get()}
          />
          <SelectComponent
            options={options}
            paragraph={'Štítek přiveze kurýr'}
            state={settersOfDataSupp.ShippingLabel}
            error={setterErrors.errShippingLabel.get()}
          />
          <SelectComponent
            options={options}
            paragraph={'Zabalení do fólie (nepovinné)'}
            state={settersOfDataSupp.Foil}
            error={setterErrors.errFoil.get()}
          />

          <SelectComponent
            options={options}
            paragraph={'Zabalení do krabice'}
            state={settersOfDataSupp.PackInBox}
            error={setterErrors.errPackInBox.get()}
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
            Ceny způsobu dopravy
          </legend>
          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelDepoCost}
            errorComp={setterErrors.errDepoCost.get()}
            funcComp={(e) => settersOfDataSupp.DepoCost.set(e)}
            helpTexterComp={'Cena vyzvednutí/dodání do depa'}
            placeholderComp="Kč"
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelPersonalCost}
            errorComp={setterErrors.errPersonalCost.get()}
            funcComp={(e) => settersOfDataSupp.PersonalCost.set(e)}
            helpTexterComp={'Cena za osobní vyzvednutí/dodání'}
            placeholderComp="Kč"
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
          <BackButtn onClick={() => Back()}>Zpět</BackButtn>
        </div>
      </form>
    </Typography>
  );
};
