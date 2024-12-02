import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import {
  AnyPrincipal,
  Effect,
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { Bucket, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import * as path from 'path';
import { CustomCfnOutput } from '../constructs/customCfnOutput';
import customImportValue from '../constructs/customImportValue';
import { CustomStringParameter } from '../constructs/customStringParameter';
import { appName, env, isProd } from '../helpers/constants';

export class MediaStorageStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const unauthenticatedRoleArn = customImportValue('UnauthenticatedRoleArn');
    const unauthenticatedRole = Role.fromRoleArn(
      this,
      'identityPoolUnauthenticatedRole',
      unauthenticatedRoleArn
    );

    // authenticatedRole
    const authenticatedRoleArn = customImportValue('AuthenticatedRoleArn');
    const authenticatedRole = Role.fromRoleArn(
      this,
      'identityPoolAuthenticatedRole',
      authenticatedRoleArn
    );

    const mediaStorageBucket = new Bucket(this, 'S3MediaBucket', {
      bucketName: isProd
        ? `${appName.toLowerCase()}media`
        : `${appName.toLowerCase()}${env}media`,
      removalPolicy: isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      autoDeleteObjects: !isProd,
      cors: [
        {
          allowedMethods: [
            HttpMethods.GET,
            HttpMethods.POST,
            HttpMethods.PUT,
            HttpMethods.DELETE,
          ],
          allowedOrigins: ['*'], //TODO: check amplify behaviour
          allowedHeaders: ['*'], //TODO: check amplify behaviour
        },
      ],
      //TODO: see if necessary
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
      //TODO: should we change something here? for objectOwnership
      //objectOwnership: ,
      transferAcceleration: true,
    });

    new BucketDeployment(this, 'TranslationFiles', {
      sources: [
        Source.asset(path.join(__dirname, '../s3/media-storage-bucket')),
      ],
      destinationBucket: mediaStorageBucket,
    });

    // allow unauthenticated guests read access to the bucket.
    mediaStorageBucket.addToResourcePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['s3:GetObject'],
        principals: [new AnyPrincipal()],
        resources: [
          `arn:aws:s3:::${mediaStorageBucket.bucketName}/public/*`,
          `arn:aws:s3:::${mediaStorageBucket.bucketName}/translations/*`,
        ],
      })
    );

    // unauthenticated role policy for s3 bucket
    new ManagedPolicy(this, 'mangedPolicyForAmplifyUnauth', {
      // TODO: rename to S3UnauthenticatedPolicy
      description: 'Policy to allow unauthenticated usage of s3',
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['s3:GetObject'],
          resources: [`arn:aws:s3:::${mediaStorageBucket.bucketName}/public/*`],
        }),
        //new PolicyStatement({
        //  effect: Effect.ALLOW,
        //  actions: ['s3:GetObject'],
        //  resources: [
        //    `arn:aws:s3:::${mediaStorageBucket.bucketName}/protected/*`,
        //  ],
        //}),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['s3:ListBucket'],
          resources: [`arn:aws:s3:::${mediaStorageBucket.bucketName}`],
          conditions: {
            StringLike: {
              's3:prefix': ['public/', 'public/*', 'protected/', 'protected/*'],
            },
          },
        }),
      ],
      roles: [unauthenticatedRole],
    });

    // authenticated role policy for s3 bucket
    new ManagedPolicy(this, 'mangedPolicyForAmplifyAuth', {
      description: 'Policy to allow authenticated usage of s3',
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['s3:PutObject', 's3:GetObject', 's3:DeleteObject'],
          resources: [`arn:aws:s3:::${mediaStorageBucket.bucketName}/public/*`],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['s3:PutObject', 's3:GetObject', 's3:DeleteObject'],
          resources: [
            `arn:aws:s3:::${mediaStorageBucket.bucketName}/protected/\${cognito-identity.amazonaws.com:sub}/*`,
          ],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['s3:PutObject', 's3:GetObject', 's3:DeleteObject'],
          resources: [
            `arn:aws:s3:::${mediaStorageBucket.bucketName}/private/\${cognito-identity.amazonaws.com:sub}/*`,
          ],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['s3:GetObject'],
          resources: [
            `arn:aws:s3:::${mediaStorageBucket.bucketName}/protected/*`,
          ],
        }),
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['s3:ListBucket'],
          resources: [`arn:aws:s3:::${mediaStorageBucket.bucketName}`],
          conditions: {
            StringLike: {
              's3:prefix': [
                'public/',
                'public/*',
                'protected/',
                'protected/*',
                'private/${cognito-identity.amazonaws.com:sub}/',
                'private/${cognito-identity.amazonaws.com:sub}/*',
              ],
            },
          },
        }),
      ],
      roles: [authenticatedRole],
    });

    // email storage bucket
    const ocrEmailStorageBucket = new Bucket(this, 'S3OcrEmailBucket', {
      bucketName: isProd
        ? `${appName.toLowerCase()}ocremails`
        : `${appName.toLowerCase()}${env}ocremails`,
      removalPolicy: isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      autoDeleteObjects: !isProd,
    });

    ocrEmailStorageBucket.addToResourcePolicy(
      new PolicyStatement({
        actions: ['s3:PutObject'],
        resources: [`${ocrEmailStorageBucket.bucketArn}/*`],
        principals: [new ServicePrincipal('ses.amazonaws.com')],
      })
    );

    new CustomCfnOutput(this, 'MediaBucketName', {
      value: mediaStorageBucket.bucketName,
      exportName: 'MediaBucketName',
    });

    new CustomStringParameter(this, 'MediaBucketNameString', {
      parameterName: 'MediaBucketName',
      stringValue: mediaStorageBucket.bucketName,
    });

    new CustomCfnOutput(this, 'OcrEmailBucketName', {
      value: ocrEmailStorageBucket.bucketName,
      exportName: 'OcrEmailBucket',
    });

    //new CustomCfnOutput(this, 'MediaStorageBucketName', {
    //  value: mediaStorageBucket.bucketName,
    //  exportName: 'MediaStorageBucketName',
    //});

    new CustomCfnOutput(this, 'MediaBucketRegion', {
      value: this.region,
      exportName: 'MediaBucketRegion',
    });
  }
}
