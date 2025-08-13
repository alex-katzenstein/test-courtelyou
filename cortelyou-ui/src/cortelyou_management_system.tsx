import { useState } from 'react';
import { 
  Calendar, Clock, Users, 
  Package, BarChart3, FileText, Settings, Home, Truck, DollarSign, Search
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

  // Navigation items with enhanced structure and organization
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, section: 'main' },
    { id: 'production-planning', label: 'Production Planning', icon: Calendar, section: 'production' },
    { id: 'work-orders', label: 'Work Orders', icon: Clock, section: 'production' },
    { id: 'sales-orders', label: 'Sales Orders', icon: Package, section: 'sales' },
    { id: 'customers', label: 'Customers', icon: Users, section: 'sales' },
    { id: 'delivery-schedule', label: 'Delivery Schedule', icon: Truck, section: 'sales' },
    { id: 'inventory', label: 'Inventory', icon: Package, section: 'inventory' },
    { id: 'purchasing', label: 'Purchasing', icon: DollarSign, section: 'inventory' },
    { id: 'reports', label: 'Reports', icon: BarChart3, section: 'analytics' },
    { id: 'accounting', label: 'Accounting', icon: FileText, section: 'finance' },
    { id: 'settings', label: 'Settings', icon: Settings, section: 'admin' }
  ];

  // Production lines data
  const productionLines = ['Mixing Room', 'Pre-Bake Prep', 'Rolls Bake Room', 'Bake Room', 'Finishing', 'Shipping Prep'];

  // Render the sidebar navigation
  const renderSidebar = () => (
    <div className="fixed left-0 top-0 w-64 h-full bg-white border-r border-gray-200 z-10">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-violet-600 rounded-lg"></div>
          <span className="text-xl font-semibold">Cortelyou Snacks</span>
        </div>
      </div>
      
      <nav className="mt-8">
        {['main', 'production', 'sales', 'inventory', 'analytics', 'finance', 'admin'].map(section => (
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      {renderSidebar()}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {navigationItems.find(item => item.id === activeView)?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {activeView === 'dashboard' && (
              <div className="bg-white rounded-lg p-6 shadow">
                <h2 className="text-lg font-semibold mb-4">Dashboard View</h2>
                <p className="text-gray-600">Select a section from the sidebar to get started.</p>
              </div>
            )}
            {activeView === 'production-planning' && (
              <ProductionPlanning
                productionLines={productionLines}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedLine={selectedLine}
                setSelectedLine={setSelectedLine}
              />
            )}
            {activeView === 'work-orders' && (
              <WorkOrdersProvider>
                <WorkOrders />
              </WorkOrdersProvider>
            )}
            {activeView === 'inventory' && (
              <InventoryLotsProvider>
                <InventoryLots />
              </InventoryLotsProvider>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}