# Speech-to-Text PCF Control

A Power Apps Component Framework (PCF) control that enables speech-to-text functionality in Power Apps. This control allows users to input text through voice recognition using the Web Speech API.

## Features

- Speech-to-text conversion using browser's built-in Web Speech API
- Multiline text input support
- Compact design with small icons
- Real-time voice recognition
- Support for text editing after voice input

## Prerequisites

- Power Apps environment
- Power Platform CLI
- Node.js

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Quantril/SpeechToText.git
```

2. Install dependencies:
```bash
npm install
```

3. Build the control:
```bash
npm run build
```

4. Package the solution:
```bash
npm run package
```

## Usage

1. Import the solution into your Power Apps environment
2. Add the Speech-to-Text control to your form
3. Configure the following properties:
   - Bound field (for storing the text)
   - Display settings
   - Any other custom properties

## Development

To start development:

1. Make sure you have all prerequisites installed
2. Clone the repository
3. Run `npm install` to install dependencies
4. Use `npm run start` to start the development server

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.