import { State, useHookstate } from '@hookstate/core';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Alert, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import React, { useState } from 'react';

import {
  DataFromForm,
  DataS,
  ErrSettersPropertiesFromData,
  SetterDataProperties,
  SuitableSuppType,
  SupplierInfo,
} from '@/copmonents/types/types';
import {
  useMutSuitableSuppMutation,
  useSuppDataQuery,
} from '@/generated/graphql';

import { useAuthContext } from '../copmonents/auth-context-provider';
import { ResSuppCard } from '../copmonents/Cards/res-supp';
import { FormChooseSup } from '../copmonents/form-choose-supp';
import { Navbar } from '../copmonents/navbar';
import styles from '../styles/Home.module.css';

const Submit = styled(Button)({
  color: 'white',
  backgroundColor: '#5CA6EB',
  width: '20%',
  alignSelf: 'center',
});

const DropDownBtn = styled(Button)({
  color: 'white',
  backgroundColor: '#5CA6EB',
});

const SetAndReturnDataForm = (stateSetter: State<SetterDataProperties>) => {
  const dataForm: DataFromForm = {
    width: '',
    height: '',
    weight: '',
    plength: '',
    placeFrom: '',
    placeTo: '',
  };
  dataForm.width = stateSetter.Width.get();
  dataForm.height = stateSetter.Height.get();
  dataForm.weight = stateSetter.Weight.get();
  dataForm.plength = stateSetter.Plength.get();
  dataForm.placeFrom = stateSetter.PlaceFrom.get();
  dataForm.placeTo = stateSetter.PlaceTo.get();
  return dataForm;
};

const parseIntReliable = (numArg: string) => {
  if (numArg.length > 0) {
    const parsed = Number.parseInt(numArg, 10);
    if (parsed === 0) {
      // eslint-disable-next-line max-depth
      if (numArg.replaceAll('0', '') === '') {
        return 0;
      }
    } else if (Number.isSafeInteger(parsed)) {
      return parsed;
    }
  }
  return false;
};

const isInt = (numArg: string, min: number) => {
  const parsed = parseIntReliable(numArg);

  return parsed !== false && parsed > min;
};

const Res = (dataSui: Array<DataS>, allSupp: SupplierInfo) => {
  const SuitableSupps: Array<SuitableSuppType> = [];
  dataSui.forEach((itm) => {
    SuitableSupps.push({
      dataS: allSupp.data?.suplierData.find((item) => {
        return item.supplierId === itm.suppId;
      }),
      cost: itm.cost,
      packName: itm.name,
    });
  });

  return SuitableSupps ?? [];
};

const RenderSupp = (
  dataFromResolver: Array<DataS>,
  QueryData: SupplierInfo,
  dataFromForm: DataFromForm,
) => {
  const res = Res(dataFromResolver, QueryData);
  if (!QueryData.error && QueryData.data && res) {
    return res.map((itm) =>
      itm.dataS ? (
        <div key={itm.dataS.supplierId}>
          <ResSuppCard
            packName={itm.packName}
            price={itm.cost}
            delivery={itm.dataS.delivery}
            folie={itm.dataS.foil}
            insurance={itm.dataS.insurance}
            packInBox={itm.dataS.packInBox}
            pickUp={itm.dataS.pickUp}
            sendCash={itm.dataS.sendCashDelivery}
            shippingLabel={itm.dataS.shippingLabel}
            name={itm.dataS.suppName}
            sId={itm.dataS.supplierId}
            dataFrPage={dataFromForm}
          />
        </div>
      ) : (
        <div key={''}></div>
      ),
    );
  }
  return <div></div>;
};

const Valid = (
  weightarg: string,
  costarg: string,
  pLengtharg: string,
  heightarg: string,
  widtharg: string,
  placeToarg: string,
  placeFromarg: string,
  errorsSetters: State<ErrSettersPropertiesFromData>,
) => {
  const messageForInt = 'Očekává se číslo větší nebo rovné nule';
  const messageLoc = 'Očekává se hodnota (depo/personal)';

  if (!isInt(weightarg, 0)) {
    errorsSetters.errWeight.set(messageForInt);
    return new Error(messageForInt);
  }

  if (!isInt(costarg, 0)) {
    errorsSetters.errCost.set(messageForInt);
    return new Error(messageForInt);
  }

  if (!isInt(pLengtharg, 0)) {
    errorsSetters.errLength.set(messageForInt);
    return new Error(messageForInt);
  }

  if (!isInt(heightarg, 0)) {
    errorsSetters.errHeight.set(messageForInt);
    return new Error(messageForInt);
  }

  if (!isInt(widtharg, 0)) {
    errorsSetters.errWidth.set(messageForInt);
    return new Error(messageForInt);
  }

  if (!['depo', 'personal'].includes(placeToarg)) {
    errorsSetters.errPlaceTo.set(messageLoc);
    return new Error(messageLoc);
  }

  if (!['depo', 'personal'].includes(placeFromarg)) {
    errorsSetters.errFrom.set(messageLoc);
    return new Error(messageLoc);
  }

  errorsSetters.set({
    errCost: '',
    errFrom: '',
    errHeight: '',
    errLength: '',
    errPlaceTo: '',
    errWeight: '',
    errWidth: '',
  });
  return undefined;
};

