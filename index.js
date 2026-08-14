const express = require('express');
const app = express();
const fs = require('fs').promises;
const { randomUUID } = require('crypto');
app.use(express.json());

const port = 3000;


async function getTodos() {
    try {
        const data = await fs.readFile('data/todos.json', 'utf8');

        return JSON.parse(data);

    } catch (err) {
        console.error(err);
        throw err;
    }
}


async function saveTodos(todos) {
    await fs.writeFile(
        'data/todos.json',
        JSON.stringify(todos, null, 2)
    );
}

function validateToDo(todo) {
    if (
        typeof todo.name !== 'string' ||
        todo.name.trim().length < 3 ||
        typeof todo.completed !== 'boolean'
    ) {
        return false;
    }

    return true;
}


app.get('/api/todos', async (req, res) => {

    try {
        const todos = await getTodos();

        res.json(todos);

    } catch (err) {
        res.status(500).send('Error fetching todos');
    }

});

app.get('/api/todos/search', async (req, res) => {

    try {
        const todos = await getTodos();

        if (!req.query.name) {
            return res
                .status(400)
                .send('Query parameter "name" is required');
        }

        const search = req.query.name;

        const filteredTodos = todos.filter(todo =>
            todo.name
                .toLowerCase()
                .includes(search.toLowerCase())
        );

        res.json(filteredTodos);

    } catch (err) {
        res.status(500).send('Error searching todos');
    }

});

app.get('/api/todos/completed', async (req, res) => {

    try {
        const todos = await getTodos();

        const completedTodos = todos.filter(
            todo => todo.completed === true
        );

        res.json(completedTodos);

    } catch (err) {
        res.status(500).send('Error fetching completed todos');
    }

});

app.get('/api/todos/incompleted', async (req, res) => {

    try {
        const todos = await getTodos();

        const incompletedTodos = todos.filter(
            todo => todo.completed === false
        );

        res.json(incompletedTodos);

    } catch (err) {
        res.status(500).send('Error fetching incompleted todos');
    }

});

app.get('/api/todos/:id', async (req, res) => {

    try {
        const todos = await getTodos();

        const todo = todos.find(
            t => t.id === req.params.id
        );

        if (!todo) {
            return res.status(404).send('Todo not found');
        }

        res.json(todo);

    } catch (err) {
        res.status(500).send('Error fetching todo');
    }

});

app.post('/api/todos', async (req, res) => {

    try {
        const todos = await getTodos();

        const todo = {
            id: randomUUID(),
            name: req.body.name.trim(),
            completed: false
        };

        if (!validateToDo(todo)) {
            return res
                .status(400)
                .send('Name is required and should be minimum 3 characters.');
        }

        todos.push(todo);

        await saveTodos(todos);

        res.status(201).json(todo);

    } catch (err) {
        res.status(500).send('Error creating todo');
    }

});

app.put('/api/todos/:id', async (req, res) => {

    try {
        const todos = await getTodos();

        const todo = todos.find(
            t => t.id === req.params.id
        );

        if (!todo) {
            return res.status(404).send('Todo not found');
        }

        if (!validateToDo(req.body)) {
            return res
                .status(400)
                .send('Name is required and should be minimum 3 characters.');
        }

        todo.name = req.body.name.trim();
        todo.completed = req.body.completed;

        await saveTodos(todos);

        res.json(todo);

    } catch (err) {
        res.status(500).send('Error updating todo');
    }

});

app.patch('/api/todos/:id/completed', async (req, res) => {

    try {
        const todos = await getTodos();

        const todo = todos.find(
            t => t.id === req.params.id
        );

        if (!todo) {
            return res.status(404).send('Todo not found');
        }

        todo.completed = true;

        await saveTodos(todos);

        res.json(todo);

    } catch (err) {
        res.status(500).send('Error completing todo');
    }

});

app.patch('/api/todos/:id/incompleted', async (req, res) => {

    try {
        const todos = await getTodos();

        const todo = todos.find(
            t => t.id === req.params.id
        );

        if (!todo) {
            return res.status(404).send('Todo not found');
        }

        todo.completed = false;

        await saveTodos(todos);

        res.json(todo);

    } catch (err) {
        res.status(500).send('Error marking todo as incomplete');
    }

});

app.delete('/api/todos/:id', async (req, res) => {

    try {
        const todos = await getTodos();

        const todo = todos.find(
            t => t.id === req.params.id
        );

        if (!todo) {
            return res.status(404).send('Todo not found');
        }

        const index = todos.indexOf(todo);

        todos.splice(index, 1);

        await saveTodos(todos);

        res.json(todo);

    } catch (err) {
        res.status(500).send('Error deleting todo');
    }

});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    });