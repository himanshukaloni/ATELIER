export default function ProductCard({ product, index, onAddToCart }) {
    return (
        <div className="product-card" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="product-image">
                <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/400x400?text=${encodeURIComponent(product.name)}`;
                    }}
                />
            </div>
            <div className="product-info">
                <div className="product-category">{product.category}</div>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price">${product.price.toFixed(2)}</div>
                <button
                    className="product-add-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                    }}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
