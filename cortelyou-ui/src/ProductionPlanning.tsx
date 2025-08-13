import React, { useState } from 'react';

type Props = {
  productionLines?: string[];
  selectedDate?: string;
  setSelectedDate?: (v: string) => void;
  selectedLine?: string;
  setSelectedLine?: (v: string) => void;
};

export default function ProductionPlanning({
  productionLines = [],
  selectedDate = new Date().toISOString().split('T')[0],
  setSelectedDate = () => {},
  selectedLine = 'all',
  setSelectedLine = () => {},
}: Props) {
  const [viewMode] = useState<'summary' | 'detailed'>('summary');
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Production Planning (Debug Mode)</h1>
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-medium text-yellow-800">Debug Information</h3>
        <pre className="mt-2 p-2 bg-white text-xs overflow-auto">
          {JSON.stringify({
            productionLines,
            selectedDate,
            selectedLine,
            viewMode
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
              </div>
            </div>
            <button 
              onClick={() => setShowCapacityModal(true)}
              className="flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
            >
              View Details
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}
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
                
                {/* Capacity Utilization Bar */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600">Capacity</span>
                    <span className={`text-xs font-medium ${
                      capacityAnalysis.lineCapacities[aggregate.line] && 
                      capacityAnalysis.lineCapacities[aggregate.line].used > capacityAnalysis.lineCapacities[aggregate.line].capacity
                        ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {capacityAnalysis.lineCapacities[aggregate.line] ? 
                        `${capacityAnalysis.lineCapacities[aggregate.line].used}/${capacityAnalysis.lineCapacities[aggregate.line].capacity} pans` : 
                        `${aggregate.totalPans}/100 pans`
                      }
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        capacityAnalysis.lineCapacities[aggregate.line] && 
                        capacityAnalysis.lineCapacities[aggregate.line].used > capacityAnalysis.lineCapacities[aggregate.line].capacity
                          ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{
                        width: `${Math.min(100, capacityAnalysis.lineCapacities[aggregate.line] ? 
                          (capacityAnalysis.lineCapacities[aggregate.line].used / capacityAnalysis.lineCapacities[aggregate.line].capacity) * 100 :
                          (aggregate.totalPans / 100) * 100
                        )}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {aggregate.items.map((item) => {
                  const itemWithWO = slotsWithWorkOrders.find(slot => slot.id === item.id);
                  const isShortage = item.status === 'capacity-shortage';
                  const totalPans = item.pansFromOrders + item.pansStandard;
                  
                  return (
                    <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg ${
                      isShortage ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                    }`}>
                      <div>
                        <div className="flex items-center space-x-2">
                          <div className="font-medium text-gray-900">{item.sku}</div>
                          {itemWithWO?.hasWorkOrder && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              <Settings className="w-3 h-3 mr-1" />
                              WO
                            </span>
                          )}
                          {isShortage && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Over Capacity
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {item.line} • {item.timeSlot}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">
                          {totalPans} pans
                        </div>
                        <div className="flex items-center justify-end space-x-2 mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                            {isShortage ? `Short ${Math.max(0, totalPans - 25)} pans` : getStatusText(item.status)}
                          </span>
                          {isShortage && (
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleAutoReschedule(item)}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                              >
                                Reschedule
                              </button>
                              <button
                                onClick={() => handleSplitProduction(item)}
                                className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                              >
                                Split
                              </button>
                            </div>
                          )}
                          {!itemWithWO?.hasWorkOrder && !isShortage && (
                            <button
                              onClick={() => handleGenerateWorkOrder(item)}
                              className="text-xs text-violet-600 hover:text-violet-700 font-medium"
                            >
                              Generate WO
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Work Order</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      {item.hasWorkOrder ? (
                        <div className="flex items-center justify-end space-x-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Settings className="w-3 h-3 mr-1" />
                            {item.workOrderNumber}
                          </span>
                          <button 
                            className="text-blue-600 hover:text-blue-700"
                            title="View Work Order"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleGenerateWorkOrder(item)}
                          className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-violet-100 text-violet-700 hover:bg-violet-200"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Generate WO
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Capacity Shortage Details Modal */}
      {showCapacityModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-6 z-50">
          <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Production Capacity Analysis</h3>
              <button 
                onClick={() => setShowCapacityModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {/* Summary */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                  <h4 className="font-medium text-red-900">Capacity Shortages Detected</h4>
                </div>
                <p className="text-sm text-red-700 mb-3">
                  {capacityAnalysis.totalShortage} pans exceed available capacity across {capacityAnalysis.shortages.length} production line{capacityAnalysis.shortages.length > 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {capacityAnalysis.shortages.map(shortage => (
                    <div key={shortage.line} className="bg-white border border-red-200 rounded p-3">
                      <div className="font-medium text-gray-900">{shortage.line}</div>
                      <div className="text-sm text-red-600">{shortage.utilization}% utilized</div>
                      <div className="text-sm text-red-600">Short {shortage.shortage} pans</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Affected Production Slots */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Affected Production Slots</h4>
                <div className="space-y-3">
                  {productionSchedule.filter(slot => slot.status === 'capacity-shortage').map(slot => {
                    const totalPans = slot.pansFromOrders + slot.pansStandard;
                    const shortage = Math.max(0, totalPans - 25); // Assuming 25 pan capacity per slot
                    
                    return (
                      <div key={slot.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="font-medium text-gray-900">{slot.sku}</div>
                            <div className="text-sm text-gray-600">{slot.line} • {slot.timeSlot}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-red-600">Short {shortage} pans</div>
                            <div className="text-sm text-gray-600">{totalPans} total needed</div>
                          </div>
                        </div>
                        
                        {/* Resolution Options */}
                        <div className="border-t border-red-200 pt-3">
                          <div className="text-sm font-medium text-gray-700 mb-2">Resolution Options:</div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <button
                              onClick={() => handleAutoReschedule(slot)}
                              className="flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                            >
                              <ArrowRight className="w-4 h-4 mr-1" />
                              Move to Available Line
                            </button>
                            <button
                              onClick={() => handleSplitProduction(slot)}
                              className="flex items-center justify-center px-3 py-2 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200"
                            >
                              <Package className="w-4 h-4 mr-1" />
                              Split Across Slots
                            </button>
                            <button
                              className="flex items-center justify-center px-3 py-2 bg-orange-100 text-orange-700 rounded-md text-sm hover:bg-orange-200"
                            >
                              <Clock className="w-4 h-4 mr-1" />
                              Extend Hours
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Available Capacity */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Available Capacity</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(capacityAnalysis.lineCapacities)
                    .filter(([, data]) => data.used < data.capacity)
                    .map(([line, data]) => (
                      <div key={line} className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="font-medium text-gray-900">{line}</div>
                        <div className="text-sm text-green-600">
                          {Math.round((data.used / data.capacity) * 100)}% utilized
                        </div>
                        <div className="text-sm text-green-600">
                          {data.capacity - data.used} pans available
                        </div>
                        <div className="w-full bg-green-100 rounded-full h-2 mt-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(data.used / data.capacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end space-x-3">
              <button 
                onClick={() => setShowCapacityModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">
                Auto-Optimize Schedule
              </button>
            </div>
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
