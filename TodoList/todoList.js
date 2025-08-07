// Step 1: Setup readline and todo array
const readline = require('readline');

const readToUser = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

// Initialize an empty array to store todos
let todos = [];

// Step 2: CRUD Functions (using arrow functions)
const showMenu = () => {
	console.log('\n--- Todo List Menu ---');
	console.log('1. Create Todo');
	console.log('2. List Todos');
	console.log('3. Update Todo');
	console.log('4. Delete Todo');
	console.log('5. Exit');
	readToUser.question('Choose an option (1-5): ', handleMenu);
};

// Handle user input for the menu options using a switch cases. 
const handleMenu = (option) => {
	switch (option.trim()) {
		case '1':
			createTodo();
			break;
		case '2':
			listTodos();
			break;
		case '3':
			updateTodo();
			break;
		case '4':
			deleteTodo();
			break;
		case '5':
			readToUser.close();
			break;
		default:
			console.log('Invalid option. Try again.');
			showMenu();
	}
};

// Function to create a new todo
const createTodo = () => {
	readToUser.question('Enter new todo: ', (input) => {
		if (input.trim()) {
			todos.push(input.trim());
			console.log('Todo added!');
		} else {
			console.log('Cannot add empty todo.');
		}
		showMenu();
	});
};

// Function to list all todos
const listTodos = () => {
	console.log('\n--- Todos ---');
	if (todos.length === 0) {
		console.log('No todos yet.');
	} else {
		todos.forEach((todo, index) => {
			console.log(`${index + 1}. ${todo}`);
		});
	}
	showMenu();
};

// Function to update an existing todo
const updateTodo = () => {
    if (todos.length === 0) {
        console.log('No todos to update.');
        showMenu();
        return;
    }

    todos.forEach((todo, index) => {
        console.log(`${index + 1}. ${todo}`);
    });

    //number to update
    readToUser.question('Enter the number of the todo to update: ', (input) => {
        const index = parseInt(input) - 1;

        if (isNaN(index) || index < 0 || index >= todos.length) {
            console.log('Invalid number.');
            showMenu();
            return;
        }

        readToUser.question('Enter the updated todo text: ', (newText) => {
            if (newText.trim()) {
                todos[index] = newText.trim();
                console.log('Todo updated!');
            } else {
                console.log('Cannot update with empty text.');
            }
            showMenu();
        });
    });
};


//Function to delete a todo
const deleteTodo = () => {
    if (todos.length === 0) {
        console.log('No todos to delete.');
        showMenu();
        return;
    }

    todos.forEach((todo, index) => {
        console.log(`${index + 1}. ${todo}`);
    });

    readToUser.question('Enter the number of the todo to delete: ', (num) => {
        const index = parseInt(num) - 1;

        if (isNaN(index) || index < 0 || index >= todos.length) {
            console.log('Invalid number.');
        } else {
            const removed = todos.splice(index, 1);
            console.log(`Deleted: "${removed[0]}"`);
        }
        showMenu();
    });
};


// Step 3: Start the app
console.log('Welcome to the Interactive Todo List!');
showMenu();
