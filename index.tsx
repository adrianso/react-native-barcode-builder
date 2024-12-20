// @flow
import React, { useState, useEffect } from 'react';
import { View, ViewProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import barcodeEncoders from 'jsbarcode/src/barcodes';

// encode() handles the Encoder call and builds the binary string to be rendered
const encode = (text: string, Encoder: any, options: BarcodeOptions) => {
  // If text is not a non-empty string, throw error.
  if (typeof text !== 'string' || text.length === 0) {
    throw new Error('Barcode value must be a non-empty string');
  }

  var encoder;

  try {
    encoder = new Encoder(text, options);
  } catch (error) {
    // If the encoder could not be instantiated, throw error.
    throw new Error('Invalid barcode format.');
  }

  // If the input is not valid for the encoder, throw error.
  if (!encoder.valid()) {
    throw new Error('Invalid barcode for selected format.');
  }

  // Make a request for the binary data (and other infromation) that should be rendered
  // encoded stucture is {
  //  text: 'xxxxx',
  //  data: '110100100001....'
  // }
  var encoded = encoder.encode();
  return encoded;
};

const drawSvgBarCode = (encoding: any) => {
  const rects = [] as string[];
  // binary data of barcode
  const binary = encoding.data;

  let barWidth = 0;
  let x = 0;
  let yFrom = 0;

  for (let b = 0; b < binary.length; b++) {
    x = b;
    if (binary[b] === '1') {
      barWidth++;
    } else if (barWidth > 0) {
      rects[rects.length] = drawRect(x - barWidth, yFrom, barWidth, 100);
      barWidth = 0;
    }
  }

  // Last draw is needed since the barcode ends with 1
  if (barWidth > 0) {
    rects[rects.length] = drawRect(x - barWidth + 1, yFrom, barWidth, 100);
  }

  return rects;
};

const drawRect = (x: number, y: number, width: number, height: number) => {
  return `M${x},${y}h${width}v${height}h-${width}z`;
};

type BarcodeFormat =
  | 'CODE39'
  | 'CODE128'
  | 'CODE128A'
  | 'CODE128B'
  | 'CODE128C'
  | 'EAN13'
  | 'EAN8'
  | 'EAN5'
  | 'EAN2'
  | 'UPC'
  | 'UPCE'
  | 'ITF14'
  | 'ITF'
  | 'MSI'
  | 'MSI10'
  | 'MSI11'
  | 'MSI1010'
  | 'MSI1110'
  | 'pharmacode'
  | 'codabar'
  | 'GenericBarcode';

interface BarcodeOptions {
  format?: BarcodeFormat;
  lineColor?: string;
  flat?: boolean;
  value: string;
  width?: number;
  height?: number;
}

interface Props extends BarcodeOptions, ViewProps {}

export const barcodeToSvg = (options: BarcodeOptions) => {
  const {
    format = 'CODE128',
    lineColor = '#000000',
    value,
    width = 100,
    height = 100,
  } = options;
  const encoder = barcodeEncoders[format];
  const encoded = encode(value, encoder, options);

  const bars = drawSvgBarCode(encoded);
  const barCodeWidth = encoded.data.length;

  return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${barCodeWidth} 100" preserveAspectRatio="xMinYMin slice">
        <path d="${bars.join(' ')}" fill="${lineColor}"/>
      </svg>
    `;
};

const Barcode = (props: Props) => {
  const {
    format = 'CODE128',
    lineColor = '#000000',
    flat = false,
    value,
    width,
    height,
    ...viewProps
  } = props;
  const [bars, setBars] = useState<string[]>([]);
  const [barCodeWidth, setBarCodeWidth] = useState(0);

  useEffect(() => {
    const encoder = barcodeEncoders[format];
    const encoded = encode(value, encoder, {
      format,
      lineColor,
      flat,
      value,
      width,
      height,
    });

    if (encoded) {
      setBars(drawSvgBarCode(encoded));
      setBarCodeWidth(encoded.data.length);
    }
  }, [format, value, lineColor, flat, width, height]);

  return (
    <View {...viewProps}>
      <Svg
        height="100%"
        width="100%"
        viewBox={`0 0 ${barCodeWidth} 100`}
        preserveAspectRatio="xMinYMin slice"
        fill={lineColor}
      >
        <Path d={bars.join(' ')} />
      </Svg>
    </View>
  );
};

export default Barcode;
