import { useHookstate } from '@hookstate/core';
import Head from 'next/head';
import React, { useState } from 'react';

import {
  useMutSuitableSuppMutation,
  useSuppDataQuery,
} from '@/generated/graphql';

import styles from '../styles/Home.module.css';
import stylesF from '../styles/stylesForm/styleForms.module.css';
import { ResSuppCard } from './components/Cards/resSupp';
import { FormChooseSup } from './components/formChooseSupp';
import { Navbar } from './components/navbar2';

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

const Res = (dataSui: [], allSupp: any) => {
  const SuitableSupps: Array<any> = [];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  console.log('co tam je', SuitableSupps);
  console.log('co tam jeee2', dataSui);
  console.log('objecty', dataSui);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return
  dataSui.forEach((itm: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    SuitableSupps.push({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      dataS: allSupp.data?.suplierData.find((item: any) => {
        return item.supplierId === itm.suppId;
      }),
      cost: itm.cost,
      packName: itm.name,
    });
    console.log('sorted val', itm.suppId);
    console.log('supplier', allSupp.data?.suplierData);
  });
  console.log('ssuitabel', SuitableSupps);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return SuitableSupps ?? [];
};

// eslint-disable-next-line consistent-return
const RenderSupp = (
  dataFromResolver: any,
  QueryData: any,
  dataFromForm: object,
) => {
  // alert(JSON.stringify(Res(dataFromResover, QueryData)));
  console.log('resolver', dataFromResolver);
  // v ifu problemi
  console.log('uvidime', QueryData.loading, QueryData, QueryData.data);
  if (!QueryData.loading && !QueryData.error && QueryData.data) {
    // eslint-disable-next-line array-callback-return
    return Res(dataFromResolver, QueryData).map((itm: any) => (
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
    ));
  }
  return <div></div>;
};

const Valid = (
  weightarg: string,
  costarg: string,
  pLengtharg: string,
  heightarg: string,
  widtharg: string,
  // eslint-disable-next-line unicorn/consistent-function-scoping, consistent-return
) => {
  if (
    !isInt(weightarg, 0) ||
    !isInt(costarg, 0) ||
    !isInt(pLengtharg, 0) ||
    !isInt(heightarg, 0) ||
    !isInt(widtharg, 0)
  ) {
    return new Error('Invalid argument');
  }
};

export default function SuitableSupp() {
  const statesOfFormPack = useHookstate({
    Width: '',
    Height: '',
    Weight: '',
    Plength: '',
    PlaceFrom: '',
    PlaceTo: '',
    Cost: '',
  });

  // const setd = React.useCallback((nwValue) => console.log(nwValue), [2]);
  const [dataS, SetData] = useState([]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const [suitableSupp] = useMutSuitableSuppMutation();
  const suppData = useSuppDataQuery();

  const HandleForm = async () => {
    const valid = Valid(
      statesOfFormPack.Weight.get(),
      statesOfFormPack.Cost.get(),
      statesOfFormPack.Plength.get(),
      statesOfFormPack.Height.get(),
      statesOfFormPack.Width.get(),
    )?.message;
    if (valid) {
      alert(valid);
    } else {
      const result = await suitableSupp({
        variables: {
          Width: Number(statesOfFormPack.Width.get()),
          Weight: Number(statesOfFormPack.Weight.get()),
          Height: Number(statesOfFormPack.Height.get()),
          Length: Number(statesOfFormPack.Plength.get()),
          Mz: statesOfFormPack.PlaceFrom.get(),
          Mdo: statesOfFormPack.PlaceTo.get(),
          Cost: Number(statesOfFormPack.Cost.get()),
        },
      });

      console.log('datatataat');

      if (result.data?.BingoSupPac?.suitable) {
        const data = JSON.parse(result.data?.BingoSupPac?.suitable);
        console.log('datatataat', data);
        SetData(data);
      } else {
        // eslint-disable-next-line no-alert
        alert(result.data?.BingoSupPac?.message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className={styles.main}>
        <FormChooseSup
          onChangeSirka={(e) => statesOfFormPack.Width.set(e.toString())}
          onChangeVyska={(e) => statesOfFormPack.Height.set(e.toString())}
          onChangeHmotnost={(e) => statesOfFormPack.Weight.set(e.toString())}
          onChangeDelka={(e) => statesOfFormPack.Plength.set(e.toString())}
          onChangeCena={(e) => statesOfFormPack.Cost.set(e.toString())}
          onChangeDo={(e) => statesOfFormPack.PlaceTo.set(e.toString())}
          onChangeZ={(e) => statesOfFormPack.PlaceFrom.set(e.toString())}
          buttonEl={
            <button className={stylesF.crudbtn} onClick={HandleForm}>
              odeslat
            </button>
          }
        />
        {RenderSupp(dataS, suppData, {
          dataFrForm: {
            width: statesOfFormPack.Width.get(),
            height: statesOfFormPack.Height.get(),
            weight: statesOfFormPack.Weight.get(),
            plength: statesOfFormPack.Plength.get(),
            placeFrom: statesOfFormPack.PlaceFrom.get(),
            placeTo: statesOfFormPack.PlaceTo.get(),
            // packName: statesOfFormPack.PackName.get(),
          },
        })}
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
