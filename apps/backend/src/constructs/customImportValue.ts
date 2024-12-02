import { Fn } from 'aws-cdk-lib';
import { setResourceName } from '../helpers';

const customImportValue = (importValue: string) =>
  Fn.importValue(setResourceName(importValue));
export default customImportValue;
