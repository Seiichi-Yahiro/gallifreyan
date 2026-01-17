#let title = "Gallifreyan math documentation"
#let author = "Julian Viechter"
#let font_size = 12pt

#let body-font = "New Computer Modern"

#set document(title: title, author: author)

#set page(
  paper: "a4",
)

#show heading: set block(below: 0.85em, above: 1.75em)
#show heading: set text(font: body-font)
#set heading(numbering: "1.1")

#set par(justify: true, leading: 1em)
#set block(spacing: 1.5em)
#set text(font: body-font, lang: "en", size: 12pt)

= Keeping a word inside a sentence

If the word is a full circle the calculation is simple

$ d_w <= r_s - r_w $

If the word is made up of arcs because letters remove parts of the word it becomes more complicated.
Special treatment is necessary when the angle $phi_w$ is inside one of the missing parts. Meaning $phi_w$ is between the anti arcs defined by the letter.

An anti arc is defined by 2 angles $theta_"start"$ and $theta_"end"$.

The position of a word circle in polar coordinates is

$ W = vec(d_w sin(phi_w), -d_w cos(phi_w), delim: "[") $

A point $P$ on the arc of $W$ is

$ P_w = W + vec(r_w sin(theta), -r_w cos(theta), delim: "[") $

Assuming the sentence is placed at the origin point then a point on the arc of the word is inside of the sentence if

$ ||P_w|| <= r_s $

Too avoid square roots, square both sides

$ ||P_w||^2 <= r_s^2 $

expanding

$ ||P_w||^2 = P_w dot P_w $

$ = (d_w sin(phi_w) + r_w sin(theta))^2 + (-d_w cos(phi_w) - r_w cos(theta))^2 $

expanding with quadratic formulas

$
  = (d_w^2 sin^2(phi_w) + 2d_w r_w sin(phi_w) sin(theta) + r_w^2 sin^2(theta)) +\ (d_w^2 cos^2(phi_w) + 2d_w r_w cos(phi_w) cos(theta) + r_w^2 cos^2(theta))
$

grouping

$
  = d_w^2(sin^2(phi_w) + cos^2(phi_w)) +\ r_w^2(sin^2(theta) + cos^2(theta)) +\ 2d_w r_w (sin(phi_w) sin(theta) + cos(phi_w) cos(theta))
$

simplifying with trigonometric equalities

- $sin^2(alpha) + cos^2(alpha) = 1$
- $cos(alpha) cos(beta) + sin(alpha) sin(beta) = cos(alpha - beta)$

$ ||P_w||^2 = d_w^2 + r_w^2 + 2d_w r_w cos(phi_w - theta) $

resulting in the constraint

$ d_w^2 + r_w^2 + 2d_w r_w cos(phi_w - theta) <= r_s^2 $

Only the point that will be farthest away from the sentence's center will be relevant for this inequality.
This means either $theta_"start"$ or $theta_"end"$.
Pick the angle that yields the highest value for $$.

$ theta_"max" = max(cos(phi_w - theta)), theta in {theta_"start", theta_"end"} $

$ d_w^2 + r_w^2 + 2d_w r_w cos(phi_w - theta_"max") <= r_s^2 $

We are looking for $d_"max"$ so solve vor $d_w$

$ d_w^2 + 2 d_w r_w cos(phi_w - theta_"max") + (r_w^2 - r_s^2) = 0 $

solve with quadratic formula

$ d = (-b plus.minus sqrt(b^2 - 4 a c)) / (2a) $

$ d = (-2r_w cos(phi_w - theta_"max") plus.minus sqrt((2 r_w cos(phi_w - theta_"max"))^2 - 4 (r_w^2 - r_s^2))) / 2 $

$ d = (-2r_w cos(phi_w - theta_"max") plus.minus sqrt(4 r_w^2 cos^2(phi_w - theta_"max") - 4 (r_w^2 - r_s^2))) / 2 $

$ d = (-2r_w cos(phi_w - theta_"max") plus.minus 2 sqrt(r_w^2 cos^2(phi_w - theta_"max") - (r_w^2 - r_s^2))) / 2 $

$ d = -r_w cos(phi_w - theta_"max") plus.minus sqrt(r_w^2 cos^2(phi_w - theta_"max") - r_w^2 + r_s^2) $

$ d = -r_w cos(phi_w - theta_"max") plus.minus sqrt(-r_w^2 (1 - cos^2(phi_w - theta_"max")) + r_s^2) $

with $1 - cos^2(alpha) = sin^2(alpha)$

$ d = -r_w cos(phi_w - theta_"max") plus.minus sqrt(r_s^2 - r_w^2 sin^2(phi_w - theta_"max")) $

as we are looking for a max value the solution is

$ d_"max" = -r_w cos(phi_w - theta_"max") plus sqrt(r_s^2 - r_w^2 sin^2(phi_w - theta_"max")) $
