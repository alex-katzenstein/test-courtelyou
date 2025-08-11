import React, { createContext, useContext, useMemo, useReducer } from 'react';
import type { Lot } from './types';
import {
  type InventoryState,
  initialInventoryState,
  receiveLot as svcReceiveLot,
  issueFromLots as svcIssueFromLots,
  transferLot as svcTransferLot,
  adjustLot as svcAdjustLot,
} from './inventoryLotsService';

// Context shape
interface InventoryLotsContextShape extends InventoryState {
  receiveLot: (input: Omit<Lot, 'id' | 'receivedTs'> & { receivedTs?: string }) => void;
  issueFromLots: (params: {
    skuId: string;
    qty: number;
    strategy?: 'FEFO' | 'manual';
    selections?: { lotId: string; qty: number }[];
    ref?: { poId?: string; woId?: string; soId?: string };
  }) => void;
  transferLot: (lotId: string, toLocationId: string, qty: number) => void;
  adjustLot: (lotId: string, delta: number, notes?: string) => void;
}

const InventoryLotsContext = createContext<InventoryLotsContextShape | null>(null);

type Action =
  | { type: 'RECEIVE'; payload: Omit<Lot, 'id' | 'receivedTs'> & { receivedTs?: string } }
  | { type: 'ISSUE'; payload: { skuId: string; qty: number; strategy?: 'FEFO' | 'manual'; selections?: { lotId: string; qty: number }[]; ref?: { poId?: string; woId?: string; soId?: string } } }
  | { type: 'TRANSFER'; payload: { lotId: string; toLocationId: string; qty: number } }
  | { type: 'ADJUST'; payload: { lotId: string; delta: number; notes?: string } };

function reducer(state: InventoryState, action: Action): InventoryState {
  switch (action.type) {
    case 'RECEIVE':
      return svcReceiveLot(state, action.payload);
    case 'ISSUE':
      return svcIssueFromLots(state, action.payload);
    case 'TRANSFER':
      return svcTransferLot(state, action.payload.lotId, action.payload.toLocationId, action.payload.qty);
    case 'ADJUST':
      return svcAdjustLot(state, action.payload.lotId, action.payload.delta, action.payload.notes);
    default:
      return state;
  }
}

export const InventoryLotsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, undefined, initialInventoryState);

  const api = useMemo<InventoryLotsContextShape>(() => ({
    lots: state.lots,
    txns: state.txns,
    receiveLot: (input) => dispatch({ type: 'RECEIVE', payload: input }),
    issueFromLots: (params) => dispatch({ type: 'ISSUE', payload: params }),
    transferLot: (lotId, toLocationId, qty) => dispatch({ type: 'TRANSFER', payload: { lotId, toLocationId, qty } }),
    adjustLot: (lotId, delta, notes) => dispatch({ type: 'ADJUST', payload: { lotId, delta, notes } }),
  }), [state]);

  return (
    <InventoryLotsContext.Provider value={api}>
      {children}
    </InventoryLotsContext.Provider>
  );
};

export function useInventoryLots(): InventoryLotsContextShape {
  const ctx = useContext(InventoryLotsContext);
  if (!ctx) throw new Error('useInventoryLots must be used within InventoryLotsProvider');
  return ctx;
}
