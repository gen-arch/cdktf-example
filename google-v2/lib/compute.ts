import { Construct } from 'constructs';
import { ComputeInstance, ComputeNetwork, ComputeSubnetwork } from '../.gen/providers/google';

interface ComputeProps {
  zone:   { [key: string]: string },
  vpc:    ComputeNetwork,
  subnet: ComputeSubnetwork
}

export class Compute extends Construct {
  constructor(parent: Construct, name: string, props: ComputeProps) {
    super(parent, name);

    new ComputeInstance(this, 'ComputeInstance', {
      name: 'cdktf-instance',
      machineType: 'f1-micro',
      zone: props.zone.a,
      bootDisk: [{
        initializeParams: [{
          image: 'ubuntu-os-cloud/ubuntu-2004-lts',
          size: 20
        }]
      }],
      networkInterface: [{
        subnetwork: props.subnet.name,
      }],
      tags: ["web", "dev"],
      dependsOn: [props.subnet]
    })

  }
}