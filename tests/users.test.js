/* eslint-disable prettier/prettier */
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const SQLiteDb = require('../lib/db');
const payloads = require('./payloads');

const db = new SQLiteDb();

chai.use(chaiHttp);

const { expect } = chai;
let userLogged1Token = null;
let userLogged2Token = null;

describe('Users tests', () => {
  before(async () => {
    await db.exec('DELETE FROM friendships');
    await db.exec('DELETE FROM users');
    console.log('\tDatabase cleared!');
  });

  describe('Create User', () => {
    describe('Create a user with correct parameters', () => {
      it("it should has status code 200 and an 'Created OK' message", (done) => {
        chai
          .request(app)
          .post('/api/v1/users')
          .set('Accept', 'application/json')
          .send(payloads.register1)
          .end((error, response) => {
            expect(response).to.have.status(201);
            expect(response.body).to.have.property('message').eql('Created OK');
            expect(response.body).to.have.property('hemisphere').eql('northern');
            const dataProperties = ['username', 'email', 'language', 'location'];
            expect(Object.keys(response.body.data).map((el) => dataProperties.includes(el)));
            if (error) done(error);
            done();
          });
      });
    });

    describe('Create a user with an existing username/email', () => {
      it("it should has status code 409 and an 'Username or email is already registered' message", (done) => {
        chai
          .request(app)
          .post('/api/v1/users')
          .set('Accept', 'application/json')
          .send(payloads.register1)
          .end((error, response) => {
            expect(response).to.have.status(409);
            expect(response.body)
              .to.have.property('message')
              .eql('Username or email is already registered');
            if (error) done(error);
            done();
          });
      });
    });

    describe('Create a user without correct parameters', () => {
      it("it should has status code 409 and an 'Validation Error' message", (done) => {
        chai
          .request(app)
          .post('/api/v1/users')
          .set('Accept', 'application/json')
          .send(payloads.registerIncorrect)
          .end((error, response) => {
            expect(response).to.have.status(404);
            expect(response.body)
              .to.have.property('message')
              .eql('Validation Error');
            if (error) done(error);
            done();
          });
      });
    });
  });

  describe('Login User', () => {
    describe('Login user with correct parameters', () => {
      it("it should has status code 200 and a 'Login OK' message", (done) => {
        chai
          .request(app)
          .post('/api/v1/users/login')
          .set('Accept', 'application/json')
          .send(payloads.login1)
          .end((error, response) => {
            expect(response).to.have.status(200);
            expect(response.body).to.have.property('message').eql('Login OK');
            expect(response.body).to.have.property('token');
            userLogged1Token = response.body.token;
            if (error) done(error);
            done();
          });
      });
    });

    describe('Login non existing user', () => {
      it("it should has status code 401 and a 'Login Error' message", (done) => {
        chai
          .request(app)
          .post('/api/v1/users/login')
          .set('Accept', 'application/json')
          .send(payloads.login2)
          .end((error, response) => {
            expect(response).to.have.status(401);
            expect(response.body).to.have.property('message').eql('Login Error');
            if (error) done(error);
            done();
          });
      });
    });

    describe('Login user with wrong password', () => {
      it("it should has status code 401 and a 'Login Error' message", (done) => {
        chai
          .request(app)
          .post('/api/v1/users/login')
          .set('Accept', 'application/json')
          .send(payloads.login3)
          .end((error, response) => {
            expect(response).to.have.status(401);
            expect(response.body).to.have.property('message').eql('Login Error');
            if (error) done(error);
            done();
          });
      });
    });
  });

  describe('Find User', () => {
    describe('Find a existing user by username', () => {
      it("it should has status code 200 and a 'Validation Error' message", (done) => {
        chai
          .request(app)
          .get(`/api/v1/users/${payloads.register1.username}`)
          .end((error, response) => {
            expect(response).to.have.status(200);
            expect(response.body).to.have.property('message').eql('User found');
            expect(response.body.data).to.have.property('username').eql(payloads.register1.username);
            expect(response.body.data).to.have.property('email').eql(payloads.register1.email);
            expect(response.body.data).to.have.property('language').eql(payloads.register1.language);
            expect(response.body.data.location).to.have.property('latitude').eql(payloads.register1.location.latitude);
            expect(response.body.data.location).to.have.property('longitude').eql(payloads.register1.location.longitude);
            if (error) done(error);
            done();
          });
      });
    });

    describe('Find a non existing user by username', () => {
      it("it should has status code 404 and a 'User not found' message", (done) => {
        chai
          .request(app)
          .get(`/api/v1/users/${payloads.login2.username}`)
          .end((error, response) => {
            expect(response).to.have.status(404);
            expect(response.body).to.have.property('message').eql('User not found');
            if (error) done(error);
            done();
          });
      });
    });

    describe('List users', () => {
      describe('Get an all existing users list when exists 1 user', () => {
        it("it should has status code 200, a 'Users found' message and list 1 user", (done) => {
          chai
            .request(app)
            .get('/api/v1/users')
            .end((error, response) => {
              expect(response).to.have.status(200);
              expect(response.body).to.have.property('message').eql('Users found');
              expect(response.body.data).to.be.a('array');
              expect(response.body.data).to.have.lengthOf(1);
              if (error) done(error);
              done();
            });
        });
      });

      describe('Get an all existing users list when exists 2 user', () => {
        before(async () => {
          await chai
            .request(app)
            .post('/api/v1/users')
            .set('Accept', 'application/json')
            .send(payloads.register2);
          console.log('\tNew user added!');
        });

        it("it should has status code 200, a 'Users found' message and list 2 users", (done) => {
          chai
            .request(app)
            .get('/api/v1/users')
            .end((error, response) => {
              expect(response).to.have.status(200);
              expect(response.body).to.have.property('message').eql('Users found');
              expect(response.body.data).to.be.a('array');
              expect(response.body.data).to.have.lengthOf(2);
              if (error) done(error);
              done();
            });
        });
      });
    });

    describe('Modify user', () => {
      describe('Modify some parameters of a user', () => {
        it("it should has status code 200 and 'Modify OK' message", (done) => {
          chai
            .request(app)
            .put('/api/v1/users')
            .set({ Authorization: `Bearer ${userLogged1Token}` })
            .send(payloads.modifyUser1)
            .end((error, response) => {
              expect(response).to.have.status(200);
              expect(response.body).to.have.property('message').eql('Modify OK');
              expect(response.body.data).to.have.property('email').eql(payloads.modifyUser1.email);
              expect(response.body.data).to.have.property('language').eql(payloads.modifyUser1.language);
              if (error) done(error);
              done();
            });
        });
      });

      describe('Modify some parameters of a user with an invalid password', () => {
        it("it should has status code 404 and 'Validation Error' message", (done) => {
          chai
            .request(app)
            .put('/api/v1/users')
            .set({ Authorization: `Bearer ${userLogged1Token}` })
            .send(payloads.modifyUserIncorrect1)
            .end((error, response) => {
              expect(response).to.have.status(404);
              expect(response.body).to.have.property('message').eql('Validation Error');
              if (error) done(error);
              done();
            });
        });
      });

      describe('Modify some parameters of a user with an invalid coordinates', () => {
        it("it should has status code 404 and 'Validation Error' message", (done) => {
          chai
            .request(app)
            .put('/api/v1/users')
            .set({ Authorization: `Bearer ${userLogged1Token}` })
            .send(payloads.modifyUserIncorrect2)
            .end((error, response) => {
              expect(response).to.have.status(404);
              expect(response.body).to.have.property('message').eql('Validation Error');
              if (error) done(error);
              done();
            });
        });
      });

      describe('Modify the password and verify login', () => {
        it("it should has status code 200 and 'Modify OK' message", (done) => {
          chai
            .request(app)
            .put('/api/v1/users')
            .set({ Authorization: `Bearer ${userLogged1Token}` })
            .send(payloads.modifyUser2)
            .end((error, response) => {
              expect(response).to.have.status(200);
              expect(response.body).to.have.property('message').eql('Modify OK');
              if (error) done(error);
              done();
            });
        });

        it("it should has status code 200 and a 'Login OK' message", (done) => {
          chai
            .request(app)
            .post('/api/v1/users/login')
            .set('Accept', 'application/json')
            .send(payloads.login4)
            .end((error, response) => {
              expect(response).to.have.status(200);
              expect(response.body).to.have.property('message').eql('Login OK');
              expect(response.body).to.have.property('token');
              userLogged1Token = response.body.token;
              if (error) done(error);
              done();
            });
        });
      });
    });

    describe('Add friendship', () => {
      describe('Add friendship request to a existing user', () => {
        it("it should has status code 200 and 'Friendship added OK' message", (done) => {
          chai
            .request(app)
            .post(`/api/v1/friendships/${payloads.register2.username}/add`)
            .set({ Authorization: `Bearer ${userLogged1Token}` })
            .end((error, response) => {
              expect(response).to.have.status(200);
              expect(response.body).to.have.property('message').eql('Friendship added OK');
              if (error) done(error);
              done();
            });
        });
      });

      describe('Add friendship request to a non existing user', () => {
        it("it should has status code 400 and 'User not exists' message", (done) => {
          chai
            .request(app)
            .post(`/api/v1/friendships/${payloads.login2.username}/add`)
            .set({ Authorization: `Bearer ${userLogged1Token}` })
            .end((error, response) => {
              expect(response).to.have.status(400);
              expect(response.body).to.have.property('message').eql('User not exists');
              if (error) done(error);
              done();
            });
        });
      });
    });

    describe('Confirm friendship', () => {
      before(async () => {
        const response = await chai
          .request(app)
          .post('/api/v1/users/login')
          .set('Accept', 'application/json')
          .send(payloads.login5);
        userLogged2Token = response.body.token;
      });

      describe('Confirm friendship request to a existing friendship request', () => {
        it("it should has status code 200 and 'Friendship Confirmed OK' message", (done) => {
          chai
            .request(app)
            .post(`/api/v1/friendships/${payloads.register1.username}/confirm`)
            .set({ Authorization: `Bearer ${userLogged2Token}` })
            .end((error, response) => {
              expect(response).to.have.status(200);
              expect(response.body).to.have.property('message').eql('Friendship Confirmed OK');
              if (error) done(error);
              done();
            });
        });
      });

      describe('Confirm friendship request to previously confirmed friendship', () => {
        it("it should has status code 500 and 'Error Confirmating Friendship' message", (done) => {
          chai
            .request(app)
            .post(`/api/v1/friendships/${payloads.register1.username}/confirm`)
            .set({ Authorization: `Bearer ${userLogged2Token}` })
            .end((error, response) => {
              expect(response).to.have.status(500);
              expect(response.body).to.have.property('message').eql('Error Confirmating Friendship');
              if (error) done(error);
              done();
            });
        });
      });

      describe('Confirm friendship request to a non existing user', () => {
        it("it should has status code 200 and 'Friendship Confirmed OK' message", (done) => {
          chai
            .request(app)
            .post(`/api/v1/friendships/${payloads.login2.username}/confirm`)
            .set({ Authorization: `Bearer ${userLogged2Token}` })
            .end((error, response) => {
              expect(response).to.have.status(400);
              expect(response.body).to.have.property('message').eql('User not exists');
              if (error) done(error);
              done();
            });
        });
      });
    });

    describe('List friendships', () => {
      it("it should has status code 200 and 'Listing Friendship OK' message", (done) => {
        chai
          .request(app)
          .get('/api/v1/friendships')
          .set({ Authorization: `Bearer ${userLogged1Token}` })
          .end((error, response) => {
            expect(response).to.have.status(200);
            expect(response.body).to.have.property('message').eql('Listing Friendship OK');
            expect(response.body).to.have.property('count').eql(1);
            if (error) done(error);
            done();
          });
      });
    });

    describe('Delete user', () => {
      describe('Delete an existing user', () => {
        it("it should has status code 200 and 'Delete OK' message", (done) => {
          chai
            .request(app)
            .delete('/api/v1/users')
            .set({ Authorization: `Bearer ${userLogged1Token}` })
            .end((error, response) => {
              expect(response).to.have.status(200);
              expect(response.body).to.have.property('message').eql('Delete OK');
              if (error) done(error);
              done();
            });
        });
      });

      describe('Delete a non existing user', () => {
        it("it should has status code 404 and 'User not found' message", (done) => {
          chai
            .request(app)
            .delete('/api/v1/users')
            .set({ Authorization: `Bearer ${userLogged1Token}` })
            .end((error, response) => {
              expect(response).to.have.status(404);
              expect(response.body).to.have.property('message').eql('User not found');
              if (error) done(error);
              done();
            });
        });
      });
    });
  });
});
