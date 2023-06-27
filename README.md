# @adrianso/react-native-barcode-builder

React Native component to generate barcodes.

Uses [JsBarcode](https://github.com/lindell/JsBarcode) for encoding of data.

Uses [@react-native-community/react-native-svg](https://github.com/react-native-community/react-native-svg) instead of [@react-native-community/art](https://github.com/react-native-community/art).

## Getting started

### Step 1

Install `@adrianso/react-native-barcode-builder` and dependencies:

    npm install @adrianso/react-native-barcode-builder react-native-svg

or

    yarn add @adrianso/react-native-barcode-builder react-native-svg

### Step 2

Start using the component

```javascript
import Barcode from '@adrianso/react-native-barcode-builder';

<Barcode value="Hello World" format="CODE128" />;
```

or you can invoke the barcodeToSvg function to convert any barcode to and SVG string

```javascript
import { barcodeToSvg } from '@adrianso/react-native-barcode-builder';

const svg = barcodeToSvg({
  value: 'Hello world!',
});

/* svg will now have the following value
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 167 100" preserveAspectRatio="xMinYMin slice">
        <path d="M0,0h2v100h-2z M3,0h1v100h-1z M6,0h1v100h-1z M11,0h2v100h-2z M16,0h1v100h-1z M18,0h1v100h-1z M22,0h1v100h-1z M24,0h2v100h-2z M28,0h1v100h-1z M33,0h2v100h-2z M37,0h1v100h-1z M39,0h1v100h-1z M44,0h2v100h-2z M48,0h1v100h-1z M50,0h1v100h-1z M55,0h1v100h-1z M59,0h4v100h-4z M64,0h1v100h-1z M66,0h2v100h-2z M69,0h2v100h-2z M73,0h2v100h-2z M77,0h3v100h-3z M81,0h1v100h-1z M85,0h2v100h-2z M88,0h1v100h-1z M92,0h4v100h-4z M97,0h1v100h-1z M99,0h1v100h-1z M102,0h1v100h-1z M105,0h4v100h-4z M110,0h2v100h-2z M114,0h1v100h-1z M116,0h1v100h-1z M121,0h1v100h-1z M126,0h1v100h-1z M129,0h2v100h-2z M132,0h2v100h-2z M136,0h2v100h-2z M139,0h2v100h-2z M143,0h3v100h-3z M147,0h1v100h-1z M151,0h2v100h-2z M154,0h2v100h-2z M159,0h3v100h-3z M163,0h1v100h-1z M165,0h2v100h-2z" fill="#000000"/>
      </svg>
*/
```

You can find more info about the supported barcodes in the [JsBarcode README](https://github.com/lindell/JsBarcode#supported-barcodes).

![](./images/example.png)

## Properties

<table style="width:80%">
  <tr>
    <th>Property</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>value</code></td>
    <td>What the barcode stands for (required).</td>
  </tr>
  <tr>
    <td><code>format</code></td>
    <td>Which barcode type to use (default: CODE128).</td>
  </tr>
  <tr>
    <td><code>width</code></td>
    <td>Width of a single bar (default: 2)</td>
  </tr>
  <tr>
    <td><code>height</code></td>
    <td>Height of the barcode (default: 100)</td>
  </tr>
  <tr>
    <td><code>text</code></td>
    <td>Override text that is displayed.</td>
  </tr>
  <tr>
    <td><code>lineColor</code></td>
    <td>Color of the bars and text (default: #000000)</td>
  </tr>
  <tr>
    <td><code>background</code></td>
    <td>Background color of the barcode (default: #ffffff)</td>
  </tr>
  <tr>
    <td><code>onError</code></td>
    <td>Handler for invalid barcode of selected format</td>
  </tr>
</table>
