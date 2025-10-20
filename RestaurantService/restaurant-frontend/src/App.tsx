import { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';

// Nos imports personnalisés des fichiers que nous avons créés
import { getRestaurants, createRestaurant, updateRestaurant, deleteRestaurant } from './services/apiService';
import type {Restaurant, RestaurantDto} from './types';
import { RestaurantModal } from './components/RestaurantModal';

function App() {
    // Gère l'état de l'application avec les hooks de React
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fonction pour charger la liste des restaurants depuis le backend
    const fetchRestaurants = async () => {
        try {
            const response = await getRestaurants();
            setRestaurants(response.data);
            setError(null); // Réinitialise l'erreur en cas de succès
        } catch (err) {
            setError('Impossible de charger les restaurants. Le backend est-il démarré ?');
        }
    };

    // Le hook useEffect exécute cette fonction une seule fois au chargement du composant
    useEffect(() => {
        fetchRestaurants();
    }, []);

    // Gère la soumission du formulaire (création ou mise à jour)
    const handleSubmit = async (formData: RestaurantDto) => {
        try {
            if (editingRestaurant) {
                // Mode édition
                await updateRestaurant(editingRestaurant.restaurantId, formData);
            } else {
                // Mode création
                await createRestaurant(formData);
            }
            fetchRestaurants(); // Met à jour la liste
            setShowModal(false); // Ferme le modal
        } catch (err) {
            setError('Erreur lors de la sauvegarde du restaurant.');
        }
    };

    // Gère la suppression d'un restaurant
    const handleDelete = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce restaurant ?')) {
            try {
                await deleteRestaurant(id);
                fetchRestaurants(); // Met à jour la liste
            } catch (err) {
                setError('Erreur lors de la suppression du restaurant.');
            }
        }
    };

    // Fonctions pour ouvrir le modal dans différents modes
    const handleAddNew = () => {
        setEditingRestaurant(null); // Assure que nous sommes en mode "ajout"
        setShowModal(true);
    };

    const handleEdit = (restaurant: Restaurant) => {
        setEditingRestaurant(restaurant); // Passe les données du restaurant au modal
        setShowModal(true);
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Gestion des Restaurants</h1>
                <Button variant="primary" onClick={handleAddNew}>
                    Ajouter un Restaurant
                </Button>
            </div>

            {/* Affiche une alerte en cas d'erreur */}
            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Nom</th>
                    <th>Type de Cuisine</th>
                    <th className="text-end">Actions</th>
                </tr>
                </thead>
                <tbody>
                {restaurants.map((resto) => (
                    <tr key={resto.restaurantId}>
                        <td>{resto.name}</td>
                        <td>{resto.cuisineType}</td>
                        <td className="text-end">
                            <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => handleEdit(resto)}>
                                Modifier
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(resto.restaurantId)}>
                                Supprimer
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {/* Notre composant modal, à qui on passe toutes les fonctions et données nécessaires */}
            <RestaurantModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                handleSubmit={handleSubmit}
                initialData={editingRestaurant ? { name: editingRestaurant.name, cuisineType: editingRestaurant.cuisineType } : null}
            />
        </Container>
    );
}

export default App;

