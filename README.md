# Banana Bread Calculator 🍌🍞

An interactive banana bread recipe calculator that automatically scales ingredients based on the number of bananas you have. Perfect for turning your overripe banana horde into something delicious!

![Banana Bread Calculator](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)

## ✨ Features

- **Smart Scaling**: Automatically calculates perfect ingredient ratios for 1-100 bananas
- **Dual Units**: Toggle between metric (grams/mL) and US (cups/tbsp) measurements
- **Precise Fractions**: US measurements display as cooking-friendly fractions (1/2, 3/4, etc.)
- **Flexible Input**: Enter by banana count or total weight in grams
- **Baking Guidance**: Automatic pan size, temperature, and timing recommendations
- **Accessibility**: Full screen reader support and keyboard navigation
- **Responsive Design**: Works beautifully on mobile, tablet, and desktop
- **Fun Status Messages**: Playful feedback based on your banana count

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/titania-nz/banana-bread-calculator.git
cd banana-bread-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## 🛠️ Built With

- **[React 18](https://reactjs.org/)** - UI framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Vite](https://vitejs.dev/)** - Build tool and dev server
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[Lucide React](https://lucide.dev/)** - Icons
- **Custom UI Components** - Built with accessibility in mind

## 📖 How It Works

### The Formula

The calculator uses a precise base recipe for 1 banana (120g) and scales all ingredients proportionally:

- **Base Recipe (1 banana/120g)**:
  - 60g all-purpose flour
  - 50g sugar
  - 28g melted butter/oil
  - 0.5 eggs
  - 1.5g baking soda
  - 0.75g salt
  - 1.25mL vanilla extract

### Smart Features

- **Banana Weight Calculation**: Assumes 120g per medium banana
- **Fraction Conversion**: Converts decimals to cooking-friendly fractions
- **Pan Size Recommendations**: Suggests appropriate pan sizes based on batter volume
- **Baking Time Scaling**: Adjusts temperature and timing for different batch sizes

## 🎯 Usage Examples

- **Got 3 overripe bananas?** Perfect for a standard loaf
- **Cleaning out the freezer?** Enter total weight for precise scaling
- **Baking for a crowd?** Scale up to 20+ bananas for multiple loaves
- **Prefer metric?** Toggle to grams and milliliters
- **US baker?** Get measurements in familiar cups and tablespoons

## 🤝 Contributing

Contributions are welcome! Here are some ways you can help:

- 🐛 Report bugs or issues
- 💡 Suggest new features
- 🔧 Submit pull requests
- 📖 Improve documentation
- 🌍 Add internationalization

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run lint`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🍌 Fun Facts

- The calculator handles the special case of 69 bananas with a "Nice." message 😎
- Status messages range from "Lonely banana" (1) to "Banana legend" (50+)
- The design uses a warm, editorial color palette inspired by baking
- All measurements are tested and kitchen-approved

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Recipe ratios tested and refined through countless banana bread experiments
- Design inspired by editorial and food blog aesthetics
- Built with accessibility as a core principle
- Special thanks to all the overripe bananas that made this possible 🍌

## 📞 Support

If you have questions or need help:

- 🐛 [Open an issue](https://github.com/titania-nz/banana-bread-calculator/issues)
- 💬 [Start a discussion](https://github.com/titania-nz/banana-bread-calculator/discussions)

---

Made with 🍞 by [Steph](https://github.com/titania-nz)

*Turn your banana surplus into delicious success!*
