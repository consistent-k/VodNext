import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './app/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            colors: {
                // 品牌色
                primary: {
                    DEFAULT: '#E11D48',
                    light: '#FB7185'
                },
                // 背景色
                bg: {
                    DEFAULT: '#000000',
                    container: '#0F0F23',
                    elevated: '#1E1B4B'
                },
                // 文字色
                text: {
                    DEFAULT: '#F8FAFC',
                    secondary: '#94A3B8',
                    tertiary: '#64748B'
                },
                // 边框色
                border: {
                    DEFAULT: '#334155',
                    secondary: 'rgba(51, 65, 85, 0.5)'
                }
            }
        }
    },
    plugins: []
};
export default config;
