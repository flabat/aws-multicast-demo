#!/usr/bin/env node

const envDemo = { account: '741142690061', region: 'us-east-1' };

import 'source-map-support/register';
import cdk = require('@aws-cdk/core');  
import { McdemoCdkStack } from '../lib/mcdemo-cdk-stack';

const app = new cdk.App();
new McdemoCdkStack(app, 'McdemoCdkStack', { env: envDemo });
