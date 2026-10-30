import { Router, Request, Response, NextFunction } from "express";

import {
    createTodoSchema,
    updateTodoSchema
} from "../schemas/todoSchema";

import { validate } from "../middleware/validate";
import { prisma } from "../lib/prisma";

const router = Router();

// ----------------------------------------
// GET /api/todos
// Vraća sve zadatke
// ----------------------------------------

router.get(
    "/",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const todos = await prisma.todo.findMany();

            res.json(todos);
        } catch (error) {
            next(error);
        }
    }
);

// ----------------------------------------
// GET /api/todos/search?name=...
// Pretraga zadataka po nazivu
// ----------------------------------------

router.get(
    "/search",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const name = req.query.name;

            if (typeof name !== "string" || !name.trim()) {
                return res.status(400).json({
                    error: 'Query parameter "name" is required'
                });
            }

            const todos = await prisma.todo.findMany({
                where: {
                    name: {
                        contains: name.trim(),
                        mode: "insensitive"
                    }
                }
            });

            res.json(todos);
        } catch (error) {
            next(error);
        }
    }
);

// ----------------------------------------
// GET /api/todos/completed
// Vraća završene zadatke
// ----------------------------------------

router.get(
    "/completed",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const todos = await prisma.todo.findMany({
                where: {
                    completed: true
                }
            });

            res.json(todos);
        } catch (error) {
            next(error);
        }
    }
);

// ----------------------------------------
// GET /api/todos/incompleted
// Vraća nezavršene zadatke
// ----------------------------------------

router.get(
    "/incompleted",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const todos = await prisma.todo.findMany({
                where: {
                    completed: false
                }
            });

            res.json(todos);
        } catch (error) {
            next(error);
        }
    }
);

// ----------------------------------------
// GET /api/todos/:id
// Vraća jedan zadatak prema ID-u
// ----------------------------------------

router.get(
    "/:id",
    async (
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const todo = await prisma.todo.findUnique({
                where: {
                    id: req.params.id
                }
            });

            if (!todo) {
                return res.status(404).json({
                    error: "Todo not found"
                });
            }

            res.json(todo);
        } catch (error) {
            next(error);
        }
    }
);

// ----------------------------------------
// POST /api/todos
// Kreiranje novog zadatka
// ----------------------------------------

router.post(
    "/",
    validate(createTodoSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const todo = await prisma.todo.create({
                data: {
                    name: req.body.name,
                    completed: req.body.completed ?? false
                }
            });

            res.status(201).json(todo);
        } catch (error) {
            next(error);
        }
    }
);

// ----------------------------------------
// PUT /api/todos/:id
// Potpuna izmjena zadatka
// ----------------------------------------

router.put(
    "/:id",
    validate(updateTodoSchema),
    async (
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const existingTodo = await prisma.todo.findUnique({
                where: {
                    id: req.params.id
                }
            });

            if (!existingTodo) {
                return res.status(404).json({
                    error: "Todo not found"
                });
            }

            const updatedTodo = await prisma.todo.update({
                where: {
                    id: req.params.id
                },
                data: {
                    name: req.body.name,
                    completed: req.body.completed
                }
            });

            res.json(updatedTodo);
        } catch (error) {
            next(error);
        }
    }
);

// ----------------------------------------
// PATCH /api/todos/:id/completed
// Označava zadatak kao završen
// ----------------------------------------

router.patch(
    "/:id/completed",
    async (
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const existingTodo = await prisma.todo.findUnique({
                where: {
                    id: req.params.id
                }
            });

            if (!existingTodo) {
                return res.status(404).json({
                    error: "Todo not found"
                });
            }

            const updatedTodo = await prisma.todo.update({
                where: {
                    id: req.params.id
                },
                data: {
                    completed: true
                }
            });

            res.json(updatedTodo);
        } catch (error) {
            next(error);
        }
    }
);

// ----------------------------------------
// PATCH /api/todos/:id/incompleted
// Označava zadatak kao nezavršen
// ----------------------------------------

router.patch(
    "/:id/incompleted",
    async (
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const existingTodo = await prisma.todo.findUnique({
                where: {
                    id: req.params.id
                }
            });

            if (!existingTodo) {
                return res.status(404).json({
                    error: "Todo not found"
                });
            }

            const updatedTodo = await prisma.todo.update({
                where: {
                    id: req.params.id
                },
                data: {
                    completed: false
                }
            });

            res.json(updatedTodo);
        } catch (error) {
            next(error);
        }
    }
);

// ----------------------------------------
// DELETE /api/todos/:id
// Brisanje zadatka
// ----------------------------------------

router.delete(
    "/:id",
    async (
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const existingTodo = await prisma.todo.findUnique({
                where: {
                    id: req.params.id
                }
            });

            if (!existingTodo) {
                return res.status(404).json({
                    error: "Todo not found"
                });
            }

            const deletedTodo = await prisma.todo.delete({
                where: {
                    id: req.params.id
                }
            });

            res.json(deletedTodo);
        } catch (error) {
            next(error);
        }
    }
);

export default router;