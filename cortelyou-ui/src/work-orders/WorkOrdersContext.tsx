import React, { createContext, useContext, useMemo, useReducer } from 'react';
import type { WorkOrder, TimeEntry, WorkOrderUpdate, WorkOrderStatus } from './types';
import {
  type WorkOrdersState,
  initialWorkOrdersState,
  updateWorkOrderStatus as svcUpdateStatus,
  updateWorkOrderQuantities as svcUpdateQuantities,
  addTimeEntry as svcAddTimeEntry,
  endTimeEntry as svcEndTimeEntry,
  generateWorkOrderFromPlanning as svcGenerateWorkOrder,
} from './workOrdersService';

// Context shape
interface WorkOrdersContextShape extends WorkOrdersState {
  updateWorkOrderStatus: (workOrderId: string, status: WorkOrderStatus, notes?: string) => void;
  updateWorkOrderQuantities: (workOrderId: string, quantities: { actualQty?: number; wasteQty?: number; freezeQty?: number }) => void;
  addTimeEntry: (entry: Omit<TimeEntry, 'id'>) => void;
  endTimeEntry: (timeEntryId: string) => void;
  generateWorkOrderFromPlanning: (planningSlot: {
    id: number;
    sku: string;
    line: string;
    timeSlot: string;
    pansFromOrders: number;
    pansStandard: number;
  }) => void;
  getWorkOrderByPlanningId: (planningId: string) => WorkOrder | undefined;
}

const WorkOrdersContext = createContext<WorkOrdersContextShape | null>(null);

type Action =
  | { type: 'UPDATE_STATUS'; payload: { workOrderId: string; status: WorkOrderStatus; notes?: string } }
  | { type: 'UPDATE_QUANTITIES'; payload: { workOrderId: string; quantities: { actualQty?: number; wasteQty?: number; freezeQty?: number } } }
  | { type: 'ADD_TIME_ENTRY'; payload: Omit<TimeEntry, 'id'> }
  | { type: 'END_TIME_ENTRY'; payload: { timeEntryId: string } }
  | { type: 'GENERATE_FROM_PLANNING'; payload: { id: number; sku: string; line: string; timeSlot: string; pansFromOrders: number; pansStandard: number } };

function reducer(state: WorkOrdersState, action: Action): WorkOrdersState {
  switch (action.type) {
    case 'UPDATE_STATUS':
      return svcUpdateStatus(state, action.payload.workOrderId, action.payload.status, action.payload.notes);
    case 'UPDATE_QUANTITIES':
      return svcUpdateQuantities(state, action.payload.workOrderId, action.payload.quantities);
    case 'ADD_TIME_ENTRY':
      return svcAddTimeEntry(state, action.payload);
    case 'END_TIME_ENTRY':
      return svcEndTimeEntry(state, action.payload.timeEntryId);
    case 'GENERATE_FROM_PLANNING':
      return svcGenerateWorkOrder(state, action.payload);
    default:
      return state;
  }
}

export const WorkOrdersProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, undefined, initialWorkOrdersState);

  const api = useMemo<WorkOrdersContextShape>(() => ({
    workOrders: state.workOrders,
    timeEntries: state.timeEntries,
    updates: state.updates,
    updateWorkOrderStatus: (workOrderId, status, notes) => 
      dispatch({ type: 'UPDATE_STATUS', payload: { workOrderId, status, notes } }),
    updateWorkOrderQuantities: (workOrderId, quantities) => 
      dispatch({ type: 'UPDATE_QUANTITIES', payload: { workOrderId, quantities } }),
    addTimeEntry: (entry) => 
      dispatch({ type: 'ADD_TIME_ENTRY', payload: entry }),
    endTimeEntry: (timeEntryId) => 
      dispatch({ type: 'END_TIME_ENTRY', payload: { timeEntryId } }),
    generateWorkOrderFromPlanning: (planningSlot) => 
      dispatch({ type: 'GENERATE_FROM_PLANNING', payload: planningSlot }),
    getWorkOrderByPlanningId: (planningId) => 
      state.workOrders.find(wo => wo.productionPlanningId === planningId),
  }), [state]);

  return (
    <WorkOrdersContext.Provider value={api}>
      {children}
    </WorkOrdersContext.Provider>
  );
};

export function useWorkOrders(): WorkOrdersContextShape {
  const ctx = useContext(WorkOrdersContext);
  if (!ctx) throw new Error('useWorkOrders must be used within WorkOrdersProvider');
  return ctx;
}
