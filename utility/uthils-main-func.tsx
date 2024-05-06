import _ from 'lodash';

import {
  CostSup,
  DataForMaxPackValidation,
  MaxPackValidation,
  Package,
  PackageData,
  PackageType,
  SupplierInformation,
  SuppWithLocation,
} from '@/copmonents/types/types';

const CostOfPack = (costSup: Array<CostSup>, pack: PackageData) => {
  let sumCost = 0;
  for (const e of costSup) {
    if (pack.supplier_id === e.idS) {
      const sCost = e.cost + pack.cost;
      sumCost = sCost;
    }
  }
  return sumCost;
};

const MaxPack = (item: PackageType, item2: PackageType) => {
  const bettterPack: PackageType = {
    supplierId: '',
    Cost: 0,
    Name: '',
    param: {
      width: 0,
      length: 0,
      weight: 0,
      height: 0,
    },
  };

  // itm - itm
  if (item.param.width > item2.param.width) {
    bettterPack.param.width = item.param.width;
  }

  if (item.param.weight > item2.param.weight) {
    bettterPack.param.weight = item.param.weight;
  }

  if (item.param.length > item2.param.length) {
    bettterPack.param.length = item.param.length;
  }

  if (item.param.height > item2.param.height) {
    bettterPack.param.height = item.param.height;
  }

  // prev - prev
  if (item2.param.width > item.param.width) {
    bettterPack.param.width = item2.param.width;
  }

  if (item2.param.weight > item.param.weight) {
    bettterPack.param.weight = item2.param.weight;
  }

  if (item2.param.length > item.param.length) {
    bettterPack.param.length = item2.param.length;
  }

  if (item2.param.height > item.param.height) {
    bettterPack.param.height = item2.param.height;
  }
  return bettterPack;
};

const FindParams = (data: DataForMaxPackValidation) => {
  const packagesDictionary: Record<string, PackageType> = {};
  let maxPackage: PackageType = {
    supplierId: '',
    Cost: 0,
    Name: '',
    param: {
      width: 0,
      length: 0,
      weight: 0,
      height: 0,
    },
  };

  data.forEach(([, item]) => {
    item.forEach((itm) => {
      if (itm && itm.param) {
        const prev = packagesDictionary[itm.supplierId] ?? undefined;

        if (prev) {
          maxPackage = MaxPack(itm, prev);
        } else {
          packagesDictionary[itm.supplierId] = {
            supplierId: itm.supplierId,
            Cost: itm.Cost,
            Name: itm.Name,
            param: {
              width: itm.param.width,
              weight: itm.param.weight,
              height: itm.param.height,
              length: itm.param.length,
            },
          };
        }
      }
    });
  });
  return maxPackage;
};

const MaxPackage = (
  data: DataForMaxPackValidation,
  dataFromForm: {
    width: number;
    weight: number;
    pLength: number;
    height: number;
  },
) => {
  const minMaxParams: MaxPackValidation = {
    max: {
      params: {
        width: 0,
        length: 0,
        weight: 0,
        height: 0,
      },
      message: undefined,
    },
  };
  const pack = FindParams(data);
  if (
    dataFromForm.height > pack.param.height ||
    dataFromForm.pLength > pack.param.length ||
    dataFromForm.weight > pack.param.weight ||
    dataFromForm.width > pack.param.width
  ) {
    minMaxParams.max.params = pack.param;
    minMaxParams.max.message = 'Jeden z parametrů je moc velký. ';
  }

  return minMaxParams.max;
};

const IsItSuppWithLoc = (loc: Array<SuppWithLocation>, sId: string) => {
  return loc.find((itm) => {
    return itm.suppId === sId;
  });
};

