import React, { useEffect, useState } from 'react';
import './Transaction.css';
import { FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

const STATUS_COLORS = {
  Completed: 'completed',
  Pending: 'pending',
  Placed: 'pending',
};

function getMergedItems(transaction) {
  // Try to get product details from localStorage if needed
  let items = transaction.items || transaction.products || [];
  // Debug log
  let txMap = {};
  let txId = transaction._id || transaction.orderId || transaction.transactionId;
  try {
    txMap = JSON.parse(localStorage.getItem('transactionProductsMap') || '{}');
  } catch {}
  console.log('getMergedItems', { transaction, items, txId, txMap });
  if (!items.length || !items[0].name) {
    // Try to merge from localStorage
    if (txId && txMap[txId]) {
      // If backend only gives productId/quantity, merge details
      if (items.length && items[0].productId) {
        // Merge by productId
        return items.map(item => {
          const found = txMap[txId].find(p => p._id === item.productId);
          return found ? { ...found, quantity: item.quantity } : item;
        });
      }
      // If backend gives nothing, just use stored
      return txMap[txId];
    }
  }
  return items;
}

export const Transaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [demoMode, setDemoMode] = useState(false);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('https://fbackend-zhrj.onrender.com/buyers/transactions', {
                    method: 'POST',
                    headers: {
                        'x-access-token': localStorage.getItem('x-access-token'),
                    },
                });
                console.log(localStorage.getItem('x-access-token'));

                if (!response.ok) {
                    throw new Error('Failed to fetch transactions');
                }

                const data = await response.json();
                if (data.result) {
                    setTransactions(data.transactions);
                    console.log(data.transactions);
                } else {
                    setError(data.error || 'Error fetching transactions');
                }
            } catch (error) {
                setError(error.message);
                setDemoMode(true); // Show demo mode if error
            } finally {
                setLoading(false);
            }
        };

        if (localStorage.getItem('x-access-token')) {
            fetchTransactions();
        } else {
            setLoading(false);
        }
    }, []);

    // Demo data for UI preview if needed
    const demoTransactions = [
      {
        _id: 'ORD-DEMO-001',
        createdAt: '2025-06-27T00:00:00Z',
        totalBill: 485,
        status: 'Completed',
        items: [
          {
            image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&w=64',
            name: 'Fresh Apples',
            farmer: { state: 'Himachal Pradesh' },
            quantity: 2,
            price: 120,
          },
          {
            image: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=64',
            name: 'Fresh Tomatoes',
            farmer: { state: 'Maharashtra' },
            quantity: 5,
            price: 45,
          },
        ],
      },
      {
        _id: 'ORD-DEMO-002',
        createdAt: '2025-06-24T00:00:00Z',
        totalBill: 320,
        status: 'Completed',
        items: [
          {
            image: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=64',
            name: 'Alphonso Mangoes',
            farmer: { state: 'Maharashtra' },
            quantity: 1,
            price: 280,
          },
          {
            image: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=64',
            name: 'Fresh Bananas',
            farmer: { state: 'Tamil Nadu' },
            quantity: 1,
            price: 40,
          },
        ],
      },
      {
        _id: 'ORD-DEMO-003',
        createdAt: '2025-06-22T00:00:00Z',
        totalBill: 150,
        status: 'Pending',
        items: [
          {
            image: 'https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=64',
            name: 'Basmati Rice',
            farmer: { state: 'Punjab' },
            quantity: 1,
            price: 150,
          },
        ],
      },
    ];

    const showDemo = demoMode || error;
    const txs = showDemo ? demoTransactions : transactions;

    return (
        <div className="transaction-ui-bg">
            <h2 className="transaction-title">Transaction History</h2>
            <div className="transaction-subtitle">View all your past orders and their status</div>
            {showDemo && (
              <div className="transaction-info-banner">
                <span role="img" aria-label="info">📑</span> Demo Mode: Showing sample transactions<br/>
                <span className="transaction-info-desc">Backend unavailable - displaying demo transaction history</span>
                <button className="transaction-retry-btn" onClick={()=>window.location.reload()}>Retry API</button>
              </div>
            )}
            <div className="transaction-list">
              {loading ? (
                <div className="transaction-loading">Loading transactions...</div>
              ) : txs.length === 0 ? (
                <div className="transaction-empty">No transactions found.</div>
              ) : (
                txs.map((transaction, idx) => {
                  const mergedItems = getMergedItems(transaction);
                  return (
                  <div className="transaction-card-green" key={transaction._id || idx}>
                    <div className="transaction-card-header-green">
                      <div className="transaction-card-header-left">
                        <span className="transaction-order-id-green">Order <b>#{transaction._id}</b></span>
                        <span className="transaction-date-green"><FaCalendarAlt className="transaction-icon-green" /> {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'Invalid Date'}</span>
                      </div>
                      <div className="transaction-card-header-right">
                        <span className="transaction-total-green">₹{transaction.totalBill?.toFixed(2) || '0.00'}</span>
                        {transaction.status === 'Completed' && <FaCheckCircle className="transaction-check-green" />}
                        <span className={`transaction-status-badge-green ${STATUS_COLORS[transaction.status] || 'pending'}`}>{transaction.status || 'Placed'}</span>
                      </div>
                    </div>
                    <div className="transaction-items-title-green">Items Ordered:</div>
                    <div className="transaction-items-list-green">
                      {mergedItems.length === 0 ? (
                        <div className="transaction-no-items">No product details found for this order.</div>
                      ) : (
                        mergedItems.map((item, i) => (
                          <div className="transaction-item-row-green" key={i}>
                            <img
                              className="transaction-item-img-green"
                              src={
                                item.image
                                  ? item.image.startsWith('http')
                                    ? item.image
                                    : `https://fbackend-zhrj.onrender.com${item.image}`
                                  : 'https://via.placeholder.com/64'
                              }
                              alt={item.name}
                            />
                            <div className="transaction-item-details-green">
                              <div className="transaction-item-name-green">{item.name}</div>
                              <div className="transaction-item-state-green">{item.farmer?.state}</div>
                            </div>
                            <div className="transaction-item-qtyprice-green">
                              <div className="transaction-item-qty-green">{item.quantity} × ₹{item.price}</div>
                              <div className="transaction-item-total-green">= ₹{(item.quantity * item.price).toFixed(2)}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )})
              )}
            </div>
        </div>
    );
};
