import React, { useState } from 'react';
import { 
  Calendar, Plus, Filter, MoreHorizontal, Clock, Users, AlertCircle, 
  Package, CheckCircle, AlertTriangle, Tablet, Search, Eye, 
  BarChart3, FileText, Settings, Home, Truck, DollarSign
} from 'lucide-react';

export default function CortelyouManagementSystem() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState('2025-08-11');
  const [selectedLine, setSelectedLine] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, section: 'main' },
    { id: 'production-planning', label: 'Production Planning', icon: Calendar, section: 'production' },
    { id: 'work-orders', label: 'Work Orders', icon: Clock, section: 'production' },
    { id: 'machine-tablets', label: 'Machine Tablets', icon: Tablet, section: 'production' },
    { id: 'employee-tracking', label: 'Employee Tracking', icon: Users, section: 'production' },
    { id: 'sales-orders', label: 'Sales Orders', icon: Package, section: 'sales' },
    { id: 'customers', label: 'Customers', icon: Users, section: 'sales' },
    { id: 'delivery-schedule', label: 'Delivery Schedule', icon: Truck, section: 'sales' },
    { id: 'inventory', label: 'Inventory', icon: Package, section: 'inventory' },
    { id: 'purchasing', label: 'Purchasing', icon: DollarSign, section: 'inventory' },
    { id: 'reports', label: 'Reports', icon: BarChart3, section: 'analytics' },
    { id: 'accounting', label: 'Accounting', icon: FileText, section: 'finance' },
    { id: 'settings', label: 'Settings', icon: Settings, section: 'admin' }
  ];

  // Production data
  const productionLines = ['Mixing Room', 'Pre-Bake Prep', 'Rolls Bake Room', 'Bake Room', 'Finishing', 'Shipping Prep'];

  const panSchedule = [
    { id: 1, sku: 'Rugelach Chocolate', pansRequired: 15, pansScheduled: 12, timeSlot: '06:00-10:00', line: 'Mixing Room', status: 'active' },
    { id: 2, sku: 'Babka Cinnamon', pansRequired: 8, pansScheduled: 8, timeSlot: '10:00-14:00', line: 'Mixing Room', status: 'pending' },
    { id: 3, sku: 'Challah Traditional', pansRequired: 20, pansScheduled: 18, timeSlot: '14:00-18:00', line: 'Bake Room', status: 'scheduled' },
    { id: 4, sku: 'Bagels Everything', pansRequired: 12, pansScheduled: 12, timeSlot: '18:00-22:00', line: 'Bake Room', status: 'scheduled' },
    { id: 5, sku: 'Rolls Dinner', pansRequired: 25, pansScheduled: 20, timeSlot: '22:00-02:00', line: 'Rolls Bake Room', status: 'capacity-shortage' }
  ];

  // Sales data
  const salesOrders = [
    {
      id: 'SO-2025-0145',
      customer: 'Metro Foods Distribution',
      subcustomer: 'Store #401 - Manhattan',
      orderDate: '2025-08-10',
      items: [
        { sku: 'Rugelach Chocolate', quantity: 24, deliveryDate: '2025-08-12', status: 'in-stock' },
        { sku: 'Babka Cinnamon', quantity: 12, deliveryDate: '2025-08-12', status: 'in-stock' },
        { sku: 'Challah Traditional', quantity: 18, deliveryDate: '2025-08-13', status: 'scheduled' }
      ],
      totalValue: 1245.50,
      status: 'confirmed',
      priority: 'standard',
      notes: 'Regular weekly order'
    },
    {
      id: 'SO-2025-0146',
      customer: 'Brooklyn Bakery Supply',
      subcustomer: 'Main Location',
      orderDate: '2025-08-10',
      items: [
        { sku: 'Bagels Everything', quantity: 50, deliveryDate: '2025-08-14', status: 'needs-scheduling' },
        { sku: 'Rolls Dinner', quantity: 30, deliveryDate: '2025-08-14', status: 'needs-scheduling' }
      ],
      totalValue: 875.00,
      status: 'pending-schedule',
      priority: 'high',
      notes: 'Rush order for weekend event'
    },
    {
      id: 'SO-2025-0147',
      customer: 'Metro Foods Distribution',
      subcustomer: 'Store #298 - Queens',
      orderDate: '2025-08-09',
      items: [
        { sku: 'Challah Traditional', quantity: 15, deliveryDate: '2025-08-11', status: 'in-production' },
        { sku: 'Rugelach Chocolate', quantity: 20, deliveryDate: '2025-08-12', status: 'in-stock' }
      ],
      totalValue: 920.25,
      status: 'in-production',
      priority: 'standard',
      notes: ''
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'pending': 'bg-orange-100 text-orange-800',
      'scheduled': 'bg-blue-100 text-blue-800',
      'capacity-shortage': 'bg-red-100 text-red-800',
      'confirmed': 'bg-green-100 text-green-800',
      'pending-schedule': 'bg-yellow-100 text-yellow-800',
      'in-production': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      'active': 'In Production',
      'pending': 'Ready to Start',
      'scheduled': 'Scheduled',
      'capacity-shortage': 'Capacity Shortage',
      'confirmed': 'Confirmed',
      'pending-schedule': 'Pending Schedule',
      'in-production': 'In Production'
    };
    return statusTexts[status] || status;
  };

  const renderSidebar = () => (
    <div className="fixed left-0 top-0 w-64 h-full bg-white border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-violet-600 rounded-lg"></div>
          <span className="text-xl font-semibold">Cortelyou Snacks</span>
        </div>
      </div>
      
      <nav className="mt-8">
        {['main', 'production', 'sales', 'inventory', 'finance', 'analytics', 'admin'].map(section => (
          <div key={section}>
            <div className="px-6 mb-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {section === 'main' ? 'Overview' : section}
              </span>
            </div>
            {navigationItems
              .filter(item => item.section === section)
              .map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 ${
                    activeView === item.id 
                      ? 'text-gray-900 bg-violet-50 border-r-2 border-violet-600' 
                      : 'text-gray-600'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              ))}
          </div>
        ))}
      </nav>
    </div>
  );

  const renderDashboard = () => (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Production Overview</h1>
        <p className="text-gray-600">Real-time status of your manufacturing operations</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase">Today's Orders</p>
              <p className="text-xl font-bold text-gray-900">23</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase">Active Work Orders</p>
              <p className="text-xl font-bold text-gray-900">8</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase">Capacity Issues</p>
              <p className="text-xl font-bold text-red-600">3</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase">Revenue Today</p>
              <p className="text-xl font-bold text-gray-900">$8,942</p>
            </div>
            <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-violet-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {salesOrders.slice(0, 3).map(order => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{order.id}</div>
                  <div className="text-sm text-gray-600">{order.customer}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">${order.totalValue.toFixed(2)}</div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Production Status</h2>
          <div className="space-y-3">
            {panSchedule.slice(0, 3).map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{item.sku}</div>
                  <div className="text-sm text-gray-600">{item.line} • {item.timeSlot}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{item.pansScheduled}/{item.pansRequired} pans</div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                    {getStatusText(item.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProductionPlanning = () => {
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
      // Add more realistic data...
      { id: 11, sku: 'Pumpernickel Bread', line: 'Bake Room', timeSlot: '22:00-02:00', pansFromOrders: 5, pansStandard: 2, status: 'scheduled' },
      { id: 12, sku: 'Cinnamon Rolls', line: 'Finishing', timeSlot: '06:00-10:00', pansFromOrders: 12, pansStandard: 3, status: 'confirmed' }
    ];

    const [viewMode, setViewMode] = useState('summary'); // 'summary' or 'detailed'
    const [showAddSlot, setShowAddSlot] = useState(false);

    // Aggregate data by production line
    const lineAggregates = productionLines.map(line => {
      const lineItems = productionSchedule.filter(item => item.line === line);
      const totalFromOrders = lineItems.reduce((sum, item) => sum + item.pansFromOrders, 0);
      const totalStandard = lineItems.reduce((sum, item) => sum + item.pansStandard, 0);
      const skuCount = lineItems.length;
      return {
        line,
        totalFromOrders,
        totalStandard,
        totalPans: totalFromOrders + totalStandard,
        skuCount,
        items: lineItems
      };
    });

    const filteredSchedule = selectedLine === 'all' 
      ? productionSchedule 
      : productionSchedule.filter(item => item.line === selectedLine);

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
              onChange={(e) => setViewMode(e.target.value)}
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
              {productionLines.map(line => (
                <option key={line} value={line}>{line}</option>
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
            {lineAggregates.map(aggregate => (
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
                  <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                    <span className="text-sm font-medium text-gray-900">Total:</span>
                    <span className="font-bold text-gray-900">{aggregate.totalPans} pans</span>
                  </div>
                </div>

                <div className="space-y-1">
                  {aggregate.items.slice(0, 3).map(item => (
                    <div key={item.id} className="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1">
                      <span className="truncate font-medium">{item.sku}</span>
                      <span className="text-gray-600">{item.pansFromOrders + item.pansStandard}</span>
                    </div>
                  ))}
                  {aggregate.items.length > 3 && (
                    <div className="text-xs text-center text-gray-500 py-1">
                      +{aggregate.items.length - 3} more SKUs
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => {setSelectedLine(aggregate.line); setViewMode('detailed');}}
                  className="w-full mt-3 text-sm text-violet-600 hover:text-violet-800 font-medium"
                >
                  View Details →
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Detailed Schedule - {selectedLine === 'all' ? 'All Lines' : selectedLine}
                </h2>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setViewMode('summary')}
                    className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    ← Back to Summary
                  </button>
                  <button className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Production Line</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Time Slot</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">From Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">For Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Total Pans</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSchedule.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{item.sku}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-600">{item.line}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-600 font-mono text-sm">{item.timeSlot}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-blue-600">{item.pansFromOrders}</span>
                          <span className="text-xs text-blue-500">orders</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-green-600">{item.pansStandard}</span>
                          <span className="text-xs text-green-500">stock</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{item.pansFromOrders + item.pansStandard}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                          {getStatusText(item.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-violet-600 hover:text-violet-800 text-sm">Edit</button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Showing {filteredSchedule.length} SKUs</span>
                <span>
                  Total: <strong>{filteredSchedule.reduce((sum, item) => sum + item.pansFromOrders + item.pansStandard, 0)} pans</strong>
                  {' '}(<span className="text-blue-600">{filteredSchedule.reduce((sum, item) => sum + item.pansFromOrders, 0)} from orders</span>
                  {' '}+ <span className="text-green-600">{filteredSchedule.reduce((sum, item) => sum + item.pansStandard, 0)} for stock</span>)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Add Production Slot Modal */}
        {showAddSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg border border-gray-200 p-6 w-96">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Production Slot</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500" placeholder="Enter SKU name" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Production Line</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
                    {productionLines.map(line => (
                      <option key={line} value={line}>{line}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Slot</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
                    <option>06:00-10:00</option>
                    <option>10:00-14:00</option>
                    <option>14:00-18:00</option>
                    <option>18:00-22:00</option>
                    <option>22:00-02:00</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pans from Orders</label>
                    <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pans for Stock</label>
                    <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500" placeholder="0" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button 
                  onClick={() => setShowAddSlot(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowAddSlot(false)}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
                >
                  Add Slot
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSalesOrders = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Sales Orders</h1>
          <p className="text-sm text-gray-600">Customer hierarchy with multi-date delivery scheduling</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Order</span>
          </button>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 w-80"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending-schedule">Pending Schedule</option>
              <option value="in-production">In Production</option>
            </select>
          </div>
          <button className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-b-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Order Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Customer Hierarchy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Items & Delivery</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Priority</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{order.id}</div>
                    <div className="text-sm text-gray-500">
                      Ordered: {new Date(order.orderDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{order.customer}</div>
                    <div className="text-sm text-gray-500 flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{order.subcustomer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex-1">
                            <span className="font-medium">{item.sku}</span>
                            <span className="text-gray-500"> (×{item.quantity})</span>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <span className="text-gray-500">{new Date(item.deliveryDate).toLocaleDateString()}</span>
                            <span className={`text-xs font-medium ${
                              item.status === 'in-stock' ? 'text-green-600' : 
                              item.status === 'scheduled' ? 'text-blue-600' : 'text-yellow-600'
                            }`}>
                              {item.status.replace('-', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">${order.totalValue.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">{order.items.length} items</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full space-x-1 ${getStatusColor(order.status)}`}>
                      <span>{order.status.replace('-', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${
                      order.priority === 'high' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                    </span>
                    {order.priority === 'high' && (
                      <div className="flex items-center mt-1">
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPlaceholderView = (title, description) => (
    <div className="p-6">
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600 mb-4">{description}</p>
          <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700">
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboard();
      case 'production-planning':
        return renderProductionPlanning();
      case 'sales-orders':
        return renderSalesOrders();
      case 'work-orders':
        return renderPlaceholderView('Work Orders', 'Multi-stage production tracking with real-time updates');
      case 'machine-tablets':
        return renderPlaceholderView('Machine Tablets', 'Tablet interfaces for production line machines');
      case 'employee-tracking':
        return renderPlaceholderView('Employee Tracking', 'Time tracking per production line and shift');
      case 'customers':
        return renderPlaceholderView('Customer Management', 'Manage customer hierarchy and relationships');
      case 'delivery-schedule':
        return renderPlaceholderView('Delivery Schedule', 'Multi-date delivery planning and logistics');
      case 'inventory':
        return renderPlaceholderView('Inventory Management', 'Stock tracking with lot number traceability');
      case 'purchasing':
        return renderPlaceholderView('Purchasing', 'Vendor management and purchase order tracking');
      case 'reports':
        return renderPlaceholderView('Reports & Analytics', 'Sales, production, and performance reporting');
      case 'accounting':
        return renderPlaceholderView('Accounting', 'Financial management with QuickBooks integration');
      case 'settings':
        return renderPlaceholderView('Settings', 'System configuration and user management');
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderSidebar()}
      
      {/* Main Content Area */}
      <div className="ml-64">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">👋</div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Good Morning, John!</h1>
                <p className="text-sm text-gray-600">Here's what's happening with your operations today.</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 w-64"
                />
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500">
                <option>2024-2025</option>
              </select>
              <div className="relative">
                <button className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        {renderMainContent()}
      </div>
    </div>
  );
}