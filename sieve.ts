export class Sieve {
  smallPrimes: number[] = [];

  NthPrime(nthPrime: number): number | undefined {
    return this.segmented(nthPrime);
  }

  /**
   * Finds large primes by segmenting it out into smaller chunks
   * helping us avoid storing huge arrays in memory.
   *  */
  segmented(nthPrime: number): number | undefined {
    // Estimate range needed
    const primeEstimate = this.estimateNthPrime(nthPrime);

    // Segment size to reduce memory footprint
    const segmentSize = 1000000;

    let count = 0;

    // Use small primes to mark multiples in larger segments
    this.smallPrimes = this.simple(Math.sqrt(primeEstimate));

    for (let low = 2; low < primeEstimate; low += segmentSize) {
      const high = Math.min(low + segmentSize - 1, primeEstimate);
      const sieve = new Uint8Array(high - low + 1).fill(1);

      // Mark multiples of small primes
      for (const prime of this.smallPrimes) {
        let start = Math.max(prime * prime, Math.ceil(low / prime) * prime);
        for (let j = start; j <= high; j += prime) {
          sieve[j - low] = 0;
        }
      }

      // Collect primes in this segment
      for (let i = 0; i < sieve.length; i++) {
        if (sieve[i]) {
          count++;
          if (count === nthPrime + 1) {
            return low + i;
          }
        }
      }
    }
  }

  /**
   * Estimates the upper bound for the nth prime using
   * Prime Number Theorem to help reduce the size of the sieve.
   *  */
  estimateNthPrime(nthPrime: number): number {
    if (nthPrime < 6) return 13;

    return Math.ceil(
      nthPrime * Math.log(nthPrime) + nthPrime * Math.log(Math.log(nthPrime))
    );
  }

  /** Generate all primes up to `limit`. */
  simple(limit: number): number[] {
    // Uint8Array is more memory efficient than an array of booleans.
    // Each element is a single byte.
    const sieve = new Uint8Array(limit + 1);

    // Assume all numbers are prime initially
    sieve.fill(1);

    // Set 0 and 1 to not prime
    sieve[0] = sieve[1] = 0;

    for (let i = 2; i * i <= limit; i++) {
      if (sieve[i]) {
        for (let j = i * i; j <= limit; j += i) {
          // Mark as not prime
          sieve[j] = 0;
        }
      }
    }

    // Collect primes found
    const primes: number[] = [];
    for (let i = 2; i <= limit; i++) {
      if (sieve[i]) primes.push(i);
    }
    return primes;
  }
}
