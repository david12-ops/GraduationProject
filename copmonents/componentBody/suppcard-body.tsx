import { DetailSupps } from '../Cards/supp-cards';
import { SuppData } from '../types/types';

type Props = {
  data: SuppData;
  styling: any;
};

export const SuppcardPageBody: React.FC<Props> = ({ data, styling }) => {
  return data ? (
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
  ) : (
    <div style={styling}>Nenalezeny žádné zásilkové služby</div>
  );
};
