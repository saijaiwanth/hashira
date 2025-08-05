const fs = require('fs');

// Decode a string value to decimal given a base
function decode(value, base) {
  return parseInt(value, base);
}

// Multiply two polynomials
function multiplyPoly(p1, p2) {
  const res = Array(p1.length + p2.length - 1).fill(0);
  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      res[i + j] += p1[i] * p2[j];
    }
  }
  return res;
}

// Perform Lagrange interpolation to find polynomial coefficients
function lagrangeInterpolation(points) {
  const k = points.length;
  let coeffs = Array(k).fill(0);

  for (let i = 0; i < k; i++) {
    const [xi, yi] = points[i];
    let li = [1];

    for (let j = 0; j < k; j++) {
      if (i === j) continue;
      const xj = points[j][0];
      li = multiplyPoly(li, [-xj, 1]);
      const denom = xi - xj;
      li = li.map(c => c / denom);
    }

    for (let d = 0; d < li.length; d++) {
      coeffs[d] += li[d] * yi;
    }
  }

  return coeffs.reverse().map(c => Math.round(c));
}

// Read and process input file
function processFile(filename) {
  console.log(`\n📄 Processing ${filename}`);
  const data = JSON.parse(fs.readFileSync(filename, 'utf8'));
  const { n, k } = data.keys;

  const points = Object.keys(data)
    .filter(key => key !== "keys")
    .map(key => {
      const x = parseInt(key);
      const base = parseInt(data[key].base);
      const value = data[key].value;
      const y = decode(value, base);
      return [x, y];
    })
    .slice(0, k); // take first k points

  const coeffs = lagrangeInterpolation(points);
  console.log("🧮 Coefficients (highest degree to lowest):");
  console.log(coeffs);
}

// Run both test cases
processFile('input1.json');
processFile('input2.json');
