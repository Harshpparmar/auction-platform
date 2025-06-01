function BidsPanel({ bids, products, bidFilter, setBidFilter, bidLoading, bidError, bidPagination, onFetchBids }) {
    return (
        <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Auction Bids</h2>
            {bidError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {bidError}
                </div>
            )}

            {/* Filter controls */}
            <div className="mb-4 flex items-center space-x-2">
                <select
                    className="border rounded px-3 py-2 flex-grow"
                    value={bidFilter || ""}
                    onChange={(e) => {
                        const value = e.target.value || null;
                        setBidFilter(value);
                        onFetchBids(1, value);
                    }}
                >
                    <option value="">All Products</option>
                    {products.map(product => (
                        <option key={product._id} value={product._id}>
                            {product.title}
                        </option>
                    ))}
                </select>

                <button
                    onClick={() => onFetchBids(1, bidFilter)}
                    className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700"
                >
                    Refresh
                </button>
            </div>

            {bidLoading ? (
                <div className="py-8 text-center">
                    <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading bids...</p>
                </div>
            ) : bids.length > 0 ? (
                <>
                    {/* Bids Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Bidder</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Product</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {bids.map(bid => (
                                    <tr key={bid._id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div>
                                                <p className="font-medium">{bid.bidder_name}</p>
                                                <p className="text-sm text-gray-500">{bid.bidder_email}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center">
                                                {bid.product_id?.image_url && (
                                                    <div className="w-8 h-8 mr-3 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={bid.product_id.image_url}
                                                            alt={bid.product_id.title}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                )}
                                                <span>{bid.product_id?.title || "Unknown Product"}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 font-medium">₹{bid.amount.toFixed(2)}</td>
                                        <td className="py-3 px-4 text-gray-500">
                                            {new Date(bid.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between mt-6">
                        <p className="text-gray-600 text-sm">
                            Showing {((bidPagination.page - 1) * bidPagination.limit) + 1} to {Math.min(bidPagination.page * bidPagination.limit, bidPagination.total)} of {bidPagination.total} bids
                        </p>

                        <div className="flex space-x-1">
                            <button
                                onClick={() => onFetchBids(1, bidFilter)}
                                disabled={bidPagination.page === 1}
                                className={`px-3 py-1 rounded ${bidPagination.page === 1 ? 'bg-slate-100 text-slate-400' : 'bg-slate-200 hover:bg-slate-300'}`}
                            >
                                First
                            </button>
                            <button
                                onClick={() => onFetchBids(bidPagination.page - 1, bidFilter)}
                                disabled={bidPagination.page === 1}
                                className={`px-3 py-1 rounded ${bidPagination.page === 1 ? 'bg-slate-100 text-slate-400' : 'bg-slate-200 hover:bg-slate-300'}`}
                            >
                                Prev
                            </button>

                            {/* Page numbers */}
                            <div className="flex space-x-1">
                                {[...Array(Math.min(5, bidPagination.pages))].map((_, i) => {
                                    // Logic to show pages around current page
                                    let pageNum;
                                    if (bidPagination.pages <= 5) {
                                        pageNum = i + 1;
                                    } else if (bidPagination.page <= 3) {
                                        pageNum = i + 1;
                                    } else if (bidPagination.page >= bidPagination.pages - 2) {
                                        pageNum = bidPagination.pages - 4 + i;
                                    } else {
                                        pageNum = bidPagination.page - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => onFetchBids(pageNum, bidFilter)}
                                            className={`px-3 py-1 rounded ${bidPagination.page === pageNum
                                                ? 'bg-slate-600 text-white'
                                                : 'bg-slate-200 hover:bg-slate-300'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => onFetchBids(bidPagination.page + 1, bidFilter)}
                                disabled={bidPagination.page === bidPagination.pages}
                                className={`px-3 py-1 rounded ${bidPagination.page === bidPagination.pages
                                    ? 'bg-slate-100 text-slate-400'
                                    : 'bg-slate-200 hover:bg-slate-300'}`}
                            >
                                Next
                            </button>
                            <button
                                onClick={() => onFetchBids(bidPagination.pages, bidFilter)}
                                disabled={bidPagination.page === bidPagination.pages}
                                className={`px-3 py-1 rounded ${bidPagination.page === bidPagination.pages
                                    ? 'bg-slate-100 text-slate-400'
                                    : 'bg-slate-200 hover:bg-slate-300'}`}
                            >
                                Last
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="py-12 text-center">
                    <p className="text-slate-500 mb-4">No bids found.</p>
                    {bidFilter && (
                        <button
                            onClick={() => {
                                setBidFilter(null);
                                onFetchBids(1, null);
                            }}
                            className="text-slate-600 hover:underline"
                        >
                            Clear filter and show all bids
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default BidsPanel;