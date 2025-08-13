import type { WorkOrder, TimeEntry, WorkOrderUpdate, WorkOrderStatus } from './types';

// Simple ID generator for in-memory data
const uid = () => Math.random().toString(36).slice(2, 10);

export type WorkOrdersState = {
  workOrders: WorkOrder[];
  timeEntries: TimeEntry[];
  updates: WorkOrderUpdate[];
};

export const initialWorkOrdersState = (): WorkOrdersState => ({
  workOrders: [
    {
      id: 'wo-001',
      woNumber: 'WO-2025-0145',
      sku: 'Rugelach Chocolate',
      productionArea: 'mixing-room',
      plannedQty: 15,
      plannedPans: 15,
      actualQty: 12,
      wasteQty: 1,
      status: 'active',
      priority: 'normal',
      scheduledStart: '2025-08-11T06:00:00Z',
      scheduledEnd: '2025-08-11T10:00:00Z',
      actualStart: '2025-08-11T06:15:00Z',
      assignedEmployees: ['emp-001', 'emp-002'],
      machineId: 'mixer-01',
      productionPlanningId: 'pp-001',
      recipe: {
        id: 'recipe-001',
        name: 'Rugelach Chocolate Base',
        ingredients: [
          { skuId: 'flour-001', name: 'All Purpose Flour', qty: 2.5, unit: 'lbs' },
          { skuId: 'butter-001', name: 'Unsalted Butter', qty: 1.0, unit: 'lbs' },
          { skuId: 'chocolate-001', name: 'Dark Chocolate Chips', qty: 0.75, unit: 'lbs' },
          { skuId: 'sugar-001', name: 'Granulated Sugar', qty: 0.5, unit: 'lbs' }
        ],
        instructions: ['Mix dry ingredients', 'Cream butter and sugar', 'Combine and form dough'],
        yieldQty: 15,
        yieldUnit: 'pans'
      },
      notes: 'Customer requested extra chocolate',
      createdAt: '2025-08-10T20:00:00Z',
      updatedAt: '2025-08-11T06:15:00Z'
    },
    {
      id: 'wo-002',
      woNumber: 'WO-2025-0146',
      sku: 'Babka Cinnamon',
      productionArea: 'pre-bake-prep',
      plannedQty: 8,
      plannedPans: 8,
      status: 'pending',
      priority: 'normal',
      scheduledStart: '2025-08-11T10:00:00Z',
      scheduledEnd: '2025-08-11T14:00:00Z',
      assignedEmployees: ['emp-003'],
      productionPlanningId: 'pp-002',
      recipe: {
        id: 'recipe-002',
        name: 'Babka Cinnamon Prep',
        ingredients: [
          { skuId: 'flour-001', name: 'All Purpose Flour', qty: 3.0, unit: 'lbs' },
          { skuId: 'yeast-001', name: 'Active Dry Yeast', qty: 0.25, unit: 'lbs' },
          { skuId: 'cinnamon-001', name: 'Ground Cinnamon', qty: 0.1, unit: 'lbs' },
          { skuId: 'sugar-001', name: 'Granulated Sugar', qty: 0.75, unit: 'lbs' }
        ],
        instructions: ['Proof yeast', 'Mix dough', 'First rise', 'Shape and fill'],
        yieldQty: 8,
        yieldUnit: 'loaves'
      },
      createdAt: '2025-08-10T20:30:00Z',
      updatedAt: '2025-08-10T20:30:00Z'
    },
    {
      id: 'wo-003',
      woNumber: 'WO-2025-0147',
      sku: 'Challah Traditional',
      productionArea: 'bake-room',
      plannedQty: 20,
      plannedPans: 20,
      actualQty: 18,
      wasteQty: 2,
      status: 'completed',
      priority: 'high',
      scheduledStart: '2025-08-11T14:00:00Z',
      scheduledEnd: '2025-08-11T18:00:00Z',
      actualStart: '2025-08-11T14:10:00Z',
      actualEnd: '2025-08-11T17:45:00Z',
      assignedEmployees: ['emp-004', 'emp-005'],
      machineId: 'oven-02',
      productionPlanningId: 'pp-003',
      notes: 'Completed ahead of schedule',
      createdAt: '2025-08-10T21:00:00Z',
      updatedAt: '2025-08-11T17:45:00Z'
    },
    {
      id: 'wo-004',
      woNumber: 'WO-2025-0148',
      sku: 'Bagels Everything',
      productionArea: 'finishing',
      plannedQty: 12,
      plannedPans: 12,
      status: 'paused',
      priority: 'normal',
      scheduledStart: '2025-08-11T18:00:00Z',
      scheduledEnd: '2025-08-11T22:00:00Z',
      assignedEmployees: ['emp-006'],
      productionPlanningId: 'pp-004',
      notes: 'Waiting for topping delivery',
      createdAt: '2025-08-11T08:00:00Z',
      updatedAt: '2025-08-11T18:30:00Z'
    }
  ],
  timeEntries: [
    {
      id: 'time-001',
      workOrderId: 'wo-001',
      employeeId: 'emp-001',
      employeeName: 'John Smith',
      startTime: '2025-08-11T06:15:00Z',
      breakMinutes: 15
    },
    {
      id: 'time-002',
      workOrderId: 'wo-001',
      employeeId: 'emp-002',
      employeeName: 'Maria Garcia',
      startTime: '2025-08-11T06:15:00Z',
      breakMinutes: 10
    },
    {
      id: 'time-003',
      workOrderId: 'wo-003',
      employeeId: 'emp-004',
      employeeName: 'David Chen',
      startTime: '2025-08-11T14:10:00Z',
      endTime: '2025-08-11T17:45:00Z',
      breakMinutes: 20
    }
  ],
  updates: [
    {
      id: 'update-001',
      workOrderId: 'wo-001',
      timestamp: '2025-08-11T06:15:00Z',
      type: 'generated_from_planning',
      details: 'Work order generated from production planning slot for Rugelach Chocolate',
      updatedBy: 'Production Planning System'
    },
    {
      id: 'update-002',
      workOrderId: 'wo-001',
      timestamp: '2025-08-11T06:15:00Z',
      type: 'status_change',
      details: 'Work order started',
      updatedBy: 'John Smith'
    },
    {
      id: 'update-003',
      workOrderId: 'wo-003',
      timestamp: '2025-08-11T17:45:00Z',
      type: 'status_change',
      details: 'Work order completed - 18 units produced, 2 waste',
      updatedBy: 'David Chen'
    }
  ]
});

