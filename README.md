

# il-gaemi 🐜

<div align="center">
<img src="ilgaemi.png" alt="il-gaemi Logo" width=200>
</div>

A comprehensive TypeScript date and time utility library built on top of the modern Temporal API, with a focus on Korean localization and business day calculations.

## ✨ Features

- **🏢 Business Day Calculations**: Determine workdays, skip holidays and weekends with customizable rules
- **🎨 Flexible Date Formatting**: Support for various output formats including Korean style and relative time
- **🌏 Timezone Management**: Seamless conversion between timezones with built-in Korean timezone support
- **⚡ Temporal API Integration**: Built on the cutting-edge Temporal API for precise and reliable date/time handling
- **🔒 Type Safety**: Full TypeScript support with comprehensive type definitions
- **🇰🇷 Korean Localization**: Native support for Korean date formats and business calendar

## 📦 Installation

```bash
# Using npm
npm install @zwoninstitute/il-gaemi

# Using yarn
yarn add @zwoninstitute/il-gaemi

# Using bun

# il-gaemi 🐜
bun add @zwoninstitute/il-gaemi
```

## ⚙️ Configuration

You can override the default non-working days by setting the `IL_GAEMI_DAY_OFFS` environment variable with a comma-separated list of Korean weekday abbreviations (`월,화,수,목,금,토,일`). If the variable is unset, only Saturday (`"토"`) is treated as a day off.

```bash
# Treat Saturday and Sunday as non-working days
export IL_GAEMI_DAY_OFFS="토,일"

# bun example
IL_GAEMI_DAY_OFFS="토,일" bun run dev
```

## 📚 Documentation

For comprehensive documentation, please visit our docs folder:

- **🚀 [Quick Start Guide](./docs/ENG/QuickStart.md)** - Get up and running in 5 minutes
- **📖 [API Reference](./docs/ENG/API-Reference.md)** - Complete function reference and examples
- **🇰🇷 [한국어 문서](./docs/KOR/)** - Korean documentation


## 📄 License

MIT

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

---

*il-gaemi (일개미) - Working hard like ants to make date handling easier* 🐜
