import React from 'react';
import type { Product } from '../../types/index.js';

interface CafePageProps {
  products: Array<Product & { emoji: string; description: string }>;
  cart: Map<string, number>;
  onItemClick: (productId: string) => void;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
}

export function CafePage({ products, cart, onItemClick, onIncrement, onDecrement }: CafePageProps) {
  return (
    <section className="cafe-page cafe-items">
      {products.map((product) => {
        const count = cart.get(product.id) || 0;
        const isSelected = count > 0;

        return (
          <div
            key={product.id}
            className={`cafe-item js-item ${isSelected ? 'selected' : ''}`}
            data-item-id={product.id}
            data-item-price={product.pricing.priceRange.start.gross.amount}
            data-item-count={count}
            onClick={() => onItemClick(product.id)}
          >
            <div className="cafe-item-counter js-item-counter">{count || 1}</div>
            <div className="cafe-item-photo">
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
            <div className="cafe-item-label">
              <span className="cafe-item-title">{product.name}</span>
              <span className="cafe-item-price">
                ${(product.pricing.priceRange.start.gross.amount / 100).toFixed(2)}
              </span>
            </div>
            <div className="cafe-item-buttons">
              <button
                className="cafe-item-decr-button js-item-decr-btn button-item ripple-handler"
                onClick={(e) => {
                  e.stopPropagation();
                  onDecrement(product.id);
                }}
              >
                <span className="ripple-mask"><span className="ripple"></span></span>
              </button>
              <button
                className="cafe-item-incr-button js-item-incr-btn button-item ripple-handler"
                onClick={(e) => {
                  e.stopPropagation();
                  onIncrement(product.id);
                }}
              >
                <span className="button-item-label">Add</span>
                <span className="ripple-mask"><span className="ripple"></span></span>
              </button>
            </div>
          </div>
        );
      })}
      
      {/* Shadows */}
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="cafe-item-shadow"></div>
      ))}
    </section>
  );
}
