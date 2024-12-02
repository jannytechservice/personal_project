#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { join } from 'path';
import { setResourceName } from './helpers';
import { account, region } from './helpers/constants';
import { AppSyncApiStack } from './stacks/appSyncApiStack';
import { AuthStack } from './stacks/authStack';
import { DatabaseStack } from './stacks/databaseStack';
// import { FrontendStack } from './stacks/frontendStack';
import { LogStack } from './stacks/logStack';
import { MediaStorageStack } from './stacks/mediaStorageStack';
import { LayerStack } from './stacks/layerStack';
import { OpenSearchStack } from './stacks/openSearchStack';
import { PinpointStack } from './stacks/pinpointStack';
import { RestApiStack } from './stacks/restApiStack';
import { Route53Stack } from './stacks/route53Stack';
import { ServicesStack } from './stacks/servicesStack';

import * as dotenv from 'dotenv';
import { FrontendStack } from './stacks/frontendStack';

dotenv.config({ path: join(__dirname, '..', '.env') });

const defaultEnv = {
  account,
  region,
};

const app = new App();

const route53Stack = new Route53Stack(app, setResourceName('Route53Stack'), {
  env: {
    ...defaultEnv,
  },
});

const layerStack = new LayerStack(app, setResourceName('LayerStack'), {
  env: {
    ...defaultEnv,
  },
});

const databaseStack = new DatabaseStack(app, setResourceName('DatabaseStack'), {
  env: {
    ...defaultEnv,
  },
});
databaseStack.addDependency(layerStack);

const authStack = new AuthStack(app, setResourceName('AuthStack'), {
  env: {
    ...defaultEnv,
  },
  zone: route53Stack.zone,
});

authStack.addDependency(route53Stack);
authStack.addDependency(databaseStack);

// media storage bucket for files
const mediaStorageStack = new MediaStorageStack(
  app,
  setResourceName('MediaStorageStack'),
  {
    env: {
      ...defaultEnv,
    },
  }
);

mediaStorageStack.addDependency(authStack);

const openSearchStack = new OpenSearchStack(
  app,
  setResourceName('OpenSearchStack'),
  {
    env: {
      ...defaultEnv,
    },
  }
);

const pinpointStack = new PinpointStack(app, setResourceName('PinpointStack'), {
  env: {
    ...defaultEnv,
  },
});

const restApiStack = new RestApiStack(app, setResourceName('RestApiStack'), {
  env: {
    ...defaultEnv,
  },
  zone: route53Stack.zone,
});

restApiStack.addDependency(authStack);
restApiStack.addDependency(databaseStack);

const appSyncStack = new AppSyncApiStack(
  app,
  setResourceName('AppSyncApiStack'),
  {
    env: {
      ...defaultEnv,
    },
    zone: route53Stack.zone,
  }
);

appSyncStack.addDependency(authStack);

const servicesStack = new ServicesStack(app, setResourceName('ServicesStack'), {
  env: {
    ...defaultEnv,
  },
});

servicesStack.addDependency(appSyncStack);
servicesStack.addDependency(authStack);
servicesStack.addDependency(databaseStack);
servicesStack.addDependency(layerStack);
servicesStack.addDependency(mediaStorageStack);
servicesStack.addDependency(openSearchStack);
servicesStack.addDependency(pinpointStack);
servicesStack.addDependency(restApiStack);

const frontendStack = new FrontendStack(app, setResourceName('FrontendStack'), {
  env: {
    ...defaultEnv,
  },
  zone: route53Stack.zone,
});

frontendStack.addDependency(servicesStack);

new LogStack(app, setResourceName('LogStack'), {
  env: {
    ...defaultEnv,
  },
});

//new CiCdStack(app, 'CiCdStack', {
//  env: {
//    ...defaultEnv,
//  },
//  repoPath: 'apptractive/project-template',
//  branch: 'main',
//  directory: 'backend-app',
//  stage,
//  connectionArn
//});

app.synth();

//Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }))
