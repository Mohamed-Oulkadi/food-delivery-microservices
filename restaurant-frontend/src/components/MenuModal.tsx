import { Modal, Table, Spinner } from 'react-bootstrap';
import type {Menu} from '../types';

interface MenuModalProps {
    show: boolean;
    handleClose: () => void;
    menu: Menu | null;
    restaurantName: string;
    isLoading: boolean;
}

export function MenuModal({ show, handleClose, menu, restaurantName, isLoading }: MenuModalProps) {
    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Menu for {restaurantName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isLoading ? (
                    <div className="text-center">
                        <Spinner animation="border" />
                        <p>Loading menu...</p>
                    </div>
                ) : (
                    <Table striped bordered hover responsive="sm">
                        <thead>
                        <tr>
                            <th>Item</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Available</th>
                        </tr>
                        </thead>
                        <tbody>
                        {menu?.items && menu.items.length > 0 ? (
                            menu.items.map((item) => (
                                <tr key={item.menuItemId}>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>${item.price.toFixed(2)}</td>
                                    <td>{item.isAvailable ? 'Yes' : 'No'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center">This restaurant has no menu items yet.</td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                )}
            </Modal.Body>
        </Modal>
    );
}