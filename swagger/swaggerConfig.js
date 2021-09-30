module.exports = {
  swagger: '2.0',
  info: {
    description: '',
    version: '1.0',
    title: 'dog lovers social network'
  },
  basePath: '/',
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'Enter your bearer token in the format **Bearer &lt;token>**'
    }
  },
  paths: {
    '/status': {
      get: {
        tags: ['Status'],
        summary: 'Check staus API',
        description: 'Check if API is on',
        produces: ['application/json'],
        responses: {
          200: {
            description: 'OK',
            schema: {
              $ref: '#/definitions/StatusResponse'
            }
          }
        }
      }
    },
    '/api/v1/users/': {
      post: {
        tags: ['Users'],
        summary: 'Register user',
        description: 'Register a user if the parameters are valid',
        produces: ['application/json'],
        parameters: [
          {
            name: 'username',
            in: 'body',
            description: 'The username of a user',
            required: true,
            type: 'string',
            example: 'john'
          },
          {
            name: 'email',
            in: 'body',
            description: 'The email of a user',
            required: true,
            type: 'string',
            example: 'john@mail.com'
          },
          {
            name: 'password',
            in: 'body',
            description: 'The password of a user',
            required: true,
            type: 'string',
            example: 'abcd1234'
          },
          {
            name: 'location',
            in: 'body',
            description: 'The coordinates of a user',
            required: true,
            type: 'object',
            properties: {
              latitude: {
                type: 'float',
                example: 20.1353
              },
              longitude: {
                type: 'float',
                example: -3.70325
              }
            }
          },
          {
            name: 'language',
            in: 'body',
            description: 'The language of a user',
            required: true,
            type: 'string',
            example: 'es'
          }
        ],
        responses: {
          201: {
            description: 'Created OK',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Created OK'
                },
                hemisphere: {
                  type: 'string',
                  example: 'northern'
                },
                data: {
                  $ref: '#/definitions/UserDataInfo'
                }
              }
            }
          },
          404: {
            description: 'Validation Error',
            schema: {
              $ref: '#/definitions/ValidationError'
            }
          },
          409: {
            description: 'Username or email is already registered',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Username or email is already registered'
                }
              }
            }
          },
          500: {
            description: 'Server error / Error creating User',
            schema: {
              $ref: '#/definitions/Error500'
            }
          }
        }
      },
      get: {
        tags: ['Users'],
        summary: 'List all users',
        description: 'List all existing users',
        produces: ['application/json'],
        responses: {
          200: {
            description: 'OK',
            schema: {
              $ref: '#/definitions/ListAllUsers'
            }
          },
          404: {
            description: 'Users not found',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Users not found'
                }
              }
            }
          },
          500: {
            description: 'Server error',
            schema: {
              $ref: '#/definitions/Error500'
            }
          }
        }
      },
      put: {
        tags: ['Users'],
        summary: 'Modify the user data',
        description: 'Modify the user data',
        produces: ['application/json'],
        security: [{ Bearer: [] }],
        parameters: [
          {
            name: 'email',
            in: 'body',
            description: 'The email of a user',
            required: false,
            type: 'string',
            example: 'john@mail.com'
          },
          {
            name: 'password',
            in: 'body',
            description: 'The password of a user',
            required: false,
            type: 'string',
            example: 'abcd1234'
          },
          {
            name: 'location',
            in: 'body',
            description: 'The coordinates of a user',
            required: false,
            type: 'object',
            properties: {
              latitude: {
                type: 'float',
                example: 20.1353
              },
              longitude: {
                type: 'float',
                example: -3.70325
              }
            }
          },
          {
            name: 'language',
            in: 'body',
            description: 'The language of a user',
            required: false,
            type: 'string',
            example: 'es'
          }
        ],
        responses: {
          200: {
            description: 'Modify OK',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Modify OK'
                },
                hemisphere: {
                  type: 'string',
                  example: 'northern'
                },
                data: {
                  $ref: '#/definitions/UserDataInfo'
                }
              }
            }
          },
          404: {
            description: 'Validation Error',
            schema: {
              $ref: '#/definitions/ValidationError'
            }
          }
        }
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete a user',
        description: 'Delete a user from database',
        produces: ['application/json'],
        security: [{ Bearer: [] }],
        parameters: [
          {
            name: 'username',
            in: 'path',
            description: 'The username',
            required: true,
            type: 'string',
            example: 'john'
          }
        ],
        responses: {
          200: {
            description: 'Delete OK',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Delete OK'
                }
              }
            }
          },
          404: {
            description: 'User not found',
            schema: {
              $ref: '#/definitions/ErrorUserNotFound'
            }
          },
          500: {
            description: 'Server error / Error creating User',
            schema: {
              $ref: '#/definitions/Error500'
            }
          }
        }
      }
    },
    '/api/v1/users/{username}': {
      get: {
        tags: ['Users'],
        summary: 'Find user',
        description: 'Find user by username',
        produces: ['application/json'],
        parameters: [
          {
            name: 'username',
            in: 'path',
            description: 'The username',
            required: true,
            type: 'string',
            example: 'john'
          }
        ],
        responses: {
          200: {
            description: 'User found',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'User found'
                },
                data: {
                  $ref: '#/definitions/UserDataInfo'
                }
              }
            }
          },
          404: {
            description: 'User not found',
            schema: {
              $ref: '#/definitions/ErrorUserNotFound'
            }
          },
          500: {
            description: 'Server error / Error creating User',
            schema: {
              $ref: '#/definitions/Error500'
            }
          }
        }
      }
    },
    '/api/v1/users/login': {
      post: {
        tags: ['Users'],
        summary: 'Login user',
        description:
          'Login a user if the username and password are correct. Return a token.',
        produces: ['application/json'],
        parameters: [
          {
            name: 'username',
            in: 'body',
            description: 'The username of the user',
            required: true,
            type: 'string'
          },
          {
            name: 'password',
            in: 'body',
            description: 'The password of the user',
            required: true,
            type: 'string'
          }
        ],
        responses: {
          200: {
            description: 'Login OK',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Login OK'
                },
                token: {
                  type: 'string',
                  example:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibWljaGFlbCIsImlkIjo1NiwiaWF0IjoxNjMyOTQ1NDAzfQ.siF5pxOk6FiyBm1JjJr-8Mt8n1Q6HANPw-AW1jWCyII'
                }
              }
            }
          },
          401: {
            description: 'Login Error',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Login Error'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/friendships': {
      get: {
        tags: ['Friendships'],
        summary: 'List Friendships',
        description: 'List Friendships from the user',
        produces: ['application/json'],
        security: [{ Bearer: [] }],
        responses: {
          200: {
            description: 'Listing Friendship OK',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Listing Friendship OK'
                },
                count: {
                  type: 'number',
                  example: 1
                },
                data: {
                  type: 'array',
                  items: {
                    $ref: '#/definitions/UserDataInfo'
                  }
                }
              }
            }
          },
          500: {
            description: 'Server error',
            schema: {
              $ref: '#/definitions/Error500'
            }
          }
        }
      }
    },
    '/api/v1/friendships/{username}/add': {
      post: {
        tags: ['Friendships'],
        summary: 'Add Friendship',
        description: 'Send friendship request to a user',
        produces: ['application/json'],
        security: [{ Bearer: [] }],
        parameters: [
          {
            name: 'username',
            in: 'path',
            description: 'The username',
            required: true,
            type: 'string',
            example: 'john'
          }
        ],
        responses: {
          200: {
            description: 'Friendship added OK',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Friendship added OK'
                }
              }
            }
          },
          400: {
            description: 'User not exists',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'User not exists'
                }
              }
            }
          },
          500: {
            description: 'Server error / Error adding Friendship',
            schema: {
              $ref: '#/definitions/Error500'
            }
          }
        }
      }
    },
    '/api/v1/friendships/{username}/confirm': {
      post: {
        tags: ['Friendships'],
        summary: 'Confirm Friendship',
        description: 'Confirm a friendship request',
        produces: ['application/json'],
        security: [{ Bearer: [] }],
        parameters: [
          {
            name: 'username',
            in: 'path',
            description: 'The username',
            required: true,
            type: 'string',
            example: 'john'
          }
        ],
        responses: {
          200: {
            description: 'Friendship Confirmed OK',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Friendship Confirmed OK'
                }
              }
            }
          },
          400: {
            description: 'User not exists',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'User not exists'
                }
              }
            }
          },
          500: {
            description: 'Server error / Error Confirmating Friendship',
            schema: {
              $ref: '#/definitions/Error500'
            }
          }
        }
      }
    }
  },
  definitions: {
    Error500: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Internal Server Error'
        }
      }
    },
    ErrorUserNotFound: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User not found'
        }
      }
    },
    ValidationError: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Validation Error'
        }
      }
    },
    UserDataInfo: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          example: 'john'
        },
        email: {
          type: 'string',
          example: 'john@mail.com'
        },
        language: {
          type: 'string',
          example: 'es'
        },
        location: {
          type: 'object',
          properties: {
            latitude: {
              type: 'float',
              example: 20.1353
            },
            longitude: {
              type: 'float',
              example: -3.70325
            }
          }
        }
      }
    },
    StatusResponse: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: "I'm working"
        }
      }
    },
    ListAllUsers: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Users found'
        },
        data: {
          type: 'array',
          items: {
            $ref: '#/definitions/UserDataInfo'
          }
        }
      }
    }
  }
};
