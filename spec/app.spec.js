process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection.js');

beforeEach(() => connection.seed.run());
after(() => connection.destroy());

describe('/api', () => {
  it('status:404 responds with a message "route note found"', () => {
    return request(app)
      .get('/api/test')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal('route not found');
      });
  });
  describe('/topics', () => {
    describe('GET', () => {
      it('status:200 responds with an array of all topics', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).to.eql([
              { slug: 'mitch', description: 'The man, the Mitch, the legend' },
              { slug: 'cats', description: 'Not dogs' },
              { slug: 'paper', description: 'what books are made of' }
            ]);
          });
      });
    });
    describe('INVALID METHODS', () => {
      it('status:405 responds with "method not allowed"', () => {
        const invalidMethods = ['post', 'patch', 'put', 'delete'];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]('/api/topics')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('method not allowed');
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
  describe('/users', () => {
    describe('/:username', () => {
      describe('GET', () => {
        it('status:200 responds with a user object', () => {
          return request(app)
            .get('/api/users/butter_bridge')
            .expect(200)
            .then(({ body: { user } }) => {
              expect(user).to.eql({
                username: 'butter_bridge',
                name: 'jonny',
                avatar_url:
                  'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
              });
            });
        });
        it('status:404 responds with "route not found" when a username that does not exist is entered', () => {
          return request(app)
            .get('/api/users/ian_wright')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('invalid username');
            });
        });
      });
      describe('INVALID METHODS', () => {
        it('status:405 responds with "method not allowed"', () => {
          const invalidMethods = ['post', 'patch', 'put', 'delete'];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]('/api/users/icellusedkars')
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('method not allowed');
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
  });
});
