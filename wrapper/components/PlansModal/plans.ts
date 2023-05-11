import { Plans } from 'models/user/user';

export type PlanType = {
  name: Plans;
  title: string;
  description: string;
  benefits: string[];
  tips: string[];
};

export const selfServicePlan: PlanType = {
  name: Plans.SELF_SERVICE,
  title: 'plans-selection.self_service',
  description: 'plans-selection.self_service-description',
  benefits: [
    'plans-selection.harness-the-full-power-of-the-platform',
    'plans-selection.explore-some-of-the-top-global-brands',
    'plans-selection.store-important-documents-in-your-vault',
    'plans-selection.list-brands-and-attract-partners',
    'plans-selection.receive-offers-for-deals',
    'plans-selection.access-to-a-pool-of-pre-vetted-licensees',
    'plans-selection.as-bip-evolves-have-access-to-powerful-technology',
  ],
  tips: [
    'plans-selection.self_service-tip',
  ],
};

export const fullServicePlan: PlanType = {
  name: Plans.FULL_SERVICE,
  title: 'plans-selection.full_service',
  description: 'plans-selection.full_service-description',
  benefits: [
    'plans-selection.access-to-the-self-service-package',
    'plans-selection.have-full-access-to-our-experienced-brand-specialists',
    'plans-selection.dealmaking-ideation',
    'plans-selection.introductions-between-licensees-and-licensors',
    'plans-selection.strategy-consulting',
    'plans-selection.licensing-consulting',
    'plans-selection.can-work-on-your-behalf-with-consent',
  ],
  tips: ['plans-selection.full_service-tip'],
};
