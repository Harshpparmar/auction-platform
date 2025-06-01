function AllProductsPanel({ products, currentProduct, loading, onSetActive, onAddProduct }) {
    return (
        <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">All Products</h2>
            <p className="text-sm text-gray-500 mb-4">View all available products</p>

            {loading ? (
                <div className="py-8 text-center">
                    <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading products...</p>
                </div>
            ) : products.length > 0 ? (
                <div className="space-y-4">
                    {products.map(product => (
                        <div
                            key={product._id}
                            className={`border rounded-lg p-4 ${currentProduct?._id === product._id ? 'border-blue-500 bg-blue-50' : ''}`}
                        >
                            <div className="flex items-start">
                                <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0 mr-4 overflow-hidden">
                                    {product.image_url ? (
                                        <img
                                            src={product.image_url}
                                            alt={product.title}
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://images.pexels.com/photos/8534233/pexels-photo-8534233.jpeg?auto=compress&cs=tinysrgb&w=600"; // Fallback image path
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-medium">{product.title}</h3>
                                    <p className="text-sm text-gray-600 line-clamp-2 my-1">{product.description}</p>
                                    <div className="mt-2">
                                        <p className="text-sm">
                                            <span className="text-gray-500">Starting bid:</span> ₹{product.starting_bid.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 ml-4 flex flex-col items-end space-y-2">
                                    {currentProduct?._id === product._id ? (
                                        <span className="inline-block px-3 py-1 bg-slate-100 border border-slate-800 text-slate-800 text-xs font-medium rounded-md">
                                            Currently Active
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => onSetActive(product._id)}
                                            className="px-3 py-1 bg-slate-700 text-white text-xs rounded hover:bg-slate-800"
                                        >
                                            Set Active
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-8 text-center">
                    <p className="text-gray-500">No products found. Add your first product!</p>
                    <button
                        onClick={onAddProduct}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Add Product
                    </button>
                </div>
            )}
        </div>
    );
}

export default AllProductsPanel;