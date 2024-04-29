import { SuppDataQuery } from '@/generated/graphql';

import { DetailSupps } from '../Cards/supp-cards';

type Item = SuppDataQuery | undefined;

type Props = {
  data: Item;
  styling: any;
};
export const SuppcardPageBody: React.FC<Props> = ({ data, styling }) => {
  if (data) {
    return (
      <div>
        {data?.suplierData.map((item) => (
          <DetailSupps
            key={item.supplierId}
            packInBox={item.packInBox}
            name={item.suppName}
            sendCash={item.sendCashDelivery}
            folie={item.foil}
            shippingLabel={item.shippingLabel}
            pickUp={item.pickUp}
            delivery={item.delivery}
            insurance={item.insurance}
            suppId={item.supplierId}
          />
        ))}
      </div>
    );
  }
  return <div style={styling}>Nenalezeny žádné zásilkové služby</div>;
};
