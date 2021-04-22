import { Construct } from 'constructs';
import { 
  ComputeNetwork,
  ComputeSubnetwork,
  ComputeFirewall,
  VpcAccessConnector
} from '../.gen/providers/google';

export class Network extends Construct {
  public readonly vpc:        ComputeNetwork;
  public readonly subnet:     ComputeSubnetwork;
  public readonly connector:  VpcAccessConnector;

  constructor(parent: Construct, name: string) {
    super(parent, name);

    const network = new ComputeNetwork(this, 'network', {
      name: `network`,
      autoCreateSubnetworks: false,
    })

    const subnet = new ComputeSubnetwork(this, 'subnet', {
      name: 'subnet',
      network: network.name,
      privateIpGoogleAccess: true,
      ipCidrRange: "172.16.0.0/24",
      dependsOn: [network]
    })

    const connector = new VpcAccessConnector(this, 'connector', {
      name: 'vpc-connector',
      network: network.name,
      ipCidrRange: "10.8.0.0/28",
      dependsOn: [network]
    })

    new ComputeFirewall(this, 'firewall-ingress-iap', {
      name: "allow-ingress-from-iap",
      network: network.name,
      direction: "INGRESS",
      priority: 1000,
      sourceRanges: ["35.235.240.0/20"],
      allow: [
        {
          ports: ["22"],
          protocol: "tcp"
        }
      ],
      dependsOn: [network]
    })

    this.vpc        = network
    this.subnet     = subnet
    this.connector  = connector
  }
}