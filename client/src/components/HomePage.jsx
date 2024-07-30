import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Modal, Form, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const HomePage = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [newTask, setNewTask] = useState({ name: '', description: '', status: '', dueDate: '' });
    const [editTask, setEditTask] = useState({ _id: '', name: '', description: '', status: '', dueDate: '' });
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/tasks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(response.data);
        } catch (err) {
            console.error('Error fetching tasks:', err.response ? err.response.data : err.message);
        }
    };

    const handleShowAddModal = () => setShowAddModal(true);
    const handleCloseAddModal = () => setShowAddModal(false);

    const handleShowDetailsModal = (task) => {
        setSelectedTask(task);
        setShowDetailsModal(true);
    };
    const handleCloseDetailsModal = () => setShowDetailsModal(false);

    const handleShowEditModal = (task) => {
        setEditTask(task);
        setShowEditModal(true);
    };
    const handleCloseEditModal = () => setShowEditModal(false);

    const handleAddTask = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/tasks', newTask, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks([...tasks, response.data]);
            handleCloseAddModal();
        } catch (err) {
            console.error('Error adding task:', err.response ? err.response.data : err.message);
        }
    };

    const handleEditTask = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/api/tasks/${editTask._id}`, {
                name: editTask.name,
                description: editTask.description,
                status: editTask.status,
                dueDate: editTask.dueDate
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updatedTask = response.data;
            setTasks(tasks.map(task => (task._id === updatedTask._id ? updatedTask : task)));
            handleCloseEditModal();
        } catch (err) {
            console.error('Error editing task:', err.response ? err.response.data : err.message);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(tasks.filter(task => task._id !== id));
        } catch (err) {
            console.error('Error deleting task:', err.response ? err.response.data : err.message);
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Tasks Report', 14, 16);

        const tableColumn = ["Task Name", "Description", "Status", "Due Date"];
        const tableRows = tasks.map(task => [
            task.name,
            task.description,
            task.status,
            task.dueDate
        ]);

        doc.autoTable(tableColumn, tableRows, { startY: 30 });
        doc.save('tasks_report.pdf');
    };

    return (
        <Container fluid style={styles.container}>
            <Row style={styles.headerRow}>
                <Col>
                    <h1 style={styles.heading}>Welcome to Tassc</h1>
                </Col>
                <Col>
                    <h6>Tasks</h6>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={handleShowAddModal} style={styles.addButton}>Add Task</Button>
                    <Button variant="secondary" onClick={generatePDF} style={styles.pdfButton}>Export PDF</Button>
                </Col>
            </Row>
            <Table striped bordered hover style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.tableHeader}>Task Name</th>
                        <th style={styles.tableHeader}>Description</th>
                        <th style={styles.tableHeader}>Status</th>
                        <th style={styles.tableHeader}>Due Date</th>
                        <th style={styles.tableHeader}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task._id}>
                            <td style={styles.taskName}>{task.name}</td>
                            <td>{task.description}</td>
                            <td>{task.status}</td>
                            <td>{task.dueDate}</td>
                            <td>
                                <Button variant="info" onClick={() => handleShowDetailsModal(task)}>View</Button>
                                <Dropdown style={{ display: 'inline-block', marginLeft: '10px' }}>
                                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                        Edit
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => handleShowEditModal(task)}>Edit Task</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Button 
                                    variant="danger" 
                                    style={{ marginLeft: '10px' }}
                                    onClick={() => handleDeleteTask(task._id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Add Task Modal */}
            <Modal show={showAddModal} onHide={handleCloseAddModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formTaskName">
                            <Form.Label>Task Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter task name"
                                value={newTask.name}
                                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formTaskDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter task description"
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formTaskStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter task status"
                                value={newTask.status}
                                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formTaskDueDate">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={newTask.dueDate}
                                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddModal}>Close</Button>
                    <Button variant="primary" onClick={handleAddTask}>Add Task</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Task Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formEditTaskName">
                            <Form.Label>Task Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editTask.name}
                                onChange={(e) => setEditTask({ ...editTask, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEditTaskDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editTask.description}
                                onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEditTaskStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                type="text"
                                value={editTask.status}
                                onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEditTaskDueDate">
                            <Form.Label>Due Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={editTask.dueDate}
                                onChange={(e) => setEditTask({ ...editTask, dueDate: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>Close</Button>
                    <Button variant="primary" onClick={handleEditTask}>Save Changes</Button>
                </Modal.Footer>
            </Modal>

            {/* Task Details Modal */}
            <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Task Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTask && (
                        <>
                            <p><strong>Task Name:</strong> {selectedTask.name}</p>
                            <p><strong>Description:</strong> {selectedTask.description}</p>
                            <p><strong>Status:</strong> {selectedTask.status}</p>
                            <p><strong>Due Date:</strong> {selectedTask.dueDate}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDetailsModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

const styles = {
    container: {
        padding: '20px',
    },
    headerRow: {
        marginBottom: '20px',
    },
    heading: {
        fontSize: '24px',
        fontWeight: 'bold',
    },
    addButton: {
        marginRight: '10px',
    },
    pdfButton: {
        marginLeft: '10px',
    },
    table: {
        marginTop: '20px',
    },
    tableHeader: {
        textAlign: 'center',
    },
    taskName: {
        fontWeight: 'bold',
    },
};

export default HomePage;
