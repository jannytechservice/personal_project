import { util, Context, extensions } from '@aws-appsync/utils';

//https://docs.aws.amazon.com/appsync/latest/devguide/aws-appsync-real-time-enhanced-filtering.html

export function request() {
  return { payload: null };
}

export function response(ctx: Context) {
  const { entityId } = ctx.args;
  const filter = { entityId: { eq: entityId } };
  extensions.setSubscriptionFilter(util.transform.toSubscriptionFilter(filter));
  return null;
}
