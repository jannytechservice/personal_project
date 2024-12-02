import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { DynamoDbDataSource, IGraphqlApi } from 'aws-cdk-lib/aws-appsync';
import {
  Effect,
  IRole,
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { CustomCfnOutput } from '../constructs/customCfnOutput';
import { CustomStringParameter } from '../constructs/customStringParameter';
import { JsResolverConstruct } from '../constructs/jsResolverConstruct';
import { CfnPlaceIndex } from 'aws-cdk-lib/aws-location';
import { setResourceName } from '../helpers';
import { account, region } from '../helpers/constants';

interface SearchServiceStackProps extends NestedStackProps {
  appSyncApi: IGraphqlApi;
  authenticatedRole: IRole;
  autoCompleteResultsDS: DynamoDbDataSource;
}

const indexName = 'EsriPlaceIndexName';

export class SearchServiceStack extends NestedStack {
  constructor(scope: Construct, id: string, props: SearchServiceStackProps) {
    super(scope, id, props);
    // AUTOCOMPLETE RESULTS
    // query autocomplete results by type
    new JsResolverConstruct(this, 'AutocompleteResultsByTypeResolver', {
      api: props.appSyncApi,
      dataSource: props.autoCompleteResultsDS,
      typeName: 'Query',
      fieldName: 'autocompleteResultsByType',
      pathName: 'Query.autocompleteResultsByType',
    });

    // Define the Amazon Location Service place index resource
    const placeIndex = new CfnPlaceIndex(this, 'PlaceIndex', {
      dataSource: 'Esri',
      indexName: setResourceName(indexName),
    });

    //TODO: remove duplicate values
    //new CfnOutput(this, 'PlaceIndexName', {
    //  value: placeIndex.indexName,
    //  exportName: setResourceName('PlaceIndexName'),
    //});

    new CustomCfnOutput(this, 'PlaceIndexName', {
      value: placeIndex.indexName,
      exportName: 'PlaceIndexName',
    });

    //new StringParameter(this, 'PlaceIndexNameString', {
    //  parameterName: setResourceName('placeIndexName'),
    //  stringValue: placeIndex.indexName,
    //});

    new CustomStringParameter(this, 'PlaceIndexNameString', {
      parameterName: 'placeIndexName',
      stringValue: placeIndex.indexName,
    });

    const locationServiceRole = new Role(this, 'LocationServiceRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'), // Adjust the ServicePrincipal as needed
      // ... other role configurations ...
    });

    locationServiceRole.addToPolicy(
      new PolicyStatement({
        actions: [
          'geo:SearchPlaceIndexByText',
          'geo:SearchPlaceIndexByPlaceId',
          'geo:SearchPlaceIndexForSuggestions',
          'geo:SearchPlaceIndexForPosition',
          'geo:SearchPlaceIndexForText',
          'geo:SearchPlaceIndex',
          'geo:GetPlace',
        ], // Include other actions as needed
        resources: [
          placeIndex.attrArn,
          `arn:aws:geo:${region}:${account}:place-index/${indexName}`,
        ], // Reference the Place Index ARN
      })
    );

    new ManagedPolicy(this, 'mangedPolicyForAmplifyAuth', {
      description: 'managed Policy to allow usage of location service for auth',
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            'geo:SearchPlaceIndexByText',
            'geo:SearchPlaceIndexByPlaceId',
            'geo:SearchPlaceIndexForSuggestions',
            'geo:SearchPlaceIndexForPosition',
            'geo:SearchPlaceIndexForText',
            'geo:SearchPlaceIndex',
            'geo:GetPlace',
          ],
          resources: [
            placeIndex.attrArn,
            `arn:aws:geo:${region}:${account}:place-index/${indexName}`,
          ],
        }),
      ],
      roles: [props.authenticatedRole],
    });
  }
}
