import { Context, OpenSearchRequest } from '@aws-appsync/utils';
import { ContactStatus } from '../API';

export function request(ctx: Context): OpenSearchRequest {
  const { entityId, searchName, limit = 20, from = 0 } = ctx.args;

  const mustFilters = [
    { term: { entityId } },
    { term: { status: ContactStatus.ACTIVE } },
  ];

  const shouldFilters = [];

  if (searchName) {
    shouldFilters.push(
      {
        bool: {
          should: [
            {
              match: {
                firstName: {
                  query: searchName,
                  fuzziness: 'AUTO',
                },
              },
            },
            {
              match: {
                lastName: {
                  query: searchName,
                  fuzziness: 'AUTO',
                },
              },
            },
            {
              match: {
                fullName: {
                  query: searchName,
                  operator: 'and',
                  fuzziness: 'AUTO',
                },
              },
            },
          ],
          minimum_should_match: 1,
        },
      },
      {
        match: {
          name: {
            query: searchName,
            fuzziness: 'AUTO',
          },
        },
      },
      { prefix: { email: searchName } },
      { prefix: { taxNumber: searchName } }
    );
  }

  const query: any = {
    bool: {
      filter: mustFilters,
      ...(shouldFilters.length > 0 && {
        should: shouldFilters,
        minimum_should_match: 1,
      }),
    },
  };

  return {
    operation: 'GET',
    path: '/contact/_search',
    params: {
      headers: {},
      queryString: {},
      body: {
        from: from,
        size: limit,
        sort: [{ createdAt: { order: 'asc' } }],
        query: query,
      },
    },
  };
}

export function response(ctx: Context) {
  const entries = ctx?.result?.hits?.hits?.map((hit: any) => hit._source) ?? [];
  const total = ctx?.result?.hits?.total?.value ?? 0;
  return { items: entries, total };
}
