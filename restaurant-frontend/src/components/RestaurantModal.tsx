// restaurant-frontend/src/components/RestaurantModal.tsx
import { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import type {RestaurantDto} from '../types';

// Définit les "props" (propriétés) que ce composant reçoit de son parent (App.tsx)
interface RestaurantModalProps {
    show: boolean;
    handleClose: () => void;
    handleSubmit: (restaurant: RestaurantDto) => void;
    initialData: RestaurantDto | null; // null pour un ajout, des données pour une édition
}

const emptyForm: RestaurantDto = { name: '', cuisineType: '' };

export function RestaurantModal({ show, handleClose, handleSubmit, initialData }: RestaurantModalProps) {
    // Gère l'état interne du formulaire
    const [formData, setFormData] = useState<RestaurantDto>(emptyForm);

    // Met à jour le formulaire si des données initiales sont fournies (mode édition)
    useEffect(() => {
        setFormData(initialData || emptyForm);
    }, [initialData]);

    // Met à jour l'état quand l'utilisateur tape dans un champ
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Appelle la fonction handleSubmit du parent lorsque le formulaire est soumis
    const onFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleSubmit(formData);
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{initialData ? 'Edit Restaurant' : 'Add New Restaurant'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={onFormSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            autoFocus
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Cuisine Type</Form.Label>
                        <Form.Control
                            type="text"
                            name="cuisineType"
                            value={formData.cuisineType}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Save Changes
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
