import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { HttpException } from '@nestjs/common';

describe('TodosController', () => {
    let controller: TodosController;
    let service: TodosService;

    const mockTodo = { id: 1, title: 'Test Todo' };
    const todosArray = [mockTodo];

    const mockTodosService = {
        findAll: jest.fn(() => todosArray),
        findOne: jest.fn((id) => todosArray.find(todo => todo.id === id)),
        create: jest.fn((title) => ({ id: Date.now(), title })),
        update: jest.fn((id, dto) => ({ id, ...dto })),
        remove: jest.fn((id) => todosArray.find(todo => todo.id === id) !== undefined),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TodosController],
            providers: [
                {
                    provide: TodosService,
                    useValue: mockTodosService,
                },
            ],
        }).compile();

        controller = module.get<TodosController>(TodosController);
        service = module.get<TodosService>(TodosService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of todos', () => {
            expect(controller.findAll()).toEqual(todosArray);
        });

        it('should throw an internal server error if the service fails', () => {
            jest.spyOn(service, 'findAll').mockImplementationOnce(() => {
                throw new Error();
            });
            expect(() => controller.findAll()).toThrow(HttpException);
        });
    });

    describe('findOne', () => {
        it('should return a todo by id', () => {
            expect(controller.findOne(1)).toEqual(mockTodo);
        });

        it('should throw a not found exception if the todo is not found', () => {
            jest.spyOn(service, 'findOne').mockReturnValueOnce(undefined);
            expect(() => controller.findOne(2)).toThrow(HttpException);
        });

        it('should throw an internal server error if the service fails', () => {
            jest.spyOn(service, 'findOne').mockImplementationOnce(() => {
                throw new Error();
            });
            expect(() => controller.findOne(1)).toThrow(HttpException);
        });
    });

    describe('create', () => {
        it('should create a new todo', () => {
            const createTodoDto: CreateTodoDto = { title: 'New Todo' };
            expect(controller.create(createTodoDto)).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    title: createTodoDto.title,
                })
            );
        });

        it('should throw an internal server error if the service fails', () => {
            jest.spyOn(service, 'create').mockImplementationOnce(() => {
                throw new Error();
            });
            expect(() => controller.create({ title: 'New Todo' })).toThrow(HttpException);
        });
    });

    describe('update', () => {
        it('should update an existing todo', () => {
            const updateTodoDto: UpdateTodoDto = { title: 'Updated Todo', completed: true };
            expect(controller.update(1, updateTodoDto)).toEqual(
                expect.objectContaining({
                    id: 1,
                    title: updateTodoDto.title,
                })
            );
        });

        it('should throw a not found exception if the todo is not found', () => {
            jest.spyOn(service, 'findOne').mockReturnValueOnce(undefined);
            const updateTodoDto: UpdateTodoDto = { title: 'Non-existent Todo', completed: true };
            expect(() => controller.update(2, updateTodoDto)).toThrow(HttpException);
        });

        it('should throw an internal server error if the service fails', () => {
            jest.spyOn(service, 'update').mockImplementationOnce(() => {
                throw new Error();
            });
            const updateTodoDto: UpdateTodoDto = { title: 'Todo', completed: true };
            expect(() => controller.update(1, updateTodoDto)).toThrow(HttpException);
        });
    });

    describe('remove', () => {
        it('should remove an existing todo', () => {
            expect(() => controller.remove(1)).not.toThrow();
        });

        it('should throw a not found exception if the todo is not found', () => {
            jest.spyOn(service, 'findOne').mockReturnValueOnce(undefined);
            expect(() => controller.remove(2)).toThrow(HttpException);
        });

        it('should throw an internal server error if the service fails to delete the todo', () => {
            jest.spyOn(service, 'remove').mockReturnValueOnce(false);
            expect(() => controller.remove(1)).toThrow(HttpException);
        });

        it('should throw an internal server error if the service fails', () => {
            jest.spyOn(service, 'remove').mockImplementationOnce(() => {
                throw new Error();
            });
            expect(() => controller.remove(1)).toThrow(HttpException);
        });
    });
});
