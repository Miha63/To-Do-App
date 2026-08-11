const express = require('express');
const app = express();
app.use(express.json());

const fs = require('fs');

const port = 3000;

function getTodos() {
    try {
        const data = fs.readFileSync('data/todos.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
       console.error(err);
        throw err;
    }
}

function saveTodos(todos) {
    fs.writeFileSync('data/todos.json', JSON.stringify(todos, null, 2));
}

function validateToDo(todos) {
  if (typeof todos.name !== 'string' || todos.name.trim().length < 3 || typeof todos.completed !== 'boolean')     
    return false;
  return true;
}

function getAvailableId(todos){
    let id = 1;
    while(todos.some(t => t.id === id)){
        id++;
    }
    return id;
}

app.get('/api/todos',(req, res) => {
    try{
        const todos = getTodos();
        res.json(todos);

    } catch (err) {
        res.status(500).send('Error fetching todos');
    }
});

app.get('/api/todos/search', (req, res) => {
    const todos = getTodos();
    if(!req.query.name) return res.status(400).send('Query parameter "name" is required');

    const search = req.query.name;

    const filteredTodos = todos.filter(todo =>
        todo.name.toLowerCase().includes(search.toLowerCase())
    );
    res.json(filteredTodos);
});

app.get('/api/todos/completed', (req, res) => {

    const todos = getTodos();

    const completedTodos = todos.filter(
        todo => todo.completed === true
    );

    res.json(completedTodos);
});

app.get('/api/todos/incompleted', (req, res) => {

    const todos = getTodos();

    const incompletedTodos = todos.filter(
        todo => todo.completed === false
    );

    res.json(incompletedTodos);
});

app.get('/api/todos/:id', (req, res) => {
  const todos = getTodos();
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).send('Todo not found');
  res.json(todo);
});

app.post('/api/todos', (req, res) => {
    const todos = getTodos();
    const todo = {
        id: getAvailableId(todos),
        name: req.body.name.trim(),
        completed: false
    };
    if (!validateToDo(todo)) {
        return res.status(400).send('Name is required and should be minimum 3 characters.');
    }
   
    todos.push(todo);
    saveTodos(todos);
    res.status(201).json(todo);
});

app.put('/api/todos/:id', (req, res) => {
  const todos = getTodos();
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).send('Todo not found');
  if( !validateToDo(req.body)) return res.status(400).send('Name is required and should be minimum 3 characters.');

  todo.name = req.body.name.trim();
  todo.completed = req.body.completed;
  saveTodos(todos);
  res.json(todo);
});

app.patch('/api/todos/:id/completed',(req,res)=>{
    const todos = getTodos();
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).send('Todo not found');

    todo.completed = true;
    saveTodos(todos);
    res.json(todo);
});

app.patch('/api/todos/:id/incompleted',(req,res)=>{
    const todos = getTodos();
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).send('Todo not found');

    todo.completed = false;
    saveTodos(todos);
    res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  const todos = getTodos();
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).send('Todo not found');

  const index = todos.indexOf(todo);
  todos.splice(index, 1);
  saveTodos(todos);
  res.json(todo);
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});