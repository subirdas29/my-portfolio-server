export type TPageView = {
  url?: string;
  referrer?: string;
  device?: 'mobile' | 'tablet' | 'desktop';
  country?: string;
  ipHash?: string;
  sessionId?: string;
  duration?: number;
  scrollDepth?: number;
  event?: 'pageview' | 'session_end';
};