const MakeCost = (
  suppWithLocationFiled: Array<SuppWithLocation>,
  data: { where: string; fromWhere: string },
  packData: Array<PackageData>,
) => {
  // vedet cenu
  const costSupp = suppWithLocationFiled.map((i) => {
    // dd
    const depo = i.loc.depoDelivery;
    const personal = i.loc.personalDelivery;
    if (depo.delivery === data.where && depo.delivery === data.fromWhere) {
      return {
        idS: i.suppId,
        cost: 2 * depo.cost,
      };
    }
    // pd
    if (personal.delivery === data.where && depo.delivery === data.fromWhere) {
      return {
        idS: i.suppId,
        cost: personal.cost + depo.cost,
      };
    }
    // dp
    if (depo.delivery === data.where && personal.delivery === data.fromWhere) {
      return {
        idS: i.suppId,
        cost: depo.cost + personal.cost,
      };
    }
    // pp
    return {
      idS: i.suppId,
      cost: 2 * personal.cost,
    };
  });

  // prilepim cenu
  return packData.map((item: PackageData) => {
    const cost = CostOfPack(costSupp, item);
    if (IsItSuppWithLoc(suppWithLocationFiled, item.supplier_id)) {
      return {
        supplierId: item.supplier_id,
        Cost: cost,
        Name: item.name_package,
        param: {
          width: item.width,
          length: item.Plength,
          weight: item.weight,
          height: item.height,
        },
      };
    }
    return {
      supplierId: item.supplier_id,
      Cost: item.cost,
      Name: item.name_package,
      param: {
        width: item.width,
        length: item.Plength,
        weight: item.weight,
        height: item.height,
      },
    };
  });
};

export const LookWhichIsBetter = (item: PackageType, item2: PackageType) => {
  let bettterPack: PackageType = {
    supplierId: '',
    Cost: 0,
    Name: '',
    param: {
      width: 0,
      length: 0,
      weight: 0,
      height: 0,
    },
  };

  if (
    item.param.width > item2.param.width ||
    item.param.weight > item2.param.weight ||
    item.param.length > item2.param.length ||
    item.param.height > item2.param.height
  ) {
    bettterPack = item2;
  }

  if (
    item.param.width < item2.param.width ||
    item.param.weight < item2.param.weight ||
    item.param.length < item2.param.length ||
    item.param.height < item2.param.height
  ) {
    bettterPack = item;
  }

  return bettterPack;
};

export const ServeData = (
  suppDoc: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
  data: { where: string; fromWhere: string },
  Pcost: number,
  dataFromForm: {
    width: number;
    weight: number;
    pLength: number;
    height: number;
  },
) => {
  const serveData: { msg: object | undefined; data: DataForMaxPackValidation } =
    {
      msg: undefined,
      data: [],
    };
  const packData: Array<PackageData> = [];
  const suppWithLocationFiled: Array<SuppWithLocation> = [];
  suppDoc.forEach((item) => {
    const suppItem = item.data() as SupplierInformation;
    if (suppItem && suppItem.package) {
      suppItem.package.forEach((packItem: Package) => {
        const [packageDetails] = Object.values(packItem);
        packData.push(packageDetails);
      });
    }
    if (suppItem && suppItem?.location) {
      suppWithLocationFiled.push({
        suppId: suppItem.supplierId,
        loc: suppItem.location,
      });
    }
  });

  const suitableByCost = MakeCost(suppWithLocationFiled, data, packData).map(
    (item) => {
      if (Pcost >= Number(item.Cost)) {
        return item;
      }
      return undefined;
    },
  );

  const cleared = suitableByCost.filter((itm) => itm !== undefined);

  if (cleared.length === 0) {
    serveData.msg = {
      __typename: 'ErrorMessage',
      message: `Zadaná cena je příliš nízká`,
    };
    return serveData;
  }

  const groupedById = _.groupBy(cleared, 'supplierId');

  const maxPack = MaxPackage(Object.entries(groupedById), dataFromForm);

  if (maxPack.message) {
    serveData.msg = {
      __typename: 'ErrorMessage',
      message: `Jeden ze zadaných parametrů je moc velký. Balík s maximálními parametry (výška ${maxPack.params.height} cm, šířka ${maxPack.params.width} cm, délka ${maxPack.params.length} cm, hmotnost ${maxPack.params.weight} kg)`,
    };
    return serveData;
  }
  serveData.data = Object.entries(groupedById);

  return serveData;
};

export const ResultSuitable = (
  packageDic: Record<string, PackageType>,
  constant: string,
) => {
  const rtrnItem: Array<{ suppId: string; cost: number; name: string }> = [];
  Object.entries(packageDic).forEach(([, item]) => {
    rtrnItem.push({
      suppId: item.supplierId,
      cost: item.Cost,
      name: item.Name,
    });
  });

  if (rtrnItem.length > 0) {
    return {
      __typename: 'Suitable',
      suitable: JSON.stringify(rtrnItem),
    };
  }
  return {
    __typename: 'ErrorMessage',
    message: `Žádná vhodná ${constant.toLowerCase()} s vhodným balíkem`,
  };
};
