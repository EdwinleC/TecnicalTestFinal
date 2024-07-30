const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;
const MONGODB_URI = 'mongodb://localhost:27017/mydatabase';

app.use(cors());
app.use(express.json());


mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

const TaskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    dueDate: { type: Date, required: true },
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);


app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const user = new User({ email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        res.json({ token, userId: user._id });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


const authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) return res.status(401).json({ error: 'No token provided' });


    if (token !== 'static-token') return res.status(401).json({ error: 'Invalid token' });


    req.user = { _id: '64b1b9e8451e8d5c4d95e2b4' }; 
    next();
};


app.post('/api/tasks', authenticate, async (req, res) => {
    const { name, description, status, dueDate } = req.body;
    const userId = req.user._id; 

    try {
        const task = new Task({ userId, name, description, status, dueDate });
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (err) {
        console.error('Error during task creation:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/tasks', authenticate, async (req, res) => {
    const userId = req.user._id; 

    try {
        const tasks = await Task.find({ userId });
        res.json(tasks);
    } catch (err) {
        console.error('Error during task fetch:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/tasks/:id', authenticate, async (req, res) => {
    const userId = req.user._id; 
    const { id } = req.params;

    try {
        const task = await Task.findOne({ _id: id, userId });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (err) {
        console.error('Error during task fetch by ID:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/tasks/:id', authenticate, async (req, res) => {
    const userId = req.user._id; 
    const { id } = req.params;
    const { name, description, status, dueDate } = req.body;

    try {
        const task = await Task.findOneAndUpdate(
            { _id: id, userId },
            { name, description, status, dueDate },
            { new: true }
        );
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (err) {
        console.error('Error during task update:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/tasks/:id', authenticate, async (req, res) => {
    const userId = req.user._id; 
    const { id } = req.params;

    try {
        const task = await Task.findOneAndDelete({ _id: id, userId });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error('Error during task deletion:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:5000`);
});