const DisplayResult = (
  close: boolean,
  dataFromResolver: Array<DataS>,
  QueryData: SupplierInfo,
  setters: State<SetterDataProperties>,
) => {
  return close ? (
    <div></div>
  ) : QueryData.loading ? (
    <div>Načítá se...</div>
  ) : (
    RenderSupp(
      dataFromResolver,
      {
        data: QueryData.data,
        loading: QueryData.loading,
        error: QueryData.error,
      },
      SetAndReturnDataForm(setters),
    )
  );
};

const onChangeForm = (
  setters: State<ErrSettersPropertiesFromData>,
  stateAlert: React.Dispatch<React.SetStateAction<JSX.Element>>,
) => {
  setters.set({
    errWidth: '',
    errHeight: '',
    errWeight: '',
    errLength: '',
    errCost: '',
    errPlaceTo: '',
    errFrom: '',
  });
  stateAlert(<div></div>);
};

const MyInfoAlert = (message: string) => {
  return <Alert severity="info">{message}</Alert>;
};

const Response = (
  response:
    | {
        __typename?: 'ErrorMessage' | undefined;
        message: string;
      }
    | {
        __typename?: 'Suitable' | undefined;
        suitable: string;
      }
    | null
    | undefined,
) => {
  const responseFromQuery: {
    data: string | undefined;
    error: string | undefined;
  } = {
    data: undefined,
    error: undefined,
  };
  // eslint-disable-next-line no-underscore-dangle
  if (response?.__typename === 'Suitable') {
    responseFromQuery.data = response.suitable ?? undefined;
  }
  // eslint-disable-next-line no-underscore-dangle
  if (response?.__typename === 'ErrorMessage') {
    responseFromQuery.error = response.message ?? undefined;
  }
  return responseFromQuery;
};

// eslint-disable-next-line import/no-default-export
export default function SuitableSupp() {
  const { user } = useAuthContext();
  const statesOfFormPack = useHookstate({
    Width: '',
    Height: '',
    Weight: '',
    Plength: '',
    PlaceFrom: '',
    PlaceTo: '',
    Cost: '',
  });

  const errors = useHookstate({
    errWidth: '',
    errHeight: '',
    errWeight: '',
    errLength: '',
    errCost: '',
    errPlaceTo: '',
    errFrom: '',
  });

  const [close, SetClose] = useState(true);
  const [dataS, SetData] = useState(Array<DataS>);
  const [myAlert, SetAlert] = useState(<div></div>);

  const [suitableSupp] = useMutSuitableSuppMutation();
  const suppData = useSuppDataQuery();

  const HandleForm = async () => {
    const valid = Valid(
      statesOfFormPack.Weight.get(),
      statesOfFormPack.Cost.get(),
      statesOfFormPack.Plength.get(),
      statesOfFormPack.Height.get(),
      statesOfFormPack.Width.get(),
      statesOfFormPack.PlaceTo.get(),
      statesOfFormPack.PlaceFrom.get(),
      errors,
    )?.message;
    if (valid) {
      console.error(valid);
    } else {
      const result = await suitableSupp({
        variables: {
          Width: Number(statesOfFormPack.Width.get()),
          Weight: Number(statesOfFormPack.Weight.get()),
          Height: Number(statesOfFormPack.Height.get()),
          Length: Number(statesOfFormPack.Plength.get()),
          Where: statesOfFormPack.PlaceFrom.get(),
          FromWhere: statesOfFormPack.PlaceTo.get(),
          Cost: Number(statesOfFormPack.Cost.get()),
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }).catch((error: string) => console.error(error));

      const response = Response(result?.data?.BingoSupPac);
      if (response.data) {
        const data: Array<DataS> = JSON.parse(response.data);
        SetData(data);
      }

      if (response.error) {
        SetAlert(MyInfoAlert(response.error));
      }
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Vhodná zásilková služba</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar user={user} />
      <main className={styles.main}>
        <div style={{ margin: '20px' }}> {myAlert}</div>

        <FormChooseSup
          onChangeForm={() => onChangeForm(errors, SetAlert)}
          onChangeWidth={(e) => statesOfFormPack.Width.set(e)}
          onChangeHeight={(e) => statesOfFormPack.Height.set(e)}
          onChangeWeight={(e) => statesOfFormPack.Weight.set(e)}
          onChangeLength={(e) => statesOfFormPack.Plength.set(e)}
          onChangeCost={(e) => statesOfFormPack.Cost.set(e)}
          onChangeWhere={(e) => statesOfFormPack.PlaceTo.set(e)}
          onChangeFromWhere={(e) => statesOfFormPack.PlaceFrom.set(e)}
          buttonEl={<Submit onClick={HandleForm}>Odeslat</Submit>}
          errors={errors.get()}
        />

        <DropDownBtn onClick={() => SetClose((prev) => !prev)}>
          {close ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
        </DropDownBtn>
        <div>
          {DisplayResult(
            close,
            dataS,
            {
              data: suppData.data,
              loading: suppData.loading,
              error: suppData.error,
            },
            statesOfFormPack,
          )}
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
