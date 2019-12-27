import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');
import autoscaling = require('@aws-cdk/aws-autoscaling');
import iam = require('@aws-cdk/aws-iam');
import { BastionHostLinux, SubnetType } from '@aws-cdk/aws-ec2';
import { Asset } from '@aws-cdk/aws-s3-assets';

const path = require('path');

export class McdemoCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC');

    // TODO: add tgw when Multicast is supported in CFN/CDK, use CLI  from Bastion Host in the meantime

    const bastionhost = new ec2.BastionHostLinux(this, 'BastionHost', {vpc: vpc});
    bastionhost.instance.userData.addCommands(
      'yum install -y tmux',
      '\n',
    );
    
    bastionhost.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')); // WARNING: Adds full Admin Access to the Bastion Host Instance Role

    const asgrole = new iam.Role(this, 'ASGROLE', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
    });

    asgrole.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['ssmmessages:*',
        'ssm:UpdateInstanceInformation',
        'ec2messages:*',
        ] }));

    const asgsg = new ec2.SecurityGroup(this, 'ASGSG', {
      vpc,
    });
    
    asgsg.addIngressRule(ec2.Peer.ipv4(vpc.vpcCidrBlock), ec2.Port.allTraffic(), 'Open from same SG');

    const asglinux = new autoscaling.AutoScalingGroup(this, 'ASGLINUX', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      desiredCapacity: 3,
      role: asgrole,
    });

    asglinux.addSecurityGroup(asgsg);

    asglinux.userData.addCommands(
      'yum update -y',
      'yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm',
      'yum install -y iperf',
      '\n',
    );

  }
}
