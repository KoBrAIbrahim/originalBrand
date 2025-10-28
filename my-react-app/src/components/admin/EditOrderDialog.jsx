import React, { useEffect, useMemo, useState } from 'react';
import AdminDialog from '../common/AdminDialog';
import { useProducts } from '../../hooks/useProducts';
import { formatPrice } from '../../utils/helpers';

const EditOrderDialog = ({ open, order, onClose, onSave }) => {
  const { products, loading: productsLoading } = useProducts();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (order && order.items) {
      setItems(order.items.map(i => ({ ...i })));
    } else {
      setItems([]);
    }
  }, [order]);

  const productsMap = useMemo(() => {
    const map = {};
    (products || []).forEach(p => map[p.id] = p);
    return map;
  }, [products]);

  const handleQuantityChange = (index, qty) => {
    const newItems = [...items];
    newItems[index].quantity = Math.max(0, parseInt(qty) || 0);
    setItems(newItems);
  };

  const handleRemove = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);

  useEffect(() => {
    if (selectedProductId) {
      const p = productsMap[selectedProductId];
      setSelectedSize(Object.keys(p.sizes || {})[0] || '');
      setSelectedColor((p.colors && p.colors[0]) || '');
    }
  }, [selectedProductId, productsMap]);

  const handleAddItem = () => {
    if (!selectedProductId) return;
    const p = productsMap[selectedProductId];
    const price = p.salePrice || p.sellPrice || 0;
    const newItem = {
      productId: p.id,
      productName: p.name,
      size: selectedSize,
      color: selectedColor,
      quantity: parseInt(selectedQty) || 0,
      price
    };
    setItems(prev => [...prev, newItem]);
    // reset small fields
    setSelectedProductId('');
    setSelectedQty(1);
  };

  const totalPrice = items.reduce((s, it) => s + (it.price || 0) * (it.quantity || 0), 0);

  const handleSave = async () => {
    const updatedOrder = {
      ...order,
      items,
      totalPrice
    };

    await onSave(order.id, updatedOrder);
  };

  return (
    <AdminDialog
      open={open}
      title={`تعديل الطلب #${order ? order.id.slice(-6) : ''}`}
      onConfirm={handleSave}
      onCancel={onClose}
      confirmText="حفظ"
      cancelText="إلغاء"
    >
      <div className="edit-order-dialog">
        <div>
          <h4>المنتجات الحالية</h4>
          {items.length === 0 && <p>لا توجد منتجات في الطلب</p>}
          <div className="items-list">
            {items.map((it, idx) => (
              <div key={idx} className="item-row">
                <div className="item-main">
                  <div style={{ fontWeight: 700 }}>{it.productName}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>مقاس: {it.size} • اللون: {it.color}</div>
                </div>
                <div className="item-qty">
                  <input type="number" value={it.quantity} min={0} onChange={(e) => handleQuantityChange(idx, e.target.value)} />
                  <div style={{ width: 120, textAlign: 'right', fontWeight: 700 }}>{formatPrice((it.price || 0) * (it.quantity || 0))}</div>
                  <button onClick={() => handleRemove(idx)} className="btn btn-danger">حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4>إضافة منتج</h4>
          {productsLoading ? (
            <p>جاري تحميل المنتجات...</p>
          ) : (
            <div className="add-product-row">
              <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
                <option value="">اختر منتج</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              {selectedProductId && (
                <>
                  <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                    {(Object.keys(productsMap[selectedProductId].sizes || {})).map(sz => (
                      <option key={sz} value={sz}>{sz}</option>
                    ))}
                  </select>
                  <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
                    {(productsMap[selectedProductId].colors || []).map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <input type="number" min={1} value={selectedQty} onChange={(e) => setSelectedQty(e.target.value)} />
                  <button onClick={handleAddItem} className="btn btn-primary">إضافة</button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="summary-row">
          <div>الإجمالي: <span style={{ fontWeight: 700 }}>{formatPrice(totalPrice)}</span></div>
          <div style={{ color: 'var(--text-light)' }}>* سيؤثر الحفظ على المخزون إذا كان الطلب مقبولاً</div>
        </div>
      </div>
    </AdminDialog>
  );
};

export default EditOrderDialog;
