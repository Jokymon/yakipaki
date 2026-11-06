export const lightColors = {
  background: '#F7F4EC', surface: '#FFFFFF', ink: '#18261E', muted: '#66736B',
  primary: '#276749', primarySoft: '#DDECE2', accent: '#F0A35E', border: '#DFE3DC',
  danger: '#B64040', shopping: '#79553A', shoppingSoft: '#F6E8D8', field: '#FAFBF8',
  placeholder: '#929C95', divider: '#EFF1ED', inactive: '#869189', scrim: 'rgba(15,25,18,0.35)',
  nav: 'rgba(255,255,255,0.97)', handle: '#B9C0BA', checkbox: '#AEB8B1', destructiveMuted: '#9B6A6A',
  onPrimary: '#FFFFFF'
};

export type ThemeColors = { [Key in keyof typeof lightColors]: string };

export const darkColors: ThemeColors = {
  background: '#101713', surface: '#19221D', ink: '#F0F4F1', muted: '#A7B3AB',
  primary: '#70C28E', primarySoft: '#243D2D', accent: '#F0A35E', border: '#35413A',
  danger: '#F08B8B', shopping: '#EDC59F', shoppingSoft: '#493727', field: '#202A24',
  placeholder: '#7F8E85', divider: '#2B3730', inactive: '#87958C', scrim: 'rgba(0,0,0,0.62)',
  nav: 'rgba(25,34,29,0.98)', handle: '#5B6860', checkbox: '#718078', destructiveMuted: '#D68F8F',
  onPrimary: '#102016'
};

// Kept as an alias for non-React modules. UI components should use useTheme().
export const colors = lightColors;

export const categoryColors = ['#D78A5C', '#5E87A6', '#55866A', '#A272A8', '#C1A34B', '#5C9B96'];
