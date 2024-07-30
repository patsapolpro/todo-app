import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { TodosService, Todo } from './todos.service';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { CreateTodoDto } from './dto/create-todo.dto';

@Controller('todos')
export class TodosController {
    constructor(private readonly todosService: TodosService) { }

    @Get()
    findAll(): Todo[] {
        try {
            return this.todosService.findAll();
        } catch (error) {
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Todo | undefined {
        try {
            const todo = this.todosService.findOne(id);
            if (!todo) {
                throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
            }
            return todo;
        } catch (error) {
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createTodoDto: CreateTodoDto): Todo {
        try {
            return this.todosService.create(createTodoDto.title);
        } catch (error) {
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTodoDto: UpdateTodoDto,
    ): Todo {
        try {
            const todo = this.todosService.findOne(id);
            if (!todo) {
                throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
            }
            return this.todosService.update(id, updateTodoDto);
        } catch (error) {
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): void {
        try {
            const todo = this.todosService.findOne(id);
            if (!todo) {
                throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
            }
            const deleted = this.todosService.remove(id);
            if (!deleted) {
                throw new HttpException('Failed to delete todo', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (error) {
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
