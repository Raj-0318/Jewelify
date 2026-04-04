/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#D4AF37', // Gold
                secondary: '#1A1A1A', // Minimalist Black
                accent: '#F9F6F0', // Warm Beige/Cream
                surface: '#F8F9FA', // Evening Gray

            },
            fontFamily: {
                sans: ['Montserrat', 'sans-serif'],
                serif: ['Cormorant Garamond', 'serif'],
                display: ['Cormorant Garamond', 'serif'],
            }
        },
    },
    plugins: [],
}
