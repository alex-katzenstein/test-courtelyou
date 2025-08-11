import React, { useState } from 'react';
import { 
  Calendar, Plus, Filter, MoreHorizontal, Clock, Users, AlertCircle, 
  Package, AlertTriangle, Tablet, Search, 
  BarChart3, FileText, Settings, Home, Truck, DollarSign
} from 'lucide-react';
import ProductionPlanning from './ProductionPlanning';
import InventoryLots from './inventory/InventoryLots';
import { InventoryLotsProvider } from './inventory/InventoryLotsContext';
import WorkOrders from './work-orders/WorkOrders';
import { WorkOrdersProvider } from './work-orders/WorkOrdersContext';

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

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
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

  const getStatusText = (status: string): string => {
    const statusTexts: Record<string, string> = {
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

  const renderPlaceholderView = (title: string, description: string) => (
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
        return (
          <ProductionPlanning
            productionLines={productionLines}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedLine={selectedLine}
            setSelectedLine={setSelectedLine}
          />
        );
      case 'sales-orders':
        return renderSalesOrders();
      case 'work-orders':
        return <WorkOrders />;
      case 'machine-tablets':
        return renderPlaceholderView('Machine Tablets', 'Tablet interfaces for production line machines');
      case 'employee-tracking':
        return renderPlaceholderView('Employee Tracking', 'Time tracking per production line and shift');
      case 'customers':
        return renderPlaceholderView('Customer Management', 'Manage customer hierarchy and relationships');
      case 'delivery-schedule':
        return renderPlaceholderView('Delivery Schedule', 'Multi-date delivery planning and logistics');
      case 'inventory':
        return <InventoryLots />;
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
    <InventoryLotsProvider>
      <WorkOrdersProvider>
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
      </WorkOrdersProvider>
    </InventoryLotsProvider>
  );
}