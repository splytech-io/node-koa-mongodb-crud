import { expect } from 'chai';
import { ListRecordsEndpointHelper } from './list-records-endpoint.helper';
import { createCollection } from './test-helpers';

describe('list-records-endpoint.helper', () => {

  describe('.parseOptions()', () => {
    it('should construct default settings', () => {
      const { filter, pipeline } = ListRecordsEndpointHelper.parseOptions({});

      expect(filter).to.deep.equals({});
      expect(pipeline).to.deep.equals([
        {
          $project: { '_id': 1 },
        },
      ]);
    });
    it('should parse custom filter options', () => {
      const { filter, pipeline } = ListRecordsEndpointHelper.parseOptions({
        filter: JSON.stringify({
          status: 'one',
        }),
      });

      expect(filter).to.deep.equals({
        status: 'one',
      });
      expect(pipeline).to.deep.equals([
        {
          $match: {
            status: 'one',
          },
        }, {
          $project: { '_id': 1 },
        },
      ]);
    });
    it('should override filter options with forceFilters', () => {
      const { filter, pipeline } = ListRecordsEndpointHelper.parseOptions({
        filter: JSON.stringify({
          status: 'one',
        }),
        forceFilter: {
          status: 'two',
        },
      });

      expect(filter).to.deep.equals({
        status: 'two',
      });
      expect(pipeline).to.deep.equals([
        {
          $match: {
            status: 'two',
          },
        }, {
          $project: { '_id': 1 },
        },
      ]);
    });
    it('should parse just forceFilters', () => {
      const { filter, pipeline } = ListRecordsEndpointHelper.parseOptions({
        forceFilter: {
          status: 'two',
        },
      });

      expect(filter).to.deep.equals({
        status: 'two',
      });
      expect(pipeline).to.deep.equals([
        {
          $match: {
            status: 'two',
          },
        }, {
          $project: { '_id': 1 },
        },
      ]);
    });
    it('should parse sort rules', () => {
      const { filter, pipeline } = ListRecordsEndpointHelper.parseOptions({
        sort: '+one,-two,+three',
      });

      expect(filter).to.deep.equals({});
      expect(pipeline).to.deep.equals([
        {
          $sort: {
            one: 1,
            two: -1,
            three: 1,
          },
        }, {
          $project: { '_id': 1 },
        },
      ]);
    });
    it('should parse offset rules', () => {
      const { filter, pipeline } = ListRecordsEndpointHelper.parseOptions({
        offset: 3,
      });

      expect(filter).to.deep.equals({});
      expect(pipeline).to.deep.equals([
        {
          $skip: 3,
        }, {
          $project: { '_id': 1 },
        },
      ]);
    });
    it('should parse limit rules', () => {
      const { filter, pipeline } = ListRecordsEndpointHelper.parseOptions({
        limit: 3,
      });

      expect(filter).to.deep.equals({});
      expect(pipeline).to.deep.equals([
        {
          $limit: 3,
        }, {
          $project: { '_id': 1 },
        },
      ]);
    });
    it('should parse fields rules', () => {
      const { filter, pipeline } = ListRecordsEndpointHelper.parseOptions({
        fields: 'name,surname',
      });

      expect(filter).to.deep.equals({});
      expect(pipeline).to.deep.equals([
        {
          $project: {
            '_id': 1,
            'name': '$name',
            'surname': '$surname',
          },
        },
      ]);
    });
    it('should parse project rules', () => {
      const { filter, pipeline } = ListRecordsEndpointHelper.parseOptions({
        project: { name: 1 },
      });

      expect(filter).to.deep.equals({});
      expect(pipeline).to.deep.equals([
        {
          $project: {
            '_id': 1,
            'name': 1,
          },
        },
      ]);
    });
  });

  describe('.exec()', () => {

    it('should return right values', async () => {
      const collection = createCollection();
      const result = await ListRecordsEndpointHelper.exec(collection, {
        forceFilter: { date: '2017' },
        cast: { date: Date },
      });

      expect(result.count).to.equals(3);
      expect(result.records.length).to.equals(3);
      expect(result.filter).to.deep.equals({
        date: new Date('2017'),
      });
    });
  });
});
