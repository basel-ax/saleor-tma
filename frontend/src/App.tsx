import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Product } from '../types/index.js';
import { useTMA } from './hooks/useTMA';
import { CafePage } from './components/CafePage';
import { OrderOverview } from './components/OrderOverview';
import { StatusMessage } from './components/StatusMessage';

// Fallback products matching the original cafe
const fallbackProducts: Array<Product & { emoji: string; description: string }> = [
  { id: '1', name: 'Burger', emoji: '🍔', description: 'Meat™', slug: 'burger', pricing: { priceRange: { start: { gross: { amount: 499, currency: 'USD' } } } } },
  { id: '2', name: 'Fries', emoji: '🍟', description: 'Po-ta-toes', slug: 'fries', pricing: { priceRange: { start: { gross: { amount: 149, currency: 'USD' } } } } },
  { id: '3', name: 'Hotdog', emoji: '🌭', description: '0% dog, 100% hot', slug: 'hotdog', pricing: { priceRange: { start: { gross: { amount: 349, currency: 'USD' } } } } },
  { id: '4', name: 'Tako', emoji: '🐙', description: 'Mucho más', slug: 'tako', pricing: { priceRange: { start: { gross: { amount: 399, currency: 'USD' } } } } },
  { id: '5', name: 'Pizza', emoji: '🍕', description: "That's amore", slug: 'pizza', pricing: { priceRange: { start: { gross: { amount: 799, currency: 'USD' } } } } },
  { id: '6', name: 'Donut', emoji: '🍩', description: 'Hole included', slug: 'donut', pricing: { priceRange: { start: { gross: { amount: 149, currency: 'USD' } } } } },
  { id: '7', name: 'Popcorn', emoji: '🍿', description: 'Lights, camera, corn', slug: 'popcorn', pricing: { priceRange: { start: { gross: { amount: 199, currency: 'USD' } } } } },
  { id: '8', name: 'Coke', emoji: '🥤', description: 'The liquid kind', slug: 'coke', pricing: { priceRange: { start: { gross: { amount: 149, currency: 'USD' } } } } },
  { id: '9', name: 'Cake', emoji: '🍰', description: 'Bread substitute', slug: 'cake', pricing: { priceRange: { start: { gross: { amount: 1099, currency: 'USD' } } } } },
  { id: '10', name: 'Icecream', emoji: '🍦', description: 'Cone of shame', slug: 'icecream', pricing: { priceRange: { start: { gross: { amount: 599, currency: 'USD' } } } } },
  { id: '11', name: 'Cookie', emoji: '🍪', description: "Milk's favorite", slug: 'cookie', pricing: { priceRange: { start: { gross: { amount: 399, currency: 'USD' } } } } },
  { id: '12', name: 'Flan', emoji: '🍮', description: 'Flan-tastic', slug: 'flan', pricing: { priceRange: { start: { gross: { amount: 799, currency: 'USD' } } } } },
];

interface CartItem {
  productId: string;
  count: number;
}

function App() {
  const { initialized, mainButton, onMainButtonClick, close } = useTMA();
  const [products] = useState(fallbackProducts);
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const [modeOrder, setModeOrder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [isClosed, setIsClosed] = useState(false);
  const mainButtonCallbackRef = useRef<(() => void) | null>(null);

  // Check if running in Telegram
  useEffect(() => {
    if (!initialized) {
      setIsClosed(true);
      setStatus('Cafe is temporarily closed');
    }
  }, [initialized]);

  // Update main button
  useEffect(() => {
    if (mainButton && initialized) {
      if (modeOrder) {
        if (isLoading) {
          mainButton.setParams({
            text_color: '#fff',
            is_visible: true,
            color: '#65c36d',
          });
          mainButton.showProgress();
        } else {
          mainButton.setParams({
            is_visible: cart.size > 0,
            text: `PAY ${formatPrice(getTotalPrice())}`,
            color: '#31b545',
            text_color: '#fff',
          });
          mainButton.hideProgress();
        }
      } else {
        mainButton.setParams({
          is_visible: cart.size > 0,
          text: 'VIEW ORDER',
          color: '#31b545',
          text_color: '#fff',
        });
        mainButton.hideProgress();
      }
    }
  }, [mainButton, initialized, modeOrder, isLoading, cart, comment]);

  // Handle main button click
  useEffect(() => {
    if (mainButton && mainButtonCallbackRef.current) {
      mainButton.onClick(mainButtonCallbackRef.current);
    }
  }, [mainButton, modeOrder]);

  onMainButtonClick(() => {
    if (!initialized || isLoading || isClosed) return;

    if (modeOrder) {
      handlePlaceOrder();
    } else {
      setModeOrder(true);
    }
  });

  const getTotalPrice = useCallback(() => {
    let total = 0;
    cart.forEach((count, productId) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        total += product.pricing.priceRange.start.gross.amount * count;
      }
    });
    return total;
  }, [cart, products]);

  const formatPrice = (amount: number) => {
    return `$${(amount / 1000).toFixed(2)}`;
  };

  const handleItemClick = (productId: string) => {
    if (isClosed) return;
    
    setCart((prev) => {
      const newCart = new Map(prev);
      const currentCount = newCart.get(productId) || 0;
      if (currentCount === 0) {
        newCart.set(productId, 1);
      } else {
        newCart.delete(productId);
      }
      return newCart;
    });
  };

  const handleIncrement = (productId: string) => {
    if (isClosed || isLoading) return;
    
    setCart((prev) => {
      const newCart = new Map(prev);
      const currentCount = newCart.get(productId) || 0;
      newCart.set(productId, currentCount + 1);
      return newCart;
    });
  };

  const handleDecrement = (productId: string) => {
    if (isClosed || isLoading) return;
    
    setCart((prev) => {
      const newCart = new Map(prev);
      const currentCount = newCart.get(productId) || 0;
      if (currentCount <= 1) {
        newCart.delete(productId);
      } else {
        newCart.set(productId, currentCount - 1);
      }
      return newCart;
    });
  };

  const handlePlaceOrder = async () => {
    if (isLoading || cart.size === 0) return;

    setIsLoading(true);

    const orderData: CartItem[] = [];
    cart.forEach((count, productId) => {
      orderData.push({ productId, count });
    });

    try {
      const response = await fetch('/api/webapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: 'makeOrder',
          order_data: JSON.stringify(orderData),
          comment: comment,
        }),
      });

      const result = await response.json();

      if (result.ok) {
        close?.();
        // Reset cart
        setCart(new Map());
        setModeOrder(false);
        setComment('');
      } else {
        setStatus(result.error || 'Order failed');
      }
    } catch {
      setStatus('Server error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditOrder = () => {
    setModeOrder(false);
  };

  const handleStatusClick = () => {
    setStatus(null);
  };

  if (!initialized) {
    return (
      <div className="cafe-page cafe-items">
        <div className="status-message" onClick={handleStatusClick}>
          <div className="cafe-status js-status shown">{status || 'Loading...'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`cafe-app ${modeOrder ? 'order-mode' : ''}`}>
      <CafePage
        products={products}
        cart={cart}
        onItemClick={handleItemClick}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
      />
      
      <OrderOverview
        products={products}
        cart={cart}
        comment={comment}
        onCommentChange={setComment}
        onEdit={handleEditOrder}
      />

      <StatusMessage
        message={status}
        onClick={handleStatusClick}
        isClosed={isClosed}
      />
    </div>
  );
}

export default App;
