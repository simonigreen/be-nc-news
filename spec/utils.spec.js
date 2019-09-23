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

describe('makeRefObj', () => {});

describe('formatComments', () => {});
