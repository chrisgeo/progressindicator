progressindicator
=================
Progress indicator using Angular JS

http://www.chrisgeorge.me/progressindicator/



PROBLEM
========
Design a widget that looks like the following:

## Requirements
- Use AngularJS directive that renders the widget/indicator
    - Takes the following inputs: float expected, float actual 0.0 <= expected/eactual <= 1.0
- Outer arc is based on actual; drawn with d3.svg.arc
    - Orange if actual/expected >= 25% and < 50% behind
    - Red if actual/expected is >= 50% behind
- Inner arc is based on expected; drawn with d3.svc.arc
- Text is actual

# Frontend exercise

Please implement an AngularJS directive that renders a circular progress indicator as shown.

The directive should take two float inputs, expected and actual, between 0.0 and 1.0. The thicker outer circle is drawn based on actual, and the thinner inner circle is drawn based on the expected. The text should be the actual.
Inline image 1

Please render the widget as a SVG, use D3's arc generator to produce the arcs, and code it using CoffeeScript if possible.

The final output should be as high fidelity as possible. Bonus points for changing the color of the outer ring to orange or red when the actual is more than 25% or 50% behind expected.
