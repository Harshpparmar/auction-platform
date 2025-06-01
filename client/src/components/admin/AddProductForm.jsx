import { useState } from 'react';

function AddProductForm({ initialValues, onSubmit }) {
    const [formData, setFormData] = useState(initialValues);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            starting_bid: Number(formData.starting_bid)
        });
    };

    return (
        <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Add/Edit Product</h2>
            <p className="text-sm text-gray-500 mb-4">Update the current auction product</p>

            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input
                            type="url"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Starting Bid (₹)</label>
                            <input
                                type="number"
                                name="starting_bid"
                                value={formData.starting_bid}
                                onChange={handleInputChange}
                                min="1"
                                step="1"
                                className="w-full px-3 py-2 border rounded-md"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Highest Bid (₹)</label>
                            <input
                                type="text"
                                value={formData.starting_bid}
                                className="w-full px-3 py-2 border rounded-md bg-gray-100"
                                disabled
                                placeholder="Automatically updated from bids"
                            />
                        </div>
                    </div>

                    <div className="mt-2">
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-md"
                        >
                            Save Product
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AddProductForm;