import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, getActiveProduct, getAdminBids, setActiveProduct, createProduct } from '../services/api';
import AdminTabs from '../components/admin/AdminTabs';
import CurrentProductPanel from '../components/admin/CurrentProductPanel';
import AllProductsPanel from '../components/admin/AllProductsPanel';
import BidsPanel from '../components/admin/BidsPanel';
import AddProductForm from '../components/admin/AddProductForm';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('current');
    const [products, setProducts] = useState([]);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [currentHighestBid, setCurrentHighestBid] = useState(0);
    const [bids, setBids] = useState([]);
    const [bidPagination, setBidPagination] = useState({
        page: 1,
        pages: 1,
        total: 0,
        limit: 10
    });
    const [bidLoading, setBidLoading] = useState(false);
    const [bidFilter, setBidFilter] = useState(null);
    const [bidError, setBidError] = useState(null);
    const [newProduct, setNewProduct] = useState({
        title: '',
        description: '',
        image_url: '',
        starting_bid: ''
    });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [productsRes, activeProductRes] = await Promise.all([
                getAllProducts(),
                getActiveProduct()
            ]);

            setProducts(productsRes.data);
            setCurrentProduct(activeProductRes.data);

            // Set current highest bid if available
            if (activeProductRes.data?.current_highest_bid) {
                setCurrentHighestBid(activeProductRes.data.current_highest_bid);
            } else {
                setCurrentHighestBid(activeProductRes.data?.starting_bid || 0);
            }

            setError(null);
        } catch (err) {
            setError('Failed to fetch data');
            console.error(err);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/admin/login');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const fetchBids = useCallback(async (page = 1, productId = null) => {
        try {
            setBidLoading(true);
            setBidError(null);

            const response = await getAdminBids(page, bidPagination.limit, productId);

            setBids(response.data.bids || []);
            setBidPagination(response.data.pagination || {
                page: 1,
                pages: 1,
                total: 0,
                limit: 10
            });
        } catch (err) {
            setBidError(`Failed to load bids: ${err.message}`);
            setBids([]);
        } finally {
            setBidLoading(false);
        }
    }, [bidPagination.limit]);

    // Load initial data
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Load bids when tab changes
    useEffect(() => {
        if (activeTab === 'bids') {
            fetchBids(1, bidFilter);
        }
    }, [activeTab, bidFilter, fetchBids]);

    const handleSetActive = async (productId) => {
        try {
            await setActiveProduct(productId);
            fetchData();
            setActiveTab('current');
        } catch (err) {
            setError('Failed to set active product');
            console.error(err);
        }
    };

    const handleAddProduct = async (productData) => {
        try {
            const response = await createProduct(productData);
            setProducts(prev => [response.data, ...prev]);
            setNewProduct({
                title: '',
                description: '',
                image_url: '',
                starting_bid: ''
            });
            setActiveTab('current');
            fetchData();
        } catch (err) {
            setError('Failed to create product');
            console.error(err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                    {error}
                </div>
            )}

            <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'current' && (
                <CurrentProductPanel 
                    currentProduct={currentProduct} 
                    currentHighestBid={currentHighestBid}
                    loading={loading}
                    onAddProduct={() => setActiveTab('add')} 
                />
            )}

            {activeTab === 'products' && (
                <AllProductsPanel 
                    products={products} 
                    currentProduct={currentProduct} 
                    loading={loading}
                    onSetActive={handleSetActive}
                    onAddProduct={() => setActiveTab('add')} 
                />
            )}

            {activeTab === 'bids' && (
                <BidsPanel 
                    bids={bids}
                    products={products}
                    bidFilter={bidFilter}
                    setBidFilter={setBidFilter}
                    bidLoading={bidLoading}
                    bidError={bidError}
                    bidPagination={bidPagination}
                    onFetchBids={fetchBids}
                />
            )}

            {activeTab === 'add' && (
                <AddProductForm 
                    initialValues={newProduct}
                    onSubmit={handleAddProduct}
                />
            )}
        </div>
    );
}

export default AdminDashboard;