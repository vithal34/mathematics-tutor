export const courseContent: Record<string, string> = {
  // Calculus 101 Content
  'limits-intro-content': `
    <h2>Introduction to Limits</h2>
    <p>Limits are a fundamental concept in calculus that describe the behavior of a function as its input approaches a certain value.</p>
    
    <h3>Key Concepts:</h3>
    <ul>
      <li>What is a limit?</li>
      <li>One-sided limits</li>
      <li>Infinite limits</li>
      <li>Limits at infinity</li>
    </ul>

    <div class="example-box">
      <h4>Example 1: Basic Limit</h4>
      <p>Find the limit of f(x) = x² as x approaches 2.</p>
      <p>Solution: As x gets closer to 2, f(x) gets closer to 4. Therefore, lim(x→2) x² = 4.</p>
    </div>
  `,

  'limits-practice-content': `
    <h2>Practice with Limits</h2>
    <p>Let's practice solving limit problems. Try these exercises:</p>

    <div class="practice-problem">
      <h4>Problem 1</h4>
      <p>Find lim(x→3) (x² - 9)/(x - 3)</p>
      <button onclick="showSolution('sol1')" class="show-solution-btn">Show Solution</button>
      <div id="sol1" class="solution hidden">
        <p>Solution: Factor the numerator: (x² - 9) = (x + 3)(x - 3)</p>
        <p>Then: lim(x→3) (x + 3)(x - 3)/(x - 3) = lim(x→3) (x + 3) = 6</p>
      </div>
    </div>
  `,

  'derivatives-intro-content': `
    <h2>Introduction to Derivatives</h2>
    <p>Derivatives represent the rate of change of a function at any point. They are fundamental to understanding how quantities change.</p>

    <h3>Key Concepts:</h3>
    <ul>
      <li>Definition of derivative</li>
      <li>Power rule</li>
      <li>Product rule</li>
      <li>Chain rule</li>
    </ul>

    <div class="example-box">
      <h4>Example: Basic Derivative</h4>
      <p>Find the derivative of f(x) = x²</p>
      <p>Solution: Using the power rule, f'(x) = 2x</p>
    </div>
  `,

  'derivatives-practice-content': `
    <h2>Practice with Derivatives</h2>
    <p>Practice finding derivatives using different rules:</p>

    <div class="practice-problem">
      <h4>Problem 1</h4>
      <p>Find the derivative of f(x) = x³ + 2x² - 5x + 1</p>
      <button onclick="showSolution('sol2')" class="show-solution-btn">Show Solution</button>
      <div id="sol2" class="solution hidden">
        <p>Solution: f'(x) = 3x² + 4x - 5</p>
      </div>
    </div>
  `,

  'integration-intro-content': `
    <h2>Introduction to Integration</h2>
    <p>Integration is the process of finding the area under a curve or the accumulation of change.</p>

    <h3>Key Concepts:</h3>
    <ul>
      <li>Definite integrals</li>
      <li>Indefinite integrals</li>
      <li>Integration by parts</li>
      <li>Substitution method</li>
    </ul>

    <div class="example-box">
      <h4>Example: Basic Integration</h4>
      <p>Find ∫2x dx</p>
      <p>Solution: ∫2x dx = x² + C, where C is the constant of integration</p>
    </div>
  `,

  'integration-practice-content': `
    <h2>Practice with Integration</h2>
    <p>Practice solving integration problems:</p>

    <div class="practice-problem">
      <h4>Problem 1</h4>
      <p>Find ∫(3x² + 2x - 1) dx</p>
      <button onclick="showSolution('sol3')" class="show-solution-btn">Show Solution</button>
      <div id="sol3" class="solution hidden">
        <p>Solution: ∫(3x² + 2x - 1) dx = x³ + x² - x + C</p>
      </div>
    </div>
  `,

  // Linear Algebra Content
  'vectors-intro-content': `
    <h2>Introduction to Vectors</h2>
    <p>Vectors are mathematical objects that have both magnitude and direction.</p>

    <h3>Key Concepts:</h3>
    <ul>
      <li>Vector representation</li>
      <li>Vector addition</li>
      <li>Scalar multiplication</li>
      <li>Dot product</li>
    </ul>

    <div class="example-box">
      <h4>Example: Vector Addition</h4>
      <p>Add vectors a = (1, 2) and b = (3, 4)</p>
      <p>Solution: a + b = (1+3, 2+4) = (4, 6)</p>
    </div>
  `,

  'vectors-practice-content': `
    <h2>Vector Operations</h2>
    <p>Practice vector operations:</p>

    <div class="practice-problem">
      <h4>Problem 1</h4>
      <p>Find the dot product of a = (2, 3) and b = (4, 1)</p>
      <button onclick="showSolution('sol4')" class="show-solution-btn">Show Solution</button>
      <div id="sol4" class="solution hidden">
        <p>Solution: a·b = 2×4 + 3×1 = 8 + 3 = 11</p>
      </div>
    </div>
  `,

  'matrices-intro-content': `
    <h2>Introduction to Matrices</h2>
    <p>Matrices are rectangular arrays of numbers that can be used to represent and solve systems of linear equations.</p>

    <h3>Key Concepts:</h3>
    <ul>
      <li>Matrix representation</li>
      <li>Matrix addition</li>
      <li>Matrix multiplication</li>
      <li>Determinants</li>
    </ul>

    <div class="example-box">
      <h4>Example: Matrix Addition</h4>
      <p>Add matrices A = [[1, 2], [3, 4]] and B = [[5, 6], [7, 8]]</p>
      <p>Solution: A + B = [[6, 8], [10, 12]]</p>
    </div>
  `,

  'matrices-practice-content': `
    <h2>Matrix Operations</h2>
    <p>Practice matrix operations:</p>

    <div class="practice-problem">
      <h4>Problem 1</h4>
      <p>Multiply matrices A = [[1, 2], [3, 4]] and B = [[5, 6], [7, 8]]</p>
      <button onclick="showSolution('sol5')" class="show-solution-btn">Show Solution</button>
      <div id="sol5" class="solution hidden">
        <p>Solution: AB = [[19, 22], [43, 50]]</p>
      </div>
    </div>
  `,

  // Statistics Content
  'probability-intro-content': `
    <h2>Introduction to Probability</h2>
    <p>Probability is the study of random events and their likelihood of occurring.</p>

    <h3>Key Concepts:</h3>
    <ul>
      <li>Basic probability rules</li>
      <li>Conditional probability</li>
      <li>Probability distributions</li>
      <li>Expected value</li>
    </ul>

    <div class="example-box">
      <h4>Example: Basic Probability</h4>
      <p>What is the probability of rolling a 6 on a fair die?</p>
      <p>Solution: P(6) = 1/6 ≈ 0.167 or 16.7%</p>
    </div>
  `,

  'probability-practice-content': `
    <h2>Probability Problems</h2>
    <p>Practice probability calculations:</p>

    <div class="practice-problem">
      <h4>Problem 1</h4>
      <p>What is the probability of drawing a heart from a standard deck of cards?</p>
      <button onclick="showSolution('sol6')" class="show-solution-btn">Show Solution</button>
      <div id="sol6" class="solution hidden">
        <p>Solution: P(heart) = 13/52 = 1/4 = 0.25 or 25%</p>
      </div>
    </div>
  `,

  'inference-intro-content': `
    <h2>Introduction to Statistical Inference</h2>
    <p>Statistical inference involves drawing conclusions about a population based on sample data.</p>

    <h3>Key Concepts:</h3>
    <ul>
      <li>Hypothesis testing</li>
      <li>Confidence intervals</li>
      <li>P-values</li>
      <li>Type I and Type II errors</li>
    </ul>

    <div class="example-box">
      <h4>Example: Confidence Interval</h4>
      <p>Calculate a 95% confidence interval for a sample mean of 50 with standard error 2</p>
      <p>Solution: 50 ± 1.96(2) = [46.08, 53.92]</p>
    </div>
  `,

  'inference-practice-content': `
    <h2>Inference Problems</h2>
    <p>Practice statistical inference:</p>

    <div class="practice-problem">
      <h4>Problem 1</h4>
      <p>Test the hypothesis that the population mean is 100 using a sample mean of 105, standard deviation of 10, and sample size of 25</p>
      <button onclick="showSolution('sol7')" class="show-solution-btn">Show Solution</button>
      <div id="sol7" class="solution hidden">
        <p>Solution: t = (105-100)/(10/√25) = 2.5</p>
        <p>p-value < 0.05, reject null hypothesis</p>
      </div>
    </div>
  `
}; 