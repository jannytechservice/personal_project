# Admiin

## REACT APP
From the project root run `yarn nx serve react-app`. Open your browser and navigate to http://localhost:4200/. (or the port that it's run on)

#### pspdfkit - https://pspdfkit.com/getting-started/web/?frontend=react&download=npm&integration=module&project=existing-project
cp -R ./node_modules/pspdfkit/dist/pspdfkit-lib apps/react-app/public/pspdfkit-lib

## NEW ENVIRONMENT

### Backend
1. Need to place environment file at `apps/backend/src/.env`
2. Deploy Route stack, Layer stack, Database Stack, Auth stack
   - `yarn nx deploy backend ADM{backendEnvName}Route53Stack --require-approval=never --profile admiin`
   - `yarn nx deploy backend ADM{backendEnvName}LayerStack --require-approval=never --profile admiin`
   - `yarn nx deploy backend ADM{backendEnvName}DatabaseStack --require-approval=never --profile admiin`
   - `yarn nx deploy backend ADM{backendEnvName}AuthStack --require-approval=never --profile admiin`
2. Get the userPoolId for the newly created environment and update `apps/backend/src/helpers/constants.ts`
3. Deploy entire backend stack (e.g. `yarn nx deploy backend --all --require-approval=never --profile admiin`)
2. Add Zai ssm (ZaiSecrets-${ENV}) https://console.aws.amazon.com/secretsmanager
** webhook secret https://dashboard.hellozai.com/
** client secret to (can generate from generateWebhookSecret - yarn test:backend and it should log. NOTE: test will get cached, generate another key by updating test or file)
3. Run init env functions

#### SES / route53 stack
Once SES ruleset is created, it must be "Set as active" in the SES console (SES => Email Receiving => Rule Sets) 
OR potentially commandline (untested aws ses set-active-receipt-rule-set --rule-set-name SomeNameOfRuleSet)

#### Troubleshooting

##### Old SSM params / invalid
1. Check SSM correct
2. Clear cdk context of old ssm param `yarn cdk context --reset ${param name from ctk.context.json}`

### Frontend
1. Need to place environment file at `apps/react-app/.env`
2. Need to update backendExports.json with correct environment variables `apps/react-app/public`
For example (may fall out of date): 
```
{
  "graphQLAPIKey": "",
  "graphQLAPIURL": "",
  "identityPoolId": "",
  "userPoolId": "",
  "userPoolClientId": "",
  "mediaBucketName": "",
  "placeIndexName": "",
  "region": "",
  "restApiGatewayEndpoint": "",
  "restApiName": "",
  "pinpointAppId": "",
  "verificationUrl": ""
}
3. Need to do `yarn generate-cert` for local https running
```

## Backend development
### Getting started
aws configure sso

```
sso_start_url = https://admiin.awsapps.com/start#
sso_region = us-east-1
sso_account_id = 035308050347
sso_role_name = PowerUserAccess
region = us-east-1
output = json
```

aws sso login --profile admiin


### NX cli usage in project 

See below how to create apps, libs, components, etc. Remove --dryRun flag to create files

How workspace was created
```
npx create-nx-workspace@latest web-template --preset=react-monorepo --appName=react-app --packageManager=yarn --bundler=vite --pascalCaseFiles=true --unitTestRunner=vitest --style=@emotion/styled --dryRun
```
Create an application
```
npx nx g @nx/react:application backoffice-app --bundler=vite  --style=@emotion/styled --pascalCaseFiles=true --dryRun
```

Create a react library
```
npx nx g @nx/react:library --bundler=vite --importPath=@admiin-com/ds-amplify-web --pascalCaseFiles=true --publishable=true --name=amplify-web  --style=@emotion/styled --dryRun
```

Create a library
```
npx nx g @nx/js:lib -bundler=vite --importPath=@admiin-com/ds-graphql --pascalCaseFiles=true --publishable=true --name=graphql --bundler=vite --unitTestRunner=vitest --dryRun
```

Create a component
```
npx nx g @nx/react:component --project=react-app --pascalCaseFiles=true --pascalCaseDirectory=true --export=false --directory=app/components componentName --dryRun
npx nx g @nx/react:component --project=react-app --pascalCaseFiles=true --pascalCaseDirectory=true --export=false --directory=app/pages XeroRedirect --dryRun
npx nx g @nx/react:component --project=design-system-web --pascalCaseFiles=true --pascalCaseDirectory=true --export=false --directory=lib/components/composites CollapsibleButton --dryRun
yarn nx g c --project=design-system-web --pascalCaseFiles=true --pascalCaseDirectory=true --directory=lib/components/transitions --export=false Collapse --dryRun

```
design-system-web
```

Test a specific file
```
yarn nx test design-system-web --testFile=lib/components/composites/CollapsibleButton.spec.tsx
yarn nx test backend --testFile=apps/backend/src/test/appsync/resolvers/createNotification.test.ts
yarn nx test react-app --testFile=apps/react-app/src/app/components/PdfSignature/PdfSignature.spec.tsx
yarn nx test react-app --testFile=apps/react-app/src/app/components/PdfViewer/PdfViewer.spec.tsx
```

## Generate code

If you happen to use Nx plugins, you can leverage code generators that might come with it.

Run `nx list` to get a list of available plugins and whether they have generators. Then run `nx list <plugin-name>` to see what generators are available.

Learn more about [Nx generators on the docs](https://nx.dev/plugin-features/use-code-generators).

## Running tasks

To execute tasks with Nx use the following syntax:

```
nx <target> <project> <...options>
```

You can also run multiple targets:

```
nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/core-features/run-tasks).

## Basic tech debt notes

### eslintrc-custom-overrides.json
- imported as override for each eslint.
- resolveJsonModule is set for importing output.json which are values from cdk backend of aws resources
      
## Troubleshooting

### Xero SSO
- <ScrictMode> renders the app twice which prevents the Xero SSO from working. Comment <StrictMode> out to work

### Backend
Error messages

_You can mark the path "@aws-crypto/util" as external to exclude it from the bundle, which will remove this error. You can also surround this "require" call with a try/catch block to handle this failure at run-time instead of bundle-time._
- Check not somewhere is not importing a library incorrectly  
- OR check and delete yarn files from changing yarn version in root of laptop (global installation)
- OR Add as "external" to esbuild / buildSync commands

#### Frankeione types
yarn swagger-typescript-api -p https://apidocs.frankiefinancial.com/openapi/5f7ab68ad5793c0040d53186 -o /Users/dylanwestbury/Development/monorepos/adm-web/apps/backend/src/layers/dependencyLayer/opt/frankieone/ -n frankieone.types.ts

