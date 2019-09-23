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
  it('returns an object with everything in the object unchanged when the object does not include a created_at property', () => {
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
  it('returns an object with the created_at date converted to a JavaScript date object when the passed in object contains a unix timestamp', () => {
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
  it('returns an empty object when passed an empty array', () => {
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
  it('returns an array containing a reference object with a single key and value, with the key being the article title and the value being the article_id when passed an array containing a single article object', () => {
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
  it('creates a reference object with a key and value pair for each article object when passed an array containing several article objects', () => {
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

describe('formatComments', () => {
  it('returns an empty array when passed an empty array', () => {
    expect(formatComments([])).to.eql([]);
  });
  it('does not mutate the passed in array', () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      }
    ];
    formatComments(input, {
      "They're not exactly dogs, are they?": 9
    });
    expect(input).to.eql([
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      }
    ]);
  });
  it('returns an array containing an object where the "created_by" property renamed to an "author" key, "belongs_to" property renamed to an "article_id" key and the value of the new "article_id" key is the id corresponding to the original title value provided', () => {
    expect(
      formatComments(
        [
          {
            body:
              "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            belongs_to: "They're not exactly dogs, are they?",
            created_by: 'butter_bridge',
            votes: 16
          }
        ],
        {
          "They're not exactly dogs, are they?": 9
        }
      )
    ).to.eql([
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 9,
        author: 'butter_bridge',
        votes: 16
      }
    ]);
  });
  it('will correctly format several comments objects when passed an array containing more than one comment object', () => {
    expect(
      formatComments(
        [
          {
            body:
              "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            belongs_to: "They're not exactly dogs, are they?",
            created_by: 'butter_bridge',
            votes: 16
          },
          {
            body:
              'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
            belongs_to: 'Living in the shadow of a great man',
            created_by: 'butter_bridge',
            votes: 14
          },
          {
            body:
              'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
            belongs_to: 'Living in the shadow of a great man',
            created_by: 'icellusedkars',
            votes: 100
          }
        ],
        {
          "They're not exactly dogs, are they?": 9,
          'Living in the shadow of a great man': 1
        }
      )
    ).to.eql([
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 9,
        author: 'butter_bridge',
        votes: 16
      },
      {
        body:
          'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        article_id: 1,
        author: 'butter_bridge',
        votes: 14
      },
      {
        body:
          'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
        article_id: 1,
        author: 'icellusedkars',
        votes: 100
      }
    ]);
  });
  it('returns an array containing an object with the created_at date converted to a JavaScript date object when the passed in object contains a unix timestamp', () => {
    const formattedComment = formatComments(
      [
        {
          body:
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          belongs_to: "They're not exactly dogs, are they?",
          created_by: 'butter_bridge',
          votes: 16,
          created_at: 1511354163389
        }
      ],
      {
        "They're not exactly dogs, are they?": 1
      }
    );
    expect(formattedComment[0].created_at).to.be.instanceOf(Date);
  });
});
