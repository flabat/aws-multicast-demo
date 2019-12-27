#!/usr/bin/env node

import 'source-map-support/register';
import cdk = require('@aws-cdk/core');  
import { McdemoCdkStack } from '../lib/mcdemo-cdk-stack';

const app = new cdk.App();
new McdemoCdkStack(app, 'McdemoCdkStack');
