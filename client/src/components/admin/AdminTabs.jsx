function AdminTabs({ activeTab, onTabChange }) {
    const tabs = [
        { id: 'current', label: 'Current Product' },
        { id: 'products', label: 'All Products' },
        { id: 'bids', label: 'Bids' },
        { id: 'add', label: 'Add Product' }
    ];

    return (
        <div className="flex border-b mb-6">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`py-2 px-4 ${activeTab === tab.id ? 'border-b-2 rounded-t-sm bg-slate-300 border-slate-500 text-slate-600' : 'text-gray-500'}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

export default AdminTabs;