# NFC My Business Card

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/tubone24/nfcMyBusinessCard/tree/)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/s/github/tubone24/nfcMyBusinessCard/tree/)

![header](public/ogp.png)

> Utilize NFC to realize a digital business card in the form of an NFC card to refer to a profile site.

<img src="docs/screenshot.png" width="60%"/>

NFC My Business Card is a web application that allows you to create a business card site with NFC with encrypted site.

## How to set up

```bash
npm install
```

And also, you need to buy [NFC card](https://www.amazon.com/Rewritable-Business-Compatible-NFC-Enabled-Devices%EF%BC%8810pcs%EF%BC%89/dp/B0BKSYWG3N/ref=sr_1_2?crid=KVQJC2CBTX8N&keywords=nfc%2Bcard&qid=1679507305&sprefix=nfc%2Bcar%2Caps%2C361&sr=8-2&th=1).

You can write the card with [NFC Tools](https://play.google.com/store/apps/details?id=com.wakdev.wdnfc&hl=ja&gl=US) for your deployed business card site.

<img src="docs/nfctools.png" width="60%"/>

## Run locally

```bash
npm start
```

## Build and Encrypt

Before build and encrypt, you need to set up the environment variables.

```
PASSWORD=yourpassword
```

```bash
npm run build && npm run encrypt && npm run serve
```

And you can access http://localhost:3000#yourpassword

## Demo

Touch your NFC card to your smartphone, and you can see your business card site.

![demo](docs/demo.gif)

## Encrypt with Pagecrypt

If you access the site without NFC or QR code, you need to input the password to access the site.

<img src="docs/encrypt.png" width="60%"/>