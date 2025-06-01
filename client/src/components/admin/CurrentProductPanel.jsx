function CurrentProductPanel({ currentProduct, currentHighestBid, loading, onAddProduct }) {
    return (
        <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Current Auction Product</h2>

            {loading ? (
                <div className="py-8 text-center">
                    <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading...</p>
                </div>
            ) : currentProduct ? (
                <div>
                    <div className="aspect-video mb-4 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                        {currentProduct.image_url ? (
                            <img
                                src={currentProduct.image_url}
                                alt={currentProduct.title}
                                className="max-h-full max-w-full object-contain"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://images.pexels.com/photos/8534233/pexels-photo-8534233.jpeg?auto=compress&cs=tinysrgb&w=600"; // Fallback image path
                                }}
                            />
                        ) : (
                            <div className="text-gray-400">No image available</div>
                        )}
                    </div>
                    <h3 className="text-lg font-medium">{currentProduct.title}</h3>
                    <p className="text-gray-600 my-2">{currentProduct.description}</p>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <p className="text-sm text-gray-500">Starting Bid</p>
                            <p className="text-lg font-bold">₹{currentProduct.starting_bid.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Current Highest Bid</p>
                            <p className="text-lg font-bold">₹{currentHighestBid.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="py-8 text-center">
                    <p className="text-gray-500">No active product. Add a new product to start an auction.</p>
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

export default CurrentProductPanel;