---
轮廓：深
---

#介绍

<溴>

<跨度文本-品牌-黄色 text-xl>志基</跨度> <跨度op75>(式，日语中的一个词["样式"](https://jisho.org/word/%E5%BC%8F))</跨度>是一个基于TextMate语法和主题的漂亮而强大的语法高亮器，与VS代码的语法高亮相同的引擎。为几乎所有主流编程语言提供非常准确和快速的语法突出显示。

无需维护自定义RegExp，无需维护自定义CSS，无需维护自定义HTML。随着VS代码中您最喜欢的语言和主题的发展-您的语法突出显示也将随之发展。

哦，顺便说一下，正如您所期望的，Shiki高亮显示了此站点中的所有代码块：)

##功能

-所有语法/主题/wasm都用作ESM、按需延迟加载和绑定器友好。
-可移植且不可知。不依赖于Node.js API或文件系统，可在任何现代JavaScript运行时中工作。
-仅ESM([CDN使用](/guide/install#cdn-usage),[CJS用法](/guide/install#cjs-usage)).
- [组合捆绑语言/主题](/guide/bundles#细粒度bundle).
- [支持浅色/深色主题](/指南/双主题)
- [`hast`支持](/导轨/变压器#代码)
- [变压器API](/导轨/变压器)
- [装饰API](/指南/装饰)
- [TypeScript Twoslash集成](/包/二档)
- [相容的组建](/guide/compat)

#

这里是一个小操场，您可以尝试Shiki如何突出显示您的代码。此文档中的其他代码块在构建时呈现并静态发送，而此游乐场在浏览器的客户端呈现。主题和语言是按需加载的。

<ShikiMiniPlayground/>

[安装志贵](/引导/安装)在你的项目中使用它。

##束大小

您可以在上详细检查捆尺寸[pkg-size.dev/shiki](https://pkg-size.dev/shiki).

截至`v1.1.6`，2024年2月22日测量：

|捆|大小(缩小)|大小(gzip)|注释|
|-------------------|--------------:|--------：|----------------------------------------------------------------|
| `志基`             |6.9MB|1.3MB|所有主题和语言均为异步块|
| `志贵/捆绑/完整` |6.9MB|1.3MB|与相同`志基`                                                  |
| `shiki/bundle/web`  |          4.2 MB |      748 KB | All themes and common web languages as async chunks              |
| `shiki/core`        |          106 KB |       34 KB | Core engine without any themes or languages, compose on your own |
| `shiki/wasm`        |          623 KB |      231 KB | WASM binary inlined as base64 string                             |
