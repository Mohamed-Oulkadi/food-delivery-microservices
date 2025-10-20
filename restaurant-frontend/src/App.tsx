import { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';

// Our custom imports
import {
    getRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getMenuForRestaurant, // <-- Import new function
} from './services/apiService';
import type {Restaurant, RestaurantDto, Menu} from './types'; // <-- Import Menu
// <-- Import Menu
import { RestaurantModal } from './components/RestaurantModal';
import { MenuModal } from './components/MenuModal'; // <-- Import new component

function App() {
    // ... existing state ...
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
    const [showRestaurantModal, setShowRestaurantModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ▼▼▼ ADD NEW STATE FOR THE MENU MODAL ▼▼▼
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
    const [selectedRestaurantName, setSelectedRestaurantName] = useState('');
    const [isMenuLoading, setIsMenuLoading] = useState(false);

    // ... existing fetchRestaurants function ...
    const fetchRestaurants = async () => {
        try {
            const response = await getRestaurants();
            setRestaurants(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch restaurants. Is the backend running?');
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    // ... existing handleSubmit and handleDelete functions ...
    const handleSubmit = async (formData: RestaurantDto) => {
        try {
            if (editingRestaurant) {
                await updateRestaurant(editingRestaurant.restaurantId, formData);
            } else {
                await createRestaurant(formData);
            }
            fetchRestaurants();
            setShowRestaurantModal(false);
        } catch (err) {
            setError('Failed to save the restaurant.');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this restaurant?')) {
            try {
                await deleteRestaurant(id);
                fetchRestaurants();
            } catch (err) {
                setError('Failed to delete the restaurant.');
            }
        }
    };

    // ... existing modal handlers ...
    const handleAddNew = () => {
        setEditingRestaurant(null);
        setShowRestaurantModal(true);
    };

    const handleEdit = (restaurant: Restaurant) => {
        setEditingRestaurant(restaurant);
        setShowRestaurantModal(true);
    };

    // ▼▼▼ ADD NEW HANDLER FOR VIEWING MENU ▼▼▼
    const handleViewMenu = async (restaurant: Restaurant) => {
        setSelectedRestaurantName(restaurant.name);
        setShowMenuModal(true);
        setIsMenuLoading(true);
        try {
            const response = await getMenuForRestaurant(restaurant.restaurantId);
            setSelectedMenu(response.data);
        } catch (err) {
            setError(`Failed to fetch menu for ${restaurant.name}.`);
            // Close modal on error
            setShowMenuModal(false);
        } finally {
            setIsMenuLoading(false);
        }
    };

    return (
        <Container className="mt-4">
            {/* ... existing header and alert ... */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Restaurant Management</h1>
                <Button variant="primary" onClick={handleAddNew}>
                    Add New Restaurant
                </Button>
            </div>

            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Cuisine Type</th>
                    <th className="text-end">Actions</th>
                </tr>
                </thead>
                <tbody>
                {restaurants.map((resto) => (
                    <tr key={resto.restaurantId}>
                        <td>{resto.name}</td>
                        <td>{resto.cuisineType}</td>
                        <td className="text-end">
                            {/* ▼▼▼ ADD THIS NEW BUTTON ▼▼▼ */}
                            <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleViewMenu(resto)}>
                                View Menu
                            </Button>
                            <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleEdit(resto)}>
                                Edit
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(resto.restaurantId)}>
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {/* ... existing RestaurantModal ... */}
            <RestaurantModal
                show={showRestaurantModal}
                handleClose={() => setShowRestaurantModal(false)}
                handleSubmit={handleSubmit}
                initialData={editingRestaurant ? { name: editingRestaurant.name, cuisineType: editingRestaurant.cuisineType } : null}
            />

            {/* ▼▼▼ ADD THE NEW MENU MODAL ▼▼▼ */}
            <MenuModal
                show={showMenuModal}
                handleClose={() => setShowMenuModal(false)}
                menu={selectedMenu}
                restaurantName={selectedRestaurantName}
                isLoading={isMenuLoading}
            />
        </Container>
    );
}

export default App;