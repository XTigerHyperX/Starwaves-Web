export type AnalyticsEvent =
  | 'service_card_open'
  | 'service_quote_click'
  | 'package_quote_click'
  | 'download_brief'
  | 'advisor_start'
  | 'advisor_submit'
  | 'open_estimator'
  | 'consult_click'
  | 'service_quickview_open'
  | 'cta_sticky_click'
  | 'service_section_view'
  | 'estimator_submit';

export function track(event: AnalyticsEvent, payload?: Record<string, any>) {
  // TODO: wire to real analytics (GA4, PostHog, etc.)
  try {
    console.debug('[analytics]', event, payload || {});
  } catch {}
}

export function useTrack() {
  return track;
}
