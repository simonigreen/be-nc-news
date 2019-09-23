const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('returns an empty array when passed an empty array', () => {
    expect(formatDates([])).to.eql([]);
  });
  it('does not mutate the contents of the passed in array', () => {
    const input = [
      {
        title: 'test title',
        topic: 'test topic',
        author: 'test_author',
        body: 'This test is testing',
        created_at: 1542284514171
      }
    ];
    formatDates(input);
    expect(input).to.eql([
      {
        title: 'test title',
        topic: 'test topic',
        author: 'test_author',
        body: 'This test is testing',
        created_at: 1542284514171
      }
    ]);
  });
  it('returns an object with everything in the object unchanged when the object does not include a created_at', () => {
    expect([
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        votes: 100
      }
    ]).to.eql([
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        votes: 100
      }
    ]);
  });
  it('returns an object with the date converted to a JavaScript date object when passed a unix timestamp', () => {
    const converted = formatDates([
      {
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ]);
    expect(converted[0].created_at).to.be.instanceOf(Date);
  });
});

describe('makeRefObj', () => {
  it('returns an empty array when passed an empty array', () => {
    expect(makeRefObj([])).to.eql({});
  });
  it('does not mutate the passed in array', () => {
    const input = [
      {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ];
    makeRefObj(input);
    expect(input).to.eql([
      {
        article_id: 1,
        title: 'Living in the shadow of a great man',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I find this existence challenging',
        created_at: 1542284514171,
        votes: 100
      }
    ]);
  });
  it('returns an array containing a single reference object with the key being the aritcle title and the value being the article_id when passed an array containing a single object', () => {
    expect(
      makeRefObj([
        {
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: 1542284514171,
          votes: 100
        }
      ])
    ).to.eql({ 'Living in the shadow of a great man': 1 });
  });
  it('creates reference object correctly when passed an array containing several article objects', () => {
    expect(
      makeRefObj([
        {
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: 1542284514171,
          votes: 100
        },
        {
          article_id: 2,
          title: 'Eight pug gifs that remind me of mitch',
          topic: 'mitch',
          author: 'icellusedkars',
          body: 'some gifs',
          created_at: 1289996514171
        },
        {
          article_id: 3,
          title: 'UNCOVERED: catspiracy to bring down democracy',
          topic: 'cats',
          author: 'rogersop',
          body: 'Bastet walks amongst us, and the cats are taking arms!',
          created_at: 1037708514171
        }
      ])
    ).to.eql({
      'Living in the shadow of a great man': 1,
      'Eight pug gifs that remind me of mitch': 2,
      'UNCOVERED: catspiracy to bring down democracy': 3
    });
  });
});

describe('formatComments', () => {});
