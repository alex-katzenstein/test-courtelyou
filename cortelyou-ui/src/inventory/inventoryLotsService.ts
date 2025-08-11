import type { Lot, LotTxn, LotTxnRef } from './types';

// Simple ID generator for in-memory data
const uid = () => Math.random().toString(36).slice(2, 10);

export type InventoryState = {
  lots: Lot[];
  txns: LotTxn[];
};

export const initialInventoryState = (): InventoryState => ({
  lots: [],
  txns: [],
});

// FEFO sort helper (undefined expirations last)
const fefoSort = (a: Lot, b: Lot) => {
  if (!a.expiration && !b.expiration) return 0;
  if (!a.expiration) return 1;
  if (!b.expiration) return -1;
  return a.expiration.localeCompare(b.expiration);
};

export function receiveLot(state: InventoryState, input: Omit<Lot, 'id' | 'receivedTs'> & { receivedTs?: string }): InventoryState {
  const lot: Lot = {
    id: uid(),
    receivedTs: input.receivedTs ?? new Date().toISOString(),
    ...input,
  };
  const txn: LotTxn = {
    id: uid(),
    lotId: lot.id,
    ts: new Date().toISOString(),
    qty: Math.abs(lot.qtyOnHand),
    type: 'receive',
  };
  return {
    lots: [...state.lots, lot],
    txns: [txn, ...state.txns],
  };
}

export function adjustLot(state: InventoryState, lotId: string, delta: number, notes?: string): InventoryState {
  const lots = state.lots.map(l => (l.id === lotId ? { ...l, qtyOnHand: Math.max(0, l.qtyOnHand + delta) } : l));
  const txn: LotTxn = { id: uid(), lotId, ts: new Date().toISOString(), qty: delta, type: 'adjust', notes };
  return { lots, txns: [txn, ...state.txns] };
}

export function transferLot(state: InventoryState, lotId: string, toLocationId: string, qty: number): InventoryState {
  const src = state.lots.find(l => l.id === lotId);
  if (!src) return state;
  const amount = Math.min(qty, src.qtyOnHand);
  const updatedSrc = { ...src, qtyOnHand: src.qtyOnHand - amount };

  // If transferring entire qty, we can either move the lot or split. We'll split to preserve history.
  const newLot: Lot = {
    ...src,
    id: uid(),
    locationId: toLocationId,
    qtyOnHand: amount,
    receivedTs: src.receivedTs,
  };

  const lots = state.lots
    .map(l => (l.id === lotId ? updatedSrc : l))
    .concat(amount > 0 ? [newLot] : []);

  const txnOut: LotTxn = { id: uid(), lotId, ts: new Date().toISOString(), qty: -amount, type: 'transfer' };
  const txnIn: LotTxn = { id: uid(), lotId: newLot.id, ts: new Date().toISOString(), qty: amount, type: 'transfer' };

  return { lots, txns: [txnIn, txnOut, ...state.txns] };
}

export function issueFromLots(
  state: InventoryState,
  params: { skuId: string; qty: number; strategy?: 'FEFO' | 'manual'; selections?: { lotId: string; qty: number }[]; ref?: LotTxnRef }
): InventoryState {
  const { skuId, qty, strategy = 'FEFO', selections, ref } = params;
  let remaining = qty;
  let lots = [...state.lots];
  const txns: LotTxn[] = [];

  const candidateLots = strategy === 'manual'
    ? lots.filter(l => selections?.some(s => s.lotId === l.id))
    : lots.filter(l => l.skuId === skuId && l.qtyOnHand > 0).sort(fefoSort);

  for (const lot of candidateLots) {
    if (remaining <= 0) break;
    const take = strategy === 'manual'
      ? Math.min(remaining, Math.max(0, selections?.find(s => s.lotId === lot.id)?.qty ?? 0))
      : Math.min(remaining, lot.qtyOnHand);
    if (take <= 0) continue;

    lots = lots.map(l => (l.id === lot.id ? { ...l, qtyOnHand: l.qtyOnHand - take } : l));
    remaining -= take;

    txns.push({ id: uid(), lotId: lot.id, ts: new Date().toISOString(), qty: -take, type: 'issue', ref });
  }

  // No negative issuance — if remaining > 0, partial issue applied.
  return { lots, txns: [...txns, ...state.txns] };
}
