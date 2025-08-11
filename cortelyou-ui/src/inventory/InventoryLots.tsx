import React, { useMemo, useState } from 'react';
import { Search, Plus, Filter, Package, ArrowRightLeft, Minus, Plus as PlusIcon, History } from 'lucide-react';
import { useInventoryLots } from './InventoryLotsContext';
import type { Lot } from './types';

function formatDate(date?: string) {
  if (!date) return '-';
  try {
    return new Date(date).toLocaleDateString();
  } catch {
    return date;
  }
}

function statusForLot(lot: Lot) {
  if (!lot.expiration) return 'OK';
  const now = new Date();
  const exp = new Date(lot.expiration);
  const diffDays = (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays < 0) return 'Expired';
  if (diffDays <= 7) return 'Expiring Soon';
  return 'OK';
}

function statusColor(status: string) {
  switch (status) {
    case 'Expired':
      return 'bg-red-100 text-red-800';
    case 'Expiring Soon':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-green-100 text-green-800';
  }
}

export default function InventoryLots() {
  const { lots, txns, receiveLot, issueFromLots, transferLot, adjustLot } = useInventoryLots();

  const [search, setSearch] = useState('');
  const [showReceive, setShowReceive] = useState(false);
  const [showIssue, setShowIssue] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showAdjust, setShowAdjust] = useState(false);
  const [showTrace, setShowTrace] = useState(false);
  const [traceInput, setTraceInput] = useState('');

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return lots;
    return lots.filter(l =>
      l.lotCode.toLowerCase().includes(s) ||
      l.skuId.toLowerCase().includes(s) ||
      (l.supplier?.toLowerCase().includes(s) ?? false)
    );
  }, [lots, search]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-violet-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Inventory (Lots)</h2>
            <p className="text-sm text-gray-600">Lot-based inventory with FEFO consumption and traceability</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 w-64"
              placeholder="Search lots, SKU, supplier"
            />
          </div>
          <button className="px-3 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 text-gray-700 hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <button onClick={() => setShowReceive(true)} className="px-3 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Receive</span>
          </button>
          <button onClick={() => setShowIssue(true)} className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Minus className="w-4 h-4" />
            <span>Issue</span>
          </button>
          <button onClick={() => setShowTransfer(true)} className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <ArrowRightLeft className="w-4 h-4" />
            <span>Transfer</span>
          </button>
          <button onClick={() => setShowAdjust(true)} className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <PlusIcon className="w-4 h-4" />
            <span>Adjust</span>
          </button>
          <button onClick={() => setShowTrace(true)} className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <History className="w-4 h-4" />
            <span>Trace</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lot Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty On Hand</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map(lot => {
              const status = statusForLot(lot);
              return (
                <tr key={lot.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{lot.skuId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{lot.lotCode}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{lot.qtyOnHand}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{lot.locationId}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{formatDate(lot.expiration)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{lot.supplier ?? '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColor(status)}`}>{status}</span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td className="px-6 py-6 text-center text-gray-500 text-sm" colSpan={7}>No lots found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Receive Modal */}
      {showReceive && (
        <ReceiveModal onClose={() => setShowReceive(false)} onSubmit={(data) => { receiveLot(data); setShowReceive(false); }} />
      )}

      {/* Issue Modal */}
      {showIssue && (
        <IssueModal onClose={() => setShowIssue(false)} onSubmit={(skuId, qty) => { issueFromLots({ skuId, qty, strategy: 'FEFO' }); setShowIssue(false); }} />
      )}

      {/* Transfer Modal */}
      {showTransfer && (
        <TransferModal onClose={() => setShowTransfer(false)} onSubmit={(lotId, toLocationId, qty) => { transferLot(lotId, toLocationId, qty); setShowTransfer(false); }} />
      )}

      {/* Adjust Modal */}
      {showAdjust && (
        <AdjustModal onClose={() => setShowAdjust(false)} onSubmit={(lotId, delta, notes) => { adjustLot(lotId, delta, notes); setShowAdjust(false); }} />
      )}

      {/* Trace Drawer */}
      {showTrace && (
        <div className="fixed inset-0 bg-black/30 flex">
          <div className="ml-auto w-[480px] h-full bg-white border-l border-gray-200 p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Trace Lot</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowTrace(false)}>Close</button>
            </div>
            <div className="space-y-3">
              <input value={traceInput} onChange={(e) => setTraceInput(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Enter Lot Code" />
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600">
                Enter a lot code to view its history. (Traceability UI to be expanded with Sales/Shipping links.)
              </div>
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Recent Transactions</div>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">When</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {txns.slice(0, 10).map(t => (
                        <tr key={t.id}>
                          <td className="px-4 py-2 text-sm">{t.type}</td>
                          <td className="px-4 py-2 text-sm">{t.qty}</td>
                          <td className="px-4 py-2 text-sm">{new Date(t.ts).toLocaleString()}</td>
                        </tr>
                      ))}
                      {txns.length === 0 && (
                        <tr>
                          <td className="px-4 py-3 text-center text-gray-500 text-sm" colSpan={3}>No transactions yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ModalFrame({ title, onClose, children, actions }: { title: string; onClose: () => void; children: React.ReactNode; actions: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white border border-gray-200 rounded-lg shadow-lg">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>Close</button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
        <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end space-x-2">
          {actions}
        </div>
      </div>
    </div>
  );
}

function ReceiveModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (lot: Omit<Lot, 'id' | 'receivedTs'> & { receivedTs?: string }) => void }) {
  const [form, setForm] = useState<Omit<Lot, 'id' | 'receivedTs'>>({ skuId: '', lotCode: '', qtyOnHand: 0, locationId: 'main', expiration: '', supplier: '' });
  return (
    <ModalFrame title="Receive Inventory" onClose={onClose} actions={(
      <>
        <button className="px-4 py-2 rounded-lg border border-gray-300" onClick={onClose}>Cancel</button>
        <button className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700" onClick={() => onSubmit(form)}>Receive</button>
      </>
    )}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">SKU</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={form.skuId} onChange={e => setForm({ ...form, skuId: e.target.value })} placeholder="sku-id" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Lot Code</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={form.lotCode} onChange={e => setForm({ ...form, lotCode: e.target.value })} placeholder="lot-123" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Quantity</label>
          <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={form.qtyOnHand} onChange={e => setForm({ ...form, qtyOnHand: Number(e.target.value) })} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Location</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={form.locationId} onChange={e => setForm({ ...form, locationId: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Expiration</label>
          <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={form.expiration || ''} onChange={e => setForm({ ...form, expiration: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Supplier</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={form.supplier || ''} onChange={e => setForm({ ...form, supplier: e.target.value })} />
        </div>
      </div>
    </ModalFrame>
  );
}

function IssueModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (skuId: string, qty: number) => void }) {
  const [skuId, setSkuId] = useState('');
  const [qty, setQty] = useState(0);
  return (
    <ModalFrame title="Issue Inventory (FEFO)" onClose={onClose} actions={(
      <>
        <button className="px-4 py-2 rounded-lg border border-gray-300" onClick={onClose}>Cancel</button>
        <button className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700" onClick={() => onSubmit(skuId, qty)}>Issue</button>
      </>
    )}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">SKU</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={skuId} onChange={e => setSkuId(e.target.value)} placeholder="sku-id" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Quantity</label>
          <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={qty} onChange={e => setQty(Number(e.target.value))} />
        </div>
      </div>
      <div className="text-xs text-gray-500">This will automatically select lots by FEFO. Manual selection coming next.</div>
    </ModalFrame>
  );
}

function TransferModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (lotId: string, toLocationId: string, qty: number) => void }) {
  const [lotId, setLotId] = useState('');
  const [to, setTo] = useState('secondary');
  const [qty, setQty] = useState(0);
  return (
    <ModalFrame title="Transfer Lot" onClose={onClose} actions={(
      <>
        <button className="px-4 py-2 rounded-lg border border-gray-300" onClick={onClose}>Cancel</button>
        <button className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700" onClick={() => onSubmit(lotId, to, qty)}>Transfer</button>
      </>
    )}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Lot</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={lotId} onChange={e => setLotId(e.target.value)} placeholder="lot-id" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">To Location</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Quantity</label>
          <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={qty} onChange={e => setQty(Number(e.target.value))} />
        </div>
      </div>
    </ModalFrame>
  );
}

function AdjustModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (lotId: string, delta: number, notes?: string) => void }) {
  const [lotId, setLotId] = useState('');
  const [delta, setDelta] = useState(0);
  const [notes, setNotes] = useState('');
  return (
    <ModalFrame title="Adjust Lot" onClose={onClose} actions={(
      <>
        <button className="px-4 py-2 rounded-lg border border-gray-300" onClick={onClose}>Cancel</button>
        <button className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700" onClick={() => onSubmit(lotId, delta, notes)}>Save</button>
      </>
    )}>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Lot</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={lotId} onChange={e => setLotId(e.target.value)} placeholder="lot-id" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Delta (positive or negative)</label>
          <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={delta} onChange={e => setDelta(Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Notes</label>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Reason" />
        </div>
      </div>
    </ModalFrame>
  );
}