export function updateWorkOrderStatus(state: WorkOrdersState, workOrderId: string, status: WorkOrderStatus, notes?: string): WorkOrdersState {
  const now = new Date().toISOString();
  const workOrders = state.workOrders.map(wo => {
    if (wo.id === workOrderId) {
      const updated = { ...wo, status, updatedAt: now };
      if (status === 'active' && !wo.actualStart) {
        updated.actualStart = now;
      } else if (status === 'completed' && !wo.actualEnd) {
        updated.actualEnd = now;
      }
      if (notes) updated.notes = notes;
      return updated;
    }
    return wo;
  });

  const update: WorkOrderUpdate = {
    id: uid(),
    workOrderId,
    timestamp: now,
    type: 'status_change',
    details: `Status changed to ${status}${notes ? `: ${notes}` : ''}`,
    updatedBy: 'Current User'
  };

  return {
    ...state,
    workOrders,
    updates: [update, ...state.updates]
  };
}

export function updateWorkOrderQuantities(
  state: WorkOrdersState, 
  workOrderId: string, 
  quantities: { actualQty?: number; wasteQty?: number; freezeQty?: number }
): WorkOrdersState {
  const now = new Date().toISOString();
  const workOrders = state.workOrders.map(wo => 
    wo.id === workOrderId 
      ? { ...wo, ...quantities, updatedAt: now }
      : wo
  );

  const update: WorkOrderUpdate = {
    id: uid(),
    workOrderId,
    timestamp: now,
    type: 'quantity_update',
    details: `Quantities updated: ${Object.entries(quantities).map(([k, v]) => `${k}=${v}`).join(', ')}`,
    updatedBy: 'Current User'
  };

  return {
    ...state,
    workOrders,
    updates: [update, ...state.updates]
  };
}

export function addTimeEntry(state: WorkOrdersState, entry: Omit<TimeEntry, 'id'>): WorkOrdersState {
  const timeEntry: TimeEntry = { id: uid(), ...entry };
  return {
    ...state,
    timeEntries: [timeEntry, ...state.timeEntries]
  };
}

export function endTimeEntry(state: WorkOrdersState, timeEntryId: string): WorkOrdersState {
  const timeEntries = state.timeEntries.map(entry =>
    entry.id === timeEntryId
      ? { ...entry, endTime: new Date().toISOString() }
      : entry
  );
  return { ...state, timeEntries };
}

// Map production line names to production areas
function mapLineToProductionArea(line: string): string {
  const mapping: Record<string, string> = {
    'Mixing Room': 'mixing-room',
    'Pre-Bake Prep': 'pre-bake-prep', 
    'Rolls Bake Room': 'rolls-bake-room',
    'Bake Room': 'bake-room',
    'Finishing': 'finishing',
    'Shipping Prep': 'shipping-prep'
  };
  return mapping[line] || 'mixing-room';
}

export function generateWorkOrderFromPlanning(
  state: WorkOrdersState,
  planningSlot: {
    id: number;
    sku: string;
    line: string;
    timeSlot: string;
    pansFromOrders: number;
    pansStandard: number;
  }
): WorkOrdersState {
  const now = new Date().toISOString();
  const [startTime, endTime] = planningSlot.timeSlot.split('-');
  const today = new Date().toISOString().split('T')[0];
  
  const workOrder: WorkOrder = {
    id: uid(),
    woNumber: `WO-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
    sku: planningSlot.sku,
    productionArea: mapLineToProductionArea(planningSlot.line) as any,
    plannedQty: planningSlot.pansFromOrders + planningSlot.pansStandard,
    plannedPans: planningSlot.pansFromOrders + planningSlot.pansStandard,
    status: 'pending',
    priority: 'normal',
    scheduledStart: `${today}T${startTime}:00Z`,
    scheduledEnd: `${today}T${endTime}:00Z`,
    assignedEmployees: [],
    productionPlanningId: `pp-${planningSlot.id}`,
    notes: `Generated from production planning slot ${planningSlot.id}`,
    createdAt: now,
    updatedAt: now
  };

  const update: WorkOrderUpdate = {
    id: uid(),
    workOrderId: workOrder.id,
    timestamp: now,
    type: 'generated_from_planning',
    details: `Work order generated from production planning slot for ${planningSlot.sku}`,
    updatedBy: 'Production Planning System'
  };

  return {
    ...state,
    workOrders: [workOrder, ...state.workOrders],
    updates: [update, ...state.updates]
  };
}
