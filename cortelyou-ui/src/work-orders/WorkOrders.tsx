import React, { useMemo, useState } from 'react';
import { Search, Filter, Clock, Users, Play, Pause, CheckCircle, AlertTriangle, Plus, MoreHorizontal } from 'lucide-react';
import { useWorkOrders } from './WorkOrdersContext';
import type { WorkOrder, ProductionArea, WorkOrderStatus } from './types';

function formatTime(dateStr?: string) {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return dateStr;
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleDateString();
  } catch {
    return dateStr;
  }
}

function getStatusColor(status: WorkOrderStatus) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'paused':
      return 'bg-orange-100 text-orange-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'normal':
      return 'bg-green-100 text-green-800';
    case 'low':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getAreaDisplayName(area: ProductionArea) {
  const names: Record<ProductionArea, string> = {
    'mixing-room': 'Mixing Room',
    'mixing-prep': 'Mixing Prep',
    'pre-bake-prep': 'Pre-Bake Prep',
    'rolls-bake-room': 'Rolls Bake Room',
    'bake-room': 'Bake Room',
    'pre-finishing': 'Pre-Finishing',
    'finishing': 'Finishing',
    'shipping-prep': 'Shipping Prep'
  };
  return names[area] || area;
}

export default function WorkOrders() {
  const { workOrders, timeEntries, updateWorkOrderStatus, updateWorkOrderQuantities } = useWorkOrders();
  
  const [search, setSearch] = useState('');
  const [filterArea, setFilterArea] = useState<ProductionArea | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<WorkOrderStatus | 'all'>('all');
  const [showUpdateModal, setShowUpdateModal] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = workOrders;
    
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      result = result.filter(wo => 
        wo.woNumber.toLowerCase().includes(s) ||
        wo.sku.toLowerCase().includes(s) ||
        wo.assignedEmployees.some(emp => emp.toLowerCase().includes(s))
      );
    }
    
    if (filterArea !== 'all') {
      result = result.filter(wo => wo.productionArea === filterArea);
    }
    
    if (filterStatus !== 'all') {
      result = result.filter(wo => wo.status === filterStatus);
    }
    
    return result.sort((a, b) => {
      // Sort by priority (urgent first), then by scheduled start
      const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 2;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 2;
      
      if (aPriority !== bPriority) return aPriority - bPriority;
      return a.scheduledStart.localeCompare(b.scheduledStart);
    });
  }, [workOrders, search, filterArea, filterStatus]);

  const activeTimeEntries = useMemo(() => {
    return timeEntries.filter(entry => !entry.endTime);
  }, [timeEntries]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-violet-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Work Orders</h2>
            <p className="text-sm text-gray-600">Multi-stage production tracking with real-time updates</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 w-64"
              placeholder="Search work orders, SKU, employees"
            />
          </div>
          <select 
            value={filterArea} 
            onChange={(e) => setFilterArea(e.target.value as ProductionArea | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          >
            <option value="all">All Areas</option>
            <option value="mixing-room">Mixing Room</option>
            <option value="pre-bake-prep">Pre-Bake Prep</option>
            <option value="bake-room">Bake Room</option>
            <option value="finishing">Finishing</option>
            <option value="shipping-prep">Shipping Prep</option>
          </select>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value as WorkOrderStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
          <button className="px-3 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Work Order</span>
          </button>
        </div>
      </div>

      {/* Active Time Tracking Summary */}
      {activeTimeEntries.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">Active Time Tracking</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeTimeEntries.map(entry => (
              <div key={entry.id} className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="text-sm font-medium text-gray-900">{entry.employeeName}</div>
                <div className="text-xs text-gray-600">Started: {formatTime(entry.startTime)}</div>
                <div className="text-xs text-blue-600">WO: {workOrders.find(wo => wo.id === entry.workOrderId)?.woNumber}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantities</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map(wo => (
              <tr key={wo.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{wo.woNumber}</div>
                  <div className="text-xs text-gray-500">{formatDate(wo.createdAt)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{wo.sku}</div>
                  {wo.machineId && <div className="text-xs text-gray-500">Machine: {wo.machineId}</div>}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{getAreaDisplayName(wo.productionArea)}</td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{formatTime(wo.scheduledStart)} - {formatTime(wo.scheduledEnd)}</div>
                  {wo.actualStart && (
                    <div className="text-xs text-green-600">Started: {formatTime(wo.actualStart)}</div>
                  )}
                  {wo.actualEnd && (
                    <div className="text-xs text-blue-600">Completed: {formatTime(wo.actualEnd)}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">Planned: {wo.plannedQty}</div>
                  {wo.actualQty !== undefined && (
                    <div className="text-xs text-green-600">Actual: {wo.actualQty}</div>
                  )}
                  {wo.wasteQty !== undefined && wo.wasteQty > 0 && (
                    <div className="text-xs text-red-600">Waste: {wo.wasteQty}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(wo.status)}`}>
                    {wo.status.charAt(0).toUpperCase() + wo.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(wo.priority)}`}>
                    {wo.priority.charAt(0).toUpperCase() + wo.priority.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {wo.assignedEmployees.length} assigned
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {wo.status === 'pending' && (
                      <button 
                        onClick={() => updateWorkOrderStatus(wo.id, 'active')}
                        className="text-green-600 hover:text-green-700"
                        title="Start Work Order"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    {wo.status === 'active' && (
                      <button 
                        onClick={() => updateWorkOrderStatus(wo.id, 'paused')}
                        className="text-orange-600 hover:text-orange-700"
                        title="Pause Work Order"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                    )}
                    {(wo.status === 'active' || wo.status === 'paused') && (
                      <button 
                        onClick={() => setShowUpdateModal(wo.id)}
                        className="text-blue-600 hover:text-blue-700"
                        title="Update Quantities"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="px-6 py-6 text-center text-gray-500 text-sm" colSpan={9}>No work orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Update Quantities Modal */}
      {showUpdateModal && (
        <UpdateQuantitiesModal 
          workOrder={workOrders.find(wo => wo.id === showUpdateModal)!}
          onClose={() => setShowUpdateModal(null)}
          onUpdate={(quantities) => {
            updateWorkOrderQuantities(showUpdateModal, quantities);
            setShowUpdateModal(null);
          }}
        />
      )}
    </div>
  );
}

function UpdateQuantitiesModal({ 
  workOrder, 
  onClose, 
  onUpdate 
}: { 
  workOrder: WorkOrder; 
  onClose: () => void; 
  onUpdate: (quantities: { actualQty?: number; wasteQty?: number; freezeQty?: number }) => void;
}) {
  const [actualQty, setActualQty] = useState(workOrder.actualQty ?? 0);
  const [wasteQty, setWasteQty] = useState(workOrder.wasteQty ?? 0);
  const [freezeQty, setFreezeQty] = useState(workOrder.freezeQty ?? 0);

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-lg">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Update Quantities</h3>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>Close</button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Work Order: {workOrder.woNumber}</div>
            <div className="text-sm text-gray-600 mb-4">Product: {workOrder.sku}</div>
            <div className="text-sm text-gray-600 mb-4">Planned Quantity: {workOrder.plannedQty}</div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Actual Quantity</label>
              <input 
                type="number" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2" 
                value={actualQty} 
                onChange={e => setActualQty(Number(e.target.value))} 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Waste Quantity</label>
              <input 
                type="number" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2" 
                value={wasteQty} 
                onChange={e => setWasteQty(Number(e.target.value))} 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Freeze Quantity</label>
              <input 
                type="number" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2" 
                value={freezeQty} 
                onChange={e => setFreezeQty(Number(e.target.value))} 
              />
            </div>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end space-x-2">
          <button className="px-4 py-2 rounded-lg border border-gray-300" onClick={onClose}>Cancel</button>
          <button 
            className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700" 
            onClick={() => onUpdate({ actualQty, wasteQty, freezeQty })}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
