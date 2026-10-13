

# il-gaemi 🐜

<div align="center">
<img src="ilgaemi.png" alt="il-gaemi Logo" width=200>
</div>

A TypeScript date and time utility library built on Temporal. Korean public holidays can be fetched through a server-only API; the calling application owns caching and refresh policy.

## ✨ Features

- **🏢 Business Day Calculations**: Determine workdays using configurable weekends and holiday lists
- **🇰🇷 Korean Public Holidays**: Fetch annual data through the optional server-only /holidays entrypoint
- **🎨 Flexible Date Formatting**: Support for various output formats including Korean style and relative time
- **🌏 Timezone Management**: Seamless conversion between timezones with built-in Korean timezone support
- **⚡ Temporal API Integration**: Built on the cutting-edge Temporal API for precise and reliable date/time handling
- **🔒 Type Safety**: Full TypeScript support with comprehensive type definitions
- **🇰🇷 Korean Localization**: Native support for Korean date formats and business calendar

## 📦 Installation

```bash
pnpm add @zwoninstitute/il-gaemi
```

## ⚙️ Configuration

You can override the default non-working days by setting the `IL_GAEMI_DAY_OFFS` environment variable with a comma-separated list of Korean weekday abbreviations (`월,화,수,목,금,토,일`). If the variable is unset, only Saturday (`"토"`) is treated as a day off.

```bash
export IL_GAEMI_DAY_OFFS="토,일"
```

## Korean Public Holidays

The /holidays entrypoint fetches Korean public holidays from the Korea Astronomy and Space Science Institute API. Call it only on the server, keep the decoded data.go.kr key in server-side secret storage, and cache only complete responses in the calling application. Importing the root entrypoint does not make a network request.

See the English Quick Start and API Reference in docs/ENG.

## 📚 Documentation

For comprehensive documentation, please visit our docs folder:

- **🚀 [Quick Start Guide](./docs/ENG/QuickStart.md)** - Get up and running in 5 minutes
- **📖 [API Reference](./docs/ENG/API-Reference.md)** - Complete function reference and examples
- **🇰🇷 [한국어 문서](./docs/KOR/)** - Korean documentation


## 📄 License

MIT

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. This repository uses pnpm and the tracked pnpm-lock.yaml for reproducible installs.

---

*il-gaemi (일개미) - Working hard like ants to make date handling easier* 🐜
