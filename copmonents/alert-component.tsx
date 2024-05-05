import { Alert } from '@mui/material';

import {
  CreatedPackage,
  DataCreatedSupp,
  DataUpdateSupp,
  PackageData,
} from './types/types';

type Props = {
  messages: {
    successUpade?: string;
    errUpdate?: string;
    msgHisotry?: string;
    successCreate?: string;
    errCreate?: string;
  };
  operation: string;
};

const PackageAlertCreate = (messages: {
  successCreate: string;
  errCreate: string;
}) => {
  let alert = <div></div>;
  if (messages.errCreate !== '') {
    alert = (
      <div>
        <Alert severity="error">{messages.errCreate}</Alert>
      </div>
    );
  }

  if (messages.successCreate !== '') {
    const data = JSON.parse(messages.successCreate) as CreatedPackage;

    alert = (
      <div>
        <Alert severity="success">
          <div>
            <h3>Balík s parametry</h3>
            <p style={{ margin: '5px' }}>
              <strong>Označení</strong>: {data.name_package}
            </p>
            <p style={{ margin: '5px' }}>
              <strong>Cena</strong>: {data.cost} Kč
            </p>
            <p style={{ margin: '5px' }}>
              <strong>Hmotnost</strong>: {data.weight}
            </p>
            <p style={{ margin: '5px' }}>
              <strong>Délka</strong>: {data.Plength}
            </p>
            <p style={{ margin: '5px' }}>
              <strong>Šířka</strong>: {data.width}
            </p>
            <p style={{ margin: '5px' }}>
              <strong>Výška</strong>: {data.height}
            </p>
          </div>
        </Alert>
      </div>
    );
  }

  return alert;
};

const PackageAlertUpdate = (messages: {
  successUpade: string;
  errUpdate: string;
  msgHisotry: string;
}) => {
  let alert = <div></div>;

  if (messages.errUpdate !== '') {
    alert = (
      <div>
        <Alert severity="error">{messages.errUpdate}</Alert>
      </div>
    );
  }

  if (messages.successUpade !== '') {
    const data = JSON.parse(messages.successUpade) as PackageData;
    alert = (
      <Alert severity="success">
        <div>
          <h3>Balík s parametry</h3>
          <p style={{ margin: '5px' }}>
            <strong>Označení</strong>: {data.name_package}
          </p>
          <p style={{ margin: '5px' }}>
            <strong>Cena</strong>: {data.cost} Kč
          </p>
          <p style={{ margin: '5px' }}>
            <strong>Hmotnost</strong>: {data.weight}
          </p>
          <p style={{ margin: '5px' }}>
            <strong>Délka</strong>: {data.Plength}
          </p>
          <p style={{ margin: '5px' }}>
            <strong>Šířka</strong>: {data.width}
          </p>
          <p style={{ margin: '5px' }}>
            <strong>Výška</strong>: {data.height}
          </p>
          {messages.msgHisotry ? (
            <p style={{ margin: '5px' }}>
              <strong>Status úpravy historie</strong>: {messages.msgHisotry}
            </p>
          ) : (
            <p></p>
          )}
        </div>
      </Alert>
    );
  }

  return alert;
};

const SuppAlertCreate = (messages: {
  successCreate: string;
  errCreate: string;
}) => {
  let alert = <div></div>;

  if (messages.errCreate !== '') {
    alert = (
      <div>
        <Alert severity="error">{messages.errCreate}</Alert>
      </div>
    );
  }

  if (messages.successCreate !== '') {
    const data = JSON.parse(messages.successCreate) as DataCreatedSupp;
    alert = (
      <div>
        <Alert severity="success">
          <div>
            <h3>Zásliková služba s parametry</h3>
            <p style={{ margin: '5px' }}>
              <strong>Dodání</strong>: {data.delivery}
            </p>
            <p style={{ margin: '5px' }}>
              <strong>Zabalení do fólie</strong>:{' '}
              {data.foil === 'Yes' ? 'Ano' : 'Ne'}
            </p>
            <p style={{ margin: '5px' }}>
              <strong>Pojištění</strong>:{' '}
              {data.insurance > 0 ? `${data.insurance} Kč` : 'bez pojištění'}
            </p>
            <p style={{ margin: '5px' }}>
              <strong> Zabalení do krabice</strong>:{' '}
              {data.packInBox === 'Yes' ? 'Ano' : 'Ne'}
            </p>
            <p style={{ margin: '5px' }}>
              <strong>Vyzvednutí</strong>:{' '}
              {data.pickUp === 'Yes' ? 'Ano' : 'Ne'}
            </p>
            <p style={{ margin: '5px' }}>
              <strong> Na dobírku</strong>:{' '}
              {data.sendCashDelivery === 'Yes' ? 'Ano' : 'Ne'}
            </p>
            <p style={{ margin: '5px' }}>
              <strong>Štítek přiveze kurýr</strong>:{' '}
              {data.shippingLabel === 'Yes' ? 'Ano' : 'Ne'}
            </p>
            <p style={{ margin: '5px' }}>
              <strong> Jméno</strong>: {data.suppName}
            </p>
          </div>
        </Alert>
      </div>
    );
  }

  return alert;
};

