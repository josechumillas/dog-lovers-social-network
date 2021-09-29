const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);

const { expect } = chai;

describe('Status', () => {
  describe('GET /', () => {
    it("it should has status code 200 and an 'I'm working' message", (done) => {
      chai
        .request(app)
        .get('/')
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.have.property('message').eql("I'm working");
          if (error) done(error);
          done();
        });
    });
  });

  describe('GET /status', () => {
    it("it should has status code 200 and an 'I'm working' message", (done) => {
      chai
        .request(app)
        .get('/status')
        .end((error, response) => {
          expect(response).to.have.status(200);
          expect(response.body).to.have.property('message').eql("I'm working");
          if (error) done(error);
          done();
        });
    });
  });

  describe('GET /api/errorPage', () => {
    it('it should has status code 404 and Not Found message', (done) => {
      chai
        .request(app)
        .get('/api/errorPage')
        .end((error, response) => {
          expect(response).to.have.status(404);
          expect(response.body)
            .to.have.property('message')
            .eql('Page Not Found');
          if (error) done(error);
          done();
        });
    });
  });
});
