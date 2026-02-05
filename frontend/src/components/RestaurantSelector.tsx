import React, { useState, useEffect } from 'react';

interface Restaurant {
  id: string;
  name: string;
  description?: string;
  slug: string;
}

interface RestaurantSelectorProps {
  selectedRestaurantId: string | null;
  onSelectRestaurant: (restaurantId: string) => void;
}

export function RestaurantSelector({ selectedRestaurantId, onSelectRestaurant }: RestaurantSelectorProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/restaurants');
      const data = await response.json();
      
      if (data.ok && data.data?.shops?.edges) {
        const restaurantList = data.data.shops.edges.map((edge: { node: Restaurant }) => edge.node);
        setRestaurants(restaurantList);
        
        // Auto-select first restaurant if none selected
        if (!selectedRestaurantId && restaurantList.length > 0) {
          onSelectRestaurant(restaurantList[0].id);
        }
      } else {
        // Use fallback restaurants if API fails
        setRestaurants([
          { id: '1', name: 'Main Cafe', slug: 'main-cafe' },
          { id: '2', name: 'Burger Palace', slug: 'burger-palace' },
          { id: '3', name: 'Pizza House', slug: 'pizza-house' },
        ]);
        if (!selectedRestaurantId) {
          onSelectRestaurant('1');
        }
      }
    } catch {
      setError('Failed to load restaurants');
      // Use fallback restaurants
      setRestaurants([
        { id: '1', name: 'Main Cafe', slug: 'main-cafe' },
        { id: '2', name: 'Burger Palace', slug: 'burger-palace' },
        { id: '3', name: 'Pizza House', slug: 'pizza-house' },
      ]);
      if (!selectedRestaurantId) {
        onSelectRestaurant('1');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="restaurant-selector">
        <div className="restaurant-selector-loading">Loading restaurants...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="restaurant-selector">
        <div className="restaurant-selector-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="restaurant-selector">
      <label className="restaurant-selector-label">Select Restaurant:</label>
      <select
        className="restaurant-selector-select"
        value={selectedRestaurantId || ''}
        onChange={(e) => onSelectRestaurant(e.target.value)}
      >
        {restaurants.map((restaurant) => (
          <option key={restaurant.id} value={restaurant.id}>
            {restaurant.name}
          </option>
        ))}
      </select>
    </div>
  );
}
