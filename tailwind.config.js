/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{jsx,js}"],
  theme: {
    extend: {
      transitionProperty: {
        'border': 'border-radius',
      }
    },
    screens:{
      'phones':{'min':'0px','max':'550px'},
      'smalltablets':{'min':'550px','max':'770px'},
      'tablets':{'min':'770px','max':'1300px'}
    }
  },
  plugins: [],
}

