import { Construct } from 'constructs';
import { App, TerraformStack, GcsBackend } from 'cdktf';
import { Network } from './lib/netwotk';
import { Compute } from './lib/compute';
import { GoogleProvider, ProjectService } from './.gen/providers/google'

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    const project: string = "terraform-cdk-example"
    const region:  string = "asia-northeast1"
    const zone: { [key: string]: string } = {
      a: `${region}-a`,
      b: `${region}-b`,
      c: `${region}-c`,
    }

    const services: string[] = [
      'compute.googleapis.com',
      'vpcaccess.googleapis.com',
    ]

    new GcsBackend(this, {
      bucket: "cdktf-state",
      prefix: "terraform/state"
    });

    new GoogleProvider(this, 'Google', {
      region: region,
      zone: zone.a,
      project: project,
    })

    services.forEach(api => {
      new ProjectService(this, `${api}-service`, {
        service: api
      })
    });
    

    const network = new Network(this, 'Network');
    new Compute(this, 'Compute', {zone: zone, vpc: network.vpc, subnet: network.subnet});
  }
}

const app = new App();
new MyStack(app, 'google-v2');
app.synth();
