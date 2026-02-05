import React from 'react';
import type { Product } from '../../types/index.js';

interface OrderOverviewProps {
  products: Array<Product & { emoji: string; description: string }>;
  cart: Map<string, number>;
  comment: string;
  onCommentChange: (comment: string) => void;
  onEdit: () => void;
}

export function OrderOverview({ products, cart, comment, onCommentChange, onEdit }: OrderOverviewProps) {
  const formatPrice = (amount: number) => `$${(amount / 1000).toFixed(2)}`;

  const orderItems = Array.from(cart.entries()).map(([productId, count]) => {
    const product = products.find(p => p.id === productId);
    return { product, count };
  }).filter(item => item.product && item.count > 0);

  return (
    <section className="cafe-page cafe-order-overview">
      <div className="cafe-block">
        <div className="cafe-order-header-wrap">
          <h2 className="cafe-order-header">Your Order</h2>
          <span className="cafe-order-edit js-order-edit" onClick={onEdit}>Edit</span>
        </div>
        <div className="cafe-order-items">
          {orderItems.map(({ product, count }) => {
            if (!product) return null;
            
            return (
              <div 
                key={product.id} 
                className="cafe-order-item js-order-item"
                data-item-id={product.id}
              >
                <div className="cafe-order-item-photo">
                  <picture className="cafe-item-lottie js-item-lottie">
                    <source
                      type="application/x-tgsticker"
                      srcSet={`./img/tgs/${product.slug}.tgs`}
                    />
                    <img
                      src={`./img/${product.slug}_148.png`}
                      alt={product.name}
                    />
                  </picture>
                </div>
                <div className="cafe-order-item-label">
                  <div className="cafe-order-item-title">
                    {product.name} <span className="cafe-order-item-counter"><span className="js-order-item-counter">{count}</span>x</span>
                  </div>
                  <div className="cafe-order-item-description">{product.description}</div>
                </div>
                <div className="cafe-order-item-price js-order-item-price">
                  {formatPrice(product.pricing.priceRange.start.gross.amount * count)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="cafe-text-field-wrap">
        <textarea
          className="cafe-text-field js-order-comment-field cafe-block"
          rows={1}
          placeholder="Add comment…"
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
        />
        <div className="cafe-text-field-hint">
          Any special requests, details, final wishes etc.
        </div>
      </div>
    </section>
  );
}
