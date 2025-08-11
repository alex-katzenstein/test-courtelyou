export type Sku = {
  id: string;
  name: string;
  uom: string;
  type: 'ingredient' | 'finished';
};

export type Location = {
  id: string;
  name: string;
};

export type Lot = {
  id: string;
  skuId: string;
  lotCode: string;
  qtyOnHand: number;
  locationId: string;
  expiration?: string; // ISO date
  supplier?: string;
  receivedTs: string; // ISO datetime
};

export type LotTxnType = 'receive' | 'issue' | 'transfer' | 'adjust';

export type LotTxnRef = {
  poId?: string;
  woId?: string;
  soId?: string;
};

export type LotTxn = {
  id: string;
  lotId: string;
  ts: string; // ISO datetime
  qty: number; // positive for receive/adjust up, negative for issue/transfer/adjust down
  type: LotTxnType;
  ref?: LotTxnRef;
  notes?: string;
};
