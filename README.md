# IB Math Visualizer

An interactive web application designed to help IB Math AA HL students visualize complex mathematical concepts through dynamic graphs and 3D visualizations.

## Features

- **Function Transformations**: Interactive sliders to manipulate parameters of trigonometric functions
- **Taylor Series**: Visualize function approximations with adjustable degree and center point
- **Volume of Revolution**: 3D visualization of solids formed by rotating curves around axes
- **Vector Calculus**: Interactive 3D vector operations with cross and dot products

## Technologies Used

- React with TypeScript
- Plotly.js for 2D and 3D visualizations
- Three.js for advanced 3D graphics
- Tailwind CSS for styling
- React Router for navigation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/math-visualizer.git
   cd math-visualizer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Function Transformations
- Use sliders to adjust amplitude, frequency, phase shift, and vertical shift
- Watch the graph update in real-time
- See the mathematical equation update as you adjust parameters

### Taylor Series
- Enter a function (currently supports basic trigonometric functions)
- Adjust the degree of the Taylor polynomial
- Move the center point to see how the approximation changes
- Compare the original function with its Taylor series approximation

### Volume of Revolution
- Enter a function to rotate
- Choose the axis of rotation (x or y)
- Adjust the start and end points
- View the resulting 3D solid from different angles

### Vector Calculus
- Input two 3D vectors
- Toggle visibility of cross product and dot product
- Rotate the 3D view to see the vectors from different angles
- See the dot product value update in real-time

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- IB Math AA HL curriculum
- Plotly.js community
- Three.js community 