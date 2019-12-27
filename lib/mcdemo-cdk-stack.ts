import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');
import autoscaling = require('@aws-cdk/aws-autoscaling');
import { BastionHostLinux } from '@aws-cdk/aws-ec2';


export class McdemoCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

// The code that defines your stack goes here

    const pemkey = 'mcdemo.pem';

    const vpc = new ec2.Vpc(this, 'VPC');

    // TODO: add tgw when Multicast is supported in CFN/CDK

    const bastionhost = new ec2.BastionHostLinux(this, 'BastionHost', {vpc: vpc});

    const asg = new autoscaling.AutoScalingGroup(this, 'ASG', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE),
      machineImage: new ec2.AmazonLinuxImage(),
      desiredCapacity: 3,
      keyName: pemkey,
    });

    asg.connections.allowFromAnyIpv4;
    asg.userData.addCommands(
      '#!/bin/bash -xe',
      'yum -y update',
      'yum -y install https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm',
      'yum -y install iperf'
    );

  }
}
