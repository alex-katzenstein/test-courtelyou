import { useState } from 'react';
import { Calendar, Plus, Package, Clock } from 'lucide-react';

type Props = {
  productionLines: string[];
  selectedDate: string;
  setSelectedDate: (v: string) => void;
  selectedLine: string;
  setSelectedLine: (v: string) => void;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-orange-100 text-orange-800',
    scheduled: 'bg-blue-100 text-blue-800',
    'capacity-shortage': 'bg-red-100 text-red-800',
    confirmed: 'bg-green-100 text-green-800',
    'pending-schedule': 'bg-yellow-100 text-yellow-800',
    'in-production': 'bg-blue-100 text-blue-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const getStatusText = (status: string) => {
  const statusTexts: Record<string, string> = {
    active: 'In Production',
    pending: 'Ready to Start',
    scheduled: 'Scheduled',
    'capacity-shortage': 'Capacity Shortage',
    confirmed: 'Confirmed',
    'pending-schedule': 'Pending Schedule',
    'in-production': 'In Production',
  };
  return statusTexts[status] || status;
};

export default function ProductionPlanning({
  productionLines,
  selectedDate,
  setSelectedDate,
  selectedLine,
  setSelectedLine,
}: Props) {
  // Expanded production data for realistic scale
  const productionSchedule = [
    { id: 1, sku: 'Rugelach Chocolate', line: 'Mixing Room', timeSlot: '06:00-10:00', pansFromOrders: 12, pansStandard: 3, status: 'confirmed' },
    { id: 2, sku: 'Babka Cinnamon', line: 'Mixing Room', timeSlot: '10:00-14:00', pansFromOrders: 8, pansStandard: 2, status: 'confirmed' },
    { id: 3, sku: 'Challah Traditional', line: 'Bake Room', timeSlot: '06:00-10:00', pansFromOrders: 18, pansStandard: 5, status: 'confirmed' },
    { id: 4, sku: 'Bagels Everything', line: 'Bake Room', timeSlot: '10:00-14:00', pansFromOrders: 12, pansStandard: 4, status: 'confirmed' },
    { id: 5, sku: 'Rolls Dinner', line: 'Rolls Bake Room', timeSlot: '14:00-18:00', pansFromOrders: 15, pansStandard: 5, status: 'capacity-shortage' },
    { id: 6, sku: 'Cookies Chocolate Chip', line: 'Pre-Bake Prep', timeSlot: '06:00-10:00', pansFromOrders: 6, pansStandard: 2, status: 'confirmed' },
    { id: 7, sku: 'Muffins Blueberry', line: 'Bake Room', timeSlot: '14:00-18:00', pansFromOrders: 10, pansStandard: 3, status: 'confirmed' },
    { id: 8, sku: 'Danish Pastry', line: 'Finishing', timeSlot: '18:00-22:00', pansFromOrders: 8, pansStandard: 2, status: 'pending' },
    { id: 9, sku: 'Croissants Plain', line: 'Pre-Bake Prep', timeSlot: '10:00-14:00', pansFromOrders: 14, pansStandard: 4, status: 'confirmed' },
    { id: 10, sku: 'Sourdough Bread', line: 'Bake Room', timeSlot: '18:00-22:00', pansFromOrders: 20, pansStandard: 6, status: 'confirmed' },
    { id: 11, sku: 'Pumpernickel Bread', line: 'Bake Room', timeSlot: '22:00-02:00', pansFromOrders: 5, pansStandard: 2, status: 'scheduled' },
    { id: 12, sku: 'Cinnamon Rolls', line: 'Finishing', timeSlot: '06:00-10:00', pansFromOrders: 12, pansStandard: 3, status: 'confirmed' },
  ];

  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary');
  const [showAddSlot, setShowAddSlot] = useState(false);

  // Aggregate data by production line
  const lineAggregates = productionLines.map((line) => {
    const lineItems = productionSchedule.filter((item) => item.line === line);
    const totalFromOrders = lineItems.reduce((sum, item) => sum + item.pansFromOrders, 0);
    const totalStandard = lineItems.reduce((sum, item) => sum + item.pansStandard, 0);
    const skuCount = lineItems.length;
    return {
      line,
      totalFromOrders,
      totalStandard,
      totalPans: totalFromOrders + totalStandard,
      skuCount,
      items: lineItems,
    };
  });

  const filteredSchedule =
    selectedLine === 'all'
      ? productionSchedule
      : productionSchedule.filter((item) => item.line === selectedLine);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Production Planning</h1>
          <p className="text-sm text-gray-600">Pan-based capacity planning for {selectedDate}</p>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          />
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as 'summary' | 'detailed')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          >
            <option value="summary">Summary View</option>
            <option value="detailed">Detailed View</option>
          </select>
          <select
            value={selectedLine}
            onChange={(e) => setSelectedLine(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          >
            <option value="all">All Production Lines</option>
            {productionLines.map((line) => (
              <option key={line} value={line}>
                {line}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowAddSlot(true)}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Production Slot</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase">SKUs Scheduled</p>
              <p className="text-xl font-bold text-gray-900">{filteredSchedule.length}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase">Pans from Orders</p>
              <p className="text-xl font-bold text-blue-600">{filteredSchedule.reduce((sum, item) => sum + item.pansFromOrders, 0)}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase">Pans for Stock</p>
              <p className="text-xl font-bold text-green-600">{filteredSchedule.reduce((sum, item) => sum + item.pansStandard, 0)}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase">Total Pans</p>
              <p className="text-xl font-bold text-gray-900">{filteredSchedule.reduce((sum, item) => sum + item.pansFromOrders + item.pansStandard, 0)}</p>
            </div>
            <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-violet-600" />
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'summary' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {lineAggregates.map((aggregate) => (
            <div key={aggregate.line} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{aggregate.line}</h3>
                <span className="text-sm text-gray-500">{aggregate.skuCount} SKUs</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">From Orders:</span>
                  <span className="font-medium text-blue-600">{aggregate.totalFromOrders} pans</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">For Stock:</span>
                  <span className="font-medium text-green-600">{aggregate.totalStandard} pans</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total:</span>
                  <span className="font-medium text-gray-900">{aggregate.totalPans} pans</span>
                </div>
              </div>

              <div className="space-y-2">
                {aggregate.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{item.sku}</div>
                      <div className="text-sm text-gray-600">
                        {item.line} • {item.timeSlot}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {item.pansFromOrders + item.pansStandard} pans
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Detailed Schedule</h2>
            <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Export</button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Line</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Slot</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Pans (Orders)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Pans (Stock)</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSchedule.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.line}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.timeSlot}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{item.pansFromOrders}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">{item.pansStandard}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Production Slot</h3>
            <div className="grid grid-cols-1 gap-4">
              <select className="px-3 py-2 border border-gray-300 rounded-lg">
                {productionLines.map((line) => (
                  <option key={line} value={line}>
                    {line}
                  </option>
                ))}
              </select>
              <input type="time" className="px-3 py-2 border border-gray-300 rounded-lg" />
              <input type="number" placeholder="Pans from Orders" className="px-3 py-2 border border-gray-300 rounded-lg" />
              <input type="number" placeholder="Pans for Stock" className="px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg" onClick={() => setShowAddSlot(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700" onClick={() => setShowAddSlot(false)}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
