function todolist() {
    let ul, input;
    let todos = [];

    const todosFromlocalStorage = () =>{
        const localTodos = localStorage.getItem('todos');
        if(localTodos){
            const todoArr = JSON.parse(localTodos);
            if(todoArr){
                todos = todoArr;
            }
        }
    };

    const saveTodos = ()=>{
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const createLi = ({text, id, completed})=>{
        /*
        <li class="completed">
            <span class="completed"></span>
            Todo
            <span class='cross'></span>
        </li>
        */
       const li = document.createElement('li');
       //li.classList.add(completed ? 'completed' : 'uncompleted');
       //soluzione temporanea allo spancheck
       li.id = 'todo-' + id;
       li.classList.add(completed ? 'completed' : 'uncompleted')

       const spanCheck = document.createElement('span');
       spanCheck.classList.add(completed ? 'completed' : 'uncompleted');
       //Operatore condizionale (ternary)

       spanCheck.addEventListener('click', (evt)=>{
        toggleTodo(id, evt.target);
        });


       const spanCross = document.createElement('span');
       spanCross.classList.add('cross');
       spanCross.addEventListener('click', (evt)=>{
           removeTodo(id);
       });

       const textNode = document.createTextNode(text);
       li.appendChild(spanCheck);
       li.appendChild(textNode);
       li.appendChild(spanCross);

       return li;
    };

    const renderTodolist = ()=>{
        todosFromlocalStorage();
        ul = document.querySelector('ul#todolist');
        if(!ul){        //Se ul non esiste viene creata
            ul = document.createElement('ul');
            ul.id = 'todolist';
            document.body.appendChild(ul);
        }
        renderTodos('all');

        input = document.querySelector('#todo');
        if(!input){
            input = document.createElement('input');
            input.id = 'todo';
            input.name = 'todo';
            input.placeholder = 'Add new to do';
            ul.parentNode.insertBefore(input, ul);
        }
        input.addEventListener('keyup', addTodo);   //Si passa solo il riferimento alla funzione
        //senza tonde
        document.querySelector('#btnAll').addEventListener('click', e => {
            activeButton('btnAll');
            renderTodos('all');
        });
        document.querySelector('#btnCompleted').addEventListener('click', e => {
            activeButton('btnCompleted');
            renderTodos('completed');
        });
        document.querySelector('#btnTodo').addEventListener('click', e => {
            activeButton('btnTodo');
            renderTodos('uncompleted');
        });
    };

    const activeButton = id =>{
        const buttons = document.getElementsByTagName('button');
        for(let button of buttons){
            if(button.id === id){
                button.classList.replace('unactive', 'active');
            }
            else{
                button.classList.replace('active', 'unactive');
            }
        }
    }

    const renderTodos = (todoType)=>{
        const lis = ul.querySelectorAll('li');
        if(lis){
            lis.forEach(li=>ul.removeChild(li));
        }
        const currentTodos = todos.filter(todo => {
            if(todoType === 'all'){
                return todo;
            }
            return (todoType === 'completed') ? todo.completed : !todo.completed;
        });
        currentTodos.map(todo => createLi(todo))
        .forEach(li => ul.appendChild(li));
 
    };

    const removeTodo = id=>{
         todos = todos.filter(todo => todo.id !== id);
         saveTodos();
         ul.removeChild(ul.querySelector('#todo-' + id));
    };

    const toggleTodo = (id, ele)=>{
        todos = todos.map(ele => {
            if(ele.id === id){
                ele.completed = !ele.completed;
            }
            return ele;
        });
        
        saveTodos();
        const oldClass = ele.classList.contains('completed') ? 'completed' : 'uncompleted';
        const newClass = oldClass === 'completed' ? 'uncompleted' : 'completed';
        ele.classList.replace(oldClass, newClass);
        ele.parentNode.classList.toggle('completed');
    };

    const addTodo = (evt)=>{
        const key = evt.keyCode     //Keycode del tasto invio della tastiera
        const ele = evt.target;

        if(key===13 && ele.value.trim().length > 2){
            const todo = {
                text: ele.value.trim(),
                id: todos.length,
                completed: false
            }
            addNewTodo(todo);
            ele.value = '';
        }
    };

    const addNewTodo = (todo)=>{
        todos.unshift(todo); //posiziona l'elemento all'inizio dell'array invece che alla fine
        saveTodos();
        const li = createLi(todo);
        const firstLi = ul.firstChild;
        if(!firstLi){
            ul.appendChild(li);
        }
        else{
            ul.insertBefore(li, firstLi);
        }
    };

    return {
        getTodo: function(){
            return todos; // mi da accesso all'array todos anche da fuori della
            //funzione
        },
        init: function(){
            renderTodolist();
        }
    };
    
}

const myTodo = todolist();
myTodo.getTodo(); // myTodo è un oggetto e ha accesso all'array todos
myTodo.init();
