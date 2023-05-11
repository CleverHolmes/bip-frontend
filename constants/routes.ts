const routes = {
  404: '/404',
  home: '/',
  earlyAccess: '/early-access',
  resetPassword: '/reset-password',
  onboarding: '/onboarding',
  vault: '/vault',
  dashboard: '/dashboard',
  dealStatus: '/deal-status',
  chat: '/chat',
  chatConversation: '/chat/[conversationId]',
  explore: '/explore',
  congrats: '/congrats',
  addProduct: '/add-product',
  brandAdded: '/brand-added',
  brandSpecialist: '/brand-specialist',
  addLicensor: '/add-client',
  quarterlyVerification: '/quarterly-verification',
  robotsTxt: '/robots.txt',
  settings: '/settings',
  settingsProfile: '/settings/profile',
  settingsNotifications: '/settings/notifications',
  settingsLicensors: '/settings/licensors',
  settingsAuthorizedUsers: '/settings/authorized-users',
  settingsBrands: '/settings/brands',
  notificationSuppression: '/notification-suppression',
  subscribe: '/subscribe',
  privacyPolicy: '/BIP_Market_Privacy_Policy.pdf',
  licensorTerms: '/BIP_Market_Terms_of_Use.pdf',
  licenseeTerms: '/BIP_Market_Terms_of_Use.pdf',
  termsOfUse: '/BIP_Market_Terms_of_Use.pdf',
} as const;

export default routes;