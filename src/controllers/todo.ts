import { todoModel, todoHistoryModel } from "../models/index";
import { services, statusCode } from "../helper";
import { RequestError } from "../error/error";
import {  Response, NextFunction } from "express";

const send = services.setResponse;

class Todo{
    static createTodo = async (req: any, res: Response, next: NextFunction): Promise<void> => {
        try {
          if (services.hasValidatorErrors(req, res)) {
            return;
          }         

          const userId  = req?.user?._id
    
          const newTodo = new todoModel({
            title: req.body.title,
            description: req.body.description,
            dueDate: req.body.dueDate,
            status: req.body.status || 'pending', 
            userId: userId,
            createdBy: req.user._id,  
            isDeleted: false,  
          });
    
          const savedTodo = await newTodo.save();
   

          await this.createTodoHistory(savedTodo?._id, userId, `Created new Todo : ${savedTodo?.title}`, new Date() )
    
          return send(
            res,
            statusCode.SUCCESSFUL,
            "Todo created successfully",
            { todoId: savedTodo._id }
          );
        } catch (error) {
          next(error);
        }
      };

      static getTodoList = async (req: any, res: Response, next: NextFunction): Promise<void> => {
        try {
          const { status, dueDate, pageNumber = 1, perPage = 10 } = req.query;
          const userId = req.user._id
    
          let filter: any = { isDeleted: false };
    
          if (status) {
            filter.status = status; 
          }
    
          if (userId) {
            filter.userId = userId;  
          }
    
          if (dueDate) {
            filter.dueDate = {
              $eq: new Date(dueDate), 
            };
          }
    
          const page = parseInt(pageNumber as string, 10);
          const limit = parseInt(perPage as string, 10);
    
          const todos = await todoModel.find(filter)
            .skip((page - 1) * limit)
            .limit(limit);
    
          const totalCount = await todoModel.countDocuments(filter);
    
          const dataList = services.paginateResponse(todos, { page, limit }, totalCount);
    
          return send(
            res,
            statusCode.SUCCESSFUL,
            'Todos fetched successfully',
            dataList
          );
        } catch (error) {
          next(error);
        }
      };

      static deleteTodoTask = async (req: any, res: Response, next: NextFunction): Promise<void> => {
        try {
          const { todoId } = req.params;
          const userId  = req?.user?._id
    
          const todo = await todoModel.findOne({ _id: todoId, isDeleted: false });
    
          if (!todo) {
            throw new RequestError(statusCode.NOT_FOUND, 'Todo task not found');
          }
    
          todo.isDeleted = true;
          await todo.save();

          await this.createTodoHistory(todo?._id, userId, `Deleted Todo : ${todo?.title}`, new Date() )
    
          return send(res, statusCode.SUCCESSFUL, 'Todo task deleted successfully', {
            todoId: todo._id,
          });
        } catch (error) {
          next(error);
        }
      };      


    static updateTodoTask = async (req: any, res: Response, next: NextFunction): Promise<void> => {
        try {
        const { todoId } = req.params;
            const userId  = req?.user?._id
        const { title, description, dueDate, status } = req.body;

        const todo = await todoModel.findOne({ _id: todoId, isDeleted: false });

        if (!todo) {
            throw new RequestError(statusCode.NOT_FOUND, 'Todo task not found');
        }

        if (title) todo.title = title;
        if (description) todo.description = description;
        if (dueDate) todo.dueDate = new Date(dueDate);  
        if (status) todo.status = status;

        const updatedTodo = await todo.save();

        await this.createTodoHistory(updatedTodo?._id, userId, `Updated Todo : ${updatedTodo?.title}, changed ${title && 'In title field: ' + title || description && 'In description field:  ' +  description || dueDate &&  "In dueDate Field:  " + dueDate || status && "In status Field: " +  status} `, new Date() )

        return send(res, statusCode.SUCCESSFUL, 'Todo task updated successfully', {
            todoId: updatedTodo._id,
            updatedData: updatedTodo,
        });
        } catch (error) {
        next(error);
        }
    };

    static getTodoHistory = async (req: any, res: Response, next: NextFunction): Promise<void> => {
        try {
        const { todoId, updatedBy, startDate, endDate, pageNumber = 1, perPage = 10, sortBy = 'updatedAt', sortOrder = 'desc' } = req.query;
        const userId = req?.user?._id;

        let filter: any = {};

        if (todoId) {
            filter.todoId = todoId;
        }

        if (updatedBy) {
            filter.updatedBy = updatedBy;
        }

        if (userId) {
            filter.updatedBy = userId;  
        }

        if (startDate && endDate) {
            filter.updatedAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
            };
        } else if (startDate) {
            filter.updatedAt = {
            $gte: new Date(startDate),
            };
        } else if (endDate) {
            filter.updatedAt = {
            $lte: new Date(endDate),
            };
        }

        const page = parseInt(pageNumber as string, 10);
        const limit = parseInt(perPage as string, 10);

        const sortObj: any = {};
        sortObj[sortBy as string] = sortOrder === 'asc' ? 1 : -1;  

        const todoHistoryRecords = await todoHistoryModel.find(filter)
            .sort(sortObj) 
            .skip((page - 1) * limit)  
            .limit(limit);  

        const totalCount = await todoHistoryModel.countDocuments(filter);

        const dataList = services.paginateResponse(todoHistoryRecords, { page, limit }, totalCount);

        return send(
            res,
            statusCode.SUCCESSFUL,
            'Todo history fetched successfully',
            dataList
        );
        } catch (error) {
        next(error);
        }
    };

  static createTodoHistory = async (
    todoId: any,
    updatedBy: string,
    changes: string,
    updatedAt: Date
  ): Promise<void> => {
    try {
      const historyRecord = new todoHistoryModel({
        todoId: todoId,
        updatedBy: updatedBy,
        changes: changes,
        updatedAt: updatedAt,
      });
  
      await historyRecord.save();
    } catch (error) {
      console.error('Error saving Todo history:', error);
    }
}
}

export default Todo;
