import { State, useHookstate } from '@hookstate/core';
import { Button, styled, Typography } from '@mui/material';
import {
  DatePicker,
  DateValidationError,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import router from 'next/router';
import * as React from 'react';
import { useEffect } from 'react';

import {
  HistoryDataDocument,
  SuppDataDocument,
  useSuppDataQuery,
  useUpdateHistoryMutation,
  useUpdateSupplierMutation,
} from '@/generated/graphql';
import { Validation } from '@/utility/uthils';

import { CustomAlert } from '../alert-component';
import { useAuthContext } from '../auth-context-provider';
import { SelectComponent } from '../select-component';
import { MyCompTextField } from '../text-field';
import {
  DataFromDB,
  DataUpdateSupp,
  ResponseSuppUpdate,
  Supplier,
} from '../types/types';

type Props = {
  id: string;
};
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

const BackButtn = styled(Button)({
  backgroundColor: '#5193DE',
  color: 'white',
  width: '30%',
});

const Back = async (ids: string) => {
  await router.push(`/../../admpage/${ids}`);
};

const setDataDatabase = (
  data: Supplier,
  stateSeter: State<DataFromDB>,
  setOldName: React.Dispatch<React.SetStateAction<string>>,
) => {
  if (data) {
    setOldName(data.suppName);
    stateSeter.set({
      SuppId: data.supplierId,
      SupplierName: data.suppName,
      Delivery: data.delivery,
      PickUp: data.pickUp,
      Insurance: data.insurance.toString(),
      SendCashDelivery: data.sendCashDelivery,
      PackInBox: data.packInBox,
      ShippingLabel: data.shippingLabel,
      Foil: data.foil,
      DepoCost: String(data.location?.depoDelivery.cost),
      PersonalCost: String(data.location?.personalDelivery.cost),
    });
  }
};

const Response = (response: ResponseSuppUpdate) => {
  const responseFromQuery: {
    data: DataUpdateSupp | undefined;
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

export const FormSupplierUpdate: React.FC<Props> = ({ id }) => {
  const options = [
    { value: 'Yes', label: 'Ano' },
    { value: 'No', label: 'Ne' },
  ];
  const { user } = useAuthContext();

  const settersOfDataSupp = useHookstate({
    SuppId: '',
    SupplierName: '',
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

  const setterForAlertMesssage = useHookstate({
    errUpdate: '',
    successUpdate: '',
    msgHistory: '',
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

  const supData = useSuppDataQuery();
  const [UpdateHistory] = useUpdateHistoryMutation();
  const [UpdateSupp] = useUpdateSupplierMutation();
  const [oldSuppName, SetOldSuppName] = React.useState('');

  useEffect(() => {
    const adminId = process.env.NEXT_PUBLIC_ADMIN_ID;
    if (user) {
      userApp.LoggedIn.set(true);
    }
    if (user?.uid === adminId) {
      userApp.Admin.set(true);
    }

    if (id && supData.data && supData) {
      const actualSupp = supData.data?.suplierData.find(
        (actSupp) => actSupp.supplierId === id,
      );

      if (actualSupp) {
        setDataDatabase(actualSupp, settersOfDataSupp, SetOldSuppName);
      }
    }
  }, [supData, userApp]);

  const handleForm = async (event: React.FormEvent) => {
    event.preventDefault();
    const valid = Validation(
      'suppUpdate',
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
      const result = await UpdateSupp({
        variables: {
          SupName: settersOfDataSupp.SupplierName.get(),
          Delivery: settersOfDataSupp.Delivery.get(),
          PickUp: settersOfDataSupp.PickUp.get(),
          ShippingLabel: settersOfDataSupp.ShippingLabel.get(),
          Foil: settersOfDataSupp.Foil.get(),
          Insurance: Number(settersOfDataSupp.Insurance.get()),
          SendCashDelivery: settersOfDataSupp.SendCashDelivery.get(),
          PackInBox: settersOfDataSupp.PackInBox.get(),
          SuppId: settersOfDataSupp.SuppId.get(),
          OldSupplierName: oldSuppName,
          DepoCost: Number(settersOfDataSupp.DepoCost.get()),
          PersonalCost: Number(settersOfDataSupp.PersonalCost.get()),
        },
        refetchQueries: [
          { query: SuppDataDocument },
          { query: HistoryDataDocument },
        ],
        awaitRefetchQueries: true,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }).catch((error: string) =>
        console.error('Chyba při úpravě zásilkové služby'),
      );

      const response = Response(result?.data?.updateSup);

      if (
        response.error &&
        /Toto jméno používá jiná zásilková služba/.test(response.error) ===
          false
      ) {
        setterForAlertMesssage.errUpdate.set(response.error);
      }

      if (
        response.error &&
        /Toto jméno používá jiná zásilková služba/.test(response.error)
      ) {
        setterErrors.errName.set(response.error);
      }
      let updateHistory;
      if (response.data && !response.error) {
        setterForAlertMesssage.successUpdate.set(JSON.stringify(response.data));
        updateHistory = await UpdateHistory({
          variables: {
            SuppData: {
              delivery: settersOfDataSupp.Delivery.get(),
              foil: settersOfDataSupp.Foil.get(),
              insurance: Number(settersOfDataSupp.Insurance.get()),
              packInBox: settersOfDataSupp.PackInBox.get(),
              pickUp: settersOfDataSupp.PickUp.get(),
              sendCashDelivery: settersOfDataSupp.SendCashDelivery.get(),
              shippingLabel: settersOfDataSupp.ShippingLabel.get(),
              suppName: settersOfDataSupp.SupplierName.get(),
            },
            NewPriceDepo: Number(settersOfDataSupp.DepoCost.get()),
            NewPricePersonal: Number(settersOfDataSupp.PersonalCost.get()),
            SuppId: settersOfDataSupp.SuppId.get(),
            OldNameSupp: oldSuppName,
          },
          refetchQueries: [
            { query: SuppDataDocument },
            { query: HistoryDataDocument },
          ],
          awaitRefetchQueries: true,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }).catch((error) => console.error('Chyba při úpravě historie'));
      }

      if (updateHistory?.data?.updateHistory?.message) {
        setterForAlertMesssage.msgHistory.set(
          updateHistory?.data?.updateHistory?.message,
        );
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
        onSubmit={handleForm}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
        onChange={() => {
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
          setterForAlertMesssage.set({
            errUpdate: '',
            successUpdate: '',
            msgHistory: '',
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
            operation="supplierUpdate"
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
            Informace o zásilkové službě
          </legend>
          <MyCompTextField
            typeComp="text"
            idComp={idComp}
            labelComp={labelName}
            errorComp={setterErrors.errName.get()}
            funcComp={(e) => settersOfDataSupp.SupplierName.set(e)}
            helpTexterComp={'Zadejte jméno'}
            valueComp={settersOfDataSupp.SupplierName.get()}
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelInsurance}
            errorComp={setterErrors.errInsurance.get()}
            funcComp={(e) => settersOfDataSupp.Insurance.set(e)}
            helpTexterComp={'Zadejte pojištění na balík'}
            placeholderComp="Kč"
            valueComp={settersOfDataSupp.Insurance.get()}
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
            Datumy
          </legend>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Dodání"
              disablePast
              minDate={dayjs()}
              onError={(e: DateValidationError) =>
                setterDateErr.errDelivery.set(e ? e.toString() : '')
              }
              onChange={(e: dayjs.Dayjs | null) =>
                settersOfDataSupp.Delivery.set(
                  e ? e.toDate().toDateString() : '',
                )
              }
              value={dayjs(settersOfDataSupp.Delivery.get())}
              slotProps={{
                textField: {
                  helperText: 'Zadejte datum dodání ve formatu (MM/DD/YYYY)',
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
                setterDateErr.errPickUp.set(e ? e.toString() : '')
              }
              onChange={(e: dayjs.Dayjs | null) =>
                settersOfDataSupp.PickUp.set(e ? e.toDate().toDateString() : '')
              }
              value={dayjs(settersOfDataSupp.PickUp.get())}
              slotProps={{
                textField: {
                  helperText:
                    'Zadejte datum vyzvednutí ve formatu (MM/DD/YYYY)',
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
            valueComp={settersOfDataSupp.DepoCost.get()}
          />

          <MyCompTextField
            typeComp="number"
            idComp={idComp}
            labelComp={labelPersonalCost}
            errorComp={setterErrors.errPersonalCost.get()}
            funcComp={(e) => settersOfDataSupp.PersonalCost.set(e)}
            helpTexterComp={'Cena za osobní vyzvednutí/dodání'}
            placeholderComp="Kč"
            valueComp={settersOfDataSupp.PersonalCost.get()}
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
          <BackButtn onClick={() => Back(id)}>Zpět</BackButtn>
        </div>
      </form>
    </Typography>
  );
};
