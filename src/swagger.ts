export const swaggerSpec = {
    openapi: "3.0.0",

    info: {
        title: "Todo API",
        version: "1.0.0",
        description: "Todo API built with TypeScript and Express"
    },

    servers: [
        {
            url: "http://localhost:3000"
        }
    ],

    tags: [
        {
            name: "Todos",
            description: "Todo management"
        }
    ],

    paths: {
        "/api/todos": {
            get: {
                tags: ["Todos"],
                summary: "Get all todos",

                responses: {
                    "200": {
                        description: "List of todos"
                    }
                }
            },

            post: {
                tags: ["Todos"],
                summary: "Create a todo",

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                type: "object",

                                required: ["name"],

                                properties: {
                                    name: {
                                        type: "string",
                                        example: "Learn TypeScript"
                                    },

                                    completed: {
                                        type: "boolean",
                                        example: false
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    "201": {
                        description: "Todo created"
                    },

                    "400": {
                        description: "Validation error"
                    }
                }
            }
        },

        "/api/todos/search": {
            get: {
                tags: ["Todos"],
                summary: "Search todos",

                parameters: [
                    {
                        name: "name",
                        in: "query",
                        required: true,

                        schema: {
                            type: "string"
                        },

                        example: "typescript"
                    }
                ],

                responses: {
                    "200": {
                        description: "Matching todos"
                    },

                    "400": {
                        description: "Missing search parameter"
                    }
                }
            }
        },

        "/api/todos/completed": {
            get: {
                tags: ["Todos"],
                summary: "Get completed todos",

                responses: {
                    "200": {
                        description: "Completed todos"
                    }
                }
            }
        },

        "/api/todos/incompleted": {
            get: {
                tags: ["Todos"],
                summary: "Get incomplete todos",

                responses: {
                    "200": {
                        description: "Incomplete todos"
                    }
                }
            }
        },

        "/api/todos/{id}": {
            get: {
                tags: ["Todos"],
                summary: "Get todo by ID",

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,

                        schema: {
                            type: "string"
                        }
                    }
                ],

                responses: {
                    "200": {
                        description: "Todo found"
                    },

                    "404": {
                        description: "Todo not found"
                    }
                }
            },

            put: {
                tags: ["Todos"],
                summary: "Update todo",

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,

                        schema: {
                            type: "string"
                        }
                    }
                ],

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                type: "object",

                                required: [
                                    "name",
                                    "completed"
                                ],

                                properties: {
                                    name: {
                                        type: "string",
                                        example: "Learn Node.js"
                                    },

                                    completed: {
                                        type: "boolean",
                                        example: true
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    "200": {
                        description: "Todo updated"
                    },

                    "400": {
                        description: "Validation error"
                    },

                    "404": {
                        description: "Todo not found"
                    }
                }
            },

            delete: {
                tags: ["Todos"],
                summary: "Delete todo",

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,

                        schema: {
                            type: "string"
                        }
                    }
                ],

                responses: {
                    "200": {
                        description: "Todo deleted"
                    },

                    "404": {
                        description: "Todo not found"
                    }
                }
            }
        },

        "/api/todos/{id}/completed": {
            patch: {
                tags: ["Todos"],
                summary: "Mark todo as completed",

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,

                        schema: {
                            type: "string"
                        }
                    }
                ],

                responses: {
                    "200": {
                        description: "Todo completed"
                    },

                    "404": {
                        description: "Todo not found"
                    }
                }
            }
        },

        "/api/todos/{id}/incompleted": {
            patch: {
                tags: ["Todos"],
                summary: "Mark todo as incomplete",

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,

                        schema: {
                            type: "string"
                        }
                    }
                ],

                responses: {
                    "200": {
                        description: "Todo marked as incomplete"
                    },

                    "404": {
                        description: "Todo not found"
                    }
                }
            }
        }
    }
};