import { useState, useEffect } from "react";
import { getActiveProduct, getBids, placeBid } from "../services/api";
import { RefreshCw } from 'lucide-react';

function PublicAuction() {
    const [product, setProduct] = useState(null);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bidError, setBidError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const [bidForm, setBidForm] = useState({
        bidder_name: "",
        bidder_email: "",
        amount: ""
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            // Get active product
            const productRes = await getActiveProduct();
            setProduct(productRes.data);

            // Get bids for this product
            if (productRes.data && productRes.data._id) {
                try {
                    const bidsRes = await getBids(productRes.data._id);
                    // Always use an array, even if the response is empty or not an array
                    setBids(Array.isArray(bidsRes.data) ? bidsRes.data : []);
                } catch (bidError) {
                    console.warn('Failed to load bids:', bidError);
                    setBids([]); // Continue with empty bids array
                }
            }

            setError(null);
        } catch (err) {
            setError('Failed to load auction data');
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();

        // poll for updates every 30 seconds
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchData();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBidForm(prev => ({ ...prev, [name]: value }));
    };

    const handleBidSubmit = async (e) => {
        e.preventDefault();

        if (!product) return;

        setBidError(null);

        try {
            const response = await placeBid({
                product_id: product._id,
                bidder_name: bidForm.bidder_name,
                bidder_email: bidForm.bidder_email,
                amount: Number(bidForm.amount)
            });

            // Add new bid to the list
            setBids(prev => [response.data, ...prev]);

            // Reset form
            setBidForm({
                bidder_name: '',
                bidder_email: '',
                amount: ''
            });

        } catch (err) {
            setBidError(err.response?.data?.message || 'Failed to place bid');
            console.error('Bid error', err.response?.data);
        }
    };

    const currentHighestBid = bids.length > 0
        ? Math.max(...bids.map(bid => bid.amount))
        : product?.starting_bid || 0;



    if (loading && !product) return <div className="py-10 flex justify-center items-center">Loading auction...</div>;

    if (error) return <div className="py-10 flex justify-center items-center text-red-500">{error}</div>;

    if (!product) return <div className="py-10 flex justify-center items-center">No active auction found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Product Details - Left Column */}
                <div className="space-y-4">
                    {/* Product Image */}
                    <div className="bg-slate-100 rounded-lg p-6 aspect-[4/3] flex items-center justify-center">
                        {product.image_url ? (
                            <img
                                src={product.image_url}
                                alt={product.title}
                                className="max-w-full max-h-full object-contain"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-200 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                    <circle cx="9" cy="9" r="2"></circle>
                                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Title and Price*/}
                    <div className="flex justify-between items-start">
                        {/* Product Title */}
                        <div className="flex-1">
                            <h2 className="text-xl font-bold">{product.title}</h2>
                            <p className="text-md text-slate-500">Starting bid: <span className="text-xl font-bold">₹{product.starting_bid.toFixed(2)}</span></p>
                        </div>

                        {/* Current Highest Bid */}
                        <div className="text-right">
                            <p className="text-sm text-slate-500">Current highest bid</p>
                            <p className="text-3xl font-bold">₹{currentHighestBid.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Description below title and price */}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                        <h3 className="text-sm font-medium text-slate-700 mb-2">Description</h3>
                        <p className="text-slate-600">{product.description}</p>
                    </div>
                </div>

                {/* Bidding Section - Right Column */}
                <div className="border border-slate-200 rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Place Your Bid</h2>

                    {bidError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                            {bidError}
                        </div>
                    )}

                    <form onSubmit={handleBidSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Your Name</label>
                            <input
                                type="text"
                                name="bidder_name"
                                value={bidForm.bidder_name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Email Address</label>
                            <input
                                type="email"
                                name="bidder_email"
                                value={bidForm.bidder_email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-medium mb-1">Bid Amount (₹)</label>
                            <input
                                type="number"
                                name="amount"
                                value={bidForm.amount}
                                onChange={handleInputChange}
                                min={currentHighestBid + 1}
                                step="1"
                                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                                placeholder={`Min: ₹${currentHighestBid + 1}`}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-slate-800 text-white py-2 px-4 rounded-md hover:bg-slate-850 transition-colors"
                        >
                            Place Bid
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold">Recent Bids</h3>
                            <button
                                onClick={handleRefresh}
                                className="text-slate-500 hover:text-slate-700 flex items-center"
                                disabled={refreshing}
                            >
                                <RefreshCw size={16} className={`mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                        </div>
                        {bids.length === 0 ? (
                            <p className="text-slate-500 text-sm">No bids yet. Be the first!</p>
                        ) : (
                            <ul className="space-y-2">
                                {bids.slice(0, 5).map((bid) => (
                                    <li key={bid._id} className="py-2 border-b border-slate-100 last:border-none">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">{bid.bidder_name}</p>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(bid.created_at).toLocaleString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: true
                                                    })}
                                                </p>
                                            </div>
                                            <span className="font-semibold">₹{bid.amount.toFixed(2)}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}

export default PublicAuction;