const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.js'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', ...defaultTheme.fontFamily.sans]
      },
      minWidth: {
        8: '2rem',
        '75px': '75px',
        '96px': '96px',
        '100px': '100px',
        '155px': '155px',
        '163px': '163px',
        '166px': '166px',
        '180px': '180px',
        '200px': '200px',
        '250px': '250px',
        '300px': '300px',
        '312px': '312px'
      },
      maxWidth: {
        '1/2': '50%',
        '3/4': '75%%',
        '16px': '16px',
        '75px': '75px',
        '100px': '100px',
        '155px': '155px',
        '180px': '180px',
        '320px': '320px',
        '312px': '312px',
        'cms-content': 'calc(100% - 300px)',
        'add-role-form': 'calc(100% - 64px)'
      },
      maxHeight: {
        '28px': '28px'
      },
      width: {
        '24px': '24px',
        '48px': '48px',
        '75px': '75px',
        '100px': '100px',
        '120px': '120px',
        '155px': '155px',
        '180px': '180px',
        '200px': '200px',
        '250px': '250px',
        // '335px': '335px',
        '300px': '300px',
        '312px': '312px',
        'cms-header': 'calc(100% - 300px)'
      },
      height: {
        '24px': '24px',
        '30px': '30px',
        '48px': '48px',
        '50px': '50px',
        '56px': '56px',
        '68px': '68px',
        '72px': '72px',
        '120px': '120px',
        'fit-content': 'fit-content'
      },
      margin: {
        '10px': '10px',
        '72px': '72px',
        '104px': '104px',
        '300px': '300px'
      },
      padding: {
        '8px': '8px',
        '24px': '24px',
        '72px': '72px'
      },
      inset: {
        '15px': '15px',
        '16px': '16px',
        '18px': '18px',
        '20px': '20px'
      },
      colors: {
        /*  Example use for text: text-tarnished_silver
            Example use for background: bg-tarnished_silver
            Example custom:
            magenta: '#FF34B4' */
        calla_lily: '#E5E9EC',
        flash_white: '#F2F4F6',
        doctor_white: '#FAFAFA',
        dark_willow: '#14171A',
        tarnished_silver: '#797D7F',
        silver_charm: '#ADB1B4',
        black_lead: '#484C4E',
        ottoman_red: '#ED2227',
        ottoman_red_dark: '#D81E21',
        mary_rose: '#FBD2D4',
        deep_skyblue: '#1B78EB',
        deep_skyblue_dark: '#1668CC',
        cloudless: '#D0E4FB',
        grass_court: '#0A8B41',
        jordan_jazz: '#0C7D3B',
        otto_ice: '#CEE8D9',
        squash: '#F4A511',
        sleep_lamp: '#FDEDCF',
        circumorbital: '#6654C0',
        chinese_silver: '#6654C0',
        burning_trail: '#F49522',
        oldTrail: '#C3840D'
      },
      fontSize: {
        /*	Example use: text-size20
					  Example custom:
					  size6: ['6px'], */
        size20: ['20px'],
        size18: ['18px'],
        size16: ['16px'],
        size15: ['15px'],
        size14: ['14px'],
        size12: ['12px'],
        size11: ['11px'],
        size10: ['10px'],
        size8: ['8px']
      },
      lineHeight: {
        '13px': '13px',
        '15px': '15px',
        '17px': '17px',
        '18px': '18px',
        '20px': '20px',
        '22px': '22px',
        '24px': '24px',
        '28px': '28px'
      },
      boxShadow: {
        btn_default: '0px 8px 16px #ED222729',
        option_custom: '8px 8px 16px #ADB1B429',
        btn_transfer_account: '4px 4px 16px rgba(237, 34, 39, 0.16)',
        btn_circle: '4px 4px 16px rgba(0, 0, 0, 0.16)'
      },
      letterSpacing: {
        'form-head': '0.88px'
      },
      backgroundImage: {
        'filter-icon': "url('/assets/images/filter-icon.svg')",
        'download-icon': "url('/assets/images/download-icon.svg')"
      },
      animation: {
        fade: 'fadeOut 5s ease-in-out'
      },
      keyframes: () => ({
        fadeOut: {
          '0%': { opacity: '100%' },
          '100%': { opacity: '0%' }
        }
      })
    }
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      backgroundColor: ['disabled'],
      textColor: ['disabled'],
      cursor: ['disabled'],
      fontWeight: ['hover']
    }
  },
  plugins: []
};
