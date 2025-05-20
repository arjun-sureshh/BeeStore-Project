import React from "react";
import { useLocation } from "react-router-dom";

const SearchResults: React.FC = () => {
  const { state } = useLocation();
  const results = state?.results || [];

  return (
    <div>
      <h1>Search Results</h1>
      {results.length > 0 ? (
        <div>
          {results.map((product: any, index: number) => (
            <div key={index}>
              <h3>{product.productTitle}</h3>
              <p>Price: ${product.sellingPrice}</p>
              <p>Brand: {product.brandName}</p>
              {product.image && (
                <img
                  src={product.image}
                  alt={product.productTitle}
                  width="100"
                />
              )}
              <hr />
            </div>
          ))}
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;
