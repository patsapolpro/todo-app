import { Injectable } from '@nestjs/common';
import { UpdateTodoDto } from './dto/update-todo.dto';

export interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

@Injectable()
export class TodosService {
    private todos: Todo[] = [];
    private nextId = 1;

    findAll(): Todo[] {
        return this.todos;
    }

    findOne(id: number): Todo | undefined| null {
        return this.todos.find(todo => todo.id === id) || null;;
    }

    create(title: string): Todo {
        const newTodo: Todo = {
            id: this.nextId++,
            title,
            completed: false,
        };
        this.todos.push(newTodo);
        return newTodo;
    }

    update(id: number, updateTodoDto: UpdateTodoDto): Todo | undefined {
        const todo = this.findOne(id);
        if (todo) {
            todo.title = updateTodoDto.title;
            todo.completed = updateTodoDto.completed;
            return todo;
        }
    }

    remove(id: number): boolean {
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            this.todos.splice(index, 1);
            return true;
        }
        return false;
    }
}
