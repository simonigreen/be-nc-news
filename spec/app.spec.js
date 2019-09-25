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
        it('status:200 responds with a user object that corresponds with the specified username', () => {
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
        it('status:404 responds with "route not found" when a username that does not exist is specified', () => {
          return request(app)
            .get('/api/users/ian_wright')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('user not found');
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
  describe('/articles', () => {
    describe('/:article_id', () => {
      describe('GET', () => {
        it('status:200 responds with an article object that corresponds with the specified article_id', () => {
          return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).to.contain.keys(
                'author',
                'title',
                'article_id',
                'body',
                'topic',
                'created_at',
                'votes',
                'comment_count'
              );
              expect(article.comment_count).to.equal('13');
            });
        });
        it('status:400 responds with message "bad request" when article_id data type is incorrect', () => {
          return request(app)
            .get('/api/articles/one')
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('bad request');
            });
        });
        it('status:404 responds with message "article not found" when the specified article_id is the correct data type but does not exist', () => {
          return request(app)
            .get('/api/articles/70')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('article not found');
            });
        });
      });
      describe('PATCH', () => {
        it('status:200 responds with an article object with the votes value updated as specified in the request', () => {
          return request(app)
            .patch('/api/articles/2')
            .send({ inc_votes: 10 })
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).to.contain.keys(
                'author',
                'title',
                'article_id',
                'body',
                'topic',
                'created_at',
                'votes'
              );
              expect(article.votes).to.equal(10);
            });
        });
        it('status:400 responds with message "bad request" when article_id data type is incorrect', () => {
          return request(app)
            .patch('/api/articles/one')
            .send({ inc_votes: 10 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('bad request');
            });
        });
        it('status:400 responds with message "bad request" when the request does not include inc_votes', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({ testing_times: 1 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('bad request');
            });
        });
        it('status:400 responds with message "bad request" when inc_votes data type is incorrect', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 'fifteen' })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('bad request');
            });
        });
        it('status:404 responds with message "article not found" when the specified article_id is the correct data type but does not exist', () => {
          return request(app)
            .get('/api/articles/30')
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('article not found');
            });
        });
      });
      describe('INVALID METHODS', () => {
        it('status:405 responds with "method not allowed"', () => {
          const invalidMethods = ['post', 'put', 'delete'];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]('/api/articles/1')
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
