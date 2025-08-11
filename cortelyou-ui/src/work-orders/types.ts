export type WorkOrderStatus = 'pending' | 'active' | 'completed' | 'paused' | 'cancelled';

export type ProductionArea = 
  | 'mixing-room' 
  | 'mixing-prep' 
  | 'pre-bake-prep' 
  | 'rolls-bake-room' 
  | 'bake-room' 
  | 'pre-finishing' 
  | 'finishing' 
  | 'shipping-prep';

export type WorkOrder = {
  id: string;
  woNumber: string;
  sku: string;
  productionArea: ProductionArea;
  plannedQty: number;
  actualQty?: number;
  wasteQty?: number;
  freezeQty?: number;
  status: WorkOrderStatus;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  scheduledStart: string; // ISO datetime
  scheduledEnd: string;
  actualStart?: string;
  actualEnd?: string;
  assignedEmployees: string[];
  machineId?: string;
  recipe?: Recipe;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Recipe = {
  id: string;
  name: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  yieldQty: number;
  yieldUnit: string;
};

export type RecipeIngredient = {
  skuId: string;
  name: string;
  qty: number;
  unit: string;
  notes?: string;
};

export type TimeEntry = {
  id: string;
  workOrderId: string;
  employeeId: string;
  employeeName: string;
  startTime: string; // ISO datetime
  endTime?: string;
  breakMinutes?: number;
  notes?: string;
};

export type WorkOrderUpdate = {
  id: string;
  workOrderId: string;
  timestamp: string;
  type: 'status_change' | 'quantity_update' | 'employee_assigned' | 'note_added';
  details: string;
  updatedBy: string;
};
