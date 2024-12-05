import express from 'express';
const router = express.Router();
import { Todo } from '../controllers';
import { body, param, query } from 'express-validator';
import { auth } from '../helper';

router.post(
    '/createTodo',
    [
      auth, 
      body('title')
        .exists()
        .withMessage('Title is required')
        .isLength({ min: 2 })
        .withMessage('Title must be at least 2 characters long'),
  
      body('description')
        .exists()
        .withMessage('Description is required')
        .isLength({ min: 5 })
        .withMessage('Description must be at least 5 characters long'),
  
      body('dueDate')
        .exists()
        .withMessage('Due date is required')
        .isISO8601()
        .withMessage('Invalid date format'),
  
      body('status')
        .optional()
        .isIn(['pending', 'completed'])
        .withMessage('Status must be either "pending" or "completed"')  
      
    ],
    Todo.createTodo 
  );
  
  router.put(
    '/updateTodo/:todoId',  
    [
      auth, 
  
      param('todoId')
        .exists()
        .withMessage('Todo ID is required')
        .isMongoId()
        .withMessage('Invalid Todo ID format'),
  
      body('title')
        .optional()
        .isLength({ min: 2 })
        .withMessage('Title must be at least 2 characters long'),
  
      body('description')
        .optional()
        .isLength({ min: 5 })
        .withMessage('Description must be at least 5 characters long'),
  
      body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format'),
  
      body('status')
        .optional()
        .isIn(['pending', 'completed'])
        .withMessage('Status must be either "pending" or "completed"'),
  
      body('userId')
        .optional()
        .isMongoId()
        .withMessage('Invalid user ID format'),
    ],
    Todo.updateTodoTask 
  );
  
  router.delete(
    '/deleteTodo/:todoId',  
    [
      auth,    
      param('todoId')
        .exists()
        .withMessage('Todo ID is required')
        .isMongoId()
        .withMessage('Invalid Todo ID format'),
    ],
    Todo.deleteTodoTask  
  );
  
  router.get(
    '/getTodoList',
    [
      auth,        
      query('status')
        .optional()
        .isIn(['pending', 'completed'])
        .withMessage('Status must be either "pending" or "completed"'),
  
      query('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format for dueDate'),     
  
      query('pageNumber')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page number must be a positive integer'),
  
      query('perPage')
        .optional()
        .isInt({ min: 1 })
        .withMessage('perPage must be a positive integer'),
  
      query('sortBy')
        .optional()
        .isIn(['title', 'dueDate', 'status', 'updatedAt'])
        .withMessage('Invalid sort field'),
  
      query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Invalid sort order'),
    ],
    Todo.getTodoList  
  );

  router.get(
    '/getTodoHistory',
    [
      auth,   
      query('todoId')
        .optional()
        .isMongoId()
        .withMessage('Invalid Todo ID format'),
  
      query('updatedBy')
        .optional()
        .isMongoId()
        .withMessage('Invalid user ID format'),
  
      query('startDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid start date format'),
  
      query('endDate')
        .optional()
        .isISO8601()
        .withMessage('Invalid end date format'),
  
      query('pageNumber')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page number must be a positive integer'),
  
      query('perPage')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Per page must be a positive integer'),
  
      query('sortBy')
        .optional()
        .isIn(['changes', 'updatedAt'])
        .withMessage('Invalid sort field'),
  
      query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Invalid sort order'),
    ],
    Todo.getTodoHistory  
  );

  export default router;
