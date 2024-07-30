import { TodosService } from './todos.service';
import { UpdateTodoDto } from './dto/update-todo.dto';

describe('TodosService', () => {
  let service: TodosService;

  beforeEach(() => {
    service = new TodosService();
  });

  describe('findAll', () => {
    it('should return an empty array initially', () => {
      expect(service.findAll()).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return undefined for a non-existent todo', () => {
      expect(service.findOne(1)).toBeNull();
    });

    it('should return a todo when it exists', () => {
      const todo = service.create('Test Todo');
      expect(service.findOne(todo.id)).toEqual(todo);
    });
  });

  describe('create', () => {
    it('should create a new todo', () => {
      const title = 'New Todo';
      const newTodo = service.create(title);
      expect(newTodo).toEqual({ id: 1, title, completed: false });
      expect(service.findAll()).toContainEqual(newTodo);
    });
  });

  describe('update', () => {
    it('should update an existing todo', () => {
      const todo = service.create('Test Todo');
      const updateDto: UpdateTodoDto = { title: 'Updated Todo', completed: true };

      const updatedTodo = service.update(todo.id, updateDto);
      expect(updatedTodo).toEqual({ id: todo.id, title: 'Updated Todo', completed: true });
      expect(service.findOne(todo.id)).toEqual(updatedTodo);
    });

    it('should return undefined if todo does not exist', () => {
      const updateDto: UpdateTodoDto = { title: 'Updated Todo', completed: true };
      expect(service.update(999, updateDto)).toBeUndefined();
      expect(service.findOne(999)).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove an existing todo', () => {
      const todo = service.create('Test Todo');
      expect(service.remove(todo.id)).toBe(true);
      expect(service.findAll()).not.toContainEqual(todo);
    });

    it('should return false if todo does not exist', () => {
      expect(service.remove(999)).toBe(false);
    });
  });
});
