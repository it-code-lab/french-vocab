export const theme = {
  colors: {
    bg1: '#09101f',
    bg2: '#11192d',
    panel: 'rgba(255,255,255,0.08)',
    panelStrong: 'rgba(255,255,255,0.12)',
    border: 'rgba(255,255,255,0.14)',
    text: '#f7f9ff',
    muted: '#b8c2df',
    soft: '#8f9bbb',
    primary: '#4f7cff',
    primary2: '#7567ff',
    success: '#18c29c',
    danger: '#ff6b6b',
    warning: '#ffb020',
    cardBg: 'rgba(12,18,34,0.94)',
  },
  gradients: {
    background: ['#09101f', '#11192d'] as const,
    primary: ['#4f7cff', '#7567ff'] as const,
    panelOverlay: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)'] as const,
  },
  radius: {
    lg: 24,
    md: 18,
    sm: 14,
    pill: 999,
  },
  shadow: {
    card: {
      shadowColor: '#000',
      shadowOpacity: 0.35,
      shadowRadius: 22,
      shadowOffset: { width: 0, height: 12 },
      elevation: 10,
    },
  },
};
