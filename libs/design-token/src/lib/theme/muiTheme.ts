import { ThemeOptions } from '@mui/material';

export const muiTheme: ThemeOptions = {
  shape: { borderRadius: 0 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          //textTransform: "uppercase",
          fontWeight: 600,
        },
        outlined: {
          border: '2px solid', // Setting the border to 2px for outlined variant
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          marginRight: '8px',
          marginBottom: '8px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontWeight: 400,
          border: '1px solid',
          borderWidth: 1,
        },
      },
    },
    MuiStepContent: {
      styleOverrides: {
        root: {
          borderTop: '1px solid #ddd', // Use theme.palette.divider if available
          borderLeft: 0,
          marginLeft: 0,
          marginTop: '8px', // Use theme.spacing(1) if available
          padding: 0,
          paddingTop: '16px', // Use theme.spacing(2) if available
        },
      },
    },
    MuiStep: {
      styleOverrides: {
        root: {
          marginTop: '8px', // Use theme.spacing(1) if available
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontSize: '1rem',
          fontWeight: 700,
          '&.Mui-active': {
            fontWeight: 700,
          },
        },
        iconContainer: {
          '& .MuiSvgIcon-root': {
            fontWeight: 700,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0,
          },
          '&[type=number]': {
            '-moz-appearance': 'textfield',
          },
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
    },
    //MuiTextField: {
    //  styleOverrides: {
    //    root: {
    //      '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
    //        {
    //          display: 'none',
    //        },
    //      '& input[type=number]': {
    //        MozAppearance: 'textfield',
    //      },
    //    },
    //  },
    //},
  },
};
