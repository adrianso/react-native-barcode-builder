import React, { PureComponent } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import Svg, {
  Path,
} from 'react-native-svg';

import barcodes from 'jsbarcode/src/barcodes';

export default class Barcode extends PureComponent {
  static propTypes = {
    /* what the barCode stands for */
    value: PropTypes.string,
    /* Select which barcode type to use */
    format: PropTypes.oneOf(Object.keys(barcodes)),
    /* Set the color of the bars */
    lineColor: PropTypes.string,
    /* Handle error for invalid barcode of selected format */
    onError: PropTypes.func
  };

  static defaultProps = {
    value: undefined,
    format: 'CODE128',
    text: undefined,
    lineColor: '#000000',
    onError: undefined
  };

  constructor(props) {
    super(props);
    this.state = {
      bars: [],
      barCodeWidth: 0
    };
  }

  componentWillUpdate(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.update(nextProps);
    }
  }

  componentDidMount() {
    this.update();
  }

  componentDidUpdate() {
    this.update();
  }

  update() {
    const encoder = barcodes[this.props.format];
    const encoded = this.encode(this.props.value, encoder, this.props);

    if (encoded) {
      this.state.bars = this.drawSvgBarCode(encoded, this.props);
      this.state.barCodeWidth = encoded.data.length;
    }
  }

  drawSvgBarCode(encoding) {
    const rects = [];
    // binary data of barcode
    const binary = encoding.data;

    let barWidth = 0;
    let x = 0;
    let yFrom = 0;
    // alert(JSON.stringify(options));

    for (let b = 0; b < binary.length; b++) {
      x = b;
      if (binary[b] === '1') {
        barWidth++;
      } else if (barWidth > 0) {
        rects[rects.length] = this.drawRect(
          x - barWidth,
          yFrom,
          barWidth,
          100
        );
        barWidth = 0;
      }
    }

    // Last draw is needed since the barcode ends with 1
    if (barWidth > 0) {
      rects[rects.length] = this.drawRect(
        x - barWidth + 1,
        yFrom,
        barWidth,
        100
      );
    }

    return rects;
  }

  drawRect(x, y, width, height) {
    return `M${x},${y}h${width}v${height}h-${width}z`;
  }

  getTotalWidthOfEncodings(encodings) {
    let totalWidth = 0;
    for (let i = 0; i < encodings.length; i++) {
      totalWidth += encodings[i].width;
    }
    return totalWidth;
  }

  // encode() handles the Encoder call and builds the binary string to be rendered
  encode(text, Encoder, options) {
    // If text is not a non-empty string, throw error.
    if (typeof text !== "string" || text.length === 0) {
      if (this.props.onError) {
        this.props.onError(new Error('Barcode value must be a non-empty string'));
        return;
      }
      throw new Error('Barcode value must be a non-empty string');
    }

    var encoder;

    try {
      encoder = new Encoder(text, options);
    } catch (error) {
      // If the encoder could not be instantiated, throw error.
      if (this.props.onError)  {
        this.props.onError(new Error('Invalid barcode format.'));
        return;
      }
      throw new Error('Invalid barcode format.');
    }

    // If the input is not valid for the encoder, throw error.
    if (!encoder.valid()) {
      if (this.props.onError) {
        this.props.onError(new Error('Invalid barcode for selected format.'));
        return;
      }
      throw new Error('Invalid barcode for selected format.');
    }

    // Make a request for the binary data (and other infromation) that should be rendered
    // encoded stucture is {
    //  text: 'xxxxx',
    //  data: '110100100001....'
    // }
    var encoded = encoder.encode();

    return encoded;
  }

  render() {
    this.update();
    return (
      <View style={{width: "100%", height: "100%"}}>
        <Svg
          height="100%"
          width="100%"
          viewBox={`0 0 ${this.state.barCodeWidth} 100`}
          // width={200}
          preserveAspectRatio="xMinYMin slice"
          fill={this.props.lineColor}>
          <Path
            d={this.state.bars.join(' ')}
          />
        </Svg>
      </View>
    );
  }
}