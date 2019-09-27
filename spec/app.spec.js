process.env.NODE_ENV = 'test';
const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-sorted'));
const request = require('supertest');
const app = require('../app');
const connection = require('../db/connection.js');

beforeEach(() => connection.seed.run());
after(() => connection.destroy());

describe('/api', () => {
  describe('GET', () => {
    it('status:200 responds with a json representation of all the available endpoints of the api', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body: { endpoints } }) => {
          expect(endpoints).to.contain.keys(
            'GET /api',
            'GET /api/topics',
            'GET /api/users/:username',
            'GET /api/articles',
            'GET /api/articles/:article_id',
            'PATCH /api/articles/:article_id',
            'POST /api/articles/:article_id/comments',
            'GET /api/articles/:article_id/comments',
            'PATCH /api/comments/:comment_id',
            'DELETE /api/comments/:comment_id'
          );
        });
    });
  });
  describe('INVALID METHODS', () => {
    it('status:405 responds with "method not allowed"', () => {
      const invalidMethods = ['post', 'patch', 'put', 'delete'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('method not allowed');
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe('/', () => {});
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
    describe('GET', () => {
      it('status:200 responds with an array of article objects, each including a key of "comment_count"', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0]).to.have.keys(
              'author',
              'title',
              'article_id',
              'topic',
              'created_at',
              'votes',
              'comment_count'
            );
            expect(articles.length).to.equal(12);
          });
      });
      it('status:200 responds with an array of article objects sorted by date by default and ordered by descending by default', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.descendingBy('created_at');
          });
      });
      it('status:200 responds with an array of article objects sorted by a valid column and ordered by ascending when the query specifies this', () => {
        return request(app)
          .get('/api/articles?sort_by=title&order=asc')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.ascendingBy('title');
          });
      });
      it('status:200 responds with an array of article objects filtered by the username specified in the query', () => {
        return request(app)
          .get('/api/articles?author=butter_bridge')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(3);
            expect(articles[0].author).to.equal('butter_bridge');
          });
      });
      it('status:200 responds with an array of article objects filtered by the topic specified in the query', () => {
        return request(app)
          .get('/api/articles?topic=cats')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(1);
            expect(articles[0].topic).to.equal('cats');
          });
      });
      it('status:200 responds with an empty array if the author specified exists in the database but has no articles associated with it', () => {
        return request(app)
          .get('/api/articles?author=lurker')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(0);
          });
      });
      it('status:200 responds with an empty array if the topic specified exists in the database but has no articles associated with it', () => {
        return request(app)
          .get('/api/articles?topic=paper')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(0);
          });
      });
      it('status:200 responds with an array of article objects even when an invalid query property is included on the request body', () => {
        return request(app)
          .get('/api/articles?sort_by=title&testing=true')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.descendingBy('title');
          });
      });
      it('status:400 responds with "bad request" when sort_by column is not valid', () => {
        return request(app)
          .get('/api/articles?sort_by=test')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('bad request');
          });
      });
      it('status:400 responds with "bad request" when order value is not valid', () => {
        return request(app)
          .get('/api/articles?order=test')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('bad request');
          });
      });
    });
    it('status:404 responds with message "topic not found" if the topic specified does not exist in the database', () => {
      return request(app)
        .get('/api/articles?topic=pokemon')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal('topic not found');
        });
    });
    it('status:404 responds with message "user not found" if the author specified does not exist in the database', () => {
      return request(app)
        .get('/api/articles?author=simon_green')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal('user not found');
        });
    });
    it('status:404 responds with message "topic not found" if the author specified does exist but the topic does not exist in the database', () => {
      return request(app)
        .get('/api/articles?author=butter_bridge&topic=mars')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal('topic not found');
        });
    });
    it('status:404 responds with message "user not found" if the topic specified does exist but the author does not exist in the database', () => {
      return request(app)
        .get('/api/articles?author=simon_green&topic=cats')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal('user not found');
        });
    });
    describe('INVALID METHODS', () => {
      it('status:405 responds with "method not allowed"', () => {
        const invalidMethods = ['post', 'patch', 'put', 'delete'];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]('/api/articles')
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('method not allowed');
            });
        });
        return Promise.all(methodPromises);
      });
    });
    describe('/:article_id', () => {
      describe('GET', () => {
        it('status:200 responds with an article object that corresponds with the specified article_id', () => {
          return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).to.have.keys(
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
        it('status:404 responds with message "article not found" when the specified article_id is the correct data type but does not exist in the database', () => {
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
        it('status:200 responds with an article object with the votes value updated even when an additional property is included on the request body in addition to inc_votes', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 5, name: 'Paul' })
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article.votes).to.equal(105);
            });
        });
        it('status:200 responds with an unchanged comment when the request does not include inc_votes on the request body', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({ testing_times: 1 })
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article.votes).to.equal(100);
              expect(article).to.contain.keys(
                'author',
                'title',
                'article_id',
                'body',
                'topic',
                'created_at',
                'votes'
              );
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
            .patch('/api/articles/30')
            .send({ inc_votes: 10 })
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
      describe('/comments', () => {
        describe('GET', () => {
          it('status:200 responds with an array of comments which are related to the article_id specified in the request, sorted by created_at by default and ordered by descending by default', () => {
            return request(app)
              .get('/api/articles/1/comments')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments[0]).to.have.keys(
                  'comment_id',
                  'votes',
                  'created_at',
                  'author',
                  'body'
                );
                expect(comments.length).to.equal(13);
                expect(comments).to.be.descendingBy('created_at');
              });
          });
          it('status:200 responds with an array of comments sorted by a valid column and ordered by ascending', () => {
            return request(app)
              .get('/api/articles/1/comments?sort_by=author&order=asc')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).to.be.ascendingBy('author');
              });
          });
          it('status:200 responds with no comments when the specified article has no comments', () => {
            return request(app)
              .get('/api/articles/3/comments')
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments.length).to.equal(0);
              });
          });
          it('status:400 responds with "bad request" when sort_by column is not valid', () => {
            return request(app)
              .get('/api/articles/1/comments?sort_by=test')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
          it('status:400 responds with "bad request" when order value is not valid', () => {
            return request(app)
              .get('/api/articles/1/comments?order=test')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
          it('status:400 responds with "bad request" when article_id type is invalid', () => {
            return request(app)
              .get('/api/articles/two/comments')
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
          it('status:404 responds with "article not found" when article_id type is valid but does not exist', () => {
            return request(app)
              .get('/api/articles/50/comments')
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('article not found');
              });
          });
        });
        describe('POST', () => {
          it('status:201 responds with the posted comment', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({
                username: 'icellusedkars',
                body: 'I really like this article!'
              })
              .expect(201)
              .then(({ body: { comment } }) => {
                expect(comment).to.contain.keys(
                  'article_id',
                  'comment_id',
                  'votes',
                  'created_at',
                  'author',
                  'body'
                );
                expect(comment.author).to.equal('icellusedkars');
                expect(comment.body).to.equal('I really like this article!');
              });
          });
          it('status:400 responds with message "bad request" when the comment is missing a username', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({
                body: 'I really like this article!'
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
          it('status:400 responds with message "bad request" when the comment is missing a body', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({
                username: 'icellusedkars'
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
          it('status:400 responds with message "bad request" when article_id data type is incorrect', () => {
            return request(app)
              .post('/api/articles/one/comments')
              .send({
                username: 'icellusedkars',
                body: 'I really like this article!'
              })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('bad request');
              });
          });
          it('status:422 responds with message "unprocessable entity" when username data type is incorrect, as username will be changed to a string and the username will not be found in the referenced articles table', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({
                username: 2019,
                body: 'I really like this article!'
              })
              .expect(422)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('unprocessable entity');
              });
          });
          it('status:422 responds with message "unprocessable entity" when the article_id is the correct type but not found when the comments table references the articles table', () => {
            return request(app)
              .post('/api/articles/43/comments')
              .send({
                username: 'icellusedkars',
                body: 'I really like this article!'
              })
              .expect(422)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('unprocessable entity');
              });
          });
          it('status:422 responds with message "unprocessable entity" when the username is the correct type but not found when the comments table references the users table', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({
                username: 'test_user',
                body: 'How is this article so fantastic?'
              })
              .expect(422)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal('unprocessable entity');
              });
          });
        });
        describe('INVALID METHODS', () => {
          it('status:405 responds with "method not allowed"', () => {
            const invalidMethods = ['put', 'patch', 'delete'];
            const methodPromises = invalidMethods.map(method => {
              return request(app)
                [method]('/api/articles/1/comments')
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
  describe('/comments', () => {
    describe('/:comment_id', () => {
      describe('PATCH', () => {
        it('status:200 responds with an updated comment object with the votes value updated as specified in the request', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: 4 })
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(comment.votes).to.equal(20);
            });
        });
        it('status:200 responds with an updated comment object with the votes value updated as specified in the request even when body includes an additional property', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: 4, name: 'tony' })
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(comment.votes).to.equal(20);
            });
        });
        it('status:200 responds with an unchanged comment when the request does not include inc_votes on the request body', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ testing_times: 1 })
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(comment.votes).to.equal(16);
            });
        });
        it('status:404 responds with message "comment not found" when the specified comment_id is the correct data type but does not exist', () => {
          return request(app)
            .patch('/api/comments/50')
            .send({ inc_votes: 10 })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('comment not found');
            });
        });
        it('status:400 responds with message "bad request" when comment_id data type is incorrect', () => {
          return request(app)
            .patch('/api/comments/one')
            .send({ inc_votes: 10 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('bad request');
            });
        });
        it('status:400 responds with message "bad request" when inc_votes data type is incorrect', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: 'fifteen' })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal('bad request');
            });
        });
      });
      describe('DELETE', () => {
        it('status:204 deletes comment by comment id', () => {
          return request(app)
            .delete('/api/comments/1')
            .expect(204);
        });
      });
      it('status:400 returns message "bad request" when comment id is the incorrect data type', () => {
        return request(app)
          .delete('/api/comments/one')
          .expect(400);
      });
      it('status:404 returns message "comment not found" when comment id is the correct data type but the comment does not exist', () => {
        return request(app)
          .delete('/api/comments/50')
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal('comment not found');
          });
      });

      describe('INVALID METHODS', () => {
        it('status:405 responds with "method not allowed"', () => {
          const invalidMethods = ['get', 'post', 'put'];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]('/api/comments/1')
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