const SuppAlertUpdate = (messages: {
  successUpade: string;
  errUpdate: string;
  msgHisotry: string;
}) => {
  let alert = <div></div>;

  if (messages.errUpdate !== '') {
    alert = (
      <div>
        <Alert severity="error">{messages.errUpdate}</Alert>
      </div>
    );
  }

  if (messages.successUpade !== '') {
    const data = JSON.parse(messages.successUpade) as DataUpdateSupp;
    alert = (
      <div>
        <Alert severity="success">
          <div>
            <h3>Zásliková služba s parametry</h3>
            <p style={{ margin: '5px' }}>
              <strong>Dodání</strong>: {data.delivery}
            </p>
            <p style={{ margin: '5px' }}>
              <strong>Zabalení do fólie</strong>:{' '}
              {data.foil === 'Yes' ? 'Ano' : 'Ne'}
            </p>
            <p style={{ margin: '5px' }}>
              <strong>Pojištění</strong>:{' '}
              {data.insurance > 0 ? `${data.insurance} Kč` : 'bez pojištění'}
            </p>
            <p style={{ margin: '5px' }}>
              <strong> Zabalení do krabice</strong>:{' '}
              {data.packInBox === 'Yes' ? 'Ano' : 'Ne'}
            </p>
            <p style={{ margin: '5px' }}>
              <strong>Vyzvednutí</strong>: {data.pickUp}
            </p>
            <p style={{ margin: '5px' }}>
              <strong> Na dobírku</strong>:{' '}
              {data.sendCashDelivery === 'Yes' ? 'Ano' : 'Ne'}
            </p>
            <p style={{ margin: '5px' }}>
              <strong>Štítek přiveze kurýr</strong>:{' '}
              {data.shippingLabel === 'Yes' ? 'Ano' : 'Ne'}
            </p>
            <p style={{ margin: '5px' }}>
              <strong> Jméno</strong>: {data.suppName}
            </p>
            {messages.msgHisotry ? (
              <p style={{ margin: '5px' }}>
                <strong>Status úpravy historie</strong>: {messages.msgHisotry}
              </p>
            ) : (
              <p></p>
            )}
          </div>
        </Alert>
      </div>
    );
  }

  return alert;
};

export const CustomAlert: React.FC<Props> = ({ messages, operation }) => {
  let alert = <div></div>;
  switch (operation) {
    case 'packageCreate': {
      alert = PackageAlertCreate({
        successCreate: messages.successCreate ?? '',
        errCreate: messages.errCreate ?? '',
      });
      break;
    }
    case 'packageUpdate': {
      alert = PackageAlertUpdate({
        successUpade: messages.successUpade ?? '',
        errUpdate: messages.errUpdate ?? '',
        msgHisotry: messages.msgHisotry ?? '',
      });
      break;
    }
    case 'supplierCreate': {
      alert = SuppAlertCreate({
        successCreate: messages.successCreate ?? '',
        errCreate: messages.errCreate ?? '',
      });
      break;
    }
    case 'supplierUpdate': {
      alert = SuppAlertUpdate({
        successUpade: messages.successUpade ?? '',
        errUpdate: messages.errUpdate ?? '',
        msgHisotry: messages.msgHisotry ?? '',
      });
      break;
    }
    default: {
      return alert;
    }
  }
  return alert;
};
